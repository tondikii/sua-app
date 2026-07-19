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
  };

  const mockNotificationsService = {
    createNotification: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

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

    // Mock Date.now to ensure consistent test results
    jest.spyOn(Date, 'now').mockReturnValue(new Date('2026-07-26T10:00:00Z').getTime());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('7 days before deadline reminders', () => {
    beforeEach(() => {
      // Clear previous calls and mock empty results for other time windows
      mockPrismaService.trip.findMany.mockImplementation(({ where }) => {
        // Return trips only for 7-day window, empty for others
        if (where?.votingDeadline?.gte?.getTime && where.votingDeadline.gte.getTime() > Date.now() + 6 * 24 * 60 * 60 * 1000) {
          return Promise.resolve([
            {
              id: 'trip-1',
              creatorId: 'creator-1',
              votingDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              status: TripStatus.voting_pending,
              participants: [
                { userId: 'user-1' }, // Has voted
                { userId: 'user-2' }, // Has not voted
                { userId: 'user-3' }, // Has not voted
              ],
              dateCandidates: [
                {
                  votes: [{ userId: 'user-1' }], // Only user-1 has voted
                },
              ],
            },
          ]);
        }
        return Promise.resolve([]);
      });
    });

    it('should send reminders for trips with voting deadline exactly 7 days from now', async () => {
      await service.handleVotingReminders();

      // Should send notifications only to users who haven't voted (user-2, user-3)
      expect(mockNotificationsService.createNotification).toHaveBeenCalledTimes(2);
      expect(mockNotificationsService.createNotification).toHaveBeenCalledWith({
        userId: 'user-2',
        type: 'voting_deadline',
        actorId: 'creator-1',
        tripId: 'trip-1',
        payload: {
          reminder_type: '7_days_before',
          voting_deadline: expect.any(String),
        },
      });
    });

    it('should not send reminders if all participants have voted', async () => {
      mockPrismaService.trip.findMany.mockResolvedValue([
        {
          id: 'trip-1',
          creatorId: 'creator-1',
          votingDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          status: TripStatus.voting_pending,
          participants: [
            { userId: 'user-1' }, // Has voted
            { userId: 'user-2' }, // Has voted
          ],
          dateCandidates: [
            {
              votes: [
                { userId: 'user-1' },
                { userId: 'user-2' },
              ], // Both users have voted
            },
          ],
        },
      ]);

      await service.handleVotingReminders();

      expect(mockNotificationsService.createNotification).not.toHaveBeenCalled();
    });

    it('should not send reminders for trips with different status', async () => {
      mockPrismaService.trip.findMany.mockResolvedValue([
        {
          id: 'trip-1',
          creatorId: 'creator-1',
          votingDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          status: TripStatus.fixed, // Not voting_pending
          participants: [{ userId: 'user-1' }],
          dateCandidates: [{ votes: [] }],
        },
      ]);

      await service.handleVotingReminders();

      expect(mockNotificationsService.createNotification).not.toHaveBeenCalled();
    });
  });

  describe('1 day before deadline reminders', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should send reminders for trips with voting deadline exactly 1 day from now', async () => {
      mockPrismaService.trip.findMany.mockResolvedValue([
        {
          id: 'trip-2',
          creatorId: 'creator-2',
          votingDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
          status: TripStatus.voting_pending,
          participants: [
            { userId: 'user-1' },
            { userId: 'user-2' },
          ],
          dateCandidates: [
            {
              votes: [{ userId: 'user-1' }], // Only user-1 has voted
            },
          ],
        },
      ]);

      await service.handleVotingReminders();

      // Should send notification only to user-2 who hasn't voted
      expect(mockNotificationsService.createNotification).toHaveBeenCalledTimes(1);
      expect(mockNotificationsService.createNotification).toHaveBeenCalledWith({
        userId: 'user-2',
        type: 'voting_deadline',
        actorId: 'creator-2',
        tripId: 'trip-2',
        payload: {
          reminder_type: '1_day_before',
          voting_deadline: expect.any(String),
        },
      });
    });
  });

  describe('1 hour before deadline reminders', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should send reminders for trips with voting deadline exactly 1 hour from now', async () => {
      mockPrismaService.trip.findMany.mockResolvedValue([
        {
          id: 'trip-3',
          creatorId: 'creator-3',
          votingDeadline: new Date(Date.now() + 60 * 60 * 1000),
          status: TripStatus.voting_pending,
          participants: [
            { userId: 'user-1' },
            { userId: 'user-2' },
            { userId: 'user-3' },
          ],
          dateCandidates: [
            {
              votes: [{ userId: 'user-1' }], // Only user-1 has voted
            },
          ],
        },
      ]);

      await service.handleVotingReminders();

      // Should send notifications to user-2 and user-3 who haven't voted
      expect(mockNotificationsService.createNotification).toHaveBeenCalledTimes(2);
      expect(mockNotificationsService.createNotification).toHaveBeenCalledWith({
        userId: 'user-2',
        type: 'voting_deadline',
        actorId: 'creator-3',
        tripId: 'trip-3',
        payload: {
          reminder_type: '1_hour_before',
          voting_deadline: expect.any(String),
        },
      });
    });
  });

  describe('handleVotingReminders - public interface', () => {
    it('should handle errors gracefully and continue processing', async () => {
      // Mock findMany to throw an error for one time window
      mockPrismaService.trip.findMany
        .mockRejectedValueOnce(new Error('Database error'))
        .mockResolvedValue([]);

      // Should not throw despite the error
      await expect(service.handleVotingReminders()).resolves.not.toThrow();
    });

    it('should process all reminder time windows when called', async () => {
      // Mock different trip scenarios for different time windows
      const now = new Date('2026-07-26T10:00:00Z');
      const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

      // First call: 7 days before
      mockPrismaService.trip.findMany
        .mockResolvedValueOnce([
          {
            id: 'trip-7d',
            creatorId: 'creator-1',
            votingDeadline: sevenDaysFromNow,
            status: TripStatus.voting_pending,
            participants: [{ userId: 'user-1' }],
            dateCandidates: [{ votes: [] }],
          },
        ])
        .mockResolvedValueOnce([]) // 1 day before - no trips
        .mockResolvedValueOnce([]); // 1 hour before - no trips

      mockNotificationsService.createNotification.mockResolvedValue({});

      await service.handleVotingReminders();

      // Should have sent notification for the 7-day reminder
      expect(mockNotificationsService.createNotification).toHaveBeenCalled();
    });
  });
});