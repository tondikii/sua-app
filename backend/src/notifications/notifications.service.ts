import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '@prisma/client';

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  actorId?: string;
  tripId?: string;
  payload?: Record<string, any>;
}

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a notification for a user.
   * Called by event writers in trips, voting, activities services.
   */
  async createNotification(params: CreateNotificationParams) {
    const { userId, type, actorId, tripId, payload = {} } = params;

    return this.prisma.notification.create({
      data: {
        userId,
        type,
        actorId,
        tripId,
        payload,
      },
    });
  }

  /**
   * List notifications for current user with enriched actor/trip data.
   * Uses separate optimized queries to avoid N+1 issues (ARCHITECTURE §4.6).
   * Cursor paginated by created_at timestamp (ARCHITECTURE §4.3.2).
   */
  async listNotifications(userId: string, cursor?: string, limit: number = 20) {
    const take = Math.min(limit, 100);

    // If using cursor, we need to find the notification ID from the timestamp cursor
    // This maintains API compatibility while using Prisma's cursor efficiently
    let skip = 0;
    if (cursor) {
      // Count notifications newer than the cursor timestamp
      const cursorDate = new Date(cursor);
      const newerCount = await this.prisma.notification.count({
        where: {
          userId,
          createdAt: { gt: cursorDate },
        },
      });
      skip = newerCount;
    }

    // Fetch base notifications first
    const notifications = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: take + 1, // Fetch one extra to determine if there's a next page
      skip,
    });

    const hasNextPage = notifications.length > take;
    const data = notifications.slice(0, take);

    if (data.length === 0) {
      return { data: [], next_cursor: null };
    }

    // Batch fetch related actors and trips to avoid N+1 (ARCHITECTURE §4.6)
    const actorIds = data.map((n) => n.actorId).filter((id): id is string => id != null);
    const tripIds = data.map((n) => n.tripId).filter((id): id is string => id != null);

    const [actors, trips] = await Promise.all([
      this.fetchActors(actorIds),
      this.fetchTrips(tripIds),
    ]);

    const actorMap = new Map(actors.map((a) => [a.id, a]));
    const tripMap = new Map(trips.map((t) => [t.id, t]));

    // Enrich notifications with actor and trip data
    const enrichedData = data.map((notification) => ({
      id: notification.id,
      type: notification.type,
      actor: notification.actorId ? actorMap.get(notification.actorId) || null : null,
      trip: notification.tripId ? tripMap.get(notification.tripId) || null : null,
      payload: notification.payload,
      is_read: notification.isRead,
      created_at: notification.createdAt,
    }));

    return {
      data: enrichedData,
      next_cursor: hasNextPage ? enrichedData[enrichedData.length - 1].created_at.toISOString() : null,
    };
  }

  /**
   * Get unread count for notification badge (Screen9Notifikasi bell icon).
   * Uses indexed query for performance.
   */
  async getUnreadCount(userId: string): Promise<{ unread_count: number }> {
    const unreadCount = await this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    return { unread_count: unreadCount };
  }

  /**
   * Mark a single notification as read.
   */
  async markAsRead(notificationId: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new ForbiddenException('Access denied to this notification');
    }

    await this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  /**
   * Mark all notifications as read for the current user.
   */
  async markAllAsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: { isRead: true },
    });
  }

  /**
   * Batch fetch users for notification actor enrichment.
   * Uses optimized query to avoid N+1 (ARCHITECTURE §4.6).
   */
  private async fetchActors(actorIds: string[]) {
    if (actorIds.length === 0) return [];

    return this.prisma.user.findMany({
      where: { id: { in: actorIds } },
      select: {
        id: true,
        name: true,
        username: true,
        avatarUrl: true,
      },
    });
  }

  /**
   * Batch fetch trips for notification enrichment.
   * Uses optimized query to avoid N+1 (ARCHITECTURE §4.6).
   */
  private async fetchTrips(tripIds: string[]) {
    if (tripIds.length === 0) return [];

    return this.prisma.trip.findMany({
      where: { id: { in: tripIds } },
      select: {
        id: true,
        name: true,
        status: true,
        startDate: true,
        endDate: true,
        coverDocumentId: true,
      },
    });
  }
}