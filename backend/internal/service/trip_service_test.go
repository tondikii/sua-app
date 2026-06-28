package service

import (
	"context"
	"errors"
	"testing"
	"time"

	"github.com/google/uuid"

	"github.com/sudutkode/atur-perjalanan/backend/internal/domain"
)

// ── Fake Trip Repositories ───────────────────────────────────────────────────

type fakeTripRepo struct {
	trips        map[uuid.UUID]*domain.Trip
	participants map[uuid.UUID]map[uuid.UUID]bool // tripID → userID → bool
}

func newFakeTripRepo() *fakeTripRepo {
	return &fakeTripRepo{
		trips:        make(map[uuid.UUID]*domain.Trip),
		participants: make(map[uuid.UUID]map[uuid.UUID]bool),
	}
}

func (r *fakeTripRepo) addParticipant(tripID, userID uuid.UUID) {
	if r.participants[tripID] == nil {
		r.participants[tripID] = make(map[uuid.UUID]bool)
	}
	r.participants[tripID][userID] = true
}

func (r *fakeTripRepo) Create(_ context.Context, t *domain.Trip) error {
	r.trips[t.ID] = t
	return nil
}

func (r *fakeTripRepo) FindByID(_ context.Context, id uuid.UUID) (*domain.Trip, error) {
	t, ok := r.trips[id]
	if !ok {
		return nil, domain.ErrNotFound
	}
	return t, nil
}

func (r *fakeTripRepo) ListByParticipant(_ context.Context, userID uuid.UUID, _ *uuid.UUID, limit int) ([]*domain.Trip, error) {
	var result []*domain.Trip
	for tripID, members := range r.participants {
		if members[userID] {
			if t, ok := r.trips[tripID]; ok {
				result = append(result, t)
			}
		}
	}
	if limit > 0 && len(result) > limit {
		result = result[:limit]
	}
	return result, nil
}

func (r *fakeTripRepo) Update(_ context.Context, t *domain.Trip) error {
	if _, ok := r.trips[t.ID]; !ok {
		return domain.ErrNotFound
	}
	r.trips[t.ID] = t
	return nil
}

func (r *fakeTripRepo) SoftDelete(_ context.Context, id uuid.UUID) error {
	t, ok := r.trips[id]
	if !ok {
		return domain.ErrNotFound
	}
	now := time.Now()
	t.DeletedAt = &now
	return nil
}

func (r *fakeTripRepo) IsParticipant(_ context.Context, tripID, userID uuid.UUID) (bool, error) {
	if _, ok := r.trips[tripID]; !ok {
		return false, domain.ErrNotFound
	}
	return r.participants[tripID][userID], nil
}

func (r *fakeTripRepo) IsCreator(_ context.Context, tripID, userID uuid.UUID) (bool, error) {
	t, ok := r.trips[tripID]
	if !ok {
		return false, domain.ErrNotFound
	}
	return t.CreatorID == userID, nil
}

func (r *fakeTripRepo) ListByParticipantFiltered(_ context.Context, userID uuid.UUID, _ string, _ *uuid.UUID, limit int) ([]*domain.Trip, error) {
	return r.ListByParticipant(context.Background(), userID, nil, limit)
}

func (r *fakeTripRepo) ListByCreator(_ context.Context, ownerID uuid.UUID, publicOnly bool) ([]*domain.Trip, error) {
	var result []*domain.Trip
	for _, t := range r.trips {
		if t.CreatorID == ownerID {
			if publicOnly && !t.IsPublic {
				continue
			}
			result = append(result, t)
		}
	}
	return result, nil
}

func (r *fakeTripRepo) GetParticipantsInfo(_ context.Context, tripIDs []uuid.UUID, _ int) (map[uuid.UUID]*domain.ParticipantsInfo, error) {
	result := make(map[uuid.UUID]*domain.ParticipantsInfo)
	for _, id := range tripIDs {
		result[id] = &domain.ParticipantsInfo{Count: 0, Preview: []*domain.UserSummary{}}
	}
	return result, nil
}

func (r *fakeTripRepo) ListParticipantIDs(_ context.Context, tripID uuid.UUID) ([]uuid.UUID, error) {
	var ids []uuid.UUID
	for userID := range r.participants[tripID] {
		ids = append(ids, userID)
	}
	return ids, nil
}

type fakeTripInvitationRepo struct {
	invitations map[uuid.UUID]*domain.TripInvitation
}

func newFakeTripInvitationRepo() *fakeTripInvitationRepo {
	return &fakeTripInvitationRepo{invitations: make(map[uuid.UUID]*domain.TripInvitation)}
}

