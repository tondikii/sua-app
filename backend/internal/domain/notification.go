package domain

import (
	"context"
	"time"

	"github.com/google/uuid"
)

// NotificationType enumerates the kinds of notifications a user can receive.
type NotificationType string

const (
	NotificationTypeInvite            NotificationType = "invite"
	NotificationTypeFollow            NotificationType = "follow"
	NotificationTypeVotingDeadline    NotificationType = "voting_deadline"
	NotificationTypeDestinationUpdate NotificationType = "destination_update"
)

// Notification represents a single event notification delivered to a user.
type Notification struct {
	ID        uuid.UUID
	UserID    uuid.UUID
	Type      NotificationType
	ActorID   *uuid.UUID
	TripID    *uuid.UUID
	Payload   map[string]any
	IsRead    bool
	CreatedAt time.Time
}

// NotificationRepository defines the data-access contract for the notifications table.
type NotificationRepository interface {
	Create(ctx context.Context, n *Notification) error
	ListByUser(ctx context.Context, userID uuid.UUID, cursor *time.Time, limit int) ([]*Notification, error)
	CountUnread(ctx context.Context, userID uuid.UUID) (int, error)
	MarkRead(ctx context.Context, notificationID, userID uuid.UUID) error
	MarkAllRead(ctx context.Context, userID uuid.UUID) error
	// FindVotingPendingParticipants returns (tripID, participantID) rows for voting_pending
	// trips whose voting_deadline is between start and end (inclusive). Only participants
	// that have NOT yet voted for any candidate are returned.
	FindUnvotedParticipants(ctx context.Context, deadlineStart, deadlineEnd time.Time) ([]VotingReminderRow, error)
}

// VotingReminderRow is a lightweight struct used by the voting reminder job.
type VotingReminderRow struct {
	TripID        uuid.UUID
	ParticipantID uuid.UUID
}

// NotificationService defines the business-logic contract for notifications.
type NotificationService interface {
	// NotifyInvite creates an "invite" notification for the invitee.
	NotifyInvite(ctx context.Context, inviteeID, inviterID, tripID uuid.UUID) error
	// NotifyFollow creates a "follow" notification for the followed user.
	NotifyFollow(ctx context.Context, followedID, followerID uuid.UUID) error
	// NotifyDestinationUpdate notifies all trip participants except the actor.
	NotifyDestinationUpdate(ctx context.Context, tripID, actorID uuid.UUID, destName string) error
	// NotifyVotingDeadline sends a voting_deadline reminder to a single participant.
	NotifyVotingDeadline(ctx context.Context, participantID, tripID uuid.UUID) error

	ListNotifications(ctx context.Context, userID uuid.UUID, cursor *time.Time, limit int) ([]*Notification, error)
	CountUnread(ctx context.Context, userID uuid.UUID) (int, error)
	MarkRead(ctx context.Context, notificationID, userID uuid.UUID) error
	MarkAllRead(ctx context.Context, userID uuid.UUID) error
}

// NotificationWriter is a write-only subset of NotificationService used as a
// dependency by TripService and UserService so they can emit notifications
// without taking a full service dependency.
type NotificationWriter interface {
	NotifyInvite(ctx context.Context, inviteeID, inviterID, tripID uuid.UUID) error
	NotifyFollow(ctx context.Context, followedID, followerID uuid.UUID) error
	NotifyDestinationUpdate(ctx context.Context, tripID, actorID uuid.UUID, destName string) error
}
