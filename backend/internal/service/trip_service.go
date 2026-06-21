package service

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/sudutkode/atur-perjalanan/backend/internal/domain"
)

type tripService struct {
	trips        domain.TripRepository
	participants domain.TripParticipantRepository
	invitations  domain.TripInvitationRepository
	candidates   domain.TripDateCandidateRepository
	destinations domain.TripDestinationRepository
	messages     domain.TripMessageRepository
	users        domain.UserRepository
	db           *pgxpool.Pool
}

// NewTripService returns a domain.TripService backed by PostgreSQL repositories.
func NewTripService(
	trips domain.TripRepository,
	participants domain.TripParticipantRepository,
	invitations domain.TripInvitationRepository,
	candidates domain.TripDateCandidateRepository,
	destinations domain.TripDestinationRepository,
	messages domain.TripMessageRepository,
	users domain.UserRepository,
	db *pgxpool.Pool,
) domain.TripService {
	return &tripService{
		trips:        trips,
		participants: participants,
		invitations:  invitations,
		candidates:   candidates,
		destinations: destinations,
		messages:     messages,
		users:        users,
		db:           db,
	}
}

func (s *tripService) CreateTrip(ctx context.Context, creatorID uuid.UUID, input domain.CreateTripInput) (*domain.Trip, error) {
	if input.Name == "" {
		return nil, domain.ErrInvalidInput
	}
	if input.StartDate != nil && len(input.Candidates) > 0 {
		return nil, domain.ErrInvalidInput
	}
	if input.StartDate == nil && len(input.Candidates) == 0 {
		return nil, domain.ErrInvalidInput
	}
	if input.StartDate != nil && input.EndDate == nil {
		return nil, domain.ErrInvalidInput
	}
	if input.StartDate != nil && input.EndDate != nil && input.StartDate.After(*input.EndDate) {
		return nil, domain.ErrInvalidInput
	}

	status := domain.TripStatusVotingPending
	if input.StartDate != nil {
		status = domain.TripStatusFixed
	}

	trip := &domain.Trip{
		ID:        uuid.New(),
		CreatorID: creatorID,
		Name:      input.Name,
		Tags:      input.Tags,
		Status:    status,
		StartDate: input.StartDate,
		EndDate:   input.EndDate,
		IsPublic:  false,
	}

	tx, err := s.db.BeginTx(ctx, pgx.TxOptions{})
	if err != nil {
		return nil, fmt.Errorf("trip_service: begin tx: %w", err)
	}
	defer func() { _ = tx.Rollback(ctx) }()

	const tripQuery = `
INSERT INTO trips (id, creator_id, name, tags, status, start_date, end_date, is_public)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`
	tagsJSON, err := json.Marshal(input.Tags)
	if err != nil {
		return nil, fmt.Errorf("trip_service: marshal tags: %w", err)
	}
	_, err = tx.Exec(ctx, tripQuery,
		trip.ID, trip.CreatorID, trip.Name, tagsJSON, trip.Status,
		trip.StartDate, trip.EndDate, trip.IsPublic,
	)
	if err != nil {
		return nil, fmt.Errorf("trip_service: create trip: %w", err)
	}

	const participantQuery = `INSERT INTO trip_participants (trip_id, user_id) VALUES ($1, $2)`
	_, err = tx.Exec(ctx, participantQuery, trip.ID, creatorID)
	if err != nil {
		return nil, fmt.Errorf("trip_service: add creator participant: %w", err)
	}

	if len(input.Candidates) > 0 {
		const candidateQuery = `INSERT INTO trip_date_candidates (id, trip_id, start_date, end_date) VALUES ($1, $2, $3, $4)`
		for _, candidate := range input.Candidates {
			if candidate.StartDate.After(candidate.EndDate) {
				return nil, domain.ErrInvalidInput
			}
			_, err = tx.Exec(ctx, candidateQuery, uuid.New(), trip.ID, candidate.StartDate, candidate.EndDate)
			if err != nil {
				return nil, fmt.Errorf("trip_service: add candidate: %w", err)
			}
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("trip_service: commit create trip: %w", err)
	}

	return trip, nil
}

func (s *tripService) ListTrips(ctx context.Context, userID uuid.UUID, cursor *uuid.UUID, limit int) ([]*domain.Trip, error) {
	if limit <= 0 {
		limit = 20
	}
	if limit > 100 {
		limit = 100
	}
	return s.trips.ListByParticipant(ctx, userID, cursor, limit)
}

func (s *tripService) GetTrip(ctx context.Context, tripID, requesterID uuid.UUID) (*domain.Trip, error) {
	trip, err := s.trips.FindByID(ctx, tripID)
	if err != nil {
		return nil, err
	}
	participant, err := s.trips.IsParticipant(ctx, tripID, requesterID)
	if err != nil {
		return nil, err
	}
	if !participant && trip.CreatorID != requesterID {
		return nil, domain.ErrNotFound
	}
	return trip, nil
}

func (s *tripService) UpdateTrip(ctx context.Context, tripID, requesterID uuid.UUID, input domain.UpdateTripInput) (*domain.Trip, error) {
	if input.Name == nil && input.Tags == nil && input.StartDate == nil && input.EndDate == nil {
		return nil, domain.ErrInvalidInput
	}
	if input.StartDate != nil && input.EndDate != nil && input.StartDate.After(*input.EndDate) {
		return nil, domain.ErrInvalidInput
	}

	if ok, err := s.trips.IsCreator(ctx, tripID, requesterID); err != nil {
		return nil, err
	} else if !ok {
		return nil, domain.ErrForbidden
	}

	trip, err := s.trips.FindByID(ctx, tripID)
	if err != nil {
		return nil, err
	}
	if input.Name != nil {
		trip.Name = *input.Name
	}
	if input.Tags != nil {
		trip.Tags = input.Tags
	}
	if input.StartDate != nil {
		trip.StartDate = input.StartDate
	}
	if input.EndDate != nil {
		trip.EndDate = input.EndDate
	}
	if err := s.trips.Update(ctx, trip); err != nil {
		return nil, err
	}
	return trip, nil
}

func (s *tripService) DeleteTrip(ctx context.Context, tripID, requesterID uuid.UUID) error {
	if ok, err := s.trips.IsCreator(ctx, tripID, requesterID); err != nil {
		return err
	} else if !ok {
		return domain.ErrForbidden
	}
	return s.trips.SoftDelete(ctx, tripID)
}

func (s *tripService) InviteParticipant(ctx context.Context, tripID, inviterID uuid.UUID, input domain.InviteInput) error {
	if ok, err := s.trips.IsParticipant(ctx, tripID, inviterID); err != nil {
		return err
	} else if !ok {
		return domain.ErrForbidden
	}

	inv := &domain.TripInvitation{
		ID:        uuid.New(),
		TripID:    tripID,
		InvitedBy: inviterID,
		Status:    domain.InvitationStatusPending,
	}
	if input.Username != nil {
		target, err := s.users.FindByUsername(ctx, *input.Username)
		if err != nil {
			return err
		}
		inv.InvitedUserID = &target.ID
		inv.Method = domain.InvitationMethodUsername
	} else if input.Email != nil {
		inv.InvitedEmail = input.Email
		inv.Method = domain.InvitationMethodEmail
	} else {
		return domain.ErrInvalidInput
	}

	return s.invitations.Create(ctx, inv)
}

func (s *tripService) RespondToInvitation(ctx context.Context, invitationID, responderID uuid.UUID, accept bool) error {
	inv, err := s.invitations.FindByID(ctx, invitationID)
	if err != nil {
		return err
	}
	if inv.Status != domain.InvitationStatusPending {
		return domain.ErrInvitationNotPending
	}
	if inv.InvitedUserID != nil {
		if *inv.InvitedUserID != responderID {
			return domain.ErrForbidden
		}
	} else if inv.InvitedEmail != nil {
		user, err := s.users.FindByID(ctx, responderID)
		if err != nil {
			return err
		}
		if user.Email != *inv.InvitedEmail {
			return domain.ErrForbidden
		}
	} else {
		return domain.ErrInvalidInput
	}

	if !accept {
		return s.invitations.UpdateStatus(ctx, invitationID, domain.InvitationStatusDeclined)
	}

	tx, err := s.db.BeginTx(ctx, pgx.TxOptions{})
	if err != nil {
		return fmt.Errorf("trip_service: begin tx: %w", err)
	}
	defer func() { _ = tx.Rollback(ctx) }()

	const acceptQuery = `UPDATE trip_invitations SET status = $2, updated_at = NOW() WHERE id = $1`
	if _, err := tx.Exec(ctx, acceptQuery, invitationID, domain.InvitationStatusAccepted); err != nil {
		return fmt.Errorf("trip_service: update invitation status: %w", err)
	}

	const addParticipantQuery = `INSERT INTO trip_participants (trip_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`
	if _, err := tx.Exec(ctx, addParticipantQuery, inv.TripID, responderID); err != nil {
		return fmt.Errorf("trip_service: add participant: %w", err)
	}

	if err := tx.Commit(ctx); err != nil {
		return fmt.Errorf("trip_service: commit accept invitation: %w", err)
	}
	return nil
}

func (s *tripService) CastVote(ctx context.Context, candidateID, userID uuid.UUID) error {
	candidate, err := s.candidates.FindByID(ctx, candidateID)
	if err != nil {
		return err
	}
	if ok, err := s.trips.IsParticipant(ctx, candidate.TripID, userID); err != nil {
		return err
	} else if !ok {
		return domain.ErrNotParticipant
	}
	trip, err := s.trips.FindByID(ctx, candidate.TripID)
	if err != nil {
		return err
	}
	if trip.Status == domain.TripStatusFixed {
		return domain.ErrTripAlreadyFixed
	}
	return s.candidates.AddVote(ctx, candidateID, userID)
}

func (s *tripService) RetractVote(ctx context.Context, candidateID, userID uuid.UUID) error {
	candidate, err := s.candidates.FindByID(ctx, candidateID)
	if err != nil {
		return err
	}
	if ok, err := s.trips.IsParticipant(ctx, candidate.TripID, userID); err != nil {
		return err
	} else if !ok {
		return domain.ErrNotParticipant
	}
	return s.candidates.RemoveVote(ctx, candidateID, userID)
}

func (s *tripService) LockDate(ctx context.Context, tripID, candidateID, requesterID uuid.UUID) error {
	if ok, err := s.trips.IsCreator(ctx, tripID, requesterID); err != nil {
		return err
	} else if !ok {
		return domain.ErrNotCreator
	}
	trip, err := s.trips.FindByID(ctx, tripID)
	if err != nil {
		return err
	}
	if trip.Status == domain.TripStatusFixed {
		return domain.ErrTripAlreadyFixed
	}
	candidate, err := s.candidates.FindByID(ctx, candidateID)
	if err != nil {
		return err
	}
	if candidate.TripID != tripID {
		return domain.ErrInvalidInput
	}
	trip.StartDate = &candidate.StartDate
	trip.EndDate = &candidate.EndDate
	trip.Status = domain.TripStatusFixed
	return s.trips.Update(ctx, trip)
}

func (s *tripService) AddDestination(ctx context.Context, tripID, requesterID uuid.UUID, input domain.AddDestinationInput) (*domain.TripDestination, error) {
	if input.PlaceName == "" {
		return nil, domain.ErrInvalidInput
	}
	if ok, err := s.trips.IsParticipant(ctx, tripID, requesterID); err != nil {
		return nil, err
	} else if !ok {
		return nil, domain.ErrNotParticipant
	}
	dest := &domain.TripDestination{
		ID:            uuid.New(),
		TripID:        tripID,
		PlaceName:     input.PlaceName,
		MapsLink:      input.MapsLink,
		ReferenceLink: input.ReferenceLink,
		SortOrder:     0,
	}
	if err := s.destinations.Create(ctx, dest); err != nil {
		return nil, err
	}
	return dest, nil
}

func (s *tripService) RemoveDestination(ctx context.Context, destinationID, tripID, requesterID uuid.UUID) error {
	if ok, err := s.trips.IsCreator(ctx, tripID, requesterID); err != nil {
		return err
	} else if !ok {
		return domain.ErrNotCreator
	}
	return s.destinations.Delete(ctx, destinationID, tripID)
}

func (s *tripService) ListDestinations(ctx context.Context, tripID, requesterID uuid.UUID) ([]*domain.TripDestination, error) {
	if ok, err := s.trips.IsParticipant(ctx, tripID, requesterID); err != nil {
		return nil, err
	} else if !ok {
		return nil, domain.ErrNotParticipant
	}
	return s.destinations.FindByTrip(ctx, tripID)
}

func (s *tripService) ListDateCandidates(ctx context.Context, tripID, requesterID uuid.UUID) ([]*domain.TripDateCandidate, error) {
	if ok, err := s.trips.IsParticipant(ctx, tripID, requesterID); err != nil {
		return nil, err
	} else if !ok {
		return nil, domain.ErrNotParticipant
	}
	return s.candidates.FindByTrip(ctx, tripID)
}

func (s *tripService) SendMessage(ctx context.Context, tripID, senderID uuid.UUID, text string) (*domain.TripMessage, error) {
	if text == "" {
		return nil, domain.ErrInvalidInput
	}
	if ok, err := s.trips.IsParticipant(ctx, tripID, senderID); err != nil {
		return nil, err
	} else if !ok {
		return nil, domain.ErrNotParticipant
	}
	msg := &domain.TripMessage{
		ID:          uuid.New(),
		TripID:      tripID,
		SenderID:    senderID,
		MessageText: text,
	}
	if err := s.messages.Create(ctx, msg); err != nil {
		return nil, err
	}
	return msg, nil
}

func (s *tripService) GetMessages(ctx context.Context, tripID, requesterID uuid.UUID, cursor *time.Time, limit int) ([]*domain.TripMessage, error) {
	if ok, err := s.trips.IsParticipant(ctx, tripID, requesterID); err != nil {
		return nil, err
	} else if !ok {
		return nil, domain.ErrNotParticipant
	}
	if limit <= 0 {
		limit = 20
	}
	if limit > 100 {
		limit = 100
	}
	return s.messages.FindByTrip(ctx, tripID, cursor, limit)
}