func (r *fakeTripInvitationRepo) Create(_ context.Context, inv *domain.TripInvitation) error {
	r.invitations[inv.ID] = inv
	return nil
}

func (r *fakeTripInvitationRepo) FindByID(_ context.Context, id uuid.UUID) (*domain.TripInvitation, error) {
	inv, ok := r.invitations[id]
	if !ok {
		return nil, domain.ErrNotFound
	}
	return inv, nil
}

func (r *fakeTripInvitationRepo) FindPendingByUser(_ context.Context, _ uuid.UUID) ([]*domain.TripInvitation, error) {
	return nil, nil
}

func (r *fakeTripInvitationRepo) FindPendingByUserEnriched(_ context.Context, _ uuid.UUID) ([]*domain.InvitationEnriched, error) {
	return nil, nil
}

func (r *fakeTripInvitationRepo) UpdateStatus(_ context.Context, id uuid.UUID, status domain.InvitationStatus) error {
	inv, ok := r.invitations[id]
	if !ok {
		return domain.ErrNotFound
	}
	inv.Status = status
	return nil
}

type fakeTripCandidateRepo struct {
	candidates map[uuid.UUID]*domain.TripDateCandidate
	votes      map[string]bool // "candidateID:userID"
}

func newFakeTripCandidateRepo() *fakeTripCandidateRepo {
	return &fakeTripCandidateRepo{
		candidates: make(map[uuid.UUID]*domain.TripDateCandidate),
		votes:      make(map[string]bool),
	}
}

func (r *fakeTripCandidateRepo) voteKey(candidateID, userID uuid.UUID) string {
	return candidateID.String() + ":" + userID.String()
}

func (r *fakeTripCandidateRepo) FindByTrip(_ context.Context, tripID uuid.UUID) ([]*domain.TripDateCandidate, error) {
	var result []*domain.TripDateCandidate
	for _, c := range r.candidates {
		if c.TripID == tripID {
			result = append(result, c)
		}
	}
	return result, nil
}

func (r *fakeTripCandidateRepo) FindByID(_ context.Context, id uuid.UUID) (*domain.TripDateCandidate, error) {
	c, ok := r.candidates[id]
	if !ok {
		return nil, domain.ErrNotFound
	}
	return c, nil
}

func (r *fakeTripCandidateRepo) AddVote(_ context.Context, candidateID, userID uuid.UUID) error {
	key := r.voteKey(candidateID, userID)
	if r.votes[key] {
		return domain.ErrAlreadyVoted
	}
	r.votes[key] = true
	return nil
}

func (r *fakeTripCandidateRepo) RemoveVote(_ context.Context, candidateID, userID uuid.UUID) error {
	key := r.voteKey(candidateID, userID)
	if !r.votes[key] {
		return domain.ErrVoteNotFound
	}
	delete(r.votes, key)
	return nil
}

func (r *fakeTripCandidateRepo) FindByTripEnriched(_ context.Context, tripID, _ uuid.UUID) ([]*domain.TripCandidateEnriched, error) {
	candidates, _ := r.FindByTrip(context.Background(), tripID)
	enriched := make([]*domain.TripCandidateEnriched, len(candidates))
	for i, c := range candidates {
		enriched[i] = &domain.TripCandidateEnriched{
			TripDateCandidate: *c,
			UserHasVoted:      false,
			VotersPreview:     []*domain.UserSummary{},
		}
	}
	return enriched, nil
}

type fakeTripDestinationRepo struct {
	destinations map[uuid.UUID]*domain.TripDestination
}

func newFakeTripDestinationRepo() *fakeTripDestinationRepo {
	return &fakeTripDestinationRepo{destinations: make(map[uuid.UUID]*domain.TripDestination)}
}

func (r *fakeTripDestinationRepo) Create(_ context.Context, d *domain.TripDestination) error {
	r.destinations[d.ID] = d
	return nil
}

func (r *fakeTripDestinationRepo) FindByTrip(_ context.Context, tripID uuid.UUID) ([]*domain.TripDestination, error) {
	var result []*domain.TripDestination
	for _, d := range r.destinations {
		if d.TripID == tripID {
			result = append(result, d)
		}
	}
	return result, nil
}

func (r *fakeTripDestinationRepo) Delete(_ context.Context, id, _ uuid.UUID) error {
	if _, ok := r.destinations[id]; !ok {
		return domain.ErrNotFound
	}
	delete(r.destinations, id)
	return nil
}

type fakeTripMessageRepo struct {
	messages map[uuid.UUID]*domain.TripMessage
}

func newFakeTripMessageRepo() *fakeTripMessageRepo {
	return &fakeTripMessageRepo{messages: make(map[uuid.UUID]*domain.TripMessage)}
}

