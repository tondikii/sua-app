package repository

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/sudutkode/atur-perjalanan/backend/internal/domain"
)

type tripDestinationRepo struct {
	db *pgxpool.Pool
}

// NewTripDestinationRepository returns a PostgreSQL-backed implementation of domain.TripDestinationRepository.
func NewTripDestinationRepository(db *pgxpool.Pool) domain.TripDestinationRepository {
	return &tripDestinationRepo{db: db}
}

func (r *tripDestinationRepo) Create(ctx context.Context, dest *domain.TripDestination) error {
	const query = `
INSERT INTO trip_destinations (id, trip_id, place_name, maps_link, reference_link, sort_order)
VALUES ($1, $2, $3, $4, $5, $6)`
	_, err := r.db.Exec(ctx, query,
		dest.ID, dest.TripID, dest.PlaceName, dest.MapsLink, dest.ReferenceLink, dest.SortOrder,
	)
	if err != nil {
		return fmt.Errorf("trip_destination_repo: Create: %w", err)
	}
	return nil
}

func (r *tripDestinationRepo) FindByTrip(ctx context.Context, tripID uuid.UUID) ([]*domain.TripDestination, error) {
	const query = `
SELECT id, trip_id, place_name, maps_link, reference_link, sort_order, created_at
FROM trip_destinations
WHERE trip_id = $1
ORDER BY sort_order ASC, created_at ASC`
	rows, err := r.db.Query(ctx, query, tripID)
	if err != nil {
		return nil, fmt.Errorf("trip_destination_repo: FindByTrip: %w", err)
	}
	defer rows.Close()

	var destinations []*domain.TripDestination
	for rows.Next() {
		var dest domain.TripDestination
		if err := rows.Scan(&dest.ID, &dest.TripID, &dest.PlaceName, &dest.MapsLink, &dest.ReferenceLink, &dest.SortOrder, &dest.CreatedAt); err != nil {
			return nil, fmt.Errorf("trip_destination_repo: scan: %w", err)
		}
		destinations = append(destinations, &dest)
	}
	return destinations, rows.Err()
}

func (r *tripDestinationRepo) Delete(ctx context.Context, id, tripID uuid.UUID) error {
	const query = `DELETE FROM trip_destinations WHERE id = $1 AND trip_id = $2`
	tag, err := r.db.Exec(ctx, query, id, tripID)
	if err != nil {
		return fmt.Errorf("trip_destination_repo: Delete: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return domain.ErrNotFound
	}
	return nil
}
