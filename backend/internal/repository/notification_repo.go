package repository

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/sudutkode/atur-perjalanan/backend/internal/domain"
)

type notificationRepo struct {
	db *pgxpool.Pool
}

// NewNotificationRepository returns a PostgreSQL-backed implementation of domain.NotificationRepository.
func NewNotificationRepository(db *pgxpool.Pool) domain.NotificationRepository {
	return &notificationRepo{db: db}
}

func (r *notificationRepo) Create(ctx context.Context, n *domain.Notification) error {
	payload, err := json.Marshal(n.Payload)
	if err != nil {
		return fmt.Errorf("notification_repo: marshal payload: %w", err)
	}
	_, err = r.db.Exec(ctx,
		`INSERT INTO notifications (id, user_id, type, actor_id, trip_id, payload, is_read)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
		n.ID, n.UserID, n.Type, n.ActorID, n.TripID, payload, n.IsRead,
	)
	if err != nil {
		return fmt.Errorf("notification_repo: create: %w", err)
	}
	return nil
}

func (r *notificationRepo) ListByUser(ctx context.Context, userID uuid.UUID, cursor *time.Time, limit int) ([]*domain.Notification, error) {
	const base = `
SELECT id, user_id, type, actor_id, trip_id, payload, is_read, created_at
FROM notifications
WHERE user_id = $1`
	query := base
	args := []any{userID, limit}
	if cursor != nil {
		query += ` AND created_at < $2`
		args = []any{userID, *cursor, limit}
	}
	query += ` ORDER BY created_at DESC LIMIT $` + fmt.Sprint(len(args))

	rows, err := r.db.Query(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("notification_repo: ListByUser: %w", err)
	}
	defer rows.Close()

	var result []*domain.Notification
	for rows.Next() {
		n, err := scanNotification(rows)
		if err != nil {
			return nil, err
		}
		result = append(result, n)
	}
	return result, rows.Err()
}

func (r *notificationRepo) CountUnread(ctx context.Context, userID uuid.UUID) (int, error) {
	var n int
	err := r.db.QueryRow(ctx,
		`SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = FALSE`,
		userID,
	).Scan(&n)
	if err != nil {
		return 0, fmt.Errorf("notification_repo: CountUnread: %w", err)
	}
	return n, nil
}

func (r *notificationRepo) MarkRead(ctx context.Context, notificationID, userID uuid.UUID) error {
	tag, err := r.db.Exec(ctx,
		`UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2`,
		notificationID, userID,
	)
	if err != nil {
		return fmt.Errorf("notification_repo: MarkRead: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return domain.ErrNotFound
	}
	return nil
}

func (r *notificationRepo) MarkAllRead(ctx context.Context, userID uuid.UUID) error {
	_, err := r.db.Exec(ctx,
		`UPDATE notifications SET is_read = TRUE WHERE user_id = $1 AND is_read = FALSE`,
		userID,
	)
	if err != nil {
		return fmt.Errorf("notification_repo: MarkAllRead: %w", err)
	}
	return nil
}

// FindUnvotedParticipants returns (tripID, participantID) for voting_pending trips whose
// voting_deadline falls within [deadlineStart, deadlineEnd] AND participant has not yet voted.
func (r *notificationRepo) FindUnvotedParticipants(ctx context.Context, deadlineStart, deadlineEnd time.Time) ([]domain.VotingReminderRow, error) {
	const query = `
SELECT DISTINCT t.id AS trip_id, tp.user_id AS participant_id
FROM trips t
JOIN trip_participants tp ON tp.trip_id = t.id
WHERE t.status = 'voting_pending'
  AND t.voting_deadline >= $1
  AND t.voting_deadline <= $2
  AND t.deleted_at IS NULL
  AND NOT EXISTS (
      SELECT 1
      FROM trip_date_votes v
      JOIN trip_date_candidates c ON c.id = v.candidate_id
      WHERE c.trip_id = t.id AND v.user_id = tp.user_id
  )`
	rows, err := r.db.Query(ctx, query, deadlineStart, deadlineEnd)
	if err != nil {
		return nil, fmt.Errorf("notification_repo: FindUnvotedParticipants: %w", err)
	}
	defer rows.Close()

	var result []domain.VotingReminderRow
	for rows.Next() {
		var row domain.VotingReminderRow
		if err := rows.Scan(&row.TripID, &row.ParticipantID); err != nil {
			return nil, fmt.Errorf("notification_repo: scan unvoted: %w", err)
		}
		result = append(result, row)
	}
	return result, rows.Err()
}

func scanNotification(row rowScanner) (*domain.Notification, error) {
	var n domain.Notification
	var payloadJSON []byte
	err := row.Scan(&n.ID, &n.UserID, &n.Type, &n.ActorID, &n.TripID, &payloadJSON, &n.IsRead, &n.CreatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrNotFound
		}
		return nil, fmt.Errorf("notification_repo: scan: %w", err)
	}
	if err := json.Unmarshal(payloadJSON, &n.Payload); err != nil {
		return nil, fmt.Errorf("notification_repo: unmarshal payload: %w", err)
	}
	return &n, nil
}