func (r *fakeTripMessageRepo) Create(_ context.Context, m *domain.TripMessage) error {
	r.messages[m.ID] = m
	return nil
}

func (r *fakeTripMessageRepo) FindByTrip(_ context.Context, tripID uuid.UUID, _ *time.Time, limit int) ([]*domain.TripMessage, error) {
	var result []*domain.TripMessage
	for _, m := range r.messages {
		if m.TripID == tripID {
			result = append(result, m)
		}
	}
	if limit > 0 && len(result) > limit {
		result = result[:limit]
	}
	return result, nil
}

func (r *fakeTripMessageRepo) FindByTripEnriched(_ context.Context, tripID uuid.UUID, _ *time.Time, limit int) ([]*domain.TripMessageEnriched, error) {
	msgs, _ := r.FindByTrip(context.Background(), tripID, nil, limit)
	enriched := make([]*domain.TripMessageEnriched, len(msgs))
	for i, m := range msgs {
		enriched[i] = &domain.TripMessageEnriched{TripMessage: *m}
	}
	return enriched, nil
}

func (r *fakeTripMessageRepo) SoftDelete(_ context.Context, messageID, senderID uuid.UUID) error {
	m, ok := r.messages[messageID]
	if !ok {
		return domain.ErrNotFound
	}
	if m.SenderID != senderID {
		return domain.ErrForbidden
	}
	now := time.Now()
	m.DeletedAt = &now
	return nil
}

// ── newTestTripService creates a trip service wired with all fake dependencies.
// Note: CreateTrip and RespondToInvitation use pgxpool.Pool directly for
// transactions; those flows are covered by integration tests. All other service
// methods use the repository interfaces and are testable here.
func newTestTripService(
	tripRepo *fakeTripRepo,
	invRepo *fakeTripInvitationRepo,
	candRepo *fakeTripCandidateRepo,
	destRepo *fakeTripDestinationRepo,
	msgRepo *fakeTripMessageRepo,
	userRepo *fakeUserRepo,
) domain.TripService {
	return &tripService{
		trips:         tripRepo,
		invitations:   invRepo,
		candidates:    candRepo,
		destinations:  destRepo,
		messages:      msgRepo,
		users:         userRepo,
		follows:       newFakeFollowRepo(),
		db:            nil, // nil pool — transactional methods will panic if called
		notifications: nil,
	}
}

// ── GetTrip ──────────────────────────────────────────────────────────────────

func TestGetTrip_ParticipantCanView(t *testing.T) {
	tripRepo := newFakeTripRepo()
	creatorID := uuid.New()
	participantID := uuid.New()
	trip := &domain.Trip{ID: uuid.New(), CreatorID: creatorID, Name: "Test Trip", Status: domain.TripStatusFixed}
	tripRepo.trips[trip.ID] = trip
	tripRepo.addParticipant(trip.ID, creatorID)
	tripRepo.addParticipant(trip.ID, participantID)

	svc := newTestTripService(tripRepo, newFakeTripInvitationRepo(), newFakeTripCandidateRepo(), newFakeTripDestinationRepo(), newFakeTripMessageRepo(), newFakeUserRepo())
	got, err := svc.GetTrip(context.Background(), trip.ID, participantID)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if got.ID != trip.ID {
		t.Errorf("trip ID = %v, want %v", got.ID, trip.ID)
	}
}

func TestGetTrip_NonParticipantBlocked(t *testing.T) {
	tripRepo := newFakeTripRepo()
	creatorID := uuid.New()
	strangerID := uuid.New()
	trip := &domain.Trip{ID: uuid.New(), CreatorID: creatorID, Name: "Private Trip", Status: domain.TripStatusFixed}
	tripRepo.trips[trip.ID] = trip
	tripRepo.addParticipant(trip.ID, creatorID)

	svc := newTestTripService(tripRepo, newFakeTripInvitationRepo(), newFakeTripCandidateRepo(), newFakeTripDestinationRepo(), newFakeTripMessageRepo(), newFakeUserRepo())
	_, err := svc.GetTrip(context.Background(), trip.ID, strangerID)
	if !errors.Is(err, domain.ErrNotFound) {
		t.Errorf("expected ErrNotFound for non-participant, got %v", err)
	}
}

// ── DeleteTrip ───────────────────────────────────────────────────────────────

