package domain

import (
	"context"
	"time"

	"github.com/google/uuid"
)

// PriorityLevel represents the user-defined importance of a wishlist destination.
type PriorityLevel string

const (
	PriorityHigh   PriorityLevel = "high"
	PriorityMedium PriorityLevel = "medium"
	PriorityLow    PriorityLevel = "low"
)

// Wishlist is a saved destination that a user intends to visit in the future.
type Wishlist struct {
	ID            uuid.UUID
	UserID        uuid.UUID
	PlaceName     string
	Link          *string
	Tags          []string
	PriorityLevel PriorityLevel
	DeletedAt     *time.Time
	CreatedAt     time.Time
	UpdatedAt     time.Time
}

// ── Repository ───────────────────────────────────────────────────────────────

// WishlistRepository defines the data-access contract for the wishlists table.
type WishlistRepository interface {
	Create(ctx context.Context, item *Wishlist) error
	FindByID(ctx context.Context, id uuid.UUID) (*Wishlist, error)
	// List returns active (non-deleted) wishlist items for a user,
	// with optional tag/priority filtering and keyset pagination.
	List(ctx context.Context, userID uuid.UUID, filter WishlistFilter) ([]*Wishlist, error)
	Update(ctx context.Context, item *Wishlist) error
	SoftDelete(ctx context.Context, id, userID uuid.UUID) error
}

// ── Service ──────────────────────────────────────────────────────────────────

// WishlistService defines the business-logic contract for wishlist management.
type WishlistService interface {
	Create(ctx context.Context, userID uuid.UUID, input CreateWishlistInput) (*Wishlist, error)
	List(ctx context.Context, userID uuid.UUID, filter WishlistFilter) ([]*Wishlist, error)
	Update(ctx context.Context, id, userID uuid.UUID, input UpdateWishlistInput) (*Wishlist, error)
	Delete(ctx context.Context, id, userID uuid.UUID) error
}

// ── Input DTOs ───────────────────────────────────────────────────────────────

// CreateWishlistInput is the payload for creating a new wishlist item.
type CreateWishlistInput struct {
	PlaceName     string
	Link          *string
	Tags          []string
	PriorityLevel PriorityLevel
}

// UpdateWishlistInput is the mutation payload for a wishlist item.
// A nil pointer means "no change" for that field.
type UpdateWishlistInput struct {
	PlaceName     *string
	Link          *string
	Tags          []string
	PriorityLevel *PriorityLevel
}

// WishlistFilter specifies the query parameters for listing wishlist items.
type WishlistFilter struct {
	Tags     []string
	Priority *PriorityLevel
	Cursor   *uuid.UUID // last-seen item ID for keyset pagination
	Limit    int        // defaults to 20 at the service layer
}
