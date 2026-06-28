// Package jobs contains background goroutines started at server boot.
package jobs

import (
	"context"
	"log/slog"
	"time"

	"github.com/sudutkode/atur-perjalanan/backend/internal/domain"
)

// StartVotingReminder launches a background goroutine that periodically checks for
// voting_pending trips whose deadline is approaching and notifies participants who
// have not yet voted.
//
// Reminders are sent at three thresholds before the voting_deadline:
//   - 7 days before  (± 1-hour window)
//   - 1 day before   (± 1-hour window)
//   - 1 hour before  (± 5-minute window)
//
// The goroutine runs every 30 minutes. It stops when ctx is cancelled.
func StartVotingReminder(ctx context.Context, repo domain.NotificationRepository, svc domain.NotificationService) {
	go func() {
		ticker := time.NewTicker(30 * time.Minute)
		defer ticker.Stop()
		for {
			select {
			case <-ctx.Done():
				return
			case <-ticker.C:
				runVotingReminder(ctx, repo, svc)
			}
		}
	}()
}

func runVotingReminder(ctx context.Context, repo domain.NotificationRepository, svc domain.NotificationService) {
	now := time.Now().UTC()

	windows := []struct {
		label string
		start time.Duration
		end   time.Duration
	}{
		{"7d", 7*24*time.Hour - 30*time.Minute, 7*24*time.Hour + 30*time.Minute},
		{"1d", 24*time.Hour - 30*time.Minute, 24*time.Hour + 30*time.Minute},
		{"1h", 1*time.Hour - 5*time.Minute, 1*time.Hour + 5*time.Minute},
	}

	for _, w := range windows {
		deadlineStart := now.Add(w.start)
		deadlineEnd := now.Add(w.end)

		rows, err := repo.FindUnvotedParticipants(ctx, deadlineStart, deadlineEnd)
		if err != nil {
			slog.Error("voting_reminder: FindUnvotedParticipants", "window", w.label, "error", err)
			continue
		}
		for _, row := range rows {
			if err := svc.NotifyVotingDeadline(ctx, row.ParticipantID, row.TripID); err != nil {
				slog.Warn("voting_reminder: notify failed",
					"participant", row.ParticipantID,
					"trip", row.TripID,
					"error", err,
				)
			}
		}
		if len(rows) > 0 {
			slog.Info("voting_reminder: sent reminders", "window", w.label, "count", len(rows))
		}
	}
}
