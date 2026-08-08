import { Test, TestingModule } from '@nestjs/testing';
import { VotingReminderService } from './voting-reminder.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from './notifications.service';
import { TripStatus } from '@prisma/client';
import { getReminderTargets } from './reminder-horizons';

describe('VotingReminderService', () => {
  let service: VotingReminderService;
  let prismaService: PrismaService;

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
    updatedAt: NOW, // deadline was set "now" → anchor = now
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
   * Mock `trip.findMany` so it only returns the given trip when the trip's
   * deadline falls within the lookahead window ([now, now+30d)) — mirroring
   * the DB query. The service then decides via `dueTarget` whether a
   * reminder target falls in the current run window.
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
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  describe('time windows', () => {
    it('queries voting_pending trips with a lookahead window around now', async () => {
      mockTripInItsWindow(tripRow());

      await service.handleVotingReminders();

      const firstCall = (prismaService.trip.findMany as jest.Mock).mock.calls[0][0];
      expect(firstCall.where).toMatchObject({
        status: TripStatus.voting_pending,
        deletedAt: null,
        votingDeadline: {
          gte: NOW,
          lt: new Date(NOW.getTime() + 30 * 24 * 60 * 60 * 1000),
        },
      });
    });

    it('fires R1 when its target falls within the run window (50% of gap)', async () => {
      // Deadline 7 days away, anchor = now → R1 target = now+3.5d.
      const row = tripRow({
        votingDeadline: new Date(NOW.getTime() + 7 * 24 * 60 * 60 * 1000),
        updatedAt: NOW,
      });
      // Run the cron when the R1 target falls within the next hour.
      const r1 = getReminderTargets(row.votingDeadline, row.updatedAt)[0];
      const runAt = new Date(r1.at.getTime() - 30 * 60 * 1000);
      jest.setSystemTime(runAt);
      mockTripInItsWindow(row);

      await service.handleVotingReminders();

      expect(mockNotificationsService.createManyNotifications).toHaveBeenCalledTimes(1);
      const [items] = (mockNotificationsService.createManyNotifications as jest.Mock).mock.calls[0];
      expect(items[0].payload.reminder_type).toBe('r1');
    });

    it('does not fire when no target falls in the current run window', async () => {
      // Deadline 7 days away, anchor = now → targets at now+3.5d and now+5.25d.
      // Now is 10:00; targets are far in the future → no reminder.
      mockTripInItsWindow(tripRow());

      await service.handleVotingReminders();

      expect(mockNotificationsService.createManyNotifications).not.toHaveBeenCalled();
    });
  });

  describe('recipient selection', () => {
    it('sends to participants who have not voted, with poll_type + poll_id payload', async () => {
      const row = tripRow();
      const r1 = getReminderTargets(row.votingDeadline, row.updatedAt)[0];
      jest.setSystemTime(new Date(r1.at.getTime() - 30 * 60 * 1000));
      mockTripInItsWindow(row);
      mockNotificationsService.createManyNotifications.mockResolvedValue({ count: 1 });

      await service.handleVotingReminders();

      expect(mockNotificationsService.createManyNotifications).toHaveBeenCalledWith([
        {
          userId: 'user-2',
          type: 'voting_deadline',
          actorId: 'creator-1',
          tripId: 'trip-1',
          payload: {
            reminder_type: 'r1',
            voting_deadline: expect.any(String),
            poll_type: 'tanggal',
            poll_id: 'poll-1',
          },
        },
      ]);
    });

    it('does not send when all participants have voted', async () => {
      const row = tripRow({
        participants: [
          { userId: 'user-1', user: { id: 'user-1' } },
          { userId: 'user-2', user: { id: 'user-2' } },
        ],
        dateCandidates: [{ votes: [{ userId: 'user-1' }, { userId: 'user-2' }] }],
      });
      const r1 = getReminderTargets(row.votingDeadline, row.updatedAt)[0];
      jest.setSystemTime(new Date(r1.at.getTime() - 30 * 60 * 1000));
      mockTripInItsWindow(row);

      await service.handleVotingReminders();

      expect(mockNotificationsService.createManyNotifications).not.toHaveBeenCalled();
    });

    it('does not send for trips that are not voting_pending', async () => {
      // DB filters status=voting_pending itself — a fixed trip never matches.
      mockPrismaService.trip.findMany.mockResolvedValue([]);

      await service.handleVotingReminders();

      expect(mockNotificationsService.createManyNotifications).not.toHaveBeenCalled();
    });

    it('dedups users who already received this reminder type for the trip', async () => {
      const row = tripRow();
      const r1 = getReminderTargets(row.votingDeadline, row.updatedAt)[0];
      jest.setSystemTime(new Date(r1.at.getTime() - 30 * 60 * 1000));
      mockTripInItsWindow(row);
      // user-2 already received the r1 reminder.
      mockPrismaService.notification.findMany.mockResolvedValue([
        {
          userId: 'user-2',
          payload: { reminder_type: 'r1' },
        },
      ]);

      await service.handleVotingReminders();

      expect(mockNotificationsService.createManyNotifications).not.toHaveBeenCalled();
    });

    it('does not dedup users whose reminder_type differs', async () => {
      const row = tripRow();
      const r1 = getReminderTargets(row.votingDeadline, row.updatedAt)[0];
      jest.setSystemTime(new Date(r1.at.getTime() - 30 * 60 * 1000));
      mockTripInItsWindow(row);
      // user-2 received a different reminder (r2) — still notify r1.
      mockPrismaService.notification.findMany.mockResolvedValue([
        {
          userId: 'user-2',
          payload: { reminder_type: 'r2' },
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
