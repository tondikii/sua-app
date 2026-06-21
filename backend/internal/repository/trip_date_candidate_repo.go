package repository

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jackc/pgx/v5/pgconn"

	"github.com/sudutkode/atur-perjalanan/backend/internal/domain"
)

type tripDateCandidateRepo struct {
	db *pgxpool.Pool
}

// NewTripDateCandidateRepository returns a PostgreSQL-backed implementation of domain.TripDateCandidateRepository.
func NewTripDateCandidateRepository(db *pgxpool.Pool) domain.TripDateCandidateRepository {
	return &tripDateCandidateRepo{db: db}
}

func (r *tripDateCandidateRepo) BulkCreate(ctx context.Context, candidates []*domain.TripDateCandidate) error {
	const query = `INSERT INTO trip_date_candidates (id, trip_id, start_date, end_date) VALUES ($1, $2, $3, $4)`
	batch := &pgx.Batch{}
	for _, candidate := range candidates {
		batch.Queue(query, candidate.ID, candidate.TripID, candidate.StartDate, candidate.EndDate)
	}
	br := r.db.SendBatch(ctx, batch)
	defer br.Close()
	for range candidates {
		if _, err := br.Exec(); err != nil {
			return fmt.Errorf("trip_date_candidate_repo: BulkCreate: %w", err)
		}
	}
	return nil
}

func (r *tripDateCandidateRepo) FindByTrip(ctx context.Context, tripID uuid.UUID) ([]*domain.TripDateCandidate, error) {
	const query = `
SELECT c.id, c.trip_id, c.start_date, c.end_date, c.created_at,
       COALESCE(count(v.user_id), 0) AS vote_count
FROM trip_date_candidates c
LEFT JOIN trip_date_votes v ON v.candidate_id = c.id
WHERE c.trip_id = $1
GROUP BY c.id
ORDER BY c.created_at ASC`
	rows, err := r.db.Query(ctx, query, tripID)
	if err != nil {
		return nil, fmt.Errorf("trip_date_candidate_repo: FindByTrip: %w", err)
	}
	defer rows.Close()

	var candidates []*domain.TripDateCandidate
	for rows.Next() {
		var cand domain.TripDateCandidate
		if err := rows.Scan(&cand.ID, &cand.TripID, &cand.StartDate, &cand.EndDate, &cand.CreatedAt, &cand.VoteCount); err != nil {
			return nil, fmt.Errorf("trip_date_candidate_repo: scan: %w", err)
		}
		candidates = append(candidates, &cand)
	}
	return candidates, rows.Err()
}

func (r *tripDateCandidateRepo) FindByID(ctx context.Context, id uuid.UUID) (*domain.TripDateCandidate, error) {
	const query = `SELECT id, trip_id, start_date, end_date, created_at FROM trip_date_candidates WHERE id = $1`
	var cand domain.TripDateCandidate
	row := r.db.QueryRow(ctx, query, id)
	err := row.Scan(&cand.ID, &cand.TripID, &cand.StartDate, &cand.EndDate, &cand.CreatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrNotFound
		}
		return nil, fmt.Errorf("trip_date_candidate_repo: FindByID: %w", err)
	}
	return &cand, nil
}

func (r *tripDateCandidateRepo) AddVote(ctx context.Context, candidateID, userID uuid.UUID) error {
	const query = `INSERT INTO trip_date_votes (candidate_id, user_id) VALUES ($1, $2)`
	tag, err := r.db.Exec(ctx, query, candidateID, userID)
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) {
			switch pgErr.Code {
			case "23505":
				return domain.ErrAlreadyVoted
			case "23503":
				return domain.ErrNotFound
			}
		}
		return fmt.Errorf("trip_date_candidate_repo: AddVote: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return domain.ErrAlreadyVoted
	}
	return nil
}

func (r *tripDateCandidateRepo) RemoveVote(ctx context.Context, candidateID, userID uuid.UUID) error {
	const query = `DELETE FROM trip_date_votes WHERE candidate_id = $1 AND user_id = $2`
	tag, err := r.db.Exec(ctx, query, candidateID, userID)
	if err != nil {
		return fmt.Errorf("trip_date_candidate_repo: RemoveVote: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return domain.ErrVoteNotFound
	}
	return nil
}
