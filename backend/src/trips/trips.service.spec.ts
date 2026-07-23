import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { TripsService } from './trips.service';
import { PrismaService } from '../prisma/prisma.service';
import { R2Service } from '../integrations/r2/r2.service';

/**
 * Unit tests for TripsService (M4). Prisma is fully mocked; `$transaction`
 * invokes its callback with the same mock so create paths exercise the tx body.
 */
describe('TripsService', () => {
  let service: TripsService;
  let prisma: any;

  const CREATOR = 'creator-1';

  const userRow = (id: string, name = 'User', username = 'user') => ({
    id,
    name,
    username,
    avatarUrl: null,
  });

  const tripDetailRow = (overrides: Record<string, any> = {}) => ({
    id: 'trip-1',
    creatorId: CREATOR,
    name: 'Lombok Trip',
    tags: ['#pantai'],
    status: 'fixed',
    startDate: new Date('2026-06-19'),
    endDate: new Date('2026-06-22'),
    isAllDay: true,
    startTime: null,
    endTime: null,
    isPublic: false,
    coverDocumentId: null,
    coverDocument: null,
    votingDeadline: null,
    createdAt: new Date('2026-06-01'),
    updatedAt: new Date('2026-06-01'),
    creator: userRow(CREATOR, 'Creator', 'creator'),
    participants: [
      {
        userId: CREATOR,
        joinedAt: new Date('2026-06-01'),
        user: userRow(CREATOR, 'Creator', 'creator'),
      },
    ],
    invitations: [],
    dateCandidates: [],
    ...overrides,
  });

  beforeEach(async () => {
    prisma = {
      trip: {
        create: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
      },
      tripParticipant: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn(),
      },
      tripInvitation: { findMany: jest.fn() },
      tripDateCandidate: { create: jest.fn() },
      tripPoll: { create: jest.fn() },
      tripPollOption: { create: jest.fn() },
      tripDocument: { findUnique: jest.fn() },
      $transaction: jest.fn((cb: any) => cb(prisma)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TripsService,
        { provide: PrismaService, useValue: prisma },
        {
          provide: R2Service,
          useValue: {
            presignDownload: jest.fn((key: string) => `https://r2.example.com/get/${key}`),
            presignDownloads: jest.fn(
              async (keys: string[]) =>
                new Map(keys.map((key) => [key, `https://r2.example.com/get/${key}`])),
            ),
          },
        },
      ],
    }).compile();

    service = module.get<TripsService>(TripsService);
  });

  describe('createTrip — validation', () => {
    it('rejects when neither dates nor candidates provided', async () => {
      await expect(service.createTrip(CREATOR, { name: 'X', tags: [] })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('rejects fixed trip with start_date after end_date', async () => {
      await expect(
        service.createTrip(CREATOR, {
          name: 'X',
          start_date: '2026-06-22',
          end_date: '2026-06-19',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('rejects voting trip with more than 3 candidates', async () => {
      await expect(
        service.createTrip(CREATOR, {
          name: 'X',
          candidates: [
            { start_date: '2026-06-01', end_date: '2026-06-02' },
            { start_date: '2026-07-01', end_date: '2026-07-02' },
            { start_date: '2026-08-01', end_date: '2026-08-02' },
            { start_date: '2026-09-01', end_date: '2026-09-02' },
          ],
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('createTrip — fixed mode', () => {
    it('creates a fixed trip and auto-adds creator as participant', async () => {
      prisma.trip.create.mockResolvedValue({ id: 'trip-1' });
      prisma.tripParticipant.create.mockResolvedValue({});
      prisma.trip.findFirst.mockResolvedValue(tripDetailRow());

      const result = await service.createTrip(CREATOR, {
        name: 'Lombok Trip',
        tags: ['#pantai'],
        start_date: '2026-06-19',
        end_date: '2026-06-22',
      });

      expect(prisma.trip.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ creatorId: CREATOR, status: 'fixed' }),
        }),
      );
      expect(prisma.tripParticipant.create).toHaveBeenCalledWith({
        data: { tripId: 'trip-1', userId: CREATOR },
      });
      expect(result.status).toBe('fixed');
      expect(result.participant_count).toBe(1);
    });
  });

  describe('createTrip — voting mode', () => {
    it('creates candidates, an auto tanggal poll, and sets voting_deadline', async () => {
      prisma.trip.create.mockResolvedValue({ id: 'trip-1' });
      prisma.tripParticipant.create.mockResolvedValue({});
      prisma.tripDateCandidate.create
        .mockResolvedValueOnce({
          id: 'c1',
          startDate: new Date('2026-08-01'),
          endDate: new Date('2026-08-05'),
        })
        .mockResolvedValueOnce({
          id: 'c2',
          startDate: new Date('2026-09-01'),
          endDate: new Date('2026-09-05'),
        });
      prisma.tripPoll.create.mockResolvedValue({ id: 'poll-1' });
      prisma.tripPollOption.create.mockResolvedValue({});
      prisma.trip.update.mockResolvedValue({ id: 'trip-1' });
      prisma.trip.findFirst.mockResolvedValue(
        tripDetailRow({ status: 'voting_pending', votingDeadline: new Date('2026-07-20') }),
      );

      const result = await service.createTrip(CREATOR, {
        name: 'Voting Trip',
        candidates: [
          { start_date: '2026-08-01', end_date: '2026-08-05' },
          { start_date: '2026-09-01', end_date: '2026-09-05' },
        ],
      });

      expect(prisma.tripPoll.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ pollType: 'tanggal', status: 'active' }),
        }),
      );
      expect(prisma.tripPollOption.create).toHaveBeenCalledTimes(2);
      expect(prisma.trip.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ votingDeadline: expect.any(Date) }),
        }),
      );
      expect(result.status).toBe('voting_pending');
      expect(result.voting_deadline).toBeTruthy();
    });
  });

  describe('listTrips', () => {
    it('returns enriched cards with next_cursor null when no more pages', async () => {
      prisma.trip.findMany.mockResolvedValue([
        {
          ...tripDetailRow(),
          coverDocument: null,
          _count: { participants: 1 },
        },
      ]);

      const result = await service.listTrips(CREATOR, 'upcoming', undefined, 20);

      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toHaveProperty('participant_count', 1);
      expect(result.data[0]).toHaveProperty('cover_image_url', null);
      expect(result.next_cursor).toBeNull();
    });

    it('sets next_cursor when there are more results', async () => {
      const rows = Array.from({ length: 21 }, (_, i) => ({
        ...tripDetailRow({ id: `trip-${i}` }),
        coverDocument: null,
        _count: { participants: 1 },
      }));
      prisma.trip.findMany.mockResolvedValue(rows);

      const result = await service.listTrips(CREATOR, 'upcoming', undefined, 20);

      expect(result.data).toHaveLength(20);
      expect(result.next_cursor).toBe('trip-19');
    });
  });

  describe('getTripDetail', () => {
    it('returns detail for the creator', async () => {
      prisma.trip.findFirst.mockResolvedValue(tripDetailRow());
      const result = await service.getTripDetail('trip-1', CREATOR);
      expect(result.id).toBe('trip-1');
      expect(result.creator.username).toBe('creator');
    });

    it('throws NotFound when trip missing', async () => {
      prisma.trip.findFirst.mockResolvedValue(null);
      await expect(service.getTripDetail('nope', CREATOR)).rejects.toThrow(NotFoundException);
    });

    it('throws Forbidden for an unrelated user', async () => {
      prisma.trip.findFirst.mockResolvedValue(tripDetailRow());
      await expect(service.getTripDetail('trip-1', 'stranger')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('updateTrip', () => {
    it('throws Forbidden when not creator', async () => {
      prisma.trip.findFirst.mockResolvedValue({ id: 'trip-1', creatorId: 'other' });
      await expect(service.updateTrip('trip-1', CREATOR, { name: 'x' })).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('throws NotFound when trip missing', async () => {
      prisma.trip.findFirst.mockResolvedValue(null);
      await expect(service.updateTrip('trip-1', CREATOR, { name: 'x' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteTrip', () => {
    it('soft-deletes for the creator', async () => {
      prisma.trip.findFirst.mockResolvedValue({ id: 'trip-1', creatorId: CREATOR });
      prisma.trip.update.mockResolvedValue({});
      await service.deleteTrip('trip-1', CREATOR);
      expect(prisma.trip.update).toHaveBeenCalledWith({
        where: { id: 'trip-1' },
        data: { deletedAt: expect.any(Date) },
      });
    });

    it('throws Forbidden when not creator', async () => {
      prisma.trip.findFirst.mockResolvedValue({ id: 'trip-1', creatorId: 'other' });
      await expect(service.deleteTrip('trip-1', CREATOR)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getTripMembers', () => {
    it('returns members + outstanding invitations for a member', async () => {
      prisma.trip.findFirst.mockResolvedValue({ id: 'trip-1', creatorId: CREATOR });
      prisma.tripParticipant.findMany.mockResolvedValue([
        {
          userId: CREATOR,
          joinedAt: new Date('2026-06-01'),
          user: userRow(CREATOR, 'Creator', 'creator'),
        },
        {
          userId: 'm2',
          joinedAt: new Date('2026-06-02'),
          user: userRow('m2', 'Member Two', 'member2'),
        },
      ]);
      prisma.tripInvitation.findMany.mockResolvedValue([
        {
          id: 'inv-p',
          tripId: 'trip-1',
          invitedBy: CREATOR,
          invitedUserId: 'u3',
          invitedEmail: null,
          method: 'username',
          status: 'pending',
          createdAt: new Date('2026-06-03'),
          updatedAt: new Date('2026-06-03'),
          invitedUser: userRow('u3', 'User Three', 'user3'),
        },
        {
          id: 'inv-e',
          tripId: 'trip-1',
          invitedBy: CREATOR,
          invitedUserId: null,
          invitedEmail: 'friend@example.com',
          method: 'email',
          status: 'pending',
          createdAt: new Date('2026-06-04'),
          updatedAt: new Date('2026-06-04'),
          invitedUser: null,
        },
        {
          id: 'inv-r',
          tripId: 'trip-1',
          invitedBy: CREATOR,
          invitedUserId: 'u4',
          invitedEmail: null,
          method: 'username',
          status: 'declined',
          createdAt: new Date('2026-06-05'),
          updatedAt: new Date('2026-06-05'),
          invitedUser: userRow('u4', 'User Four', 'user4'),
        },
      ]);

      const result = await service.getTripMembers('trip-1', CREATOR);

      expect(result.is_creator).toBe(true);
      expect(result.members).toHaveLength(2);
      expect(result.members[0].role).toBe('creator');
      expect(result.invitations).toHaveLength(3);
      expect(result.invitations.map((i: any) => i.state)).toEqual([
        'pending_accept',
        'email_sent',
        'rejected',
      ]);
      expect(result.invitations[0].invited_user?.username).toBe('user3');
      expect(result.invitations[1].invited_email).toBe('friend@example.com');
    });

    it('throws Forbidden for a non-member', async () => {
      prisma.trip.findFirst.mockResolvedValue({ id: 'trip-1', creatorId: CREATOR });
      prisma.tripParticipant.findMany.mockResolvedValue([
        { userId: CREATOR, joinedAt: new Date(), user: userRow(CREATOR) },
      ]);
      await expect(service.getTripMembers('trip-1', 'stranger')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('throws NotFound when trip missing', async () => {
      prisma.trip.findFirst.mockResolvedValue(null);
      await expect(service.getTripMembers('nope', CREATOR)).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeMember', () => {
    it('removes a member for the creator', async () => {
      prisma.trip.findFirst.mockResolvedValue({ id: 'trip-1', creatorId: CREATOR });
      prisma.tripParticipant.findUnique.mockResolvedValue({ tripId: 'trip-1', userId: 'm2' });
      prisma.tripParticipant.delete.mockResolvedValue({});
      await service.removeMember('trip-1', 'm2', CREATOR);
      expect(prisma.tripParticipant.delete).toHaveBeenCalledWith({
        where: { tripId_userId: { tripId: 'trip-1', userId: 'm2' } },
      });
    });

    it('rejects removing the creator', async () => {
      prisma.trip.findFirst.mockResolvedValue({ id: 'trip-1', creatorId: CREATOR });
      await expect(service.removeMember('trip-1', CREATOR, CREATOR)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throws Forbidden when caller is not creator', async () => {
      prisma.trip.findFirst.mockResolvedValue({ id: 'trip-1', creatorId: 'other' });
      await expect(service.removeMember('trip-1', 'm2', CREATOR)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('setTripCover', () => {
    it('sets cover when document belongs to the trip', async () => {
      prisma.trip.findFirst
        .mockResolvedValueOnce({ id: 'trip-1', creatorId: CREATOR }) // assertCreator
        .mockResolvedValueOnce(tripDetailRow()); // getTripDetail
      prisma.tripDocument.findUnique.mockResolvedValue({ id: 'doc-1', tripId: 'trip-1' });
      prisma.trip.update.mockResolvedValue({});

      const result = await service.setTripCover('trip-1', CREATOR, 'doc-1');
      expect(prisma.trip.update).toHaveBeenCalledWith({
        where: { id: 'trip-1' },
        data: { coverDocumentId: 'doc-1' },
      });
      expect(result.id).toBe('trip-1');
    });

    it('throws NotFound when document not in trip', async () => {
      prisma.trip.findFirst.mockResolvedValue({ id: 'trip-1', creatorId: CREATOR });
      prisma.tripDocument.findUnique.mockResolvedValue({ id: 'doc-1', tripId: 'other-trip' });
      await expect(service.setTripCover('trip-1', CREATOR, 'doc-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
