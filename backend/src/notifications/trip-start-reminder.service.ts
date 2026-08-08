import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from './notifications.service';
import { NotificationType, TripStatus } from '@prisma/client';
import { getReminderTargets, dueTarget } from './reminder-horizons';

/**
 * Trip Start Reminder Service
 *
 * Sends 2 proportional reminders (R1 at 50% of the gap, R2 at 25%, each with
 * a minimum lead) before a fixed trip's start datetime to all participants.
 *
 * Start datetime is `start_date` + `start_time` (TIME stored as a
 * `2000-01-01T{hh:mm}:00Z` date in Prisma); all-day trips start at 00:00 UTC
 * on `start_date`.
 *
 * Targets are anchored at `trip.updatedAt` (when the start was last set), so
 * they are stable over time and naturally reschedule when the trip start is
 * moved. An external cron triggers `handleTripStartReminders()` roughly every
 * hour (Vercel serverless has no in-process scheduler); a reminder fires when
 * its target falls within the next hour. Notifications are deduped per
 * (user, trip, reminder_type).
 */
@Injectable()
export class TripStartReminderService {
  private readonly logger = new Logger(TripStartReminderService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  /** Run the reminder pass — called by the external cron endpoint. */
  async handleTripStartReminders() {
    try {
      const now = new Date();
      // Look ahead far enough to cover the smallest reminder fraction (25% of
      // the gap). A 30-day trip has its R2 target 7.5 days before it.
      const lookahead = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      const trips = await this.prisma.trip.findMany({
        where: {
          status: TripStatus.fixed,
          deletedAt: null,
          startDate: {
            gte: now,
            lt: lookahead,
          },
        },
        include: {
          participants: {
            include: {
              user: { select: { id: true } },
            },
          },
        },
      });

      if (trips.length === 0) return;

      for (const trip of trips) {
        const startDatetime = this.tripStartDateTime(trip);
        if (!startDatetime) continue;

        if (startDatetime.getTime() < now.getTime()) continue;

        const targets = getReminderTargets(startDatetime, trip.updatedAt);
        const due = dueTarget(targets, now);
        if (!due) continue;

        await this.sendForTrip(trip, startDatetime, due);
      }
    } catch (error) {
      this.logger.error(
        `Failed to send trip start reminders: ${error.message}`,
      );
    }
  }

  /** Build the trip start Date from start_date (+ start_time when not all-day). */
  private tripStartDateTime(
    trip: {
      startDate: Date | null;
      startTime: Date | null;
      isAllDay: boolean;
    },
  ): Date | null {
    if (!trip.startDate) return null;
    if (trip.isAllDay) {
      // All-day trips start at 00:00 UTC on start_date.
      return new Date(`${trip.startDate.toISOString().slice(0, 10)}T00:00:00.000Z`);
    }
    if (!trip.startTime) return null;
    // startTime is stored as 2000-01-01T{hh:mm}:00Z — extract hh:mm.
    const time = trip.startTime.toISOString().slice(11, 16);
    return new Date(`${trip.startDate.toISOString().slice(0, 10)}T${time}:00.000Z`);
  }

  private async sendForTrip(
    trip: {
      id: string;
      creatorId: string;
      isAllDay: boolean;
      startTime: Date | null;
      participants: Array<{ userId: string; user: { id: string } }>;
    },
    startDatetime: Date,
    reminderType: 'r1' | 'r2',
  ) {
    const recipientIds = trip.participants.map((p) => p.userId);
    if (recipientIds.length === 0) return;

    // Dedup: skip users who already received this reminder type for this trip.
    const existing = await this.prisma.notification.findMany({
      where: {
        userId: { in: recipientIds },
        tripId: trip.id,
        type: NotificationType.trip_start_soon,
      },
      select: { userId: true, payload: true },
    });
    const alreadyNotified = new Set(
      existing
        .filter(
          (n) =>
            (n.payload as Record<string, any>)?.reminder_type === reminderType,
        )
        .map((n) => n.userId),
    );
    const recipients = recipientIds.filter(
      (userId) => !alreadyNotified.has(userId),
    );

    if (recipients.length === 0) return;

    await this.notifications.createManyNotifications(
      recipients.map((userId) => ({
        userId,
        type: NotificationType.trip_start_soon,
        actorId: trip.creatorId,
        tripId: trip.id,
        payload: {
          reminder_type: reminderType,
          start_datetime: startDatetime.toISOString(),
          is_all_day: trip.isAllDay,
          start_time: trip.startTime
            ? trip.startTime.toISOString().slice(11, 16)
            : null,
        },
      })),
    );

    this.logger.log(
      `Sent ${reminderType} trip start reminder for ${recipients.length} user(s) in trip ${trip.id}`,
    );
  }
}
