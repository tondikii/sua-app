import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { R2Service } from '../integrations/r2/r2.service';
import { PushNotificationsService } from './push-notifications.service';
import { NotificationType } from '@prisma/client';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('NotificationsService', () => {
  let service: NotificationsService;

  const mockPrismaService = {
    notification: {
      create: jest.fn(),
      createMany: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      count: jest.fn(),
    },
    user: {
      findMany: jest.fn(),
    },
    trip: {
      findMany: jest.fn(),
    },
  };

  const mockR2Service = {
    presignDownloads: jest.fn().mockResolvedValue(new Map()),
  };

  const mockPushService = {
    sendAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: R2Service,
          useValue: mockR2Service,
        },
        {
          provide: PushNotificationsService,
          useValue: mockPushService,
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createNotification', () => {
    it('should create a notification successfully', async () => {
      const mockNotification = {
        id: 'notif-1',
        userId: 'user-1',
        type: NotificationType.invite,
        actorId: 'user-2',
        tripId: 'trip-1',
        payload: { invitation_id: 'inv-1' },
        isRead: false,
        createdAt: new Date(),
      };

      mockPrismaService.notification.create.mockResolvedValue(mockNotification);

      const result = await service.createNotification({
        userId: 'user-1',
        type: NotificationType.invite,
        actorId: 'user-2',
        tripId: 'trip-1',
        payload: { invitation_id: 'inv-1' },
      });

      expect(result).toEqual(mockNotification);
      expect(mockPrismaService.notification.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          type: NotificationType.invite,
          actorId: 'user-2',
          tripId: 'trip-1',
          payload: { invitation_id: 'inv-1' },
        },
      });
      expect(mockPushService.sendAsync).toHaveBeenCalledWith(['user-1'], {
        type: NotificationType.invite,
        actorId: 'user-2',
        tripId: 'trip-1',
        payload: { invitation_id: 'inv-1' },
      });
    });

    it('should create notification with minimal required fields', async () => {
      const mockNotification = {
        id: 'notif-2',
        userId: 'user-1',
        type: NotificationType.activity_update,
        payload: {},
        isRead: false,
        createdAt: new Date(),
      };

      mockPrismaService.notification.create.mockResolvedValue(mockNotification);

      const result = await service.createNotification({
        userId: 'user-1',
        type: NotificationType.activity_update,
      });

      expect(result).toEqual(mockNotification);
      expect(mockPrismaService.notification.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          type: NotificationType.activity_update,
          payload: {},
        },
      });
    });
  });

  describe('listNotifications', () => {
    it('should return empty array when user has no notifications', async () => {
      mockPrismaService.notification.findMany.mockResolvedValue([]);

      const result = await service.listNotifications('user-1');

      expect(result).toEqual({
        data: [],
        next_cursor: null,
      });
      expect(mockPrismaService.notification.findMany).toHaveBeenCalled();
    });

    it('should return paginated notifications with enriched data', async () => {
      // Return 21 notifications to trigger pagination (take + 1 = 20 + 1)
      const mockNotifications = Array.from({ length: 21 }, (_, i) => ({
        id: `notif-${i}`,
        userId: 'user-1',
        type: i % 2 === 0 ? NotificationType.invite : NotificationType.activity_update,
        actorId: i % 2 === 0 ? 'user-2' : 'user-3',
        tripId: 'trip-1',
        payload: { index: i },
        isRead: i % 2 === 1, // Alternate read status
        createdAt: new Date(Date.now() - i * 3600000), // 1 hour apart
      }));

      const mockActors = [
        { id: 'user-2', name: 'User 2', username: 'user2', avatarUrl: null },
        { id: 'user-3', name: 'User 3', username: 'user3', avatarUrl: null },
      ];

      const mockTrips = [
        {
          id: 'trip-1',
          name: 'Test Trip',
          status: 'voting_pending',
          startDate: null,
          endDate: null,
          coverDocumentId: null,
        },
      ];

      mockPrismaService.notification.findMany.mockResolvedValue(mockNotifications);
      mockPrismaService.user.findMany.mockResolvedValue(mockActors);
      mockPrismaService.trip.findMany.mockResolvedValue(mockTrips);

      const result = await service.listNotifications('user-1');

      expect(result.data).toHaveLength(20); // Should return 20 items (not 21)
      expect(result.data[0]).toMatchObject({
        id: 'notif-0',
        type: NotificationType.invite,
        is_read: false,
        actor: { id: 'user-2', name: 'User 2', username: 'user2', avatar_url: null },
        trip: {
          id: 'trip-1',
          name: 'Test Trip',
          status: 'voting_pending',
          start_date: null,
          end_date: null,
        },
      });
      expect(result.next_cursor).toBeTruthy();
    });

    it('should handle cursor-based pagination', async () => {
      const cursor = '2026-07-19T09:00:00Z';

      // Mock the count for skip calculation
      mockPrismaService.notification.count.mockResolvedValue(5); // 5 newer notifications

      const mockNotifications = [
        {
          id: 'notif-1',
          userId: 'user-1',
          type: NotificationType.invite,
          createdAt: new Date('2026-07-19T10:00:00Z'),
        },
      ];

      mockPrismaService.notification.findMany.mockResolvedValue(mockNotifications);
      mockPrismaService.user.findMany.mockResolvedValue([]);
      mockPrismaService.trip.findMany.mockResolvedValue([]);

      await service.listNotifications('user-1', cursor, 20);

      expect(mockPrismaService.notification.count).toHaveBeenCalledWith({
        where: {
          userId: 'user-1',
          createdAt: { gt: new Date(cursor) },
        },
      });

      expect(mockPrismaService.notification.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        orderBy: { createdAt: 'desc' },
        take: 21,
        skip: 5, // Skip the 5 newer notifications
      });
    });
  });

  describe('getUnreadCount', () => {
    it('should return count of unread notifications', async () => {
      mockPrismaService.notification.count.mockResolvedValue(5);

      const result = await service.getUnreadCount('user-1');

      expect(result).toEqual({ unread_count: 5 });
      expect(mockPrismaService.notification.count).toHaveBeenCalledWith({
        where: {
          userId: 'user-1',
          isRead: false,
        },
      });
    });

    it('should return 0 when no unread notifications', async () => {
      mockPrismaService.notification.count.mockResolvedValue(0);

      const result = await service.getUnreadCount('user-1');

      expect(result).toEqual({ unread_count: 0 });
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read successfully', async () => {
      const mockNotification = {
        id: 'notif-1',
        userId: 'user-1',
        isRead: false,
      };

      mockPrismaService.notification.findUnique.mockResolvedValue(mockNotification);
      mockPrismaService.notification.update.mockResolvedValue({
        ...mockNotification,
        isRead: true,
      });

      await service.markAsRead('notif-1', 'user-1');

      expect(mockPrismaService.notification.update).toHaveBeenCalledWith({
        where: { id: 'notif-1' },
        data: { isRead: true },
      });
    });

    it('should throw NotFoundException when notification not found', async () => {
      mockPrismaService.notification.findUnique.mockResolvedValue(null);

      await expect(service.markAsRead('notif-1', 'user-1')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when user does not own notification', async () => {
      const mockNotification = {
        id: 'notif-1',
        userId: 'user-2', // Different user
        isRead: false,
      };

      mockPrismaService.notification.findUnique.mockResolvedValue(mockNotification);

      await expect(service.markAsRead('notif-1', 'user-1')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('createManyNotifications', () => {
    it('should bulk-create notifications and trigger push', async () => {
      mockPrismaService.notification.createMany.mockResolvedValue({ count: 2 });

      const result = await service.createManyNotifications([
        {
          userId: 'user-1',
          type: NotificationType.activity_update,
          actorId: 'user-2',
          tripId: 'trip-1',
          payload: { activity_id: 'act-1', activity_name: 'Pantai', action: 'created' },
        },
        {
          userId: 'user-3',
          type: NotificationType.activity_update,
          actorId: 'user-2',
          tripId: 'trip-1',
          payload: { activity_id: 'act-1', activity_name: 'Pantai', action: 'created' },
        },
      ]);

      expect(mockPrismaService.notification.createMany).toHaveBeenCalledWith({
        data: [
          {
            userId: 'user-1',
            type: NotificationType.activity_update,
            actorId: 'user-2',
            tripId: 'trip-1',
            payload: { activity_id: 'act-1', activity_name: 'Pantai', action: 'created' },
          },
          {
            userId: 'user-3',
            type: NotificationType.activity_update,
            actorId: 'user-2',
            tripId: 'trip-1',
            payload: { activity_id: 'act-1', activity_name: 'Pantai', action: 'created' },
          },
        ],
        skipDuplicates: true,
      });
      expect(result).toEqual({ count: 2 });
      expect(mockPushService.sendAsync).toHaveBeenCalledWith(['user-1', 'user-3'], {
        type: NotificationType.activity_update,
        actorId: 'user-2',
        tripId: 'trip-1',
        payload: { activity_id: 'act-1', activity_name: 'Pantai', action: 'created' },
      });
    });

    it('should return count 0 without calling anything for empty items', async () => {
      const result = await service.createManyNotifications([]);

      expect(result).toEqual({ count: 0 });
      expect(mockPrismaService.notification.createMany).not.toHaveBeenCalled();
      expect(mockPushService.sendAsync).not.toHaveBeenCalled();
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read for user', async () => {
      mockPrismaService.notification.updateMany.mockResolvedValue({ count: 10 });

      await service.markAllAsRead('user-1');

      expect(mockPrismaService.notification.updateMany).toHaveBeenCalledWith({
        where: {
          userId: 'user-1',
          isRead: false,
        },
        data: { isRead: true },
      });
    });

    it('should handle case when no notifications to mark as read', async () => {
      mockPrismaService.notification.updateMany.mockResolvedValue({ count: 0 });

      await service.markAllAsRead('user-1');

      expect(mockPrismaService.notification.updateMany).toHaveBeenCalled();
    });
  });
});
