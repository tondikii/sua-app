package domain

import (
	"context"
	"time"

	"github.com/google/uuid"
)

// User is the canonical domain model for an application user.
type User struct {
	ID        uuid.UUID
	GoogleID  string
	Email     string
	Name      string
	Username  string
	AvatarURL *string
	Bio       *string
	IsPublic  bool
	CreatedAt time.Time
	UpdatedAt time.Time
}

// ── Repository ───────────────────────────────────────────────────────────────

// UserRepository defines the data-access contract for the users table.
type UserRepository interface {
	Create(ctx context.Context, user *User) error
	FindByID(ctx context.Context, id uuid.UUID) (*User, error)
	FindByGoogleID(ctx context.Context, googleID string) (*User, error)
	FindByUsername(ctx context.Context, username string) (*User, error)
	Update(ctx context.Context, user *User) error
	// SearchByQuery performs a trigram search across the username and name columns.
	// cursor is the last-seen user ID for keyset pagination.
	SearchByQuery(ctx context.Context, query string, limit int, cursor *uuid.UUID) ([]*User, error)
	IsUsernameTaken(ctx context.Context, username string) (bool, error)
}

// ── Service ──────────────────────────────────────────────────────────────────

// UserService defines the business-logic contract for user management.
type UserService interface {
	// UpsertFromGoogle creates or updates a user from verified Google ID token claims.
	// Returns the user and true if the user is newly created (requires username setup).
	UpsertFromGoogle(ctx context.Context, input GoogleAuthInput) (*User, bool, error)
	CompleteRegistration(ctx context.Context, userID uuid.UUID, username string) (*User, error)
	GetProfile(ctx context.Context, username string, viewerID *uuid.UUID) (*User, error)
	UpdateProfile(ctx context.Context, userID uuid.UUID, input UpdateProfileInput) (*User, error)
	Follow(ctx context.Context, followerID, followingID uuid.UUID) error
	Unfollow(ctx context.Context, followerID, followingID uuid.UUID) error
}

// ── Input DTOs ───────────────────────────────────────────────────────────────

// GoogleAuthInput carries verified claims extracted from a Google ID token.
type GoogleAuthInput struct {
	GoogleID  string
	Email     string
	Name      string
	AvatarURL string
}

// UpdateProfileInput is the mutation payload for profile updates.
// A nil pointer means "no change" for that field.
type UpdateProfileInput struct {
	Bio      *string
	IsPublic *bool
}
