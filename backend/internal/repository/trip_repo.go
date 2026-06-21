package repository

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/sudutkode/atur-perjalanan/backend/internal/domain"
)

type tripRepo struct {
	db *pgxpool.Pool
}

// NewTripRepository returns a PostgreSQL-backed implementation of domain.TripRepository.
func NewTripRepository(db *pgxpool.Pool) domain.TripRepository {
	return &tripRepo{db: db}
}

func (r *tripRepo) Create(ctx context.Context, trip *domain.Trip) error {
	const query = `
INSERT INTO trips (id, creator_id, name, tags, status, start_date, end_date, is_public)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`
	tagsJSON, err := json.Marshal(trip.Tags)
	if err != nil {
		return fmt.Errorf("trip_repo: marshal tags: %w", err)
	}
	_, err = r.db.Exec(ctx, query,
		trip.ID, trip.CreatorID, trip.Name, tagsJSON, trip.Status,
		trip.StartDate, trip.EndDate, trip.IsPublic,
	)
	return mapPgError(err)
}

func (r *tripRepo) FindByID(ctx context.Context, id uuid.UUID) (*domain.Trip, error) {
	const query = `
SELECT id, creator_id, name, tags, status, start_date, end_date, is_public, deleted_at, created_at, updated_at
FROM trips WHERE id = $1 AND deleted_at IS NULL`
	row := r.db.QueryRow(ctx, query, id)
	return scanTrip(row)
}

func (r *tripRepo) FindByParticipant(ctx context.Context, userID uuid.UUID, cursor *uuid.UUID, limit int) ([]*domain.Trip, error) {
	const base = `
SELECT t.id, t.creator_id, t.name, t.tags, t.status, t.start_date, t.end_date, t.is_public, t.deleted_at, t.created_at, t.updated_at
FROM trips t
JOIN trip_participants p ON p.trip_id = t.id
WHERE p.user_id = $1 AND t.deleted_at IS NULL`
	query := base
	args := []any{userID, limit}
	if cursor != nil {
		query += ` AND t.id > $2`
		args = []any{userID, *cursor, limit}
	}
	query += ` ORDER BY t.id ASC LIMIT $` + fmt.Sprint(len(args))
	rows, err := r.db.Query(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("trip_repo: FindByParticipant: %w", err)
	}
	defer rows.Close()
	return scanTrips(rows)
}

func (r *tripRepo) Update(ctx context.Context, trip *domain.Trip) error {
	const query = `
UPDATE trips
SET name = $1, tags = $2, start_date = $3, end_date = $4, updated_at = NOW()
WHERE id = $5 AND deleted_at IS NULL`
	tagsJSON, err := json.Marshal(trip.Tags)
	if err != nil {
		return fmt.Errorf("trip_repo: marshal tags: %w", err)
	}
	 tag, err := r.db.Exec(ctx, query, trip.Name, tagsJSON, trip.StartDate, trip.EndDate, trip.ID)
	if err != nil {
		return mapPgError(err)
	}
	if tag.RowsAffected() == 0 {
		return domain.ErrNotFound
	}
	return nil
}

func (r *tripRepo) SoftDelete(ctx context.Context, id uuid.UUID) error {
	const query = `UPDATE trips SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL`
	tag, err := r.db.Exec(ctx, query, id)
	if err != nil {
		return fmt.Errorf("trip_repo: SoftDelete: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return domain.ErrNotFound
	}
	return nil
}

func (r *tripRepo) IsParticipant(ctx context.Context, tripID, userID uuid.UUID) (bool, error) {
	const query = `
SELECT EXISTS(
	SELECT 1 FROM trip_participants
	WHERE trip_id = $1 AND user_id = $2
)`
	var exists bool
	if err := r.db.QueryRow(ctx, query, tripID, userID).Scan(&exists); err != nil {
		return false, fmt.Errorf("trip_repo: IsParticipant: %w", err)
	}
	return exists, nil
}

func (r *tripRepo) IsCreator(ctx context.Context, tripID, userID uuid.UUID) (bool, error) {
	const query = `SELECT EXISTS(SELECT 1 FROM trips WHERE id = $1 AND creator_id = $2 AND deleted_at IS NULL)`
	var exists bool
	if err := r.db.QueryRow(ctx, query, tripID, userID).Scan(&exists); err != nil {
		return false, fmt.Errorf("trip_repo: IsCreator: %w", err)
	}
	return exists, nil
}

func (r *tripRepo) ListByParticipant(ctx context.Context, userID uuid.UUID, cursor *uuid.UUID, limit int) ([]*domain.Trip, error) {
	return r.FindByParticipant(ctx, userID, cursor, limit)
}

func scanTrip(row rowScanner) (*domain.Trip, error) {
	var t domain.Trip
	var tagsJSON []byte
	err := row.Scan(
		&t.ID, &t.CreatorID, &t.Name, &tagsJSON, &t.Status,
		&t.StartDate, &t.EndDate, &t.IsPublic, &t.DeletedAt, &t.CreatedAt, &t.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrNotFound
		}
		return nil, fmt.Errorf("trip_repo: scanTrip: %w", err)
	}
	if err := json.Unmarshal(tagsJSON, &t.Tags); err != nil {
		return nil, fmt.Errorf("trip_repo: unmarshal tags: %w", err)
	}
	return &t, nil
}

func scanTrips(rows pgx.Rows) ([]*domain.Trip, error) {
	var trips []*domain.Trip
	for rows.Next() {
		t, err := scanTrip(rows)
		if err != nil {
			return nil, err
		}
		trips = append(trips, t)
	}
	return trips, rows.Err()
}
