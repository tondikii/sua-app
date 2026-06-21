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

// ── Domain Models ────────────────────────────────────────────────────────────

// Trip is the core aggregate for a planned journey.
type Trip struct {
	ID        uuid.UUID
	CreatorID uuid.UUID
	Name      string
	Tags      []string
	Status    TripStatus
	StartDate *time.Time
	EndDate   *time.Time
	IsPublic  bool
	DeletedAt *time.Time
	CreatedAt time.Time
	UpdatedAt time.Time
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

// TripDateCandidate is a proposed date range presented to participants for voting.
type TripDateCandidate struct {
	ID        uuid.UUID
	TripID    uuid.UUID
	StartDate time.Time
	EndDate   time.Time
	VoteCount int // computed at query time; not stored in its own column
	CreatedAt time.Time
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
	CreatedAt   time.Time
}

// ── Repositories ─────────────────────────────────────────────────────────────

type TripRepository interface {
	Create(ctx context.Context, trip *Trip) error
	FindByID(ctx context.Context, id uuid.UUID) (*Trip, error)
	// FindByParticipant returns trips the user belongs to, keyset-paginated by trip ID.
	FindByParticipant(ctx context.Context, userID uuid.UUID, cursor *uuid.UUID, limit int) ([]*Trip, error)
	Update(ctx context.Context, trip *Trip) error
	SoftDelete(ctx context.Context, id uuid.UUID) error
	IsParticipant(ctx context.Context, tripID, userID uuid.UUID) (bool, error)
	IsCreator(ctx context.Context, tripID, userID uuid.UUID) (bool, error)
	ListByParticipant(ctx context.Context, userID uuid.UUID, cursor *uuid.UUID, limit int) ([]*Trip, error)
}

type TripParticipantRepository interface {
	Add(ctx context.Context, tripID, userID uuid.UUID) error
	Remove(ctx context.Context, tripID, userID uuid.UUID) error
}

type TripInvitationRepository interface {
	Create(ctx context.Context, inv *TripInvitation) error
	FindByID(ctx context.Context, id uuid.UUID) (*TripInvitation, error)
	FindPendingByUser(ctx context.Context, userID uuid.UUID) ([]*TripInvitation, error)
	UpdateStatus(ctx context.Context, id uuid.UUID, status InvitationStatus) error
}

type TripDateCandidateRepository interface {
	BulkCreate(ctx context.Context, candidates []*TripDateCandidate) error
	FindByTrip(ctx context.Context, tripID uuid.UUID) ([]*TripDateCandidate, error)
	FindByID(ctx context.Context, id uuid.UUID) (*TripDateCandidate, error)
	AddVote(ctx context.Context, candidateID, userID uuid.UUID) error
	RemoveVote(ctx context.Context, candidateID, userID uuid.UUID) error
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
}

// ── Services ──────────────────────────────────────────────────────────────────

type TripService interface {
	CreateTrip(ctx context.Context, creatorID uuid.UUID, input CreateTripInput) (*Trip, error)
	ListTrips(ctx context.Context, userID uuid.UUID, cursor *uuid.UUID, limit int) ([]*Trip, error)
	GetTrip(ctx context.Context, tripID, requesterID uuid.UUID) (*Trip, error)
	UpdateTrip(ctx context.Context, tripID, requesterID uuid.UUID, input UpdateTripInput) (*Trip, error)
	DeleteTrip(ctx context.Context, tripID, requesterID uuid.UUID) error

	InviteParticipant(ctx context.Context, tripID, inviterID uuid.UUID, input InviteInput) error
	RespondToInvitation(ctx context.Context, invitationID, responderID uuid.UUID, accept bool) error

	CastVote(ctx context.Context, candidateID, userID uuid.UUID) error
	RetractVote(ctx context.Context, candidateID, userID uuid.UUID) error
	// LockDate is restricted to the trip creator; triggers async Google Calendar sync.
	LockDate(ctx context.Context, tripID, candidateID, requesterID uuid.UUID) error

	AddDestination(ctx context.Context, tripID, requesterID uuid.UUID, input AddDestinationInput) (*TripDestination, error)
	RemoveDestination(ctx context.Context, destinationID, tripID, requesterID uuid.UUID) error
	ListDestinations(ctx context.Context, tripID, requesterID uuid.UUID) ([]*TripDestination, error)

	SendMessage(ctx context.Context, tripID, senderID uuid.UUID, text string) (*TripMessage, error)
	GetMessages(ctx context.Context, tripID, requesterID uuid.UUID, cursor *time.Time, limit int) ([]*TripMessage, error)
	ListDateCandidates(ctx context.Context, tripID, requesterID uuid.UUID) ([]*TripDateCandidate, error)
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
	Name       string
	Tags       []string
	StartDate  *time.Time  // set for fixed-date trips
	EndDate    *time.Time  // set for fixed-date trips
	Candidates []DateRange // set for voting trips
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
