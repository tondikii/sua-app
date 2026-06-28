package repository

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/sudutkode/atur-perjalanan/backend/internal/domain"
)

type tripDateCandidateRepo struct {
	db *pgxpool.Pool
}

// NewTripDateCandidateRepository returns a PostgreSQL-backed implementation of domain.TripDateCandidateRepository.
func NewTripDateCandidateRepository(db *pgxpool.Pool) domain.TripDateCandidateRepository {
	return &tripDateCandidateRepo{db: db}
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

// FindByTripEnriched returns candidates with per-viewer vote status and voters preview (max 3).
func (r *tripDateCandidateRepo) FindByTripEnriched(ctx context.Context, tripID, viewerID uuid.UUID) ([]*domain.TripCandidateEnriched, error) {
	// Step 1: fetch base candidates with vote counts.
	candidates, err := r.FindByTrip(ctx, tripID)
	if err != nil {
		return nil, err
	}
	if len(candidates) == 0 {
		return []*domain.TripCandidateEnriched{}, nil
	}

	// Step 2: fetch viewer's votes for this trip.
	viewerVotes := make(map[uuid.UUID]bool)
	rows, err := r.db.Query(ctx,
		`SELECT candidate_id FROM trip_date_votes v
         JOIN trip_date_candidates c ON c.id = v.candidate_id
         WHERE c.trip_id = $1 AND v.user_id = $2`,
		tripID, viewerID,
	)
	if err != nil {
		return nil, fmt.Errorf("trip_date_candidate_repo: FindByTripEnriched viewer votes: %w", err)
	}
	defer rows.Close()
	for rows.Next() {
		var cid uuid.UUID
		if err := rows.Scan(&cid); err != nil {
			return nil, fmt.Errorf("trip_date_candidate_repo: scan viewer vote: %w", err)
		}
		viewerVotes[cid] = true
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	// Step 3: fetch voters preview (max 3) per candidate.
	candidateIDs := make([]uuid.UUID, len(candidates))
	for i, c := range candidates {
		candidateIDs[i] = c.ID
	}
	voterRows, err := r.db.Query(ctx,
		`WITH ranked AS (
            SELECT v.candidate_id, u.id, u.name, u.username, u.avatar_url,
                   ROW_NUMBER() OVER (PARTITION BY v.candidate_id ORDER BY v.created_at ASC) AS rn
            FROM trip_date_votes v
            JOIN users u ON u.id = v.user_id
            WHERE v.candidate_id = ANY($1)
        )
        SELECT candidate_id, id, name, username, avatar_url FROM ranked WHERE rn <= 3`,
		candidateIDs,
	)
	if err != nil {
		return nil, fmt.Errorf("trip_date_candidate_repo: FindByTripEnriched voters: %w", err)
	}
	defer voterRows.Close()

	votersMap := make(map[uuid.UUID][]*domain.UserSummary)
	for voterRows.Next() {
		var cid uuid.UUID
		var s domain.UserSummary
		if err := voterRows.Scan(&cid, &s.ID, &s.Name, &s.Username, &s.AvatarURL); err != nil {
			return nil, fmt.Errorf("trip_date_candidate_repo: scan voter: %w", err)
		}
		votersMap[cid] = append(votersMap[cid], &s)
	}
	if err := voterRows.Err(); err != nil {
		return nil, err
	}

	enriched := make([]*domain.TripCandidateEnriched, len(candidates))
	for i, c := range candidates {
		voters := votersMap[c.ID]
		if voters == nil {
			voters = []*domain.UserSummary{}
		}
		enriched[i] = &domain.TripCandidateEnriched{
			TripDateCandidate: *c,
			UserHasVoted:      viewerVotes[c.ID],
			VotersPreview:     voters,
		}
	}
	return enriched, nil
}
