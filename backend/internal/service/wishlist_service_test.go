package service

import (
	"context"
	"errors"
	"testing"

	"github.com/google/uuid"

	"github.com/sudutkode/atur-perjalanan/backend/internal/domain"
)

// ── Fake Wishlist Repository ─────────────────────────────────────────────────

type fakeWishlistRepo struct {
	items map[uuid.UUID]*domain.Wishlist
}

func newFakeWishlistRepo() *fakeWishlistRepo {
	return &fakeWishlistRepo{items: make(map[uuid.UUID]*domain.Wishlist)}
}

func (r *fakeWishlistRepo) Create(_ context.Context, w *domain.Wishlist) error {
	r.items[w.ID] = w
	return nil
}

func (r *fakeWishlistRepo) FindByID(_ context.Context, id uuid.UUID) (*domain.Wishlist, error) {
	w, ok := r.items[id]
	if !ok {
		return nil, domain.ErrNotFound
	}
	return w, nil
}

func (r *fakeWishlistRepo) List(_ context.Context, userID uuid.UUID, filter domain.WishlistFilter) ([]*domain.Wishlist, error) {
	var result []*domain.Wishlist
	for _, w := range r.items {
		if w.UserID != userID || w.DeletedAt != nil {
			continue
		}
		if filter.Priority != nil && w.PriorityLevel != *filter.Priority {
			continue
		}
		result = append(result, w)
	}
	limit := filter.Limit
	if limit <= 0 {
		limit = 20
	}
	if len(result) > limit {
		result = result[:limit]
	}
	return result, nil
}

func (r *fakeWishlistRepo) Update(_ context.Context, w *domain.Wishlist) error {
	if _, ok := r.items[w.ID]; !ok {
		return domain.ErrNotFound
	}
	r.items[w.ID] = w
	return nil
}

func (r *fakeWishlistRepo) SoftDelete(_ context.Context, id, userID uuid.UUID) error {
	w, ok := r.items[id]
	if !ok {
		return domain.ErrNotFound
	}
	if w.UserID != userID {
		return domain.ErrForbidden
	}
	// The service already checked ownership before calling SoftDelete,
	// but we replicate it here to match the real repo behaviour.
	delete(r.items, id)
	return nil
}

// ── Create ───────────────────────────────────────────────────────────────────

func TestWishlistCreate_DefaultsPriorityToMedium(t *testing.T) {
	repo := newFakeWishlistRepo()
	svc := NewWishlistService(repo)

	userID := uuid.New()
	w, err := svc.Create(context.Background(), userID, domain.CreateWishlistInput{PlaceName: "Pantai Kuta"})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if w.PriorityLevel != domain.PriorityMedium {
		t.Errorf("PriorityLevel = %q, want %q", w.PriorityLevel, domain.PriorityMedium)
	}
}

