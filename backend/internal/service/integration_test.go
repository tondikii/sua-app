//go:build integration

// Package service integration tests require a running PostgreSQL instance.
// Set the TEST_DATABASE_URL environment variable, then run:
//
//	go test -tags integration -v ./internal/service/
//
// The TEST_DATABASE_URL must point to a dedicated test database that is
// separate from development and production. Never use the production DB.
package service

import (
	"context"
	"os"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/sudutkode/atur-perjalanan/backend/internal/domain"
	"github.com/sudutkode/atur-perjalanan/backend/internal/repository"
)

func integrationPool(t *testing.T) *pgxpool.Pool {
	t.Helper()
	dsn := os.Getenv("TEST_DATABASE_URL")
	if dsn == "" {
		t.Skip("TEST_DATABASE_URL not set — skipping integration test")
	}
	pool, err := pgxpool.New(context.Background(), dsn)
	if err != nil {
		t.Fatalf("open test pool: %v", err)
	}
	t.Cleanup(pool.Close)
	return pool
}

func newIntegrationTripService(t *testing.T, pool *pgxpool.Pool) domain.TripService {
	t.Helper()
	return NewTripService(
		repository.NewTripRepository(pool),
		repository.NewTripInvitationRepository(pool),
		repository.NewTripDateCandidateRepository(pool),
		repository.NewTripDestinationRepository(pool),
		repository.NewTripMessageRepository(pool),
		repository.NewUserRepository(pool),
		repository.NewFollowRepository(pool),
		pool,
		nil, // no notifications in integration tests
	)
}

func itUserPtr(t time.Time) *time.Time { return &t }

func newItUser(googleID, email, name string) *domain.User {
	id := uuid.New()
	return &domain.User{
		ID:       id,
		GoogleID: googleID,
		Email:    email,
		Name:     name,
		Username: id.String(),
		IsPublic: true,
	}
}

// TestIntegration_CreateTrip_Fixed verifies that a trip with a single date
// range is persisted with status=fixed.
func TestIntegration_CreateTrip_Fixed(t *testing.T) {
	pool := integrationPool(t)
	userRepo := repository.NewUserRepository(pool)
	creator := newItUser("goog-it-1", "it-creator@test.com", "IT Creator")
	if err := userRepo.Create(context.Background(), creator); err != nil {
		t.Fatalf("create creator: %v", err)
	}
	t.Cleanup(func() { pool.Exec(context.Background(), "DELETE FROM users WHERE id = $1", creator.ID) })

	svc := newIntegrationTripService(t, pool)
	trip, err := svc.CreateTrip(context.Background(), creator.ID, domain.CreateTripInput{
		Name:      "IT Fixed Trip",
		StartDate: itUserPtr(time.Now().Add(24 * time.Hour)),
		EndDate:   itUserPtr(time.Now().Add(48 * time.Hour)),
	})
	if err != nil {
		t.Fatalf("CreateTrip: %v", err)
	}
	t.Cleanup(func() { pool.Exec(context.Background(), "DELETE FROM trips WHERE id = $1", trip.ID) })

	if trip.Status != domain.TripStatusFixed {
		t.Errorf("Status = %v, want fixed", trip.Status)
	}
}

// TestIntegration_CreateTrip_VotingPending verifies that multiple date
// candidates result in status=voting_pending.
func TestIntegration_CreateTrip_VotingPending(t *testing.T) {
	pool := integrationPool(t)
	userRepo := repository.NewUserRepository(pool)
	creator := newItUser("goog-it-2", "it-vp@test.com", "IT Creator VP")
	if err := userRepo.Create(context.Background(), creator); err != nil {
		t.Fatalf("create creator: %v", err)
	}
	t.Cleanup(func() { pool.Exec(context.Background(), "DELETE FROM users WHERE id = $1", creator.ID) })

	svc := newIntegrationTripService(t, pool)
	now := time.Now()
	trip, err := svc.CreateTrip(context.Background(), creator.ID, domain.CreateTripInput{
		Name: "IT Voting Trip",
		Candidates: []domain.DateRange{
			{StartDate: now.Add(24 * time.Hour), EndDate: now.Add(48 * time.Hour)},
			{StartDate: now.Add(72 * time.Hour), EndDate: now.Add(96 * time.Hour)},
		},
	})
	if err != nil {
		t.Fatalf("CreateTrip: %v", err)
	}
	t.Cleanup(func() { pool.Exec(context.Background(), "DELETE FROM trips WHERE id = $1", trip.ID) })

	if trip.Status != domain.TripStatusVotingPending {
		t.Errorf("Status = %v, want voting_pending", trip.Status)
	}
}

// TestIntegration_RespondToInvitation_MutualFollow verifies that accepting a
// username-based invitation creates a mutual follow relationship atomically.
func TestIntegration_RespondToInvitation_MutualFollow(t *testing.T) {
	pool := integrationPool(t)
	userRepo := repository.NewUserRepository(pool)
	inviter := newItUser("goog-it-3a", "inviter@test.com", "Inviter")
	invitee := newItUser("goog-it-3b", "invitee@test.com", "Invitee")

	for _, u := range []*domain.User{inviter, invitee} {
		if err := userRepo.Create(context.Background(), u); err != nil {
			t.Fatalf("create user %s: %v", u.Name, err)
		}
		t.Cleanup(func() { pool.Exec(context.Background(), "DELETE FROM users WHERE id = $1", u.ID) })
	}

	svc := newIntegrationTripService(t, pool)
	trip, err := svc.CreateTrip(context.Background(), inviter.ID, domain.CreateTripInput{
		Name:      "IT Mutual Follow Trip",
		StartDate: itUserPtr(time.Now().Add(24 * time.Hour)),
		EndDate:   itUserPtr(time.Now().Add(48 * time.Hour)),
	})
	if err != nil {
		t.Fatalf("CreateTrip: %v", err)
	}
	t.Cleanup(func() { pool.Exec(context.Background(), "DELETE FROM trips WHERE id = $1", trip.ID) })

	username := invitee.Username
	if err := svc.InviteParticipant(context.Background(), trip.ID, inviter.ID, domain.InviteInput{Username: &username}); err != nil {
		t.Fatalf("InviteParticipant: %v", err)
	}

	invRepo := repository.NewTripInvitationRepository(pool)
	pending, err := invRepo.FindPendingByUser(context.Background(), invitee.ID)
	if err != nil || len(pending) == 0 {
		t.Fatalf("no pending invitation found: %v", err)
	}

	if err := svc.RespondToInvitation(context.Background(), pending[0].ID, invitee.ID, true); err != nil {
		t.Fatalf("RespondToInvitation: %v", err)
	}

	var count int
	if err := pool.QueryRow(context.Background(),
		`SELECT COUNT(*) FROM follows WHERE (follower_id=$1 AND following_id=$2) OR (follower_id=$2 AND following_id=$1)`,
		inviter.ID, invitee.ID,
	).Scan(&count); err != nil {
		t.Fatalf("count follows: %v", err)
	}
	if count != 2 {
		t.Errorf("expected 2 mutual follow rows, got %d", count)
	}
}