func TestDeleteTrip_CreatorCanDelete(t *testing.T) {
	tripRepo := newFakeTripRepo()
	creatorID := uuid.New()
	trip := &domain.Trip{ID: uuid.New(), CreatorID: creatorID, Name: "My Trip", Status: domain.TripStatusFixed}
	tripRepo.trips[trip.ID] = trip
	tripRepo.addParticipant(trip.ID, creatorID)

	svc := newTestTripService(tripRepo, newFakeTripInvitationRepo(), newFakeTripCandidateRepo(), newFakeTripDestinationRepo(), newFakeTripMessageRepo(), newFakeUserRepo())
	if err := svc.DeleteTrip(context.Background(), trip.ID, creatorID); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if tripRepo.trips[trip.ID].DeletedAt == nil {
		t.Error("trip should have deleted_at set after soft delete")
	}
}

func TestDeleteTrip_NonCreatorForbidden(t *testing.T) {
	tripRepo := newFakeTripRepo()
	creatorID := uuid.New()
	otherID := uuid.New()
	trip := &domain.Trip{ID: uuid.New(), CreatorID: creatorID, Name: "My Trip", Status: domain.TripStatusFixed}
	tripRepo.trips[trip.ID] = trip
	tripRepo.addParticipant(trip.ID, creatorID)
	tripRepo.addParticipant(trip.ID, otherID)

	svc := newTestTripService(tripRepo, newFakeTripInvitationRepo(), newFakeTripCandidateRepo(), newFakeTripDestinationRepo(), newFakeTripMessageRepo(), newFakeUserRepo())
	err := svc.DeleteTrip(context.Background(), trip.ID, otherID)
	if !errors.Is(err, domain.ErrForbidden) {
		t.Errorf("expected ErrForbidden for non-creator, got %v", err)
	}
}

// ── CastVote ─────────────────────────────────────────────────────────────────

func TestCastVote_ParticipantCanVote(t *testing.T) {
	tripRepo := newFakeTripRepo()
	candRepo := newFakeTripCandidateRepo()
	creatorID := uuid.New()
	voterID := uuid.New()

	trip := &domain.Trip{ID: uuid.New(), CreatorID: creatorID, Status: domain.TripStatusVotingPending}
	tripRepo.trips[trip.ID] = trip
	tripRepo.addParticipant(trip.ID, creatorID)
	tripRepo.addParticipant(trip.ID, voterID)

	candidate := &domain.TripDateCandidate{ID: uuid.New(), TripID: trip.ID}
	candRepo.candidates[candidate.ID] = candidate

	svc := newTestTripService(tripRepo, newFakeTripInvitationRepo(), candRepo, newFakeTripDestinationRepo(), newFakeTripMessageRepo(), newFakeUserRepo())
	if err := svc.CastVote(context.Background(), candidate.ID, voterID); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !candRepo.votes[candRepo.voteKey(candidate.ID, voterID)] {
		t.Error("vote should have been recorded")
	}
}

func TestCastVote_NonParticipantBlocked(t *testing.T) {
	tripRepo := newFakeTripRepo()
	candRepo := newFakeTripCandidateRepo()
	creatorID := uuid.New()
	strangerID := uuid.New()

	trip := &domain.Trip{ID: uuid.New(), CreatorID: creatorID, Status: domain.TripStatusVotingPending}
	tripRepo.trips[trip.ID] = trip
	tripRepo.addParticipant(trip.ID, creatorID)

	candidate := &domain.TripDateCandidate{ID: uuid.New(), TripID: trip.ID}
	candRepo.candidates[candidate.ID] = candidate

	svc := newTestTripService(tripRepo, newFakeTripInvitationRepo(), candRepo, newFakeTripDestinationRepo(), newFakeTripMessageRepo(), newFakeUserRepo())
	err := svc.CastVote(context.Background(), candidate.ID, strangerID)
	if !errors.Is(err, domain.ErrNotParticipant) {
		t.Errorf("expected ErrNotParticipant, got %v", err)
	}
}

func TestCastVote_AlreadyFixed_Rejected(t *testing.T) {
	tripRepo := newFakeTripRepo()
	candRepo := newFakeTripCandidateRepo()
	creatorID := uuid.New()
	voterID := uuid.New()

	trip := &domain.Trip{ID: uuid.New(), CreatorID: creatorID, Status: domain.TripStatusFixed}
	tripRepo.trips[trip.ID] = trip
	tripRepo.addParticipant(trip.ID, creatorID)
	tripRepo.addParticipant(trip.ID, voterID)

	candidate := &domain.TripDateCandidate{ID: uuid.New(), TripID: trip.ID}
	candRepo.candidates[candidate.ID] = candidate

	svc := newTestTripService(tripRepo, newFakeTripInvitationRepo(), candRepo, newFakeTripDestinationRepo(), newFakeTripMessageRepo(), newFakeUserRepo())
	err := svc.CastVote(context.Background(), candidate.ID, voterID)
	if !errors.Is(err, domain.ErrTripAlreadyFixed) {
		t.Errorf("expected ErrTripAlreadyFixed, got %v", err)
	}
}

