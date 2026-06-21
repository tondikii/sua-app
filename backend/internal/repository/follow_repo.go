package repository

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/sudutkode/atur-perjalanan/backend/internal/domain"
)

type followRepo struct {
	db *pgxpool.Pool
}

// NewFollowRepository returns a PostgreSQL-backed implementation of domain.FollowRepository.
func NewFollowRepository(db *pgxpool.Pool) domain.FollowRepository {
	return &followRepo{db: db}
}

// Create inserts a follow relationship. Duplicate follows are silently ignored.
func (r *followRepo) Create(ctx context.Context, followerID, followingID uuid.UUID) error {
	_, err := r.db.Exec(ctx,
		`INSERT INTO follows (follower_id, following_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
		followerID, followingID,
	)
	if err != nil {
		return fmt.Errorf("follow_repo: create: %w", err)
	}
	return nil
}

// Delete removes a follow relationship. Returns ErrNotFound if it does not exist.
func (r *followRepo) Delete(ctx context.Context, followerID, followingID uuid.UUID) error {
	tag, err := r.db.Exec(ctx,
		`DELETE FROM follows WHERE follower_id = $1 AND following_id = $2`,
		followerID, followingID,
	)
	if err != nil {
		return fmt.Errorf("follow_repo: delete: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return domain.ErrNotFound
	}
	return nil
}
