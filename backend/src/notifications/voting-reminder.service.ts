import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from './notifications.service';

/**
 * Voting Reminder Service
 *
 * Sends voting deadline reminders at H-7d, H-1d, H-1h before voting_deadline
 * for participants who haven't voted yet (M9 requirement).
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
   * Send reminders for voting deadlines exactly 7 days from now.
   * Time window: now <= voting_deadline - 7 days < now + 1 hour
   */
  private async sendRemindersFor7DaysBefore() {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

    const tripsWithDeadline = await this.prisma.trip.findMany({
      where: {
        status: 'voting_pending',
        votingDeadline: {
          gte: sevenDaysFromNow,
          lt: oneHourFromNow,
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
      },
    });

    for (const trip of tripsWithDeadline) {
      // Find participants who haven't voted yet
      const participantsToNotify = trip.participants.filter((participant) => {
        // Check if user has voted on any date candidate
        const hasVoted = trip.dateCandidates.some((candidate) =>
          candidate.votes.some((vote) => vote.userId === participant.userId),
        );
        return !hasVoted;
      });

      // Send notifications to participants who haven't voted
      await Promise.all(
        participantsToNotify.map((participant) =>
          this.notifications.createNotification({
            userId: participant.userId,
            type: 'voting_deadline',
            actorId: trip.creatorId, // Creator is the actor
            tripId: trip.id,
            payload: {
              reminder_type: '7_days_before',
              voting_deadline: trip.votingDeadline!.toISOString(),
            },
          }),
        ),
      );

      if (tripsWithDeadline.length > 0) {
        this.logger.log(`Sent H-7d voting reminders for ${tripsWithDeadline.length} trip(s)`);
      }
    }
  }

  /**
   * Send reminders for voting deadlines exactly 1 day from now.
   * Time window: now <= voting_deadline - 1 day < now + 1 hour
   */
  private async sendRemindersFor1DayBefore() {
    const now = new Date();
    const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

    const tripsWithDeadline = await this.prisma.trip.findMany({
      where: {
        status: 'voting_pending',
        votingDeadline: {
          gte: oneDayFromNow,
          lt: oneHourFromNow,
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
      },
    });

    for (const trip of tripsWithDeadline) {
      // Find participants who haven't voted yet
      const participantsToNotify = trip.participants.filter((participant) => {
        // Check if user has voted on any date candidate
        const hasVoted = trip.dateCandidates.some((candidate) =>
          candidate.votes.some((vote) => vote.userId === participant.userId),
        );
        return !hasVoted;
      });

      // Send notifications to participants who haven't voted
      await Promise.all(
        participantsToNotify.map((participant) =>
          this.notifications.createNotification({
            userId: participant.userId,
            type: 'voting_deadline',
            actorId: trip.creatorId,
            tripId: trip.id,
            payload: {
              reminder_type: '1_day_before',
              voting_deadline: trip.votingDeadline!.toISOString(),
            },
          }),
        ),
      );

      if (tripsWithDeadline.length > 0) {
        this.logger.log(`Sent H-1d voting reminders for ${tripsWithDeadline.length} trip(s)`);
      }
    }
  }

  /**
   * Send reminders for voting deadlines exactly 1 hour from now.
   * Time window: now <= voting_deadline - 1 hour < now + 1 hour
   */
  private async sendRemindersFor1HourBefore() {
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    const tripsWithDeadline = await this.prisma.trip.findMany({
      where: {
        status: 'voting_pending',
        votingDeadline: {
          gte: oneHourFromNow,
          lt: twoHoursFromNow,
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
      },
    });

    for (const trip of tripsWithDeadline) {
      // Find participants who haven't voted yet
      const participantsToNotify = trip.participants.filter((participant) => {
        // Check if user has voted on any date candidate
        const hasVoted = trip.dateCandidates.some((candidate) =>
          candidate.votes.some((vote) => vote.userId === participant.userId),
        );
        return !hasVoted;
      });

      // Send notifications to participants who haven't voted
      await Promise.all(
        participantsToNotify.map((participant) =>
          this.notifications.createNotification({
            userId: participant.userId,
            type: 'voting_deadline',
            actorId: trip.creatorId,
            tripId: trip.id,
            payload: {
              reminder_type: '1_hour_before',
              voting_deadline: trip.votingDeadline!.toISOString(),
            },
          }),
        ),
      );

      if (tripsWithDeadline.length > 0) {
        this.logger.log(`Sent H-1h voting reminders for ${tripsWithDeadline.length} trip(s)`);
      }
    }
  }
}
