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
INSERT INTO trips (id, creator_id, name, tags, status, start_date, end_date, is_public, cover_image_url, voting_deadline)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`
	tagsJSON, err := json.Marshal(trip.Tags)
	if err != nil {
		return fmt.Errorf("trip_repo: marshal tags: %w", err)
	}
	_, err = r.db.Exec(ctx, query,
		trip.ID, trip.CreatorID, trip.Name, tagsJSON, trip.Status,
		trip.StartDate, trip.EndDate, trip.IsPublic, trip.CoverImageURL, trip.VotingDeadline,
	)
	return mapPgError(err)
}

func (r *tripRepo) FindByID(ctx context.Context, id uuid.UUID) (*domain.Trip, error) {
	const query = `
SELECT id, creator_id, name, tags, status, start_date, end_date, is_public,
       cover_image_url, voting_deadline, deleted_at, created_at, updated_at
FROM trips WHERE id = $1 AND deleted_at IS NULL`
	row := r.db.QueryRow(ctx, query, id)
	return scanTrip(row)
}

// ListByParticipant returns trips the user belongs to, keyset-paginated by trip ID.
func (r *tripRepo) ListByParticipant(ctx context.Context, userID uuid.UUID, cursor *uuid.UUID, limit int) ([]*domain.Trip, error) {
	const base = `
SELECT t.id, t.creator_id, t.name, t.tags, t.status, t.start_date, t.end_date, t.is_public,
       t.cover_image_url, t.voting_deadline, t.deleted_at, t.created_at, t.updated_at
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
		return nil, fmt.Errorf("trip_repo: ListByParticipant: %w", err)
	}
	defer rows.Close()
	return scanTrips(rows)
}

// ListByParticipantFiltered is like ListByParticipant but applies an optional tab filter.
// tab values: "upcoming" | "completed" | "" (all).
func (r *tripRepo) ListByParticipantFiltered(ctx context.Context, userID uuid.UUID, tab string, cursor *uuid.UUID, limit int) ([]*domain.Trip, error) {
	base := `
SELECT t.id, t.creator_id, t.name, t.tags, t.status, t.start_date, t.end_date, t.is_public,
       t.cover_image_url, t.voting_deadline, t.deleted_at, t.created_at, t.updated_at
FROM trips t
JOIN trip_participants p ON p.trip_id = t.id
WHERE p.user_id = $1 AND t.deleted_at IS NULL`

	switch tab {
	case "upcoming":
		base += ` AND (t.status = 'voting_pending' OR (t.status = 'fixed' AND t.end_date >= CURRENT_DATE))`
	case "completed":
		base += ` AND t.status = 'fixed' AND t.end_date < CURRENT_DATE`
	}

	args := []any{userID, limit}
	if cursor != nil {
		base += ` AND t.id > $2`
		args = []any{userID, *cursor, limit}
	}
	base += ` ORDER BY t.id ASC LIMIT $` + fmt.Sprint(len(args))

	rows, err := r.db.Query(ctx, base, args...)
	if err != nil {
		return nil, fmt.Errorf("trip_repo: ListByParticipantFiltered: %w", err)
	}
	defer rows.Close()
	return scanTrips(rows)
}

// ListByCreator returns trips created by ownerID, optionally restricting to public ones.
func (r *tripRepo) ListByCreator(ctx context.Context, ownerID uuid.UUID, publicOnly bool) ([]*domain.Trip, error) {
	query := `
SELECT id, creator_id, name, tags, status, start_date, end_date, is_public,
       cover_image_url, voting_deadline, deleted_at, created_at, updated_at
FROM trips
WHERE creator_id = $1 AND deleted_at IS NULL`
	if publicOnly {
		query += ` AND is_public = TRUE`
	}
	query += ` ORDER BY created_at DESC`

	rows, err := r.db.Query(ctx, query, ownerID)
	if err != nil {
		return nil, fmt.Errorf("trip_repo: ListByCreator: %w", err)
	}
	defer rows.Close()
	return scanTrips(rows)
}

