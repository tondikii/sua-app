import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { VotingService } from './voting.service';
import { PrismaService } from '../prisma/prisma.service';

describe('VotingService', () => {
  let service: VotingService;
  let prisma: any;

  const CREATOR = 'creator-1';
  const PARTICIPANT = 'participant-1';
  const TRIP = 'trip-1';

  const userRow = (id: string, name = 'User', username = 'user') => ({
    id,
    name,
    username,
    avatarUrl: null,
  });

  beforeEach(async () => {
    prisma = {
      trip: { findFirst: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
      tripPoll: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
      tripPollOption: { findMany: jest.fn(), findFirst: jest.fn(), create: jest.fn() },
      tripPollVote: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
      },
      tripParticipant: { findUnique: jest.fn() },
      tripDateCandidate: { findFirst: jest.fn(), findUnique: jest.fn() },
      tripDateVote: {
        findUnique: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
      },
      tripActivity: { count: jest.fn().mockResolvedValue(0), create: jest.fn() },
      $transaction: jest.fn((cb: any) => cb(prisma)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [VotingService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<VotingService>(VotingService);
  });

  describe('listPolls', () => {
    it('returns all polls with vote tallies for a participant', async () => {
      prisma.trip.findFirst.mockResolvedValue({ id: TRIP, creatorId: CREATOR });
      prisma.tripParticipant.findUnique.mockResolvedValue({ tripId: TRIP, userId: PARTICIPANT });
      prisma.tripPoll.findMany.mockResolvedValue([
        {
          id: 'poll-1',
          tripId: TRIP,
          pollType: 'aktivitas',
          title: 'Aktivitas Vote',
          status: 'active',
          deadline: null,
          lockedAt: null,
          createdBy: CREATOR,
          createdAt: new Date(),
          creator: userRow(CREATOR),
          options: [
            {
              id: 'opt-1',
              pollId: 'poll-1',
              label: 'Hiking',
              sortOrder: 0,
              candidateId: null,
              votes: [{ userId: PARTICIPANT }],
            },
            {
              id: 'opt-2',
              pollId: 'poll-1',
              label: 'Swimming',
              sortOrder: 1,
              candidateId: null,
              votes: [],
            },
          ],
        },
      ]);
      prisma.tripPollVote.findFirst.mockResolvedValue({
        pollId: 'poll-1',
        optionId: 'opt-1',
        userId: PARTICIPANT,
      });

      const result = await service.listPolls(TRIP, PARTICIPANT);

      expect(result.data).toHaveLength(1);
      expect(result.data[0].title).toBe('Aktivitas Vote');
      expect(result.data[0].options).toHaveLength(2);
      expect(result.data[0].options[0].vote_count).toBe(1);
      expect(result.data[0].voted_option_id).toBe('opt-1');
    });

    it('throws Forbidden for non-participant', async () => {
      prisma.trip.findFirst.mockResolvedValue({ id: TRIP, creatorId: CREATOR });
      prisma.tripParticipant.findUnique.mockResolvedValue(null);
      await expect(service.listPolls(TRIP, 'stranger')).rejects.toThrow(ForbiddenException);
    });

    it('throws NotFound when trip missing', async () => {
      prisma.trip.findFirst.mockResolvedValue(null);
      await expect(service.listPolls(TRIP, PARTICIPANT)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createPoll', () => {
    beforeEach(() => {
      prisma.trip.findFirst.mockResolvedValue({
        id: TRIP,
        creatorId: CREATOR,
        participants: [{ userId: CREATOR }, { userId: PARTICIPANT }],
      });
    });

    it('creates an aktivitas poll with options', async () => {
      prisma.tripPoll.findFirst.mockResolvedValue(null);

      // Mock the transaction to execute the callback
      const mockTx = {
        tripPoll: {
          create: jest.fn().mockResolvedValue({
            id: 'poll-1',
            tripId: TRIP,
            pollType: 'aktivitas',
            createdBy: CREATOR,
            createdAt: new Date(),
          }),
        },
        tripPollOption: { create: jest.fn().mockResolvedValue({}) },
      };
      prisma.$transaction.mockImplementation((cb: any) => cb(mockTx));

      prisma.tripPoll.findUnique.mockResolvedValue({
        id: 'poll-1',
        tripId: TRIP,
        pollType: 'aktivitas',
        title: 'Best Activity',
        status: 'active',
        deadline: null,
        lockedAt: null,
        createdBy: CREATOR,
        createdAt: new Date(),
        creator: userRow(CREATOR),
        options: [
          {
            id: 'opt-1',
            pollId: 'poll-1',
            label: 'Hiking',
            sortOrder: 0,
            candidateId: null,
            votes: [],
          },
          {
            id: 'opt-2',
            pollId: 'poll-1',
            label: 'Swimming',
            sortOrder: 1,
            candidateId: null,
            votes: [],
          },
        ],
      });

      const result = await service.createPoll(TRIP, CREATOR, {
        title: 'Best Activity',
        poll_type: 'aktivitas',
        options: ['Hiking', 'Swimming'],
      });

      expect(result.title).toBe('Best Activity');
      expect(result.poll_type).toBe('aktivitas');
      expect(result.options).toHaveLength(2);
    });

    it('creates a tanggal poll (re-created after previous ended)', async () => {
      prisma.trip.findFirst.mockResolvedValue({
        id: TRIP,
        creatorId: CREATOR,
        participants: [{ userId: CREATOR }],
      });
      prisma.tripPoll.findFirst.mockResolvedValue(null);
      prisma.tripPoll.create.mockResolvedValue({
        id: 'poll-tanggal',
        tripId: TRIP,
        pollType: 'tanggal',
        status: 'active',
      });
      prisma.tripPoll.findUnique.mockResolvedValue({
        id: 'poll-tanggal',
        tripId: TRIP,
        pollType: 'tanggal',
        title: 'Date Poll',
        status: 'active',
        deadline: null,
        lockedAt: null,
        createdBy: CREATOR,
        createdAt: new Date(),
        creator: userRow(CREATOR),
        options: [
          {
            id: 'opt-1',
            pollId: 'poll-tanggal',
            label: '19 Jun 2027',
            sortOrder: 0,
            candidateId: null,
            votes: [],
          },
          {
            id: 'opt-2',
            pollId: 'poll-tanggal',
            label: '01 Jul 2027',
            sortOrder: 1,
            candidateId: null,
            votes: [],
          },
        ],
      });

      const result = await service.createPoll(TRIP, CREATOR, {
        title: 'Date Poll',
        poll_type: 'tanggal',
        options: ['19 Jun 2027', '01 Jul 2027'],
      });

      expect(result.poll_type).toBe('tanggal');
      expect(result.options).toHaveLength(2);
    });

    it('rejects when active poll exists for same poll_type', async () => {
      prisma.tripPoll.findFirst.mockResolvedValue({
        id: 'poll-1',
        pollType: 'aktivitas',
        status: 'active',
      });
      await expect(
        service.createPoll(TRIP, CREATOR, {
          title: 'Another Activity Poll',
          poll_type: 'aktivitas',
          options: ['A', 'B'],
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('rejects empty options', async () => {
      await expect(
        service.createPoll(TRIP, CREATOR, {
          title: 'Bad Poll',
          poll_type: 'aktivitas',
          options: [],
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('voteOnPoll', () => {
    beforeEach(() => {
      prisma.tripPoll.findFirst.mockResolvedValue({
        id: 'poll-1',
        tripId: TRIP,
        status: 'active',
      });
      prisma.tripParticipant.findUnique.mockResolvedValue({ tripId: TRIP, userId: PARTICIPANT });
      prisma.tripPollOption.findFirst.mockResolvedValue({ id: 'opt-1', pollId: 'poll-1' });
    });

    it('votes on a poll option', async () => {
      prisma.tripPollVote.findFirst.mockResolvedValue(null);

      await service.voteOnPoll(TRIP, 'poll-1', PARTICIPANT, 'opt-1');

      expect(prisma.tripPollVote.create).toHaveBeenCalled();
    });

    it('replaces vote when voting again', async () => {
      prisma.tripPollVote.findFirst.mockResolvedValue({
        pollId: 'poll-1',
        userId: PARTICIPANT,
        optionId: 'opt-2',
      });

      await service.voteOnPoll(TRIP, 'poll-1', PARTICIPANT, 'opt-1');

      expect(prisma.tripPollVote.delete).toHaveBeenCalled();
      expect(prisma.tripPollVote.create).toHaveBeenCalled();
    });

    it('no-op when voting for same option', async () => {
      prisma.tripPollVote.findFirst.mockResolvedValue({
        pollId: 'poll-1',
        userId: PARTICIPANT,
        optionId: 'opt-1',
      });

      await service.voteOnPoll(TRIP, 'poll-1', PARTICIPANT, 'opt-1');

      expect(prisma.tripPollVote.delete).not.toHaveBeenCalled();
      expect(prisma.tripPollVote.create).not.toHaveBeenCalled();
    });

    it('rejects voting on non-active poll', async () => {
      prisma.tripPoll.findFirst.mockResolvedValue({
        id: 'poll-1',
        tripId: TRIP,
        status: 'locked',
      });
      await expect(service.voteOnPoll(TRIP, 'poll-1', PARTICIPANT, 'opt-1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('lockPoll', () => {
    it('locks a tanggal poll and updates trip dates', async () => {
      prisma.tripPoll.findFirst.mockResolvedValue({
        id: 'poll-1',
        tripId: TRIP,
        pollType: 'tanggal',
        status: 'active',
      });
      prisma.trip.findUnique.mockResolvedValue({ id: TRIP, creatorId: CREATOR });
      prisma.tripPollOption.findMany.mockResolvedValue([
        {
          id: 'opt-1',
          pollId: 'poll-1',
          label: 'June 19-22',
          sortOrder: 0,
          candidateId: 'cand-1',
          votes: [{ userId: PARTICIPANT }],
        },
        {
          id: 'opt-2',
          pollId: 'poll-1',
          label: 'July 1-5',
          sortOrder: 1,
          candidateId: 'cand-2',
          votes: [],
        },
      ]);
      prisma.tripDateCandidate.findUnique.mockResolvedValue({
        id: 'cand-1',
        startDate: new Date('2027-06-19'),
        endDate: new Date('2027-06-22'),
      });

      await service.lockPoll(TRIP, 'poll-1', CREATOR);

      expect(prisma.trip.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: TRIP },
          data: expect.objectContaining({
            status: 'fixed',
            votingDeadline: null,
          }),
        }),
      );
    });

    it('rejects lock by non-creator', async () => {
      prisma.tripPoll.findFirst.mockResolvedValue({ id: 'poll-1', tripId: TRIP, status: 'active' });
      prisma.trip.findUnique.mockResolvedValue({ id: TRIP, creatorId: CREATOR });
      await expect(service.lockPoll(TRIP, 'poll-1', PARTICIPANT)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('locks an aktivitas poll and seeds the winning option into the itinerary', async () => {
      prisma.tripPoll.findFirst.mockResolvedValue({
        id: 'poll-1',
        tripId: TRIP,
        pollType: 'aktivitas',
        status: 'active',
      });
      prisma.trip.findUnique.mockResolvedValue({
        id: TRIP,
        creatorId: CREATOR,
        status: 'fixed',
        startDate: new Date('2027-06-19'),
      });
      prisma.tripPollOption.findMany.mockResolvedValue([
        {
          id: 'opt-1',
          pollId: 'poll-1',
          label: 'Hiking',
          sortOrder: 0,
          candidateId: null,
          votes: [],
        },
        {
          id: 'opt-2',
          pollId: 'poll-1',
          label: 'Swimming',
          sortOrder: 1,
          candidateId: null,
          votes: [{ userId: PARTICIPANT }],
        },
      ]);

      await service.lockPoll(TRIP, 'poll-1', CREATOR);

      expect(prisma.tripPoll.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'poll-1' },
          data: expect.objectContaining({ status: 'locked' }),
        }),
      );
      expect(prisma.tripActivity.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            tripId: TRIP,
            placeName: 'Swimming',
            kind: 'activity',
            activityDate: new Date('2027-06-19'),
          }),
        }),
      );
    });

    it('locks a lainnya poll without creating an activity', async () => {
      prisma.tripPoll.findFirst.mockResolvedValue({
        id: 'poll-9',
        tripId: TRIP,
        pollType: 'lainnya',
        status: 'active',
      });
      prisma.trip.findUnique.mockResolvedValue({ id: TRIP, creatorId: CREATOR, status: 'fixed' });

      await service.lockPoll(TRIP, 'poll-9', CREATOR);

      expect(prisma.tripActivity.create).not.toHaveBeenCalled();
      expect(prisma.tripPoll.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'poll-9' },
          data: expect.objectContaining({ status: 'locked' }),
        }),
      );
    });
  });

  describe('voteOnDateCandidate', () => {
    it('votes on a date candidate', async () => {
      prisma.tripDateCandidate.findFirst.mockResolvedValue({ id: 'cand-1', tripId: TRIP });
      prisma.tripParticipant.findUnique.mockResolvedValue({ tripId: TRIP, userId: PARTICIPANT });
      prisma.tripDateVote.findUnique.mockResolvedValue(null);

      await service.voteOnDateCandidate(TRIP, 'cand-1', PARTICIPANT);

      expect(prisma.tripDateVote.create).toHaveBeenCalled();
    });

    it('no-op when already voted', async () => {
      prisma.tripDateCandidate.findFirst.mockResolvedValue({ id: 'cand-1', tripId: TRIP });
      prisma.tripParticipant.findUnique.mockResolvedValue({ tripId: TRIP, userId: PARTICIPANT });
      prisma.tripDateVote.findUnique.mockResolvedValue({
        candidateId: 'cand-1',
        userId: PARTICIPANT,
      });

      await service.voteOnDateCandidate(TRIP, 'cand-1', PARTICIPANT);

      expect(prisma.tripDateVote.create).not.toHaveBeenCalled();
    });
  });

  describe('deletePoll', () => {
    it('deletes an active poll (creator only)', async () => {
      prisma.tripPoll.findFirst.mockResolvedValue({
        id: 'poll-1',
        tripId: TRIP,
        status: 'active',
      });
      prisma.trip.findUnique.mockResolvedValue({ id: TRIP, creatorId: CREATOR });

      await service.deletePoll(TRIP, 'poll-1', CREATOR);

      expect(prisma.tripPoll.delete).toHaveBeenCalledWith({ where: { id: 'poll-1' } });
    });

    it('rejects delete of non-active poll', async () => {
      prisma.tripPoll.findFirst.mockResolvedValue({
        id: 'poll-1',
        tripId: TRIP,
        status: 'locked',
      });
      prisma.trip.findUnique.mockResolvedValue({ id: TRIP, creatorId: CREATOR });

      await expect(service.deletePoll(TRIP, 'poll-1', CREATOR)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
