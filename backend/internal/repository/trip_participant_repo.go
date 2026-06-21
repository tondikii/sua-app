package repository

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/sudutkode/atur-perjalanan/backend/internal/domain"
)

type tripParticipantRepo struct {
	db *pgxpool.Pool
}

// NewTripParticipantRepository returns a PostgreSQL-backed implementation of domain.TripParticipantRepository.
func NewTripParticipantRepository(db *pgxpool.Pool) domain.TripParticipantRepository {
	return &tripParticipantRepo{db: db}
}

func (r *tripParticipantRepo) Add(ctx context.Context, tripID, userID uuid.UUID) error {
	_, err := r.db.Exec(ctx,
		`INSERT INTO trip_participants (trip_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
		tripID, userID,
	)
	if err != nil {
		return fmt.Errorf("trip_participant_repo: add: %w", err)
	}
	return nil
}

func (r *tripParticipantRepo) Remove(ctx context.Context, tripID, userID uuid.UUID) error {
	tag, err := r.db.Exec(ctx,
		`DELETE FROM trip_participants WHERE trip_id = $1 AND user_id = $2`,
		tripID, userID,
	)
	if err != nil {
		return fmt.Errorf("trip_participant_repo: remove: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return domain.ErrNotFound
	}
	return nil
}
