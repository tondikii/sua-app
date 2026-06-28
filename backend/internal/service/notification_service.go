package service

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"

	"github.com/sudutkode/atur-perjalanan/backend/internal/domain"
)

type notificationService struct {
	notifications domain.NotificationRepository
	trips         domain.TripRepository
}

// NewNotificationService returns a domain.NotificationService backed by the provided repositories.
func NewNotificationService(
	notifications domain.NotificationRepository,
	trips domain.TripRepository,
) domain.NotificationService {
	return &notificationService{
		notifications: notifications,
		trips:         trips,
	}
}

func (s *notificationService) NotifyInvite(ctx context.Context, inviteeID, inviterID, tripID uuid.UUID) error {
	return s.create(ctx, inviteeID, domain.NotificationTypeInvite, &inviterID, &tripID, nil)
}

func (s *notificationService) NotifyFollow(ctx context.Context, followedID, followerID uuid.UUID) error {
	return s.create(ctx, followedID, domain.NotificationTypeFollow, &followerID, nil, nil)
}

// NotifyDestinationUpdate notifies all trip participants except the actor.
func (s *notificationService) NotifyDestinationUpdate(ctx context.Context, tripID, actorID uuid.UUID, destName string) error {
	participantIDs, err := s.trips.ListParticipantIDs(ctx, tripID)
	if err != nil {
		return fmt.Errorf("notification_service: list participants: %w", err)
	}
	payload := map[string]any{"dest_name": destName}
	for _, pid := range participantIDs {
		if pid == actorID {
			continue
		}
		if err := s.create(ctx, pid, domain.NotificationTypeDestinationUpdate, &actorID, &tripID, payload); err != nil {
			return err
		}
	}
	return nil
}

func (s *notificationService) NotifyVotingDeadline(ctx context.Context, participantID, tripID uuid.UUID) error {
	return s.create(ctx, participantID, domain.NotificationTypeVotingDeadline, nil, &tripID, nil)
}

func (s *notificationService) ListNotifications(ctx context.Context, userID uuid.UUID, cursor *time.Time, limit int) ([]*domain.Notification, error) {
	if limit <= 0 {
		limit = 20
	}
	if limit > 100 {
		limit = 100
	}
	return s.notifications.ListByUser(ctx, userID, cursor, limit)
}

func (s *notificationService) CountUnread(ctx context.Context, userID uuid.UUID) (int, error) {
	return s.notifications.CountUnread(ctx, userID)
}

func (s *notificationService) MarkRead(ctx context.Context, notificationID, userID uuid.UUID) error {
	return s.notifications.MarkRead(ctx, notificationID, userID)
}

func (s *notificationService) MarkAllRead(ctx context.Context, userID uuid.UUID) error {
	return s.notifications.MarkAllRead(ctx, userID)
}

func (s *notificationService) create(ctx context.Context, userID uuid.UUID, nType domain.NotificationType, actorID, tripID *uuid.UUID, payload map[string]any) error {
	if payload == nil {
		payload = map[string]any{}
	}
	n := &domain.Notification{
		ID:      uuid.New(),
		UserID:  userID,
		Type:    nType,
		ActorID: actorID,
		TripID:  tripID,
		Payload: payload,
		IsRead:  false,
	}
	if err := s.notifications.Create(ctx, n); err != nil {
		return fmt.Errorf("notification_service: create %s: %w", nType, err)
	}
	return nil
}
