import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from './notifications.service';
import { NotificationType, PollType, PollStatus, TripStatus } from '@prisma/client';
import { getReminderTargets, dueTarget } from './reminder-horizons';

/**
 * Voting Reminder Service
 *
 * Sends 2 proportional reminders (R1 at 50% of the gap, R2 at 25%, each with
 * a minimum lead) before the voting_deadline for participants who haven't
 * voted yet (M9 requirement, revised to proportional horizons).
 *
 * Targets are anchored at `trip.updatedAt` (when the deadline was last set),
 * so they are stable over time and naturally reschedule when the deadline is
 * moved. The cron runs every hour; a reminder fires when its target falls
 * within the next hour. Notifications are deduped per (user, trip,
 * reminder_type).
 */
@Injectable()
export class VotingReminderService {
  private readonly logger = new Logger(VotingReminderService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleVotingReminders() {
    try {
      const now = new Date();
      // Look ahead far enough to cover the smallest reminder fraction (25% of
      // the gap). A 30-day deadline has its R2 target 7.5 days before it.
      const lookahead = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      const trips = await this.prisma.trip.findMany({
        where: {
          status: TripStatus.voting_pending,
          votingDeadline: {
            gte: now,
            lt: lookahead,
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

      if (trips.length === 0) return;

      for (const trip of trips) {
        const deadline = trip.votingDeadline!;
        const anchor = trip.updatedAt;

        // The deadline must be in the future (DB guarantees gte now).
        if (deadline.getTime() < now.getTime()) continue;

        // Targets for this deadline, anchored at when it was last set.
        const targets = getReminderTargets(deadline, anchor);
        const due = dueTarget(targets, now);
        if (!due) continue;

        await this.sendForTrip(trip, due);
      }
    } catch (error) {
      this.logger.error(`Failed to send voting reminders: ${error.message}`);
    }
  }

  private async sendForTrip(
    trip: {
      id: string;
      creatorId: string;
      votingDeadline: Date | null;
      participants: Array<{ userId: string; user: { id: string } }>;
      dateCandidates: Array<{ votes: Array<{ userId: string }> }>;
      polls: Array<{ id: string }>;
    },
    reminderType: 'r1' | 'r2',
  ) {
    // Find participants who haven't voted yet.
    const participantsToNotify = trip.participants.filter((participant) => {
      const hasVoted = trip.dateCandidates.some((candidate) =>
        candidate.votes.some((vote) => vote.userId === participant.userId),
      );
      return !hasVoted;
    });

    if (participantsToNotify.length === 0) return;

    // Dedup: skip users who already received this reminder type for this trip.
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

    if (recipients.length === 0) return;

    // Send notifications to participants who haven't voted.
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
