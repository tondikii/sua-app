package domain

import (
	"context"
	"time"

	"github.com/google/uuid"
)

// TripStatus represents the scheduling state of a trip.
type TripStatus string

const (
	TripStatusVotingPending TripStatus = "voting_pending"
	TripStatusFixed         TripStatus = "fixed"
)

// InvitationMethod indicates how a participant was invited.
type InvitationMethod string

const (
	InvitationMethodUsername InvitationMethod = "username"
	InvitationMethodEmail    InvitationMethod = "email"
)

// InvitationStatus tracks the response lifecycle of an invitation.
type InvitationStatus string

const (
	InvitationStatusPending  InvitationStatus = "pending"
	InvitationStatusAccepted InvitationStatus = "accepted"
	InvitationStatusDeclined InvitationStatus = "declined"
)

// DefaultCoverImageURL is returned when a trip has no explicit cover image.
const DefaultCoverImageURL = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=280&fit=crop"

// ── Domain Models ────────────────────────────────────────────────────────────

// Trip is the core aggregate for a planned journey.
type Trip struct {
	ID             uuid.UUID
	CreatorID      uuid.UUID
	Name           string
	Tags           []string
	Status         TripStatus
	StartDate      *time.Time
	EndDate        *time.Time
	IsPublic       bool
	CoverImageURL  *string
	VotingDeadline *time.Time
	DeletedAt      *time.Time
	CreatedAt      time.Time
	UpdatedAt      time.Time
}

// TripSummary is a lightweight snapshot of a trip suitable for embedding in
// invitation and notification responses.
type TripSummary struct {
	ID            uuid.UUID `json:"id"`
	Name          string    `json:"name"`
	CoverImageURL string    `json:"cover_image_url"`
}

// ParticipantsInfo bundles participant count and a preview slice together so
// both can be fetched in a single batch query.
type ParticipantsInfo struct {
	Count   int
	Preview []*UserSummary
}

// TripEnriched extends Trip with UI-required aggregates.
type TripEnriched struct {
	Trip
	ParticipantCount    int
	ParticipantsPreview []*UserSummary
}

// TripParticipant represents a confirmed member of a trip.
type TripParticipant struct {
	TripID   uuid.UUID
	UserID   uuid.UUID
	JoinedAt time.Time
}

// TripInvitation tracks an outstanding or resolved invitation to join a trip.
type TripInvitation struct {
	ID            uuid.UUID
	TripID        uuid.UUID
	InvitedBy     uuid.UUID
	InvitedUserID *uuid.UUID // populated when Method = username
	InvitedEmail  *string    // populated when Method = email
	Method        InvitationMethod
	Status        InvitationStatus
	CreatedAt     time.Time
	UpdatedAt     time.Time
}

// InvitationEnriched embeds the raw invitation with resolved trip + inviter.
type InvitationEnriched struct {
	TripInvitation
	Trip    TripSummary `json:"trip"`
	Inviter UserSummary `json:"inviter"`
}

// TripDateCandidate is a proposed date range presented to participants for voting.
type TripDateCandidate struct {
	ID        uuid.UUID
	TripID    uuid.UUID
	StartDate time.Time
	EndDate   time.Time
	VoteCount int // computed at query time; not stored in its own column
	CreatedAt time.Time
}

// TripCandidateEnriched extends TripDateCandidate with viewer-specific vote info.
type TripCandidateEnriched struct {
	TripDateCandidate
	UserHasVoted  bool           `json:"user_has_voted"`
	VotersPreview []*UserSummary `json:"voters_preview"`
}

// TripDestination is a place to visit within a trip.
type TripDestination struct {
	ID            uuid.UUID
	TripID        uuid.UUID
	PlaceName     string
	MapsLink      *string
	ReferenceLink *string
	SortOrder     int
	CreatedAt     time.Time
}

// TripMessage is a single chat message within a trip's internal group chat.
type TripMessage struct {
	ID          uuid.UUID
	TripID      uuid.UUID
	SenderID    uuid.UUID
	MessageText string
	DeletedAt   *time.Time
	CreatedAt   time.Time
}

// TripMessageEnriched extends TripMessage with resolved sender info.
type TripMessageEnriched struct {
	TripMessage
	Sender UserSummary `json:"sender"`
}

// ── Repositories ─────────────────────────────────────────────────────────────

