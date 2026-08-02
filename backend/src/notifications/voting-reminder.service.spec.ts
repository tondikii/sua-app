import { Test, TestingModule } from '@nestjs/testing';
import { VotingReminderService } from './voting-reminder.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from './notifications.service';
import { TripStatus } from '@prisma/client';

describe('VotingReminderService', () => {
  let service: VotingReminderService;
  let prismaService: PrismaService;
  let notificationsService: NotificationsService;

  const mockPrismaService = {
    trip: {
      findMany: jest.fn(),
    },
    notification: {
      findMany: jest.fn().mockResolvedValue([]),
    },
  };

  const mockNotificationsService = {
    createManyNotifications: jest.fn(),
  };

  const NOW = new Date('2026-07-26T10:00:00Z');

  const tripRow = (overrides: Record<string, any> = {}) => ({
    id: 'trip-1',
    creatorId: 'creator-1',
    votingDeadline: new Date(NOW.getTime() + 7 * 24 * 60 * 60 * 1000),
    status: TripStatus.voting_pending,
    participants: [
      { userId: 'user-1', user: { id: 'user-1' } }, // Has voted
      { userId: 'user-2', user: { id: 'user-2' } }, // Has not voted
    ],
    dateCandidates: [{ votes: [{ userId: 'user-1' }] }],
    polls: [{ id: 'poll-1' }],
    ...overrides,
  });

  /**
   * Mock `trip.findMany` so it only returns the given trip when the window
   * filter supplied by the service actually matches the trip's deadline —
   * mirroring what the database would do. The service runs three windows
   * (H-7d, H-1d, H-1h) per `handleVotingReminders()` call.
   */
  const mockTripInItsWindow = (row: Record<string, any>) => {
    mockPrismaService.trip.findMany.mockImplementation((args: any) => {
      const { gte, lt } = args.where.votingDeadline ?? {};
      const deadline = new Date(row.votingDeadline).getTime();
      const matches =
        gte instanceof Date && lt instanceof Date && deadline >= gte.getTime() && deadline < lt.getTime();
      return Promise.resolve(matches ? [row] : []);
    });
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(NOW);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VotingReminderService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: NotificationsService,
          useValue: mockNotificationsService,
        },
      ],
    }).compile();

    service = module.get<VotingReminderService>(VotingReminderService);
    prismaService = module.get<PrismaService>(PrismaService);
    notificationsService = module.get<NotificationsService>(NotificationsService);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  describe('time windows', () => {
    it('H-7d: filters voting_deadline in [now+7d, now+7d+1h)', async () => {
      mockTripInItsWindow(tripRow());

      await service.handleVotingReminders();

      const windowStart = new Date(NOW.getTime() + 7 * 24 * 60 * 60 * 1000);
      const windowEnd = new Date(windowStart.getTime() + 60 * 60 * 1000);
      const firstCall = (prismaService.trip.findMany as jest.Mock).mock.calls[0][0];
      expect(firstCall.where).toMatchObject({
        status: TripStatus.voting_pending,
        deletedAt: null,
        votingDeadline: { gte: windowStart, lt: windowEnd },
      });
    });

    it('H-1d: filters voting_deadline in [now+1d, now+1d+1h)', async () => {
      mockTripInItsWindow(
        tripRow({
          id: 'trip-2',
          votingDeadline: new Date(NOW.getTime() + 24 * 60 * 60 * 1000),
        }),
      );

      await service.handleVotingReminders();

      const windowStart = new Date(NOW.getTime() + 24 * 60 * 60 * 1000);
      const windowEnd = new Date(windowStart.getTime() + 60 * 60 * 1000);
      const secondCall = (prismaService.trip.findMany as jest.Mock).mock.calls[1][0];
      expect(secondCall.where).toMatchObject({
        votingDeadline: { gte: windowStart, lt: windowEnd },
      });
    });

    it('H-1h: filters voting_deadline in [now+1h, now+2h)', async () => {
      mockTripInItsWindow(
        tripRow({
          id: 'trip-3',
          votingDeadline: new Date(NOW.getTime() + 60 * 60 * 1000),
        }),
      );

      await service.handleVotingReminders();

      const windowStart = new Date(NOW.getTime() + 60 * 60 * 1000);
      const windowEnd = new Date(windowStart.getTime() + 60 * 60 * 1000);
      const thirdCall = (prismaService.trip.findMany as jest.Mock).mock.calls[2][0];
      expect(thirdCall.where).toMatchObject({
        votingDeadline: { gte: windowStart, lt: windowEnd },
      });
    });
  });

  describe('recipient selection', () => {
    it('sends to participants who have not voted, with poll_type + poll_id payload', async () => {
      mockTripInItsWindow(tripRow());
      mockNotificationsService.createManyNotifications.mockResolvedValue({ count: 1 });

      await service.handleVotingReminders();

      expect(mockNotificationsService.createManyNotifications).toHaveBeenCalledWith([
        {
          userId: 'user-2',
          type: 'voting_deadline',
          actorId: 'creator-1',
          tripId: 'trip-1',
          payload: {
            reminder_type: '7_days_before',
            voting_deadline: expect.any(String),
            poll_type: 'tanggal',
            poll_id: 'poll-1',
          },
        },
      ]);
    });

    it('does not send when all participants have voted', async () => {
      mockTripInItsWindow(
        tripRow({
          participants: [
            { userId: 'user-1', user: { id: 'user-1' } },
            { userId: 'user-2', user: { id: 'user-2' } },
          ],
          dateCandidates: [{ votes: [{ userId: 'user-1' }, { userId: 'user-2' }] }],
        }),
      );

      await service.handleVotingReminders();

      expect(mockNotificationsService.createManyNotifications).not.toHaveBeenCalled();
    });

    it('does not send for trips that are not voting_pending', async () => {
      // DB filters status=voting_pending itself — a fixed trip never matches.
      mockPrismaService.trip.findMany.mockResolvedValue([]);

      await service.handleVotingReminders();

      expect(mockNotificationsService.createManyNotifications).not.toHaveBeenCalled();
    });

    it('dedups users who already received this reminder window for the trip', async () => {
      mockTripInItsWindow(tripRow());
      // user-2 already received the 7_days_before reminder.
      mockPrismaService.notification.findMany.mockResolvedValue([
        {
          userId: 'user-2',
          payload: { reminder_type: '7_days_before' },
        },
      ]);

      await service.handleVotingReminders();

      expect(mockNotificationsService.createManyNotifications).not.toHaveBeenCalled();
    });

    it('does not dedup users whose reminder_type differs', async () => {
      mockTripInItsWindow(tripRow());
      // user-2 received a different reminder window (1_day_before) — still notify.
      mockPrismaService.notification.findMany.mockResolvedValue([
        {
          userId: 'user-2',
          payload: { reminder_type: '1_day_before' },
        },
      ]);
      mockNotificationsService.createManyNotifications.mockResolvedValue({ count: 1 });

      await service.handleVotingReminders();

      expect(mockNotificationsService.createManyNotifications).toHaveBeenCalledTimes(1);
    });
  });

  describe('public interface', () => {
    it('handles database errors gracefully', async () => {
      mockPrismaService.trip.findMany.mockRejectedValue(new Error('Database error'));

      await expect(service.handleVotingReminders()).resolves.not.toThrow();
    });
  });
});
