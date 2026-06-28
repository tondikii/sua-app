package service

import (
	"context"
	"errors"
	"testing"
	"time"

	"github.com/google/uuid"

	"github.com/sudutkode/atur-perjalanan/backend/internal/domain"
)

// ── Fake notification repo ────────────────────────────────────────────────────

type fakeNotificationRepo struct {
	created []domain.Notification
}

func (r *fakeNotificationRepo) Create(_ context.Context, n *domain.Notification) error {
	r.created = append(r.created, *n)
	return nil
}

func (r *fakeNotificationRepo) ListByUser(_ context.Context, _ uuid.UUID, _ *time.Time, _ int) ([]*domain.Notification, error) {
	return nil, nil
}

func (r *fakeNotificationRepo) CountUnread(_ context.Context, userID uuid.UUID) (int, error) {
	count := 0
	for _, n := range r.created {
		if n.UserID == userID && !n.IsRead {
			count++
		}
	}
	return count, nil
}

func (r *fakeNotificationRepo) MarkRead(_ context.Context, id, _ uuid.UUID) error {
	for i, n := range r.created {
		if n.ID == id {
			r.created[i].IsRead = true
			return nil
		}
	}
	return domain.ErrNotFound
}

func (r *fakeNotificationRepo) MarkAllRead(_ context.Context, userID uuid.UUID) error {
	for i := range r.created {
		if r.created[i].UserID == userID {
			r.created[i].IsRead = true
		}
	}
	return nil
}

func (r *fakeNotificationRepo) FindUnvotedParticipants(_ context.Context, _, _ time.Time) ([]domain.VotingReminderRow, error) {
	return nil, nil
}

// ── Fake trip repo for notifications (minimal) ───────────────────────────────

type fakeNotifTripRepo struct {
	participants map[uuid.UUID][]uuid.UUID
}

func (r *fakeNotifTripRepo) ListParticipantIDs(_ context.Context, tripID uuid.UUID) ([]uuid.UUID, error) {
	return r.participants[tripID], nil
}

func (r *fakeNotifTripRepo) Create(_ context.Context, _ *domain.Trip) error                    { return nil }
func (r *fakeNotifTripRepo) FindByID(_ context.Context, _ uuid.UUID) (*domain.Trip, error)     { return nil, nil }
func (r *fakeNotifTripRepo) ListByParticipant(_ context.Context, _ uuid.UUID, _ *uuid.UUID, _ int) ([]*domain.Trip, error) {
	return nil, nil
}
func (r *fakeNotifTripRepo) ListByParticipantFiltered(_ context.Context, _ uuid.UUID, _ string, _ *uuid.UUID, _ int) ([]*domain.Trip, error) {
	return nil, nil
}
func (r *fakeNotifTripRepo) ListByCreator(_ context.Context, _ uuid.UUID, _ bool) ([]*domain.Trip, error) {
	return nil, nil
}
func (r *fakeNotifTripRepo) Update(_ context.Context, _ *domain.Trip) error                   { return nil }
func (r *fakeNotifTripRepo) SoftDelete(_ context.Context, _ uuid.UUID) error                  { return nil }
func (r *fakeNotifTripRepo) IsParticipant(_ context.Context, _, _ uuid.UUID) (bool, error)    { return false, nil }
func (r *fakeNotifTripRepo) IsCreator(_ context.Context, _, _ uuid.UUID) (bool, error)        { return false, nil }
func (r *fakeNotifTripRepo) GetParticipantsInfo(_ context.Context, _ []uuid.UUID, _ int) (map[uuid.UUID]*domain.ParticipantsInfo, error) {
	return nil, nil
}

// ── Tests ─────────────────────────────────────────────────────────────────────

func TestNotifyInvite_CreatesNotification(t *testing.T) {
	repo := &fakeNotificationRepo{}
	tripRepo := &fakeNotifTripRepo{participants: make(map[uuid.UUID][]uuid.UUID)}
	svc := NewNotificationService(repo, tripRepo)

	inviteeID := uuid.New()
	inviterID := uuid.New()
	tripID := uuid.New()

	if err := svc.NotifyInvite(context.Background(), inviteeID, inviterID, tripID); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(repo.created) != 1 {
		t.Fatalf("expected 1 notification, got %d", len(repo.created))
	}
	n := repo.created[0]
	if n.UserID != inviteeID {
		t.Errorf("UserID = %v, want %v", n.UserID, inviteeID)
	}
	if n.Type != domain.NotificationTypeInvite {
		t.Errorf("Type = %q, want invite", n.Type)
	}
	if n.ActorID == nil || *n.ActorID != inviterID {
		t.Errorf("ActorID = %v, want %v", n.ActorID, inviterID)
	}
}