type TripRepository interface {
	Create(ctx context.Context, trip *Trip) error
	FindByID(ctx context.Context, id uuid.UUID) (*Trip, error)
	// ListByParticipant returns trips the user belongs to, keyset-paginated by trip ID.
	ListByParticipant(ctx context.Context, userID uuid.UUID, cursor *uuid.UUID, limit int) ([]*Trip, error)
	// ListByParticipantFiltered is like ListByParticipant but applies a tab filter.
	// tab values: "upcoming", "completed", "" (all).
	ListByParticipantFiltered(ctx context.Context, userID uuid.UUID, tab string, cursor *uuid.UUID, limit int) ([]*Trip, error)
	// ListByCreator returns trips created by ownerID. When publicOnly=true only
	// is_public=true trips are returned (used for privacy-gated profile grid).
	ListByCreator(ctx context.Context, ownerID uuid.UUID, publicOnly bool) ([]*Trip, error)
	Update(ctx context.Context, trip *Trip) error
	SoftDelete(ctx context.Context, id uuid.UUID) error
	IsParticipant(ctx context.Context, tripID, userID uuid.UUID) (bool, error)
	IsCreator(ctx context.Context, tripID, userID uuid.UUID) (bool, error)
	// GetParticipantsInfo batch-fetches participant counts and previews (up to
	// previewLimit) for the given trip IDs in a single query.
	GetParticipantsInfo(ctx context.Context, tripIDs []uuid.UUID, previewLimit int) (map[uuid.UUID]*ParticipantsInfo, error)
	// ListParticipantIDs returns all participant user IDs for a trip.
	ListParticipantIDs(ctx context.Context, tripID uuid.UUID) ([]uuid.UUID, error)
}

type TripInvitationRepository interface {
	Create(ctx context.Context, inv *TripInvitation) error
	FindByID(ctx context.Context, id uuid.UUID) (*TripInvitation, error)
	FindPendingByUser(ctx context.Context, userID uuid.UUID) ([]*TripInvitation, error)
	// FindPendingByUserEnriched returns pending invitations with embedded trip and inviter data.
	FindPendingByUserEnriched(ctx context.Context, userID uuid.UUID) ([]*InvitationEnriched, error)
	UpdateStatus(ctx context.Context, id uuid.UUID, status InvitationStatus) error
}

type TripDateCandidateRepository interface {
	FindByTrip(ctx context.Context, tripID uuid.UUID) ([]*TripDateCandidate, error)
	FindByID(ctx context.Context, id uuid.UUID) (*TripDateCandidate, error)
	AddVote(ctx context.Context, candidateID, userID uuid.UUID) error
	RemoveVote(ctx context.Context, candidateID, userID uuid.UUID) error
	// FindByTripEnriched returns candidates with per-viewer vote status and voters preview.
	FindByTripEnriched(ctx context.Context, tripID, viewerID uuid.UUID) ([]*TripCandidateEnriched, error)
}

type TripDestinationRepository interface {
	Create(ctx context.Context, dest *TripDestination) error
	FindByTrip(ctx context.Context, tripID uuid.UUID) ([]*TripDestination, error)
	Delete(ctx context.Context, id, tripID uuid.UUID) error
}

type TripMessageRepository interface {
	Create(ctx context.Context, msg *TripMessage) error
	// FindByTrip returns messages ordered by created_at DESC, keyset-paginated.
	FindByTrip(ctx context.Context, tripID uuid.UUID, cursor *time.Time, limit int) ([]*TripMessage, error)
	// FindByTripEnriched returns non-deleted messages with embedded sender info.
	FindByTripEnriched(ctx context.Context, tripID uuid.UUID, cursor *time.Time, limit int) ([]*TripMessageEnriched, error)
	// SoftDelete marks a message as deleted. Returns ErrForbidden if senderID doesn't match.
	SoftDelete(ctx context.Context, messageID, senderID uuid.UUID) error
}

// ── Services ──────────────────────────────────────────────────────────────────

