//go:build integration

// Privacy matrix integration tests require a running PostgreSQL instance.
// Set the TEST_DATABASE_URL environment variable, then run:
//
//	go test -tags integration -v ./internal/service/ -run TestPrivacy
package service

import (
	"context"
	"testing"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/sudutkode/atur-perjalanan/backend/internal/domain"
	"github.com/sudutkode/atur-perjalanan/backend/internal/repository"
)

func newIntegrationUserService(t *testing.T, pool *pgxpool.Pool) domain.UserService {
	t.Helper()
	return NewUserService(
		repository.NewUserRepository(pool),
		repository.NewFollowRepository(pool),
		nil,
	)
}

// TestPrivacy_PublicProfile_Stranger verifies that a stranger can view a public profile.
func TestPrivacy_PublicProfile_Stranger(t *testing.T) {
	pool := integrationPool(t)
	userRepo := repository.NewUserRepository(pool)

	owner := newItUser("priv-it-1a", "pub-owner@test.com", "Public Owner")
	owner.IsPublic = true
	owner.Username = "pubowner_" + uuid.New().String()[:8]
	if err := userRepo.Create(context.Background(), owner); err != nil {
		t.Fatalf("create owner: %v", err)
	}
	t.Cleanup(func() { pool.Exec(context.Background(), "DELETE FROM users WHERE id = $1", owner.ID) })

	svc := newIntegrationUserService(t, pool)
	view, err := svc.GetProfileView(context.Background(), owner.Username, nil)
	if err != nil {
		t.Fatalf("GetProfileView: %v", err)
	}
	if !view.CanViewContent {
		t.Error("public profile should have can_view_content=true for stranger")
	}
}

// TestPrivacy_PrivateProfile_Stranger verifies that a stranger gets limited view of a private profile.
func TestPrivacy_PrivateProfile_Stranger(t *testing.T) {
	pool := integrationPool(t)
	userRepo := repository.NewUserRepository(pool)

	owner := newItUser("priv-it-2a", "priv-owner@test.com", "Private Owner")
	owner.IsPublic = false
	owner.Username = "privowner_" + uuid.New().String()[:8]
	bio := "secret bio"
	owner.Bio = &bio
	if err := userRepo.Create(context.Background(), owner); err != nil {
		t.Fatalf("create owner: %v", err)
	}
	t.Cleanup(func() { pool.Exec(context.Background(), "DELETE FROM users WHERE id = $1", owner.ID) })

	svc := newIntegrationUserService(t, pool)
	view, err := svc.GetProfileView(context.Background(), owner.Username, nil)
	if err != nil {
		t.Fatalf("GetProfileView: %v", err)
	}
	if view.CanViewContent {
		t.Error("private profile should have can_view_content=false for stranger")
	}
	if view.Bio != nil {
		t.Error("bio should be hidden (nil) for stranger viewing private profile")
	}
}

// TestPrivacy_PrivateProfile_Owner verifies the owner can view their own private profile fully.
func TestPrivacy_PrivateProfile_Owner(t *testing.T) {
	pool := integrationPool(t)
	userRepo := repository.NewUserRepository(pool)

	owner := newItUser("priv-it-3a", "self-owner@test.com", "Self Owner")
	owner.IsPublic = false
	owner.Username = "selfowner_" + uuid.New().String()[:8]
	bio := "my private bio"
	owner.Bio = &bio
	if err := userRepo.Create(context.Background(), owner); err != nil {
		t.Fatalf("create owner: %v", err)
	}
	t.Cleanup(func() { pool.Exec(context.Background(), "DELETE FROM users WHERE id = $1", owner.ID) })

	svc := newIntegrationUserService(t, pool)
	view, err := svc.GetProfileView(context.Background(), owner.Username, &owner.ID)
	if err != nil {
		t.Fatalf("GetProfileView: %v", err)
	}
	if !view.CanViewContent {
		t.Error("owner should have can_view_content=true for their own private profile")
	}
	if view.Bio == nil || *view.Bio != bio {
		t.Errorf("Bio = %v, want %q", view.Bio, bio)
	}
}

// TestPrivacy_PrivateProfile_Follower verifies a follower can view a private profile.
func TestPrivacy_PrivateProfile_Follower(t *testing.T) {
	pool := integrationPool(t)
	userRepo := repository.NewUserRepository(pool)
	followRepo := repository.NewFollowRepository(pool)

	owner := newItUser("priv-it-4a", "follow-owner@test.com", "Follow Owner")
	owner.IsPublic = false
	owner.Username = "followowner_" + uuid.New().String()[:8]
	follower := newItUser("priv-it-4b", "follower@test.com", "Follower")

	for _, u := range []*domain.User{owner, follower} {
		if err := userRepo.Create(context.Background(), u); err != nil {
			t.Fatalf("create user %s: %v", u.Name, err)
		}
		t.Cleanup(func() { pool.Exec(context.Background(), "DELETE FROM users WHERE id = $1", u.ID) })
	}

	// Create follow relationship.
	if err := followRepo.Create(context.Background(), follower.ID, owner.ID); err != nil {
		t.Fatalf("create follow: %v", err)
	}

	svc := newIntegrationUserService(t, pool)
	view, err := svc.GetProfileView(context.Background(), owner.Username, &follower.ID)
	if err != nil {
		t.Fatalf("GetProfileView: %v", err)
	}
	if !view.CanViewContent {
		t.Error("follower should have can_view_content=true for private profile they follow")
	}
	if !view.IsFollowing {
		t.Error("is_following should be true for the follower")
	}
}

// TestPrivacy_CheckUsernameAvailable verifies username availability check.
func TestPrivacy_CheckUsernameAvailable(t *testing.T) {
	pool := integrationPool(t)
	userRepo := repository.NewUserRepository(pool)

	u := newItUser("priv-it-5a", "ucheck@test.com", "UCheck")
	u.Username = "ucheck_" + uuid.New().String()[:8]
	if err := userRepo.Create(context.Background(), u); err != nil {
		t.Fatalf("create user: %v", err)
	}
	t.Cleanup(func() { pool.Exec(context.Background(), "DELETE FROM users WHERE id = $1", u.ID) })

	svc := newIntegrationUserService(t, pool)
	// Taken username
	available, err := svc.CheckUsernameAvailable(context.Background(), u.Username)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if available {
		t.Error("existing username should not be available")
	}
	// New username
	available, err = svc.CheckUsernameAvailable(context.Background(), "definitely_unique_"+uuid.New().String()[:8])
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !available {
		t.Error("new username should be available")
	}
}
