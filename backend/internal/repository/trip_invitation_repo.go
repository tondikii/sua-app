package repository

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/sudutkode/atur-perjalanan/backend/internal/domain"
)

type tripInvitationRepo struct {
	db *pgxpool.Pool
}

// NewTripInvitationRepository returns a PostgreSQL-backed implementation of domain.TripInvitationRepository.
func NewTripInvitationRepository(db *pgxpool.Pool) domain.TripInvitationRepository {
	return &tripInvitationRepo{db: db}
}

func (r *tripInvitationRepo) Create(ctx context.Context, inv *domain.TripInvitation) error {
	const query = `
INSERT INTO trip_invitations (id, trip_id, invited_by, invited_user_id, invited_email, method, status)
VALUES ($1, $2, $3, $4, $5, $6, $7)`
	_, err := r.db.Exec(ctx, query,
		inv.ID, inv.TripID, inv.InvitedBy, inv.InvitedUserID, inv.InvitedEmail,
		inv.Method, inv.Status,
	)
	return mapPgError(err)
}

func (r *tripInvitationRepo) FindByID(ctx context.Context, id uuid.UUID) (*domain.TripInvitation, error) {
	const query = `
SELECT id, trip_id, invited_by, invited_user_id, invited_email, method, status, created_at, updated_at
FROM trip_invitations WHERE id = $1`
	row := r.db.QueryRow(ctx, query, id)
	return scanInvitation(row)
}

func (r *tripInvitationRepo) FindPendingByUser(ctx context.Context, userID uuid.UUID) ([]*domain.TripInvitation, error) {
	const query = `
SELECT id, trip_id, invited_by, invited_user_id, invited_email, method, status, created_at, updated_at
FROM trip_invitations
WHERE invited_user_id = $1 AND status = 'pending'
ORDER BY created_at DESC`
	rows, err := r.db.Query(ctx, query, userID)
	if err != nil {
		return nil, fmt.Errorf("trip_invitation_repo: FindPendingByUser: %w", err)
	}
	defer rows.Close()

	var invitations []*domain.TripInvitation
	for rows.Next() {
		inv, err := scanInvitation(rows)
		if err != nil {
			return nil, err
		}
		invitations = append(invitations, inv)
	}
	return invitations, rows.Err()
}

// FindPendingByUserEnriched returns pending invitations with embedded trip and inviter data.
func (r *tripInvitationRepo) FindPendingByUserEnriched(ctx context.Context, userID uuid.UUID) ([]*domain.InvitationEnriched, error) {
	const query = `
SELECT i.id, i.trip_id, i.invited_by, i.invited_user_id, i.invited_email, i.method, i.status, i.created_at, i.updated_at,
       t.name, t.cover_image_url,
       u.id, u.name, u.username, u.avatar_url
FROM trip_invitations i
JOIN trips t ON t.id = i.trip_id
JOIN users u ON u.id = i.invited_by
WHERE i.invited_user_id = $1 AND i.status = 'pending'
ORDER BY i.created_at DESC`

	rows, err := r.db.Query(ctx, query, userID)
	if err != nil {
		return nil, fmt.Errorf("trip_invitation_repo: FindPendingByUserEnriched: %w", err)
	}
	defer rows.Close()

	var result []*domain.InvitationEnriched
	for rows.Next() {
		var e domain.InvitationEnriched
		var tripCoverURL *string
		if err := rows.Scan(
			&e.ID, &e.TripID, &e.InvitedBy, &e.InvitedUserID, &e.InvitedEmail,
			&e.Method, &e.Status, &e.CreatedAt, &e.UpdatedAt,
			&e.Trip.Name, &tripCoverURL,
			&e.Inviter.ID, &e.Inviter.Name, &e.Inviter.Username, &e.Inviter.AvatarURL,
		); err != nil {
			return nil, fmt.Errorf("trip_invitation_repo: FindPendingByUserEnriched scan: %w", err)
		}
		e.Trip.ID = e.TripID
		if tripCoverURL != nil {
			e.Trip.CoverImageURL = *tripCoverURL
		} else {
			e.Trip.CoverImageURL = domain.DefaultCoverImageURL
		}
		result = append(result, &e)
	}
	return result, rows.Err()
}

func (r *tripInvitationRepo) UpdateStatus(ctx context.Context, id uuid.UUID, status domain.InvitationStatus) error {
	const query = `
UPDATE trip_invitations
SET status = $2, updated_at = NOW()
WHERE id = $1`
	tag, err := r.db.Exec(ctx, query, id, status)
	if err != nil {
		return fmt.Errorf("trip_invitation_repo: UpdateStatus: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return domain.ErrNotFound
	}
	return nil
}

func scanInvitation(row rowScanner) (*domain.TripInvitation, error) {
	var inv domain.TripInvitation
	err := row.Scan(
		&inv.ID, &inv.TripID, &inv.InvitedBy, &inv.InvitedUserID,
		&inv.InvitedEmail, &inv.Method, &inv.Status, &inv.CreatedAt, &inv.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrNotFound
		}
		return nil, fmt.Errorf("trip_invitation_repo: scanInvitation: %w", err)
	}
	return &inv, nil
}