type TripService interface {
	CreateTrip(ctx context.Context, creatorID uuid.UUID, input CreateTripInput) (*Trip, error)
	ListTrips(ctx context.Context, userID uuid.UUID, cursor *uuid.UUID, limit int) ([]*Trip, error)
	// ListTripsEnriched returns trips with participant info, filtered by optional tab.
	ListTripsEnriched(ctx context.Context, userID uuid.UUID, tab string, cursor *uuid.UUID, limit int) ([]*TripEnriched, error)
	GetTrip(ctx context.Context, tripID, requesterID uuid.UUID) (*Trip, error)
	// GetTripEnriched returns a single trip with participant info.
	GetTripEnriched(ctx context.Context, tripID, requesterID uuid.UUID) (*TripEnriched, error)
	UpdateTrip(ctx context.Context, tripID, requesterID uuid.UUID, input UpdateTripInput) (*Trip, error)
	DeleteTrip(ctx context.Context, tripID, requesterID uuid.UUID) error

	InviteParticipant(ctx context.Context, tripID, inviterID uuid.UUID, input InviteInput) error
	RespondToInvitation(ctx context.Context, invitationID, responderID uuid.UUID, accept bool) error

	CastVote(ctx context.Context, candidateID, userID uuid.UUID) error
	RetractVote(ctx context.Context, candidateID, userID uuid.UUID) error
	// LockDate is restricted to the trip creator; clears voting_deadline.
	LockDate(ctx context.Context, tripID, candidateID, requesterID uuid.UUID) error

	AddDestination(ctx context.Context, tripID, requesterID uuid.UUID, input AddDestinationInput) (*TripDestination, error)
	RemoveDestination(ctx context.Context, destinationID, tripID, requesterID uuid.UUID) error
	ListDestinations(ctx context.Context, tripID, requesterID uuid.UUID) ([]*TripDestination, error)

	SendMessage(ctx context.Context, tripID, senderID uuid.UUID, text string) (*TripMessage, error)
	GetMessages(ctx context.Context, tripID, requesterID uuid.UUID, cursor *time.Time, limit int) ([]*TripMessage, error)
	// GetMessagesEnriched returns non-deleted messages with embedded sender info.
	GetMessagesEnriched(ctx context.Context, tripID, requesterID uuid.UUID, cursor *time.Time, limit int) ([]*TripMessageEnriched, error)
	// DeleteMessage soft-deletes a message. Only the sender may delete their own message.
	DeleteMessage(ctx context.Context, tripID, messageID, requesterID uuid.UUID) error

	ListDateCandidates(ctx context.Context, tripID, requesterID uuid.UUID) ([]*TripDateCandidate, error)
	// ListDateCandidatesEnriched returns candidates with viewer-specific vote info.
	ListDateCandidatesEnriched(ctx context.Context, tripID, requesterID uuid.UUID) ([]*TripCandidateEnriched, error)

	// ListPendingInvitations returns all pending username-based invitations for the authenticated user.
	ListPendingInvitations(ctx context.Context, userID uuid.UUID) ([]*TripInvitation, error)
	// ListPendingInvitationsEnriched returns pending invitations with embedded trip and inviter.
	ListPendingInvitationsEnriched(ctx context.Context, userID uuid.UUID) ([]*InvitationEnriched, error)

	// ListTripsByUser returns trips created by the profile owner, applying privacy rules.
	// viewerID nil = unauthenticated stranger. Returns ErrForbidden for private non-follower.
	ListTripsByUser(ctx context.Context, ownerUsername string, viewerID *uuid.UUID) ([]*TripEnriched, error)
}

// ── Input DTOs ────────────────────────────────────────────────────────────────

// DateRange is a candidate date range proposed during trip creation.
type DateRange struct {
	StartDate time.Time
	EndDate   time.Time
}

// CreateTripInput is the payload for creating a new trip.
// StartDate/EndDate and Candidates are mutually exclusive.
type CreateTripInput struct {
	Name          string
	Tags          []string
	StartDate     *time.Time  // set for fixed-date trips
	EndDate       *time.Time  // set for fixed-date trips
	Candidates    []DateRange // set for voting trips
	CoverImageURL *string
}

// UpdateTripInput is the mutation payload for trip metadata.
// A nil pointer means "no change" for that field.
type UpdateTripInput struct {
	Name      *string
	Tags      []string
	StartDate *time.Time
	EndDate   *time.Time
}

// InviteInput carries the invitation target; Username and Email are mutually exclusive.
type InviteInput struct {
	Username *string
	Email    *string
}

// AddDestinationInput is the payload for adding a destination to a trip.
type AddDestinationInput struct {
	PlaceName     string
	MapsLink      *string
	ReferenceLink *string
}
