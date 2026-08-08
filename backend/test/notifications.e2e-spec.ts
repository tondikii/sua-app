import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request = require('supertest');
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import { NotificationType } from '@prisma/client';

describe('Notifications E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);

    // Clean up test data
    await prisma.notification.deleteMany({});
    await prisma.user.deleteMany({
      where: { email: { contains: 'test-notifications' } },
    });

    // Create a test user and get JWT token
    const user = await prisma.user.create({
      data: {
        googleId: 'test-google-id-notifications',
        email: 'test-notifications@example.com',
        name: 'Test User',
        username: 'testnotifications',
      },
    });

    userId = user.id;

    // Generate a test JWT token (you'll need to implement this helper)
    jwtToken = 'Bearer test-jwt-token'; // Replace with actual JWT generation
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.notification.deleteMany({
      where: { userId },
    });
    await prisma.user.delete({
      where: { id: userId },
    });

    await app.close();
  });

  describe('GET /v1/notifications', () => {
    it('should return empty array when user has no notifications', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/notifications')
        .set('Authorization', jwtToken)
        .expect(200);

      expect(response.body).toEqual({
        data: [],
        next_cursor: null,
      });
    });

    it('should return user notifications with enriched data', async () => {
      // Create test notifications
      await prisma.notification.create({
        data: {
          userId,
          type: NotificationType.invite,
          actorId: userId, // Self-notification for testing
          tripId: null,
          payload: { test: 'data' },
          isRead: false,
        },
      });

      const response = await request(app.getHttpServer())
        .get('/v1/notifications')
        .set('Authorization', jwtToken)
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0]).toMatchObject({
        type: NotificationType.invite,
        is_read: false,
      });
    });

    it('should support cursor-based pagination', async () => {
      // Create multiple notifications
      await Promise.all([
        prisma.notification.create({
          data: {
            userId,
            type: NotificationType.activity_update,
            actorId: userId,
            payload: { index: 1 },
          },
        }),
        prisma.notification.create({
          data: {
            userId,
            type: NotificationType.voting_deadline,
            actorId: userId,
            payload: { index: 2 },
          },
        }),
      ]);

      const firstPage = await request(app.getHttpServer())
        .get('/v1/notifications?limit=1')
        .set('Authorization', jwtToken)
        .expect(200);

      expect(firstPage.body.data).toHaveLength(1);
      expect(firstPage.body.next_cursor).toBeTruthy();

      // Fetch next page using cursor
      const secondPage = await request(app.getHttpServer())
        .get(`/v1/notifications?cursor=${firstPage.body.next_cursor}`)
        .set('Authorization', jwtToken)
        .expect(200);

      expect(secondPage.body.data.length).toBeGreaterThan(0);
    });

    it('should return 401 without authentication', async () => {
      await request(app.getHttpServer()).get('/v1/notifications').expect(401);
    });
  });

  describe('GET /v1/notifications/unread-count', () => {
    it('should return unread count', async () => {
      await prisma.notification.create({
        data: {
          userId,
          type: NotificationType.invite,
          actorId: userId,
          isRead: false,
        },
      });

      const response = await request(app.getHttpServer())
        .get('/v1/notifications/unread-count')
        .set('Authorization', jwtToken)
        .expect(200);

      expect(response.body).toHaveProperty('unread_count');
      expect(typeof response.body.unread_count).toBe('number');
    });

    it('should return 0 when all notifications are read', async () => {
      await prisma.notification.create({
        data: {
          userId,
          type: NotificationType.invite,
          actorId: userId,
          isRead: true, // Already read
        },
      });

      const response = await request(app.getHttpServer())
        .get('/v1/notifications/unread-count')
        .set('Authorization', jwtToken)
        .expect(200);

      expect(response.body.unread_count).toBe(0);
    });
  });

  describe('PUT /v1/notifications/:id/read', () => {
    it('should mark notification as read', async () => {
      const notification = await prisma.notification.create({
        data: {
          userId,
          type: NotificationType.invite,
          actorId: userId,
          isRead: false,
        },
      });

      await request(app.getHttpServer())
        .put(`/v1/notifications/${notification.id}/read`)
        .set('Authorization', jwtToken)
        .expect(204);

      // Verify notification is now read
      const updated = await prisma.notification.findUnique({
        where: { id: notification.id },
      });
      expect(updated?.isRead).toBe(true);
    });

    it('should return 404 for non-existent notification', async () => {
      await request(app.getHttpServer())
        .put('/v1/notifications/non-existent-id/read')
        .set('Authorization', jwtToken)
        .expect(404);
    });

    it('should return 403 when trying to mark another users notification', async () => {
      // Create another user
      const otherUser = await prisma.user.create({
        data: {
          googleId: 'other-google-id',
          email: 'other@example.com',
          name: 'Other User',
          username: 'otheruser',
        },
      });

      const notification = await prisma.notification.create({
        data: {
          userId: otherUser.id, // Different user
          type: NotificationType.invite,
          actorId: otherUser.id,
          isRead: false,
        },
      });

      await request(app.getHttpServer())
        .put(`/v1/notifications/${notification.id}/read`)
        .set('Authorization', jwtToken) // Trying as first user
        .expect(403);

      // Cleanup
      await prisma.user.delete({ where: { id: otherUser.id } });
    });
  });

  describe('PUT /v1/notifications/read-all', () => {
    it('should mark all notifications as read', async () => {
      // Create multiple unread notifications
      await Promise.all([
        prisma.notification.create({
          data: {
            userId,
            type: NotificationType.invite,
            actorId: userId,
            isRead: false,
          },
        }),
        prisma.notification.create({
          data: {
            userId,
            type: NotificationType.activity_update,
            actorId: userId,
            isRead: false,
          },
        }),
      ]);

      await request(app.getHttpServer())
        .put('/v1/notifications/read-all')
        .set('Authorization', jwtToken)
        .expect(204);

      // Verify all notifications are now read
      const unreadCount = await prisma.notification.count({
        where: {
          userId,
          isRead: false,
        },
      });
      expect(unreadCount).toBe(0);
    });

    it('should handle case when no notifications to mark as read', async () => {
      await request(app.getHttpServer())
        .put('/v1/notifications/read-all')
        .set('Authorization', jwtToken)
        .expect(204);
    });
  });

  describe('Notification Events Integration', () => {
    it('should create notification when trip invitation is created', async () => {
      // Create a test trip and invitation
      const trip = await prisma.trip.create({
        data: {
          creatorId: userId,
          name: 'Test Trip',
          status: 'voting_pending',
        },
      });

      // Create another user to invite
      const invitedUser = await prisma.user.create({
        data: {
          googleId: 'invited-google-id',
          email: 'invited@example.com',
          name: 'Invited User',
          username: 'inviteduser',
        },
      });

      // Create invitation (this should trigger notification creation)
      await request(app.getHttpServer())
        .post(`/v1/trips/${trip.id}/invitations`)
        .set('Authorization', jwtToken)
        .send({ username: 'inviteduser' })
        .expect(201);

      // Verify notification was created for invited user
      const notifications = await prisma.notification.findMany({
        where: {
          userId: invitedUser.id,
          type: NotificationType.invite,
          tripId: trip.id,
        },
      });

      expect(notifications).toHaveLength(1);
      expect(notifications[0].actorId).toBe(userId);

      // Cleanup
      await prisma.user.delete({ where: { id: invitedUser.id } });
      await prisma.trip.delete({ where: { id: trip.id } });
    });
  });
});