// ── LockDate ─────────────────────────────────────────────────────────────────

func TestLockDate_CreatorOnly(t *testing.T) {
	tripRepo := newFakeTripRepo()
	candRepo := newFakeTripCandidateRepo()
	creatorID := uuid.New()
	participantID := uuid.New()

	start := time.Now().Add(24 * time.Hour)
	end := start.Add(48 * time.Hour)
	trip := &domain.Trip{ID: uuid.New(), CreatorID: creatorID, Status: domain.TripStatusVotingPending}
	tripRepo.trips[trip.ID] = trip
	tripRepo.addParticipant(trip.ID, creatorID)
	tripRepo.addParticipant(trip.ID, participantID)

	candidate := &domain.TripDateCandidate{ID: uuid.New(), TripID: trip.ID, StartDate: start, EndDate: end}
	candRepo.candidates[candidate.ID] = candidate

	svc := newTestTripService(tripRepo, newFakeTripInvitationRepo(), candRepo, newFakeTripDestinationRepo(), newFakeTripMessageRepo(), newFakeUserRepo())

	// Participant cannot lock.
	err := svc.LockDate(context.Background(), trip.ID, candidate.ID, participantID)
	if !errors.Is(err, domain.ErrNotCreator) {
		t.Errorf("expected ErrNotCreator, got %v", err)
	}

	// Creator can lock.
	if err := svc.LockDate(context.Background(), trip.ID, candidate.ID, creatorID); err != nil {
		t.Fatalf("creator should be able to lock date: %v", err)
	}
	if tripRepo.trips[trip.ID].Status != domain.TripStatusFixed {
		t.Error("trip status should be fixed after lock")
	}
}

func TestLockDate_AlreadyFixed_Rejected(t *testing.T) {
	tripRepo := newFakeTripRepo()
	candRepo := newFakeTripCandidateRepo()
	creatorID := uuid.New()

	trip := &domain.Trip{ID: uuid.New(), CreatorID: creatorID, Status: domain.TripStatusFixed}
	tripRepo.trips[trip.ID] = trip
	tripRepo.addParticipant(trip.ID, creatorID)

	candidate := &domain.TripDateCandidate{ID: uuid.New(), TripID: trip.ID}
	candRepo.candidates[candidate.ID] = candidate

	svc := newTestTripService(tripRepo, newFakeTripInvitationRepo(), candRepo, newFakeTripDestinationRepo(), newFakeTripMessageRepo(), newFakeUserRepo())
	err := svc.LockDate(context.Background(), trip.ID, candidate.ID, creatorID)
	if !errors.Is(err, domain.ErrTripAlreadyFixed) {
		t.Errorf("expected ErrTripAlreadyFixed, got %v", err)
	}
}

// ── InviteParticipant ────────────────────────────────────────────────────────

func TestInviteParticipant_ByUsername_Success(t *testing.T) {
	tripRepo := newFakeTripRepo()
	invRepo := newFakeTripInvitationRepo()
	userRepo := newFakeUserRepo()
	creatorID := uuid.New()
	target := makePublicUser("g-target", "t@t.com", "Target", "targetuser")
	userRepo.seed(target)

	trip := &domain.Trip{ID: uuid.New(), CreatorID: creatorID, Status: domain.TripStatusFixed}
	tripRepo.trips[trip.ID] = trip
	tripRepo.addParticipant(trip.ID, creatorID)

	svc := newTestTripService(tripRepo, invRepo, newFakeTripCandidateRepo(), newFakeTripDestinationRepo(), newFakeTripMessageRepo(), userRepo)
	username := "targetuser"
	err := svc.InviteParticipant(context.Background(), trip.ID, creatorID, domain.InviteInput{Username: &username})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(invRepo.invitations) != 1 {
		t.Errorf("expected 1 invitation, got %d", len(invRepo.invitations))
	}
}

func TestInviteParticipant_NonParticipantBlocked(t *testing.T) {
	tripRepo := newFakeTripRepo()
	creatorID := uuid.New()
	strangerID := uuid.New()

	trip := &domain.Trip{ID: uuid.New(), CreatorID: creatorID, Status: domain.TripStatusFixed}
	tripRepo.trips[trip.ID] = trip
	tripRepo.addParticipant(trip.ID, creatorID)

	svc := newTestTripService(tripRepo, newFakeTripInvitationRepo(), newFakeTripCandidateRepo(), newFakeTripDestinationRepo(), newFakeTripMessageRepo(), newFakeUserRepo())
	username := "someone"
	err := svc.InviteParticipant(context.Background(), trip.ID, strangerID, domain.InviteInput{Username: &username})
	if !errors.Is(err, domain.ErrForbidden) {
		t.Errorf("expected ErrForbidden for non-participant inviter, got %v", err)
	}
}

