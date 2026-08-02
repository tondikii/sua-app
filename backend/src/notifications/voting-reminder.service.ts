import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from './notifications.service';
import { NotificationType, PollType, PollStatus, TripStatus } from '@prisma/client';

/**
 * Voting Reminder Service
 *
 * Sends voting deadline reminders at H-7d, H-1d, H-1h before voting_deadline
 * for participants who haven't voted yet (M9 requirement).
 *
 * Each run covers a 1-hour sliding window per horizon:
 *   - H-7d: voting_deadline in [now+7d, now+7d+1h)
 *   - H-1d: voting_deadline in [now+1d, now+1d+1h)
 *   - H-1h: voting_deadline in [now+1h, now+2h)
 * A notification is only sent once per user per reminder window (dedup via
 * the existing `reminder_type` payload on the user's notifications).
 */
@Injectable()
export class VotingReminderService {
  private readonly logger = new Logger(VotingReminderService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  /**
   * Run every hour to check for upcoming voting deadlines and send reminders.
   * This ensures we catch all time windows: H-7d, H-1d, H-1h
   */
  @Cron(CronExpression.EVERY_HOUR)
  async handleVotingReminders() {
    try {
      await this.sendRemindersFor7DaysBefore();
      await this.sendRemindersFor1DayBefore();
      await this.sendRemindersFor1HourBefore();
    } catch (error) {
      this.logger.error(`Failed to send voting reminders: ${error.message}`);
    }
  }

  /**
   * Send reminders for voting deadlines 7 days from now.
   * Time window: now+7d <= voting_deadline < now+7d+1h
   */
  private async sendRemindersFor7DaysBefore() {
    const now = new Date();
    const windowStart = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const windowEnd = new Date(windowStart.getTime() + 60 * 60 * 1000);

    await this.sendRemindersForWindow(now, windowStart, windowEnd, '7_days_before');
  }

  /**
   * Send reminders for voting deadlines 1 day from now.
   * Time window: now+1d <= voting_deadline < now+1d+1h
   */
  private async sendRemindersFor1DayBefore() {
    const now = new Date();
    const windowStart = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const windowEnd = new Date(windowStart.getTime() + 60 * 60 * 1000);

    await this.sendRemindersForWindow(now, windowStart, windowEnd, '1_day_before');
  }

  /**
   * Send reminders for voting deadlines 1 hour from now.
   * Time window: now+1h <= voting_deadline < now+2h
   */
  private async sendRemindersFor1HourBefore() {
    const now = new Date();
    const windowStart = new Date(now.getTime() + 60 * 60 * 1000);
    const windowEnd = new Date(windowStart.getTime() + 60 * 60 * 1000);

    await this.sendRemindersForWindow(now, windowStart, windowEnd, '1_hour_before');
  }

  private async sendRemindersForWindow(
    now: Date,
    windowStart: Date,
    windowEnd: Date,
    reminderType: string,
  ) {
    const tripsWithDeadline = await this.prisma.trip.findMany({
      where: {
        status: TripStatus.voting_pending,
        votingDeadline: {
          gte: windowStart,
          lt: windowEnd,
        },
        deletedAt: null,
      },
      include: {
        participants: {
          include: {
            user: {
              select: { id: true },
            },
          },
        },
        dateCandidates: {
          include: {
            votes: {
              select: { userId: true },
            },
          },
        },
        polls: {
          where: {
            status: PollStatus.active,
            pollType: PollType.tanggal,
          },
          select: { id: true },
          take: 1,
        },
      },
    });

    if (tripsWithDeadline.length === 0) return;

    for (const trip of tripsWithDeadline) {
      // Find participants who haven't voted yet
      const participantsToNotify = trip.participants.filter((participant) => {
        // Check if user has voted on any date candidate
        const hasVoted = trip.dateCandidates.some((candidate) =>
          candidate.votes.some((vote) => vote.userId === participant.userId),
        );
        return !hasVoted;
      });

      if (participantsToNotify.length === 0) continue;

      // Dedup: skip users who already received this reminder window for this trip.
      const existing = await this.prisma.notification.findMany({
        where: {
          userId: { in: participantsToNotify.map((p) => p.userId) },
          tripId: trip.id,
          type: NotificationType.voting_deadline,
        },
        select: { userId: true, payload: true },
      });
      const alreadyNotified = new Set(
        existing
          .filter((n) => (n.payload as Record<string, any>)?.reminder_type === reminderType)
          .map((n) => n.userId),
      );
      const recipients = participantsToNotify.filter(
        (p) => !alreadyNotified.has(p.userId),
      );

      if (recipients.length === 0) continue;

      // Send notifications to participants who haven't voted
      const pollId = trip.polls[0]?.id ?? null;
      await this.notifications.createManyNotifications(
        recipients.map((participant) => ({
          userId: participant.userId,
          type: NotificationType.voting_deadline,
          actorId: trip.creatorId, // Creator is the actor
          tripId: trip.id,
          payload: {
            reminder_type: reminderType,
            voting_deadline: trip.votingDeadline!.toISOString(),
            poll_type: 'tanggal',
            poll_id: pollId,
          },
        })),
      );

      this.logger.log(
        `Sent ${reminderType} voting reminders for ${recipients.length} user(s) in trip ${trip.id}`,
      );
    }
  }
}
