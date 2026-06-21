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
SELECT id, trip_id, sender_id, message_text, created_at
FROM trip_messages
WHERE trip_id = $1`
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
		if err := rows.Scan(&msg.ID, &msg.TripID, &msg.SenderID, &msg.MessageText, &msg.CreatedAt); err != nil {
			return nil, fmt.Errorf("trip_message_repo: scan: %w", err)
		}
		messages = append(messages, &msg)
	}
	return messages, rows.Err()
}