// ── AddDestination ───────────────────────────────────────────────────────────

func TestAddDestination_ParticipantCanAdd(t *testing.T) {
	tripRepo := newFakeTripRepo()
	destRepo := newFakeTripDestinationRepo()
	creatorID := uuid.New()

	trip := &domain.Trip{ID: uuid.New(), CreatorID: creatorID, Status: domain.TripStatusFixed}
	tripRepo.trips[trip.ID] = trip
	tripRepo.addParticipant(trip.ID, creatorID)

	svc := newTestTripService(tripRepo, newFakeTripInvitationRepo(), newFakeTripCandidateRepo(), destRepo, newFakeTripMessageRepo(), newFakeUserRepo())
	dest, err := svc.AddDestination(context.Background(), trip.ID, creatorID, domain.AddDestinationInput{PlaceName: "Bali Beach"})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if dest.PlaceName != "Bali Beach" {
		t.Errorf("PlaceName = %q, want %q", dest.PlaceName, "Bali Beach")
	}
}

// ── SendMessage ──────────────────────────────────────────────────────────────

func TestSendMessage_ParticipantCanSend(t *testing.T) {
	tripRepo := newFakeTripRepo()
	msgRepo := newFakeTripMessageRepo()
	creatorID := uuid.New()

	trip := &domain.Trip{ID: uuid.New(), CreatorID: creatorID, Status: domain.TripStatusFixed}
	tripRepo.trips[trip.ID] = trip
	tripRepo.addParticipant(trip.ID, creatorID)

	svc := newTestTripService(tripRepo, newFakeTripInvitationRepo(), newFakeTripCandidateRepo(), newFakeTripDestinationRepo(), msgRepo, newFakeUserRepo())
	msg, err := svc.SendMessage(context.Background(), trip.ID, creatorID, "Hello, world!")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if msg.MessageText != "Hello, world!" {
		t.Errorf("MessageText = %q, want %q", msg.MessageText, "Hello, world!")
	}
}

func TestSendMessage_NonParticipantBlocked(t *testing.T) {
	tripRepo := newFakeTripRepo()
	creatorID := uuid.New()
	strangerID := uuid.New()

	trip := &domain.Trip{ID: uuid.New(), CreatorID: creatorID, Status: domain.TripStatusFixed}
	tripRepo.trips[trip.ID] = trip
	tripRepo.addParticipant(trip.ID, creatorID)

	svc := newTestTripService(tripRepo, newFakeTripInvitationRepo(), newFakeTripCandidateRepo(), newFakeTripDestinationRepo(), newFakeTripMessageRepo(), newFakeUserRepo())
	_, err := svc.SendMessage(context.Background(), trip.ID, strangerID, "Hacker message")
	if !errors.Is(err, domain.ErrNotParticipant) {
		t.Errorf("expected ErrNotParticipant, got %v", err)
	}
}

// ── UpdateTrip ───────────────────────────────────────────────────────────────

func TestUpdateTrip_CreatorCanUpdateName(t *testing.T) {
	tripRepo := newFakeTripRepo()
	creatorID := uuid.New()
	trip := &domain.Trip{ID: uuid.New(), CreatorID: creatorID, Name: "Old Name", Status: domain.TripStatusFixed}
	tripRepo.trips[trip.ID] = trip
	tripRepo.addParticipant(trip.ID, creatorID)

	svc := newTestTripService(tripRepo, newFakeTripInvitationRepo(), newFakeTripCandidateRepo(), newFakeTripDestinationRepo(), newFakeTripMessageRepo(), newFakeUserRepo())
	newName := "New Name"
	updated, err := svc.UpdateTrip(context.Background(), trip.ID, creatorID, domain.UpdateTripInput{Name: &newName})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if updated.Name != "New Name" {
		t.Errorf("Name = %q, want %q", updated.Name, "New Name")
	}
}

func TestUpdateTrip_NonCreatorForbidden(t *testing.T) {
	tripRepo := newFakeTripRepo()
	creatorID := uuid.New()
	otherID := uuid.New()
	trip := &domain.Trip{ID: uuid.New(), CreatorID: creatorID, Name: "Trip", Status: domain.TripStatusFixed}
	tripRepo.trips[trip.ID] = trip
	tripRepo.addParticipant(trip.ID, creatorID)
	tripRepo.addParticipant(trip.ID, otherID)

	svc := newTestTripService(tripRepo, newFakeTripInvitationRepo(), newFakeTripCandidateRepo(), newFakeTripDestinationRepo(), newFakeTripMessageRepo(), newFakeUserRepo())
	newName := "Hijacked"
	_, err := svc.UpdateTrip(context.Background(), trip.ID, otherID, domain.UpdateTripInput{Name: &newName})
	if !errors.Is(err, domain.ErrForbidden) {
		t.Errorf("expected ErrForbidden, got %v", err)
	}
}