func TestWishlistCreate_RespectsPriority(t *testing.T) {
	repo := newFakeWishlistRepo()
	svc := NewWishlistService(repo)

	userID := uuid.New()
	w, err := svc.Create(context.Background(), userID, domain.CreateWishlistInput{
		PlaceName:     "Raja Ampat",
		PriorityLevel: domain.PriorityHigh,
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if w.PriorityLevel != domain.PriorityHigh {
		t.Errorf("PriorityLevel = %q, want %q", w.PriorityLevel, domain.PriorityHigh)
	}
}

func TestWishlistCreate_EmptyNameRejected(t *testing.T) {
	repo := newFakeWishlistRepo()
	svc := NewWishlistService(repo)

	_, err := svc.Create(context.Background(), uuid.New(), domain.CreateWishlistInput{PlaceName: ""})
	if !errors.Is(err, domain.ErrInvalidInput) {
		t.Errorf("expected ErrInvalidInput for empty name, got %v", err)
	}
}

// ── List ─────────────────────────────────────────────────────────────────────

func TestWishlistList_FiltersByPriority(t *testing.T) {
	repo := newFakeWishlistRepo()
	svc := NewWishlistService(repo)

	userID := uuid.New()
	_, _ = svc.Create(context.Background(), userID, domain.CreateWishlistInput{PlaceName: "High Place", PriorityLevel: domain.PriorityHigh})
	_, _ = svc.Create(context.Background(), userID, domain.CreateWishlistInput{PlaceName: "Low Place", PriorityLevel: domain.PriorityLow})
	_, _ = svc.Create(context.Background(), userID, domain.CreateWishlistInput{PlaceName: "Med Place", PriorityLevel: domain.PriorityMedium})

	high := domain.PriorityHigh
	items, err := svc.List(context.Background(), userID, domain.WishlistFilter{Priority: &high, Limit: 20})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(items) != 1 {
		t.Errorf("expected 1 high-priority item, got %d", len(items))
	}
	if items[0].PlaceName != "High Place" {
		t.Errorf("PlaceName = %q, want %q", items[0].PlaceName, "High Place")
	}
}

func TestWishlistList_OnlyReturnsOwnerItems(t *testing.T) {
	repo := newFakeWishlistRepo()
	svc := NewWishlistService(repo)

	userA := uuid.New()
	userB := uuid.New()
	_, _ = svc.Create(context.Background(), userA, domain.CreateWishlistInput{PlaceName: "A's Place"})
	_, _ = svc.Create(context.Background(), userB, domain.CreateWishlistInput{PlaceName: "B's Place"})

	items, err := svc.List(context.Background(), userA, domain.WishlistFilter{Limit: 20})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(items) != 1 {
		t.Errorf("expected 1 item for userA, got %d", len(items))
	}
}

// ── Update ───────────────────────────────────────────────────────────────────

func TestWishlistUpdate_OwnerCanUpdate(t *testing.T) {
	repo := newFakeWishlistRepo()
	svc := NewWishlistService(repo)

	userID := uuid.New()
	w, _ := svc.Create(context.Background(), userID, domain.CreateWishlistInput{PlaceName: "Old Name"})

	newName := "New Name"
	updated, err := svc.Update(context.Background(), w.ID, userID, domain.UpdateWishlistInput{PlaceName: &newName})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if updated.PlaceName != "New Name" {
		t.Errorf("PlaceName = %q, want %q", updated.PlaceName, "New Name")
	}
}

func TestWishlistUpdate_OtherUserForbidden(t *testing.T) {
	repo := newFakeWishlistRepo()
	svc := NewWishlistService(repo)

	ownerID := uuid.New()
	otherID := uuid.New()
	w, _ := svc.Create(context.Background(), ownerID, domain.CreateWishlistInput{PlaceName: "My Place"})

	newName := "Hacked"
	_, err := svc.Update(context.Background(), w.ID, otherID, domain.UpdateWishlistInput{PlaceName: &newName})
	if !errors.Is(err, domain.ErrForbidden) {
		t.Errorf("expected ErrForbidden, got %v", err)
	}
}

// ── Delete ───────────────────────────────────────────────────────────────────

func TestWishlistDelete_OwnerCanDelete(t *testing.T) {
	repo := newFakeWishlistRepo()
	svc := NewWishlistService(repo)

	userID := uuid.New()
	w, _ := svc.Create(context.Background(), userID, domain.CreateWishlistInput{PlaceName: "Delete Me"})

	if err := svc.Delete(context.Background(), w.ID, userID); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	// After deletion the item should not appear in list.
	items, _ := svc.List(context.Background(), userID, domain.WishlistFilter{Limit: 20})
	if len(items) != 0 {
		t.Errorf("expected 0 items after deletion, got %d", len(items))
	}
}

func TestWishlistDelete_OtherUserForbidden(t *testing.T) {
	repo := newFakeWishlistRepo()
	svc := NewWishlistService(repo)

	ownerID := uuid.New()
	otherID := uuid.New()
	w, _ := svc.Create(context.Background(), ownerID, domain.CreateWishlistInput{PlaceName: "Protected"})

	err := svc.Delete(context.Background(), w.ID, otherID)
	if !errors.Is(err, domain.ErrForbidden) {
		t.Errorf("expected ErrForbidden, got %v", err)
	}
}
