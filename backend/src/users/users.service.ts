import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { UpdateUserInput } from '@atur-perjalanan/shared-validation';
import { UserSummarySerializer } from './serializers/user.serializer';
import { toDateOnly, toTime } from '../common/helpers/date.helpers';
import { R2Service } from '../integrations/r2/r2.service';

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
  constructor(
    private readonly prisma: PrismaService,
    private readonly r2: R2Service,
  ) {}

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
    const cursorCondition = cursor ? Prisma.sql`AND u.id < ${cursor}::uuid` : Prisma.empty;

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

    const avatarKeys = results
      .map((u) => u.avatar_url)
      .filter((url): url is string => !!url && !url.includes('://'));
    const signedAvatars = await this.r2.presignDownloads(avatarKeys);

    const resolveAvatar = async (url: string | null) => {
      if (!url) return null;
      if (url.includes('://')) return UserSummarySerializer.resolveAvatar(url, this.r2);
      return signedAvatars.get(url) ?? url;
    };

    return {
      data: await Promise.all(
        results.map(async (u) => ({
          id: u.id,
          name: u.name,
          username: u.username,
          avatar_url: await resolveAvatar(u.avatar_url),
          trip_count: Number(u.trip_count),
        })),
      ),
      next_cursor: hasMore ? (results[results.length - 1]?.id ?? null) : null,
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
    return UserSummarySerializer.toProfile(user, this.r2);
  }

  async updateMe(userId: string, dto: UpdateUserInput) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.bio !== undefined && { bio: dto.bio }),
        ...(dto.website_url !== undefined && { websiteUrl: dto.website_url }),
        ...(dto.location_label !== undefined && { locationLabel: dto.location_label }),
        ...(dto.is_public !== undefined && { isPublic: dto.is_public }),
      },
      select: USER_SELECT,
    });
    return UserSummarySerializer.toProfile(user, this.r2);
  }

  /**
   * Issue a presigned R2 PUT URL for the user's profile avatar. The client
   * uploads the image directly, then calls `updateAvatar` to register it.
   */
  async presignAvatarUpload(userId: string, contentType: string) {
    return this.r2.presignAvatarUpload(userId, contentType);
  }

  /**
   * Register an avatar object already uploaded to R2. Verifies the key
   * belongs to this user and that the object exists before storing the
   * storage key on the user. The key is resolved to a presigned GET URL at
   * serialization time (bucket is private — public r2.dev URLs cannot render).
   */
  async updateAvatar(userId: string, storageKey: string) {
    if (!storageKey.startsWith(`avatars/${userId}/`)) {
      throw new BadRequestException({
        code: 'INVALID_STORAGE_KEY',
        message: 'storage_key does not belong to this user',
      });
    }

    const head = await this.r2.headObject(storageKey);
    if (!head.exists) {
      throw new BadRequestException({
        code: 'OBJECT_NOT_FOUND',
        message: 'Uploaded object not found in R2 — upload may still be in progress',
      });
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: storageKey },
      select: USER_SELECT,
    });
    return UserSummarySerializer.toProfile(user, this.r2);
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

    return UserSummarySerializer.toProfile(user, this.r2);
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

    // Fetch trips using the same approach as listTrips (include not select)
    const trips = await this.prisma.trip.findMany({
      where: {
        creatorId: user.id,
        deletedAt: null,
        ...(isOwner ? {} : { isPublic: true }),
        ...(cursor ? { id: { lt: cursor } } : {}),
      },
      orderBy: { createdAt: 'desc' },
      include: {
        coverDocument: { select: { storageKey: true, storageUrl: true } },
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

    // Manual pagination since Prisma 5.22 + Node 24 has a bug with `take` + `_count`
    const hasMore = trips.length > take;
    const results = hasMore ? trips.slice(0, take) : trips;

    // Cover images live in a private R2 bucket — presign the storage keys so
    // clients can render them (same as `TripsService.listTrips`). Legacy rows
    // may hold a raw `pub-*.r2.dev` URL instead of a key — extract the key.
    const coverKeys = results
      .map((t) => this.resolveCoverKey(t.coverDocument))
      .filter((key): key is string => Boolean(key));
    const signedCovers = await this.r2.presignDownloads(coverKeys);

    const resolveCover = (t: (typeof results)[number]): string | null => {
      const key = this.resolveCoverKey(t.coverDocument);
      if (!key) return null;
      return signedCovers.get(key) ?? null;
    };

    const avatarKeys = results
      .flatMap((t) => t.participants.map((p) => p.user.avatarUrl))
      .filter((url): url is string => !!url && !url.includes('://'));
    const signedAvatars = await this.r2.presignDownloads(avatarKeys);

    const resolveAvatar = async (url: string | null) => {
      if (!url) return null;
      if (url.includes('://')) return UserSummarySerializer.resolveAvatar(url, this.r2);
      return signedAvatars.get(url) ?? url;
    };

    return {
      data: await Promise.all(
        results.map(async (t) => ({
          id: t.id,
          name: t.name,
          tags: (t.tags as string[]) ?? [],
          status: t.status,
          start_date: toDateOnly(t.startDate),
          end_date: toDateOnly(t.endDate),
          is_all_day: t.isAllDay,
          start_time: toTime(t.startTime),
          end_time: toTime(t.endTime),
          cover_image_url: resolveCover(t),
          voting_deadline: t.votingDeadline?.toISOString() ?? null,
          participant_count: t._count.participants,
          participants_preview: await Promise.all(
            t.participants.map(async (p) => ({
              id: p.user.id,
              name: p.user.name,
              username: p.user.username,
              avatar_url: await resolveAvatar(p.user.avatarUrl),
            })),
          ),
        })),
      ),
      next_cursor: hasMore ? (results[results.length - 1]?.id ?? null) : null,
    };
  }

  /** Derive an R2 storage key from a trip cover document (key or legacy r2.dev URL). */
  private resolveCoverKey(
    coverDocument: { storageKey: string | null; storageUrl: string | null } | null,
  ): string | null {
    if (!coverDocument) return null;
    if (coverDocument.storageKey) return coverDocument.storageKey;
    if (coverDocument.storageUrl) return this.r2.extractStorageKey(coverDocument.storageUrl);
    return null;
  }
}