func TestUpdateTrip_EmptyInputRejected(t *testing.T) {
	tripRepo := newFakeTripRepo()
	creatorID := uuid.New()
	trip := &domain.Trip{ID: uuid.New(), CreatorID: creatorID, Status: domain.TripStatusFixed}
	tripRepo.trips[trip.ID] = trip

	svc := newTestTripService(tripRepo, newFakeTripInvitationRepo(), newFakeTripCandidateRepo(), newFakeTripDestinationRepo(), newFakeTripMessageRepo(), newFakeUserRepo())
	_, err := svc.UpdateTrip(context.Background(), trip.ID, creatorID, domain.UpdateTripInput{})
	if !errors.Is(err, domain.ErrInvalidInput) {
		t.Errorf("expected ErrInvalidInput for empty update, got %v", err)
	}
}

// ── ListTrips ────────────────────────────────────────────────────────────────

func TestListTrips_ReturnsParticipantTrips(t *testing.T) {
	tripRepo := newFakeTripRepo()
	userID := uuid.New()
	otherID := uuid.New()

	t1 := &domain.Trip{ID: uuid.New(), CreatorID: userID, Name: "My Trip", Status: domain.TripStatusFixed}
	t2 := &domain.Trip{ID: uuid.New(), CreatorID: otherID, Name: "Other Trip", Status: domain.TripStatusFixed}
	tripRepo.trips[t1.ID] = t1
	tripRepo.trips[t2.ID] = t2
	tripRepo.addParticipant(t1.ID, userID)
	tripRepo.addParticipant(t2.ID, otherID)

	svc := newTestTripService(tripRepo, newFakeTripInvitationRepo(), newFakeTripCandidateRepo(), newFakeTripDestinationRepo(), newFakeTripMessageRepo(), newFakeUserRepo())
	trips, err := svc.ListTrips(context.Background(), userID, nil, 20)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(trips) != 1 {
		t.Errorf("expected 1 trip for user, got %d", len(trips))
	}
}

// ── RetractVote ──────────────────────────────────────────────────────────────

func TestRetractVote_ParticipantCanRetract(t *testing.T) {
	tripRepo := newFakeTripRepo()
	candRepo := newFakeTripCandidateRepo()
	voterID := uuid.New()
	creatorID := uuid.New()

	trip := &domain.Trip{ID: uuid.New(), CreatorID: creatorID, Status: domain.TripStatusVotingPending}
	tripRepo.trips[trip.ID] = trip
	tripRepo.addParticipant(trip.ID, creatorID)
	tripRepo.addParticipant(trip.ID, voterID)

	candidate := &domain.TripDateCandidate{ID: uuid.New(), TripID: trip.ID}
	candRepo.candidates[candidate.ID] = candidate
	candRepo.votes[candRepo.voteKey(candidate.ID, voterID)] = true

	svc := newTestTripService(tripRepo, newFakeTripInvitationRepo(), candRepo, newFakeTripDestinationRepo(), newFakeTripMessageRepo(), newFakeUserRepo())
	if err := svc.RetractVote(context.Background(), candidate.ID, voterID); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if candRepo.votes[candRepo.voteKey(candidate.ID, voterID)] {
		t.Error("vote should have been removed")
	}
}

// ── RemoveDestination ────────────────────────────────────────────────────────

func TestRemoveDestination_CreatorCanRemove(t *testing.T) {
	tripRepo := newFakeTripRepo()
	destRepo := newFakeTripDestinationRepo()
	creatorID := uuid.New()

	trip := &domain.Trip{ID: uuid.New(), CreatorID: creatorID, Status: domain.TripStatusFixed}
	tripRepo.trips[trip.ID] = trip
	tripRepo.addParticipant(trip.ID, creatorID)

	dest := &domain.TripDestination{ID: uuid.New(), TripID: trip.ID, PlaceName: "To Remove"}
	destRepo.destinations[dest.ID] = dest

	svc := newTestTripService(tripRepo, newFakeTripInvitationRepo(), newFakeTripCandidateRepo(), destRepo, newFakeTripMessageRepo(), newFakeUserRepo())
	if err := svc.RemoveDestination(context.Background(), dest.ID, trip.ID, creatorID); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if _, ok := destRepo.destinations[dest.ID]; ok {
		t.Error("destination should have been removed")
	}
}

