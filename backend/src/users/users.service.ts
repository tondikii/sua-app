import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSummarySerializer } from './serializers/user.serializer';

const USER_SELECT = {
  id: true,
  name: true,
  username: true,
  avatarUrl: true,
  bio: true,
  websiteUrl: true,
  locationLabel: true,
  isPublic: true,
  createdAt: true,
  updatedAt: true,
  _count: { select: { tripsCreated: true } },
} as const;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async checkUsername(username: string) {
    const lower = username.toLowerCase();
    const existing = await this.prisma.user.findFirst({
      where: { username: lower },
      select: { id: true },
    });
    return {
      username: lower,
      available: !existing,
    };
  }

  async searchUsers(q: string, cursor?: string, limit = 20) {
    const take = Math.min(limit, 100);
    const cursorCondition = cursor
      ? Prisma.sql`AND u.id < ${cursor}::uuid`
      : Prisma.empty;

    // Use pg_trgm similarity via raw query for best search quality
    const users = await this.prisma.$queryRaw<
      Array<{
        id: string;
        name: string;
        username: string;
        avatar_url: string | null;
        trip_count: bigint;
      }>
    >`
      SELECT
        u.id,
        u.name,
        u.username,
        u.avatar_url,
        COUNT(DISTINCT t.id) AS trip_count
      FROM users u
      LEFT JOIN trips t ON t.creator_id = u.id AND t.deleted_at IS NULL AND t.is_public = TRUE
      WHERE
        (u.username ILIKE ${`%${q}%`} OR u.name ILIKE ${`%${q}%`})
        ${cursorCondition}
      GROUP BY u.id
      ORDER BY
        CASE WHEN u.username ILIKE ${`${q}%`} THEN 0
             WHEN u.name ILIKE ${`${q}%`} THEN 1
             ELSE 2
        END,
        u.username
      LIMIT ${take + 1}
    `;

    const hasMore = users.length > take;
    const results = hasMore ? users.slice(0, take) : users;

    return {
      data: results.map((u) => ({
        id: u.id,
        name: u.name,
        username: u.username,
        avatar_url: u.avatar_url,
        trip_count: Number(u.trip_count),
      })),
      next_cursor: hasMore ? results[results.length - 1]?.id ?? null : null,
    };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
      select: USER_SELECT,
    });
    if (!user) {
      throw new UnauthorizedException({
        code: 'USER_NOT_FOUND',
        message: 'Account no longer exists',
      });
    }
    return UserSummarySerializer.toProfile(user);
  }

  async updateMe(userId: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.bio !== undefined && { bio: dto.bio }),
        ...(dto.website_url !== undefined && { websiteUrl: dto.website_url }),
        ...(dto.location_label !== undefined && { locationLabel: dto.location_label }),
        ...(dto.is_public !== undefined && { isPublic: dto.is_public }),
      },
      select: USER_SELECT,
    });
    return UserSummarySerializer.toProfile(user);
  }

  async deleteMe(userId: string) {
    await this.prisma.user.delete({ where: { id: userId } });
  }

  async getPublicProfile(username: string, viewerUserId?: string) {
    const user = await this.prisma.user.findFirst({
      where: { username: username.toLowerCase() },
      select: USER_SELECT,
    });

    if (!user) {
      throw new NotFoundException({ code: 'USER_NOT_FOUND', message: 'User not found' });
    }

    // If profile is private and viewer is not the owner, return limited info
    if (!user.isPublic && user.id !== viewerUserId) {
      throw new ForbiddenException({ code: 'PROFILE_PRIVATE', message: 'This profile is private' });
    }

    return UserSummarySerializer.toProfile(user);
  }

  async getUserTrips(username: string, viewerUserId?: string, cursor?: string, limit = 20) {
    const take = Math.min(limit, 100);

    const user = await this.prisma.user.findFirst({
      where: { username: username.toLowerCase() },
      select: { id: true, isPublic: true },
    });

    if (!user) {
      throw new NotFoundException({ code: 'USER_NOT_FOUND', message: 'User not found' });
    }

    const isOwner = user.id === viewerUserId;

    // Non-owner: only public trips
    const trips = await this.prisma.trip.findMany({
      where: {
        creatorId: user.id,
        ...(isOwner ? {} : { isPublic: true }),
        ...(cursor ? { id: { lt: cursor } } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: take + 1,
      select: {
        id: true,
        name: true,
        tags: true,
        status: true,
        startDate: true,
        endDate: true,
        isAllDay: true,
        startTime: true,
        endTime: true,
        isPublic: true,
        votingDeadline: true,
        createdAt: true,
        coverDocument: { select: { storageUrl: true } },
        _count: { select: { participants: true } },
        participants: {
          take: 4,
          orderBy: { joinedAt: 'asc' },
          select: {
            user: {
              select: { id: true, name: true, username: true, avatarUrl: true },
            },
          },
        },
      },
    });

    const hasMore = trips.length > take;
    const results = hasMore ? trips.slice(0, take) : trips;

    return {
      data: results.map((t) => ({
        id: t.id,
        name: t.name,
        tags: t.tags as string[],
        status: t.status,
        start_date: t.startDate?.toISOString().split('T')[0] ?? null,
        end_date: t.endDate?.toISOString().split('T')[0] ?? null,
        is_all_day: t.isAllDay,
        start_time: t.startTime ? new Date(t.startTime).toTimeString().slice(0, 5) : null,
        end_time: t.endTime ? new Date(t.endTime).toTimeString().slice(0, 5) : null,
        cover_image_url: t.coverDocument?.storageUrl ?? null,
        voting_deadline: t.votingDeadline?.toISOString() ?? null,
        participant_count: t._count.participants,
        participants_preview: t.participants.map((p) => ({
          id: p.user.id,
          name: p.user.name,
          username: p.user.username,
          avatar_url: p.user.avatarUrl,
        })),
      })),
      next_cursor: hasMore ? results[results.length - 1]?.id ?? null : null,
    };
  }
}
