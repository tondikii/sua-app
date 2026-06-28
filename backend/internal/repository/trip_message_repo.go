package repository

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/sudutkode/atur-perjalanan/backend/internal/domain"
)

type tripMessageRepo struct {
	db *pgxpool.Pool
}

// NewTripMessageRepository returns a PostgreSQL-backed implementation of domain.TripMessageRepository.
func NewTripMessageRepository(db *pgxpool.Pool) domain.TripMessageRepository {
	return &tripMessageRepo{db: db}
}

func (r *tripMessageRepo) Create(ctx context.Context, msg *domain.TripMessage) error {
	const query = `
INSERT INTO trip_messages (id, trip_id, sender_id, message_text)
VALUES ($1, $2, $3, $4)`
	_, err := r.db.Exec(ctx, query, msg.ID, msg.TripID, msg.SenderID, msg.MessageText)
	if err != nil {
		return fmt.Errorf("trip_message_repo: Create: %w", err)
	}
	return nil
}

func (r *tripMessageRepo) FindByTrip(ctx context.Context, tripID uuid.UUID, cursor *time.Time, limit int) ([]*domain.TripMessage, error) {
	const base = `
SELECT id, trip_id, sender_id, message_text, deleted_at, created_at
FROM trip_messages
WHERE trip_id = $1 AND deleted_at IS NULL`
	query := base
	args := []any{tripID, limit}
	if cursor != nil {
		query += ` AND created_at < $2`
		args = []any{tripID, *cursor, limit}
	}
	query += ` ORDER BY created_at DESC LIMIT $` + fmt.Sprint(len(args))
	rows, err := r.db.Query(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("trip_message_repo: FindByTrip: %w", err)
	}
	defer rows.Close()

	var messages []*domain.TripMessage
	for rows.Next() {
		var msg domain.TripMessage
		if err := rows.Scan(&msg.ID, &msg.TripID, &msg.SenderID, &msg.MessageText, &msg.DeletedAt, &msg.CreatedAt); err != nil {
			return nil, fmt.Errorf("trip_message_repo: scan: %w", err)
		}
		messages = append(messages, &msg)
	}
	return messages, rows.Err()
}

// FindByTripEnriched returns non-deleted messages with embedded sender summaries.
func (r *tripMessageRepo) FindByTripEnriched(ctx context.Context, tripID uuid.UUID, cursor *time.Time, limit int) ([]*domain.TripMessageEnriched, error) {
	const base = `
SELECT m.id, m.trip_id, m.sender_id, m.message_text, m.deleted_at, m.created_at,
       u.id, u.name, u.username, u.avatar_url
FROM trip_messages m
JOIN users u ON u.id = m.sender_id
WHERE m.trip_id = $1 AND m.deleted_at IS NULL`
	query := base
	args := []any{tripID, limit}
	if cursor != nil {
		query += ` AND m.created_at < $2`
		args = []any{tripID, *cursor, limit}
	}
	query += ` ORDER BY m.created_at DESC LIMIT $` + fmt.Sprint(len(args))

	rows, err := r.db.Query(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("trip_message_repo: FindByTripEnriched: %w", err)
	}
	defer rows.Close()

	var messages []*domain.TripMessageEnriched
	for rows.Next() {
		var e domain.TripMessageEnriched
		if err := rows.Scan(
			&e.ID, &e.TripID, &e.SenderID, &e.MessageText, &e.DeletedAt, &e.CreatedAt,
			&e.Sender.ID, &e.Sender.Name, &e.Sender.Username, &e.Sender.AvatarURL,
		); err != nil {
			return nil, fmt.Errorf("trip_message_repo: FindByTripEnriched scan: %w", err)
		}
		messages = append(messages, &e)
	}
	return messages, rows.Err()
}

// SoftDelete marks a message as deleted. Returns ErrNotFound if the message
// does not exist (or already deleted), ErrForbidden if senderID doesn't match.
func (r *tripMessageRepo) SoftDelete(ctx context.Context, messageID, senderID uuid.UUID) error {
	// First verify existence and ownership.
	var actualSender uuid.UUID
	err := r.db.QueryRow(ctx,
		`SELECT sender_id FROM trip_messages WHERE id = $1 AND deleted_at IS NULL`,
		messageID,
	).Scan(&actualSender)
	if err != nil {
		if isNoRows(err) {
			return domain.ErrNotFound
		}
		return fmt.Errorf("trip_message_repo: SoftDelete lookup: %w", err)
	}
	if actualSender != senderID {
		return domain.ErrForbidden
	}
	_, err = r.db.Exec(ctx,
		`UPDATE trip_messages SET deleted_at = NOW() WHERE id = $1`,
		messageID,
	)
	if err != nil {
		return fmt.Errorf("trip_message_repo: SoftDelete update: %w", err)
	}
	return nil
}