func TestRemoveDestination_NonCreatorForbidden(t *testing.T) {
	tripRepo := newFakeTripRepo()
	destRepo := newFakeTripDestinationRepo()
	creatorID := uuid.New()
	participantID := uuid.New()

	trip := &domain.Trip{ID: uuid.New(), CreatorID: creatorID, Status: domain.TripStatusFixed}
	tripRepo.trips[trip.ID] = trip
	tripRepo.addParticipant(trip.ID, creatorID)
	tripRepo.addParticipant(trip.ID, participantID)

	dest := &domain.TripDestination{ID: uuid.New(), TripID: trip.ID, PlaceName: "Protected"}
	destRepo.destinations[dest.ID] = dest

	svc := newTestTripService(tripRepo, newFakeTripInvitationRepo(), newFakeTripCandidateRepo(), destRepo, newFakeTripMessageRepo(), newFakeUserRepo())
	err := svc.RemoveDestination(context.Background(), dest.ID, trip.ID, participantID)
	if !errors.Is(err, domain.ErrNotCreator) {
		t.Errorf("expected ErrNotCreator, got %v", err)
	}
}

// ── ListDestinations ─────────────────────────────────────────────────────────

func TestListDestinations_ParticipantCanList(t *testing.T) {
	tripRepo := newFakeTripRepo()
	destRepo := newFakeTripDestinationRepo()
	creatorID := uuid.New()

	trip := &domain.Trip{ID: uuid.New(), CreatorID: creatorID, Status: domain.TripStatusFixed}
	tripRepo.trips[trip.ID] = trip
	tripRepo.addParticipant(trip.ID, creatorID)

	d1 := &domain.TripDestination{ID: uuid.New(), TripID: trip.ID, PlaceName: "Place A"}
	d2 := &domain.TripDestination{ID: uuid.New(), TripID: trip.ID, PlaceName: "Place B"}
	destRepo.destinations[d1.ID] = d1
	destRepo.destinations[d2.ID] = d2

	svc := newTestTripService(tripRepo, newFakeTripInvitationRepo(), newFakeTripCandidateRepo(), destRepo, newFakeTripMessageRepo(), newFakeUserRepo())
	dests, err := svc.ListDestinations(context.Background(), trip.ID, creatorID)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(dests) != 2 {
		t.Errorf("expected 2 destinations, got %d", len(dests))
	}
}

// ── ListDateCandidates ───────────────────────────────────────────────────────

func TestListDateCandidates_ParticipantCanList(t *testing.T) {
	tripRepo := newFakeTripRepo()
	candRepo := newFakeTripCandidateRepo()
	creatorID := uuid.New()

	trip := &domain.Trip{ID: uuid.New(), CreatorID: creatorID, Status: domain.TripStatusVotingPending}
	tripRepo.trips[trip.ID] = trip
	tripRepo.addParticipant(trip.ID, creatorID)

	now := time.Now()
	c1 := &domain.TripDateCandidate{ID: uuid.New(), TripID: trip.ID, StartDate: now, EndDate: now.Add(48 * time.Hour)}
	candRepo.candidates[c1.ID] = c1

	svc := newTestTripService(tripRepo, newFakeTripInvitationRepo(), candRepo, newFakeTripDestinationRepo(), newFakeTripMessageRepo(), newFakeUserRepo())
	candidates, err := svc.ListDateCandidates(context.Background(), trip.ID, creatorID)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(candidates) != 1 {
		t.Errorf("expected 1 candidate, got %d", len(candidates))
	}
}

// ── GetMessages ──────────────────────────────────────────────────────────────

func TestGetMessages_ParticipantCanFetch(t *testing.T) {
	tripRepo := newFakeTripRepo()
	msgRepo := newFakeTripMessageRepo()
	creatorID := uuid.New()

	trip := &domain.Trip{ID: uuid.New(), CreatorID: creatorID, Status: domain.TripStatusFixed}
	tripRepo.trips[trip.ID] = trip
	tripRepo.addParticipant(trip.ID, creatorID)

	m1 := &domain.TripMessage{ID: uuid.New(), TripID: trip.ID, SenderID: creatorID, MessageText: "Hello"}
	msgRepo.messages[m1.ID] = m1

	svc := newTestTripService(tripRepo, newFakeTripInvitationRepo(), newFakeTripCandidateRepo(), newFakeTripDestinationRepo(), msgRepo, newFakeUserRepo())
	msgs, err := svc.GetMessages(context.Background(), trip.ID, creatorID, nil, 20)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(msgs) != 1 {
		t.Errorf("expected 1 message, got %d", len(msgs))
	}
}