func (r *tripRepo) Update(ctx context.Context, trip *domain.Trip) error {
	const query = `
UPDATE trips
SET name = $1, tags = $2, status = $3, start_date = $4, end_date = $5,
    cover_image_url = $6, voting_deadline = $7, updated_at = NOW()
WHERE id = $8 AND deleted_at IS NULL`
	tagsJSON, err := json.Marshal(trip.Tags)
	if err != nil {
		return fmt.Errorf("trip_repo: marshal tags: %w", err)
	}
	tag, err := r.db.Exec(ctx, query,
		trip.Name, tagsJSON, trip.Status, trip.StartDate, trip.EndDate,
		trip.CoverImageURL, trip.VotingDeadline, trip.ID,
	)
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

// GetParticipantsInfo fetches participant counts and up-to-previewLimit user summaries
// for each of the given trip IDs in a single query.
func (r *tripRepo) GetParticipantsInfo(ctx context.Context, tripIDs []uuid.UUID, previewLimit int) (map[uuid.UUID]*domain.ParticipantsInfo, error) {
	if len(tripIDs) == 0 {
		return map[uuid.UUID]*domain.ParticipantsInfo{}, nil
	}

	// Build a CTE that ranks participants per trip so we can grab the first N.
	const query = `
WITH ranked AS (
    SELECT
        tp.trip_id,
        u.id        AS user_id,
        u.name,
        u.username,
        u.avatar_url,
        ROW_NUMBER() OVER (PARTITION BY tp.trip_id ORDER BY tp.joined_at ASC) AS rn,
        COUNT(*) OVER (PARTITION BY tp.trip_id)                              AS total
    FROM trip_participants tp
    JOIN users u ON u.id = tp.user_id
    WHERE tp.trip_id = ANY($1)
)
SELECT trip_id, user_id, name, username, avatar_url, rn, total
FROM ranked
WHERE rn <= $2
ORDER BY trip_id, rn`

	rows, err := r.db.Query(ctx, query, tripIDs, previewLimit)
	if err != nil {
		return nil, fmt.Errorf("trip_repo: GetParticipantsInfo: %w", err)
	}
	defer rows.Close()

	result := make(map[uuid.UUID]*domain.ParticipantsInfo)
	for rows.Next() {
		var tripID, userID uuid.UUID
		var name, username string
		var avatarURL *string
		var rn, total int
		if err := rows.Scan(&tripID, &userID, &name, &username, &avatarURL, &rn, &total); err != nil {
			return nil, fmt.Errorf("trip_repo: GetParticipantsInfo scan: %w", err)
		}
		info, ok := result[tripID]
		if !ok {
			info = &domain.ParticipantsInfo{Count: total}
			result[tripID] = info
		}
		info.Preview = append(info.Preview, &domain.UserSummary{
			ID:        userID,
			Name:      name,
			Username:  username,
			AvatarURL: avatarURL,
		})
	}
	return result, rows.Err()
}

// ListParticipantIDs returns all participant user IDs for a trip.
func (r *tripRepo) ListParticipantIDs(ctx context.Context, tripID uuid.UUID) ([]uuid.UUID, error) {
	rows, err := r.db.Query(ctx,
		`SELECT user_id FROM trip_participants WHERE trip_id = $1`, tripID,
	)
	if err != nil {
		return nil, fmt.Errorf("trip_repo: ListParticipantIDs: %w", err)
	}
	defer rows.Close()
	var ids []uuid.UUID
	for rows.Next() {
		var id uuid.UUID
		if err := rows.Scan(&id); err != nil {
			return nil, fmt.Errorf("trip_repo: ListParticipantIDs scan: %w", err)
		}
		ids = append(ids, id)
	}
	return ids, rows.Err()
}

func scanTrip(row rowScanner) (*domain.Trip, error) {	var t domain.Trip
	var tagsJSON []byte
	err := row.Scan(
		&t.ID, &t.CreatorID, &t.Name, &tagsJSON, &t.Status,
		&t.StartDate, &t.EndDate, &t.IsPublic,
		&t.CoverImageURL, &t.VotingDeadline,
		&t.DeletedAt, &t.CreatedAt, &t.UpdatedAt,
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
