import { Test, TestingModule } from '@nestjs/testing';
import { TripStartReminderService } from './trip-start-reminder.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from './notifications.service';
import { TripStatus } from '@prisma/client';
import { getReminderTargets } from './reminder-horizons';

describe('TripStartReminderService', () => {
  let service: TripStartReminderService;
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
  const START_DATE = '2026-08-02'; // 7 days after NOW

  // startTime stored as 2000-01-01T09:00:00Z (TIME column)
  const START_TIME = new Date('2000-01-01T09:00:00Z');

  const tripRow = (overrides: Record<string, any> = {}) => ({
    id: 'trip-1',
    creatorId: 'creator-1',
    status: TripStatus.fixed,
    startDate: new Date(`${START_DATE}T00:00:00.000Z`),
    startTime: START_TIME,
    isAllDay: false,
    updatedAt: NOW, // start was set "now" → anchor = now
    participants: [
      { userId: 'user-1', user: { id: 'user-1' } },
      { userId: 'user-2', user: { id: 'user-2' } },
    ],
    ...overrides,
  });

  /** Compute the trip's actual start datetime (same logic as the service). */
  const startDatetimeOf = (row: Record<string, any>): Date => {
    if (row.isAllDay) {
      return new Date(`${row.startDate.toISOString().slice(0, 10)}T00:00:00.000Z`);
    }
    const time = row.startTime.toISOString().slice(11, 16);
    return new Date(`${row.startDate.toISOString().slice(0, 10)}T${time}:00.000Z`);
  };

  /**
   * Mock `trip.findMany` so it only returns the given trip when the trip's
   * start datetime falls within the lookahead window ([now, now+30d)) —
   * mirroring the DB query. The service then decides via `dueTarget` whether
   * a reminder target falls in the current run window.
   */
  const mockTripInItsWindow = (row: Record<string, any>) => {
    mockPrismaService.trip.findMany.mockImplementation((args: any) => {
      const { gte, lt } = args.where.startDate ?? {};
      const startDatetime = startDatetimeOf(row);
      const matches =
        gte instanceof Date && lt instanceof Date && startDatetime >= gte && startDatetime < lt;
      return Promise.resolve(matches ? [row] : []);
    });
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(NOW);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TripStartReminderService,
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

    service = module.get<TripStartReminderService>(TripStartReminderService);
    prismaService = module.get<PrismaService>(PrismaService);
    notificationsService = module.get<NotificationsService>(NotificationsService);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  describe('time windows', () => {
    it('queries fixed trips with a lookahead window around now', async () => {
      mockTripInItsWindow(tripRow());

      await service.handleTripStartReminders();

      const firstCall = (prismaService.trip.findMany as jest.Mock).mock.calls[0][0];
      expect(firstCall.where).toMatchObject({
        status: TripStatus.fixed,
        deletedAt: null,
        startDate: {
          gte: NOW,
          lt: new Date(NOW.getTime() + 30 * 24 * 60 * 60 * 1000),
        },
      });
    });

    it('all-day trip: start datetime is start_date at 00:00Z', async () => {
      const row = tripRow({
        isAllDay: true,
        startTime: null,
        startDate: new Date('2026-08-02T00:00:00.000Z'),
      });
      const r1 = getReminderTargets(startDatetimeOf(row), row.updatedAt)[0];
      jest.setSystemTime(new Date(r1.at.getTime() - 30 * 60 * 1000));
      mockTripInItsWindow(row);

      await service.handleTripStartReminders();

      expect(mockNotificationsService.createManyNotifications).toHaveBeenCalledTimes(1);
      const [items] = (mockNotificationsService.createManyNotifications as jest.Mock).mock.calls[0];
      expect(items[0].payload.start_datetime).toBe('2026-08-02T00:00:00.000Z');
      expect(items[0].payload.is_all_day).toBe(true);
    });
  });

  describe('notification payload', () => {
    it('sends to all participants with r1 payload including start_datetime', async () => {
      const row = tripRow();
      const r1 = getReminderTargets(startDatetimeOf(row), row.updatedAt)[0];
      jest.setSystemTime(new Date(r1.at.getTime() - 30 * 60 * 1000));
      mockTripInItsWindow(row);
      mockNotificationsService.createManyNotifications.mockResolvedValue({ count: 2 });

      await service.handleTripStartReminders();

      expect(mockNotificationsService.createManyNotifications).toHaveBeenCalledWith([
        {
          userId: 'user-1',
          type: 'trip_start_soon',
          actorId: 'creator-1',
          tripId: 'trip-1',
          payload: {
            reminder_type: 'r1',
            start_datetime: '2026-08-02T09:00:00.000Z',
            is_all_day: false,
            start_time: '09:00',
          },
        },
        {
          userId: 'user-2',
          type: 'trip_start_soon',
          actorId: 'creator-1',
          tripId: 'trip-1',
          payload: {
            reminder_type: 'r1',
            start_datetime: '2026-08-02T09:00:00.000Z',
            is_all_day: false,
            start_time: '09:00',
          },
        },
      ]);
    });

    it('dedups users who already received this reminder type for the trip', async () => {
      const row = tripRow();
      const r1 = getReminderTargets(startDatetimeOf(row), row.updatedAt)[0];
      jest.setSystemTime(new Date(r1.at.getTime() - 30 * 60 * 1000));
      mockTripInItsWindow(row);
      mockPrismaService.notification.findMany.mockResolvedValue([
        {
          userId: 'user-2',
          payload: { reminder_type: 'r1' },
        },
      ]);
      mockNotificationsService.createManyNotifications.mockResolvedValue({ count: 1 });

      await service.handleTripStartReminders();

      expect(mockNotificationsService.createManyNotifications).toHaveBeenCalledTimes(1);
      const [items] = (mockNotificationsService.createManyNotifications as jest.Mock).mock.calls[0];
      expect(items.map((i: any) => i.userId)).toEqual(['user-1']);
    });

    it('does not send when all users already got this reminder', async () => {
      const row = tripRow();
      const r1 = getReminderTargets(startDatetimeOf(row), row.updatedAt)[0];
      jest.setSystemTime(new Date(r1.at.getTime() - 30 * 60 * 1000));
      mockTripInItsWindow(row);
      mockPrismaService.notification.findMany.mockResolvedValue([
        { userId: 'user-1', payload: { reminder_type: 'r1' } },
        { userId: 'user-2', payload: { reminder_type: 'r1' } },
      ]);

      await service.handleTripStartReminders();

      expect(mockNotificationsService.createManyNotifications).not.toHaveBeenCalled();
    });

    it('does not send when no target falls in the current run window', async () => {
      // Start 7 days away, anchor = now → targets at H-3.5d / H-5.25d — far
      // from the current 10:00 run window.
      mockTripInItsWindow(tripRow());

      await service.handleTripStartReminders();

      expect(mockNotificationsService.createManyNotifications).not.toHaveBeenCalled();
    });
  });

  describe('public interface', () => {
    it('handles database errors gracefully', async () => {
      mockPrismaService.trip.findMany.mockRejectedValue(new Error('Database error'));

      await expect(service.handleTripStartReminders()).resolves.not.toThrow();
    });
  });
});
