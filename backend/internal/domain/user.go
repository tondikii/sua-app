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

// UserSummary is a lightweight snapshot of a user suitable for embedding in
// other responses (e.g. trip participant list, message sender).
type UserSummary struct {
	ID        uuid.UUID `json:"id"`
	Name      string    `json:"name"`
	Username  string    `json:"username"`
	AvatarURL *string   `json:"avatar_url"`
}

// ProfileView is the privacy-aware public view of a user profile returned by
// GET /v1/users/:username. It includes social graph counts and a flag that
// controls whether the viewer can see private content.
type ProfileView struct {
	User
	FollowersCount  int  `json:"followers_count"`
	FollowingCount  int  `json:"following_count"`
	PublicTripCount int  `json:"public_trip_count"`
	IsFollowing     bool `json:"is_following"`
	CanViewContent  bool `json:"can_view_content"`
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
	// CountPublicTrips returns the number of public, non-deleted trips where the
	// given user is a participant.
	CountPublicTrips(ctx context.Context, userID uuid.UUID) (int, error)
}

// FollowRepository defines the data-access contract for the follows table.
type FollowRepository interface {
	// Create inserts a follow relationship. Silently ignores duplicates (ON CONFLICT DO NOTHING).
	Create(ctx context.Context, followerID, followingID uuid.UUID) error
	Delete(ctx context.Context, followerID, followingID uuid.UUID) error
	// IsFollowing returns true when followerID follows followingID.
	IsFollowing(ctx context.Context, followerID, followingID uuid.UUID) (bool, error)
	// CountFollowers returns the number of users following the given user.
	CountFollowers(ctx context.Context, userID uuid.UUID) (int, error)
	// CountFollowing returns the number of users the given user follows.
	CountFollowing(ctx context.Context, userID uuid.UUID) (int, error)
}

// ── Service ──────────────────────────────────────────────────────────────────

// UserService defines the business-logic contract for user management.
type UserService interface {
	// UpsertFromGoogle creates or updates a user from verified Google ID token claims.
	// Returns the user and true if the user is newly created (requires username setup).
	UpsertFromGoogle(ctx context.Context, input GoogleAuthInput) (*User, bool, error)
	CompleteRegistration(ctx context.Context, userID uuid.UUID, username string) (*User, error)
	// GetProfile looks up a user by username without privacy enforcement (for internal
	// callers such as follow/unfollow handlers that need the raw user record).
	GetProfile(ctx context.Context, username string, viewerID *uuid.UUID) (*User, error)
	// GetProfileView returns the privacy-aware public profile view for
	// GET /v1/users/:username. Private accounts return a limited profile with
	// can_view_content=false for non-followers/non-owners.
	GetProfileView(ctx context.Context, username string, viewerID *uuid.UUID) (*ProfileView, error)
	// CheckUsernameAvailable returns true when the username is not taken.
	CheckUsernameAvailable(ctx context.Context, username string) (bool, error)
	GetByID(ctx context.Context, userID uuid.UUID) (*User, error)
	UpdateProfile(ctx context.Context, userID uuid.UUID, input UpdateProfileInput) (*User, error)
	Follow(ctx context.Context, followerID, followingID uuid.UUID) error
	Unfollow(ctx context.Context, followerID, followingID uuid.UUID) error
	// Search performs a trigram search across users by username/name with keyset pagination.
	Search(ctx context.Context, query string, limit int, cursor *uuid.UUID) ([]*User, error)
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