func TestNotifyFollow_CreatesNotification(t *testing.T) {
	repo := &fakeNotificationRepo{}
	tripRepo := &fakeNotifTripRepo{participants: make(map[uuid.UUID][]uuid.UUID)}
	svc := NewNotificationService(repo, tripRepo)

	followedID := uuid.New()
	followerID := uuid.New()

	if err := svc.NotifyFollow(context.Background(), followedID, followerID); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(repo.created) != 1 {
		t.Fatalf("expected 1 notification, got %d", len(repo.created))
	}
	n := repo.created[0]
	if n.UserID != followedID {
		t.Errorf("UserID = %v, want %v", n.UserID, followedID)
	}
	if n.Type != domain.NotificationTypeFollow {
		t.Errorf("Type = %q, want follow", n.Type)
	}
}

func TestNotifyDestinationUpdate_NotifiesParticipantsExceptActor(t *testing.T) {
	repo := &fakeNotificationRepo{}
	tripRepo := &fakeNotifTripRepo{participants: make(map[uuid.UUID][]uuid.UUID)}
	svc := NewNotificationService(repo, tripRepo)

	tripID := uuid.New()
	actorID := uuid.New()
	p1 := uuid.New()
	p2 := uuid.New()
	tripRepo.participants[tripID] = []uuid.UUID{actorID, p1, p2}

	if err := svc.NotifyDestinationUpdate(context.Background(), tripID, actorID, "Bali"); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	// Should notify p1 and p2 but NOT actorID.
	if len(repo.created) != 2 {
		t.Fatalf("expected 2 notifications, got %d", len(repo.created))
	}
	for _, n := range repo.created {
		if n.UserID == actorID {
			t.Error("actor should not receive destination_update notification")
		}
		if n.Type != domain.NotificationTypeDestinationUpdate {
			t.Errorf("Type = %q, want destination_update", n.Type)
		}
	}
}

func TestCountUnread_ReturnsCorrectCount(t *testing.T) {
	repo := &fakeNotificationRepo{}
	tripRepo := &fakeNotifTripRepo{participants: make(map[uuid.UUID][]uuid.UUID)}
	svc := NewNotificationService(repo, tripRepo)

	userID := uuid.New()
	otherID := uuid.New()

	_ = svc.NotifyFollow(context.Background(), userID, uuid.New())
	_ = svc.NotifyFollow(context.Background(), userID, uuid.New())
	_ = svc.NotifyFollow(context.Background(), otherID, uuid.New()) // different user

	count, err := svc.CountUnread(context.Background(), userID)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if count != 2 {
		t.Errorf("unread count = %d, want 2", count)
	}
}

func TestMarkRead_MarksCorrectNotification(t *testing.T) {
	repo := &fakeNotificationRepo{}
	tripRepo := &fakeNotifTripRepo{participants: make(map[uuid.UUID][]uuid.UUID)}
	svc := NewNotificationService(repo, tripRepo)

	userID := uuid.New()
	_ = svc.NotifyFollow(context.Background(), userID, uuid.New())
	if len(repo.created) == 0 {
		t.Fatal("no notification created")
	}
	notifID := repo.created[0].ID

	if err := svc.MarkRead(context.Background(), notifID, userID); err != nil {
		t.Fatalf("MarkRead: %v", err)
	}
	if !repo.created[0].IsRead {
		t.Error("notification should be marked read")
	}
}

func TestMarkRead_NotFound(t *testing.T) {
	repo := &fakeNotificationRepo{}
	tripRepo := &fakeNotifTripRepo{participants: make(map[uuid.UUID][]uuid.UUID)}
	svc := NewNotificationService(repo, tripRepo)

	err := svc.MarkRead(context.Background(), uuid.New(), uuid.New())
	if !errors.Is(err, domain.ErrNotFound) {
		t.Errorf("expected ErrNotFound, got %v", err)
	}
}
