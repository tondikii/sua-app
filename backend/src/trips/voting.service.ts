import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePollDto, VoteDateCandidateDto } from './dto/voting.dto';
import { PollSerializer } from './serializers/poll.serializer';

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

    const polls = await this.prisma.tripPoll.findMany({
      where: { tripId, status: { not: 'cancelled' } },
      orderBy: { createdAt: 'asc' },
      include: {
        creator: { select: USER_SUMMARY_SELECT },
        options: {
          orderBy: { sortOrder: 'asc' },
          include: { votes: true },
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
   * Create a new poll (aktivitas/lainnya only — tanggal is auto-created via M4).
   * Enforces: max 1 active poll per poll_type per trip.
   * Participants only.
   */
  async createPoll(tripId: string, userId: string, dto: CreatePollDto) {
    if (!['aktivitas', 'lainnya'].includes(dto.poll_type)) {
      throw new BadRequestException({
        code: 'INVALID_POLL_TYPE',
        message: "poll_type must be 'aktivitas' or 'lainnya'",
      });
    }

    if (dto.options.length < 2 || dto.options.length > 10) {
      throw new BadRequestException({
        code: 'INVALID_OPTIONS_COUNT',
        message: 'Must provide 2–10 options',
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
      where: { tripId, pollType: dto.poll_type as 'aktivitas' | 'lainnya', status: 'active' },
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
          pollType: dto.poll_type as 'aktivitas' | 'lainnya',
          title: dto.title,
          status: 'active',
          deadline: dto.deadline ? new Date(dto.deadline) : null,
          createdBy: userId,
        },
      });

      await Promise.all(
        dto.options.map((label, idx) =>
          tx.tripPollOption.create({
            data: {
              pollId: created.id,
              label,
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
          include: { votes: true },
        },
      },
    });

    return PollSerializer.toList(full!, full!.options, full!.creator, null);
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
  async voteOnDateCandidate(
    tripId: string,
    candidateId: string,
    userId: string,
  ) {
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

    if (poll.status !== 'active') {
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

    if (poll.status !== 'active') {
      throw new BadRequestException({
        code: 'POLL_NOT_ACTIVE',
        message: 'Can only delete active polls',
      });
    }

    await this.prisma.tripPoll.delete({
      where: { id: pollId },
    });
  }
}
