package service

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/sudutkode/atur-perjalanan/backend/internal/domain"
)

type wishlistService struct {
	repo domain.WishlistRepository
}

// NewWishlistService returns a domain.WishlistService backed by the provided repository.
func NewWishlistService(repo domain.WishlistRepository) domain.WishlistService {
	return &wishlistService{repo: repo}
}

func (s *wishlistService) Create(ctx context.Context, userID uuid.UUID, input domain.CreateWishlistInput) (*domain.Wishlist, error) {
	if input.PlaceName == "" {
		return nil, domain.ErrInvalidInput
	}
	if input.PriorityLevel == "" {
		input.PriorityLevel = domain.PriorityMedium
	}
	w := &domain.Wishlist{
		ID:            uuid.New(),
		UserID:        userID,
		PlaceName:     input.PlaceName,
		Link:          input.Link,
		Tags:          input.Tags,
		PriorityLevel: input.PriorityLevel,
	}
	if err := s.repo.Create(ctx, w); err != nil {
		return nil, fmt.Errorf("wishlist_service: create: %w", err)
	}
	return w, nil
}

func (s *wishlistService) List(ctx context.Context, userID uuid.UUID, filter domain.WishlistFilter) ([]*domain.Wishlist, error) {
	return s.repo.List(ctx, userID, filter)
}

func (s *wishlistService) Update(ctx context.Context, id, userID uuid.UUID, input domain.UpdateWishlistInput) (*domain.Wishlist, error) {
	w, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if w.UserID != userID {
		return nil, domain.ErrForbidden
	}
	if input.PlaceName != nil {
		w.PlaceName = *input.PlaceName
	}
	if input.Link != nil {
		w.Link = input.Link
	}
	if input.Tags != nil {
		w.Tags = input.Tags
	}
	if input.PriorityLevel != nil {
		w.PriorityLevel = *input.PriorityLevel
	}
	if err := s.repo.Update(ctx, w); err != nil {
		return nil, err
	}
	return w, nil
}

func (s *wishlistService) Delete(ctx context.Context, id, userID uuid.UUID) error {
	w, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return err
	}
	if w.UserID != userID {
		return domain.ErrForbidden
	}
	return s.repo.SoftDelete(ctx, id, userID)
}
