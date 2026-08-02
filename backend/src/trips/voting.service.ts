import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PollSerializer } from './serializers/poll.serializer';
import type { PollType } from '@atur-perjalanan/shared-types';

const USER_SUMMARY_SELECT = {
  id: true,
  name: true,
  username: true,
  avatarUrl: true,
} as const;

@Injectable()
export class VotingService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * List all polls for a trip (tanggal/aktivitas/lainnya) with tallies.
   * Includes current user's votes and creator info per poll.
   * Polls whose deadline has passed are auto-marked `expired` first.
   */
  async listPolls(tripId: string, userId: string) {
    const trip = await this.prisma.trip.findFirst({
      where: { id: tripId },
      select: { id: true, creatorId: true },
    });

    if (!trip) {
      throw new NotFoundException({ code: 'TRIP_NOT_FOUND', message: 'Trip not found' });
    }

    const isParticipant = await this.prisma.tripParticipant.findUnique({
      where: { tripId_userId: { tripId, userId } },
    });

    if (!isParticipant && trip.creatorId !== userId) {
      throw new ForbiddenException({
        code: 'NOT_TRIP_PARTICIPANT',
        message: 'You are not a member of this trip',
      });
    }

    // Auto-expire active polls whose deadline has passed (Screen 72).
    const now = new Date();
    await this.prisma.tripPoll.updateMany({
      where: { tripId, status: 'active', deadline: { lt: now } },
      data: { status: 'expired' },
    });

    const polls = await this.prisma.tripPoll.findMany({
      where: { tripId, status: { not: 'cancelled' } },
      orderBy: { createdAt: 'asc' },
      include: {
        creator: { select: USER_SUMMARY_SELECT },
        options: {
          orderBy: { sortOrder: 'asc' },
          include: {
            votes: { include: { user: { select: USER_SUMMARY_SELECT } } },
          },
        },
      },
    });

    // Map each poll + get viewer's vote for that poll
    const data = await Promise.all(
      polls.map(async (poll) => {
        const viewerVote = await this.prisma.tripPollVote.findFirst({
          where: { pollId: poll.id, userId },
        });

        return PollSerializer.toList(poll, poll.options, poll.creator, viewerVote);
      }),
    );

    return { data };
  }

  /**
   * Create a new poll (tanggal/aktivitas/lainnya).
   * Enforces: max 1 active poll per poll_type per trip (tanggal may only be
   * re-created after the previous one is locked/expired). Participants only.
   */
  async createPoll(tripId: string, userId: string, dto: any) {
    if (!['tanggal', 'aktivitas', 'lainnya'].includes(dto.poll_type)) {
      throw new BadRequestException({
        code: 'INVALID_POLL_TYPE',
        message: "poll_type must be 'tanggal', 'aktivitas' or 'lainnya'",
      });
    }

    // Normalize options: plain string -> { label }
    const normalizedOptions: Array<{ label: string; candidate_id?: string }> = dto.options.map(
      (opt: string | { label: string; candidate_id?: string }) =>
        typeof opt === 'string' ? { label: opt } : opt,
    );

    if (normalizedOptions.length < 1 || normalizedOptions.length > 10) {
      throw new BadRequestException({
        code: 'INVALID_OPTIONS_COUNT',
        message: 'Must provide 1–10 options',
      });
    }

    const trip = await this.prisma.trip.findFirst({
      where: { id: tripId },
      include: { participants: { select: { userId: true } } },
    });

    if (!trip) {
      throw new NotFoundException({ code: 'TRIP_NOT_FOUND', message: 'Trip not found' });
    }

    const isParticipant = trip.participants.some((p) => p.userId === userId);
    if (!isParticipant && trip.creatorId !== userId) {
      throw new ForbiddenException({
        code: 'NOT_TRIP_PARTICIPANT',
        message: 'Only trip participants can create polls',
      });
    }

    // Check: max 1 active poll per poll_type
    const existingActive = await this.prisma.tripPoll.findFirst({
      where: { tripId, pollType: dto.poll_type as PollType, status: 'active' },
    });

    if (existingActive) {
      throw new ConflictException({
        code: 'POLL_TYPE_ACTIVE',
        message: `An active ${dto.poll_type} poll already exists for this trip`,
      });
    }

    const poll = await this.prisma.$transaction(async (tx) => {
      const created = await tx.tripPoll.create({
        data: {
          tripId,
          pollType: dto.poll_type as PollType,
          title: dto.title,
          status: 'active',
          deadline: dto.deadline ? new Date(dto.deadline) : null,
          createdBy: userId,
        },
      });

      await Promise.all(
        normalizedOptions.map((opt, idx) =>
          tx.tripPollOption.create({
            data: {
              pollId: created.id,
              label: opt.label,
              candidateId: opt.candidate_id ?? null,
              sortOrder: idx,
            },
          }),
        ),
      );

      return created;
    });

    // Fetch and serialize
    const full = await this.prisma.tripPoll.findUnique({
      where: { id: poll.id },
      include: {
        creator: { select: USER_SUMMARY_SELECT },
        options: {
          orderBy: { sortOrder: 'asc' },
          include: {
            votes: { include: { user: { select: USER_SUMMARY_SELECT } } },
          },
        },
      },
    });

    return PollSerializer.toList(full!, full!.options, full!.creator, null);
  }

  /**
   * Update an active poll (creator only): title, deadline, and options are
   * replaced (existing votes are dropped). Used by Screen 66/67 edit flow.
   */
  async updatePoll(tripId: string, pollId: string, userId: string, dto: any) {
    const poll = await this.prisma.tripPoll.findFirst({
      where: { id: pollId, tripId },
    });

    if (!poll) {
      throw new NotFoundException({ code: 'POLL_NOT_FOUND', message: 'Poll not found' });
    }

    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
      select: { creatorId: true },
    });

    if (trip?.creatorId !== userId) {
      throw new ForbiddenException({
        code: 'NOT_TRIP_CREATOR',
        message: 'Only the trip creator can edit polls',
      });
    }

    if (poll.status !== 'active') {
      throw new BadRequestException({
        code: 'POLL_NOT_ACTIVE',
        message: `Cannot edit a ${poll.status} poll`,
      });
    }

    if (dto.options && (dto.options.length < 1 || dto.options.length > 10)) {
      throw new BadRequestException({
        code: 'INVALID_OPTIONS_COUNT',
        message: 'Must provide 1–10 options',
      });
    }

    await this.prisma.$transaction(async (tx) => {
      if (dto.options) {
        const normalizedOptions: Array<{ label: string; candidate_id?: string }> = dto.options.map(
          (opt: string | { label: string; candidate_id?: string }) =>
            typeof opt === 'string' ? { label: opt } : opt,
        );
        // Replace options: drop votes + old options, create fresh ones.
        const oldOptions = await tx.tripPollOption.findMany({ where: { pollId } });
        await tx.tripPollVote.deleteMany({
          where: { optionId: { in: oldOptions.map((o) => o.id) } },
        });
        await tx.tripPollOption.deleteMany({ where: { pollId } });
        await Promise.all(
          normalizedOptions.map((opt, idx) =>
            tx.tripPollOption.create({
              data: {
                pollId,
                label: opt.label,
                candidateId: opt.candidate_id ?? null,
                sortOrder: idx,
              },
            }),
          ),
        );
      }

      await tx.tripPoll.update({
        where: { id: pollId },
        data: {
          title: dto.title ?? poll.title,
          deadline: dto.deadline !== undefined ? (dto.deadline ? new Date(dto.deadline) : null) : poll.deadline,
        },
      });
    });

    const full = await this.prisma.tripPoll.findUnique({
      where: { id: pollId },
      include: {
        creator: { select: USER_SUMMARY_SELECT },
        options: {
          orderBy: { sortOrder: 'asc' },
          include: {
            votes: { include: { user: { select: USER_SUMMARY_SELECT } } },
          },
        },
      },
    });

    const viewerVote = await this.prisma.tripPollVote.findFirst({
      where: { pollId, userId },
    });

    return PollSerializer.toList(full!, full!.options, full!.creator, viewerVote);
  }

  /**
   * Vote on a poll option (participant only; one vote per user per poll).
   * If user already voted on this poll, replaces the previous vote.
   */
  async voteOnPoll(tripId: string, pollId: string, userId: string, optionId: string) {
    const poll = await this.prisma.tripPoll.findFirst({
      where: { id: pollId, tripId },
    });

    if (!poll) {
      throw new NotFoundException({ code: 'POLL_NOT_FOUND', message: 'Poll not found' });
    }

    if (poll.status !== 'active') {
      throw new BadRequestException({
        code: 'POLL_NOT_ACTIVE',
        message: `Cannot vote on a ${poll.status} poll`,
      });
    }

    const isParticipant = await this.prisma.tripParticipant.findUnique({
      where: { tripId_userId: { tripId, userId } },
    });

    if (!isParticipant) {
      throw new ForbiddenException({
        code: 'NOT_TRIP_PARTICIPANT',
        message: 'Only trip participants can vote',
      });
    }

    // Verify option exists and belongs to this poll
    const option = await this.prisma.tripPollOption.findFirst({
      where: { id: optionId, pollId },
    });

    if (!option) {
      throw new NotFoundException({
        code: 'OPTION_NOT_FOUND',
        message: 'Option not found in this poll',
      });
    }

    // Upsert: replace any existing vote by this user on this poll
    const existingVote = await this.prisma.tripPollVote.findFirst({
      where: { pollId, userId },
    });

    if (existingVote && existingVote.optionId === optionId) {
      // Already voted for this option — no-op
      return;
    }

    await this.prisma.$transaction(async (tx) => {
      if (existingVote) {
        await tx.tripPollVote.delete({
          where: { pollId_userId: { pollId, userId } },
        });
      }

      await tx.tripPollVote.create({
        data: { pollId, optionId, userId },
      });
    });
  }

  /**
   * Retract vote from a poll (user can only retract their own vote).
   */
  async retractVote(tripId: string, pollId: string, userId: string) {
    const poll = await this.prisma.tripPoll.findFirst({
      where: { id: pollId, tripId },
    });

    if (!poll) {
      throw new NotFoundException({ code: 'POLL_NOT_FOUND', message: 'Poll not found' });
    }

    const vote = await this.prisma.tripPollVote.findFirst({
      where: { pollId, userId },
    });

    if (!vote) {
      throw new NotFoundException({
        code: 'VOTE_NOT_FOUND',
        message: 'You have not voted on this poll',
      });
    }

    await this.prisma.tripPollVote.delete({
      where: { pollId_userId: { pollId, userId } },
    });
  }

  /**
   * Vote on a date candidate (part of tanggal poll, but stored in trip_date_votes).
   * Participants only; one vote per user per candidate.
   */
  async voteOnDateCandidate(tripId: string, candidateId: string, userId: string) {
    const candidate = await this.prisma.tripDateCandidate.findFirst({
      where: { id: candidateId, tripId },
    });

    if (!candidate) {
      throw new NotFoundException({
        code: 'CANDIDATE_NOT_FOUND',
        message: 'Candidate not found',
      });
    }

    const isParticipant = await this.prisma.tripParticipant.findUnique({
      where: { tripId_userId: { tripId, userId } },
    });

    if (!isParticipant) {
      throw new ForbiddenException({
        code: 'NOT_TRIP_PARTICIPANT',
        message: 'Only trip participants can vote',
      });
    }

    const existingVote = await this.prisma.tripDateVote.findUnique({
      where: { candidateId_userId: { candidateId, userId } },
    });

    if (existingVote) {
      // Already voted — no-op
      return;
    }

    await this.prisma.tripDateVote.create({
      data: { candidateId, userId },
    });
  }

  /**
   * Retract vote from a date candidate.
   */
  async retractDateVote(tripId: string, candidateId: string, userId: string) {
    const candidate = await this.prisma.tripDateCandidate.findFirst({
      where: { id: candidateId, tripId },
    });

    if (!candidate) {
      throw new NotFoundException({
        code: 'CANDIDATE_NOT_FOUND',
        message: 'Candidate not found',
      });
    }

    const vote = await this.prisma.tripDateVote.findUnique({
      where: { candidateId_userId: { candidateId, userId } },
    });

    if (!vote) {
      throw new NotFoundException({
        code: 'VOTE_NOT_FOUND',
        message: 'You have not voted on this candidate',
      });
    }

    await this.prisma.tripDateVote.delete({
      where: { candidateId_userId: { candidateId, userId } },
    });
  }

  /**
   * Lock a poll (creator only).
   * For tanggal: atomically update trip dates, status → fixed, clear voting_deadline (transaction).
   * For aktivitas: atomically lock the poll and copy the winning option into a new
   *   trip_activities row (ARCHITECTURE.md §3.4; WORKFLOW §8 — "pemenang masuk itinerary").
   * For lainnya: just lock the poll (no itinerary side-effect).
   */
  async lockPoll(tripId: string, pollId: string, userId: string) {
    const poll = await this.prisma.tripPoll.findFirst({
      where: { id: pollId, tripId },
    });

    if (!poll) {
      throw new NotFoundException({ code: 'POLL_NOT_FOUND', message: 'Poll not found' });
    }

    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
      select: { creatorId: true, status: true, startDate: true },
    });

    if (trip?.creatorId !== userId) {
      throw new ForbiddenException({
        code: 'NOT_TRIP_CREATOR',
        message: 'Only the trip creator can lock polls',
      });
    }

    if (poll.status !== 'active' && poll.status !== 'expired') {
      throw new BadRequestException({
        code: 'POLL_NOT_ACTIVE',
        message: `Cannot lock a ${poll.status} poll`,
      });
    }

    if (poll.pollType === 'tanggal') {
      // For tanggal: find winning candidate, update trip dates
      const options = await this.prisma.tripPollOption.findMany({
        where: { pollId },
        include: { votes: true },
      });

      const winningOption = this.pickWinningOption(options);
      const winningCandidate = await this.prisma.tripDateCandidate.findUnique({
        where: { id: winningOption?.candidateId || '' },
      });

      await this.prisma.$transaction(async (tx) => {
        await tx.tripPoll.update({
          where: { id: pollId },
          data: { status: 'locked', lockedAt: new Date() },
        });

        if (winningCandidate) {
          await tx.trip.update({
            where: { id: tripId },
            data: {
              startDate: winningCandidate.startDate,
              endDate: winningCandidate.endDate,
              status: 'fixed',
              votingDeadline: null,
            },
          });
        }
      });
    } else if (poll.pollType === 'aktivitas') {
      // For aktivitas: lock the poll and seed the winning option into the itinerary.
      const options = await this.prisma.tripPollOption.findMany({
        where: { pollId },
        include: { votes: true },
        orderBy: { sortOrder: 'asc' },
      });

      const winningOption = this.pickWinningOption(options);

      await this.prisma.$transaction(async (tx) => {
        await tx.tripPoll.update({
          where: { id: pollId },
          data: { status: 'locked', lockedAt: new Date() },
        });

        if (winningOption) {
          const activityCount = await tx.tripActivity.count({ where: { tripId } });
          await tx.tripActivity.create({
            data: {
              tripId,
              placeName: winningOption.label,
              kind: 'activity',
              // Land on day 1 for fixed trips; leave unscheduled otherwise.
              activityDate: trip.status === 'fixed' ? trip.startDate : null,
              sortOrder: activityCount,
            },
          });
        }
      });
    } else {
      // For lainnya: just lock the poll
      await this.prisma.tripPoll.update({
        where: { id: pollId },
        data: { status: 'locked', lockedAt: new Date() },
      });
    }
  }

  /**
   * Pick the winning option by vote count.
   * Tiebreaker: the earliest option (lowest sort order / first in the list).
   */
  private pickWinningOption<T extends { id: string; votes: unknown[] }>(
    options: T[],
  ): T | undefined {
    if (options.length === 0) return undefined;

    let winner = options[0];
    let maxVotes = winner.votes.length;

    for (const opt of options) {
      if (opt.votes.length > maxVotes) {
        maxVotes = opt.votes.length;
        winner = opt;
      }
    }

    return winner;
  }

  /**
   * Delete a poll (hard delete; creator only, or any participant if not locked).
   * For simplicity, only allow delete if status = active.
   */
  async deletePoll(tripId: string, pollId: string, userId: string) {
    const poll = await this.prisma.tripPoll.findFirst({
      where: { id: pollId, tripId },
    });

    if (!poll) {
      throw new NotFoundException({ code: 'POLL_NOT_FOUND', message: 'Poll not found' });
    }

    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
      select: { creatorId: true },
    });

    if (trip?.creatorId !== userId) {
      throw new ForbiddenException({
        code: 'NOT_TRIP_CREATOR',
        message: 'Only the trip creator can delete polls',
      });
    }

    if (poll.status !== 'active' && poll.status !== 'expired') {
      throw new BadRequestException({
        code: 'POLL_NOT_ACTIVE',
        message: 'Can only delete active or expired polls',
      });
    }

    await this.prisma.tripPoll.delete({
      where: { id: pollId },
    });
  }
}
