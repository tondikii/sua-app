import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TripsService } from '../trips/trips.service';
import type { CreateWishlistInput, UpdateWishlistInput } from '@atur-perjalanan/shared-validation';
import { WishlistSerializer } from './serializers/wishlist.serializer';
import { toTimeDate } from '../common/helpers/date.helpers';
import { GoogleMapsService } from '../common/google-maps/google-maps.service';
import { normalizeWishlistTags } from './wishlist-tags';
import { TripStatus } from '@prisma/client';

@Injectable()
export class WishlistService {
  private readonly logger = new Logger(WishlistService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tripsService: TripsService,
    private readonly googleMaps: GoogleMapsService,
  ) {}

  /** Create a wishlist item for the current user (WORKFLOW §12, `WishlistFormSheet`). */
  async createWishlist(userId: string, dto: CreateWishlistInput) {
    const wishlist = await this.prisma.wishlist.create({
      data: {
        userId,
        placeName: dto.place_name,
        startTime: toTimeDate(dto.start_time),
        endTime: toTimeDate(dto.end_time),
        locationLabel: dto.location_label,
        mapsLink: dto.maps_link,
        refLinks: dto.ref_links ?? [],
        notes: dto.notes,
        tags: normalizeWishlistTags(dto.tags) ?? [],
        priorityLevel: dto.priority_level ?? 'medium',
        thumbnailUrl: dto.thumbnail_url,
      },
    });

    this.scheduleThumbnailResolve(wishlist.id, dto.maps_link);

    return WishlistSerializer.toItem(wishlist);
  }

  /**
   * List the current user's wishlist items, filterable by `priority` and a
   * single `tag`, cursor paginated (WORKFLOW §12: sort tabs + tag chips).
   */
  async listWishlists(
    userId: string,
    options: { priority?: string; tag?: string; cursor?: string; limit?: number } = {},
  ) {
    const { priority, tag, cursor, limit = 20 } = options;
    const take = Math.min(limit, 100);

    const wishlists = await this.prisma.wishlist.findMany({
      where: {
        userId,
        deletedAt: null,
        ...(priority ? { priorityLevel: priority as any } : {}),
        ...(tag ? { tags: { array_contains: [tag] } } : {}),
        ...(cursor ? { id: { lt: cursor } } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: take + 1,
    });

    const hasMore = wishlists.length > take;
    const results = hasMore ? wishlists.slice(0, take) : wishlists;

    // Backfill: wishlists that have a maps link but no *real* thumbnail yet get
    // their cover resolved in the background. A Yandex URL is just the billing-free
    // map fallback — re-resolve so we can upgrade it to the actual place photo
    // (og:image) once available.
    for (const w of results) {
      if (w.mapsLink && this.isFallbackThumbnail(w.thumbnailUrl)) {
        this.scheduleThumbnailResolve(w.id, w.mapsLink);
      }
    }

    return {
      data: results.map((w) => WishlistSerializer.toItem(w)),
      next_cursor: hasMore ? (results[results.length - 1]?.id ?? null) : null,
    };
  }

  /** True when the thumbnail is null or only a billing-free map fallback (Yandex). */
  private isFallbackThumbnail(thumbnailUrl: string | null): boolean {
    if (!thumbnailUrl) return true;
    return thumbnailUrl.startsWith('https://static-maps.yandex.ru/');
  }

  /** Update a wishlist item — owner only. */
  async updateWishlist(wishlistId: string, userId: string, dto: UpdateWishlistInput) {
    const existing = await this.assertOwner(wishlistId, userId);

    const wishlist = await this.prisma.wishlist.update({
      where: { id: wishlistId },
      data: {
        placeName: dto.place_name,
        startTime: dto.start_time !== undefined ? toTimeDate(dto.start_time) : undefined,
        endTime: dto.end_time !== undefined ? toTimeDate(dto.end_time) : undefined,
        locationLabel: dto.location_label,
        mapsLink: dto.maps_link,
        refLinks: dto.ref_links,
        notes: dto.notes,
        tags: normalizeWishlistTags(dto.tags),
        priorityLevel: dto.priority_level,
        thumbnailUrl: dto.thumbnail_url,
      },
    });

    const mapsLinkChanged =
      dto.maps_link !== undefined && dto.maps_link !== existing.mapsLink;
    const needsResolve =
      !dto.thumbnail_url &&
      (mapsLinkChanged || this.isFallbackThumbnail(existing.thumbnailUrl));
    if (needsResolve && (dto.maps_link ?? existing.mapsLink)) {
      this.scheduleThumbnailResolve(wishlistId, dto.maps_link ?? existing.mapsLink);
    }

    return WishlistSerializer.toItem(wishlist);
  }

  /** Soft-delete a wishlist item — owner only (`WishlistDeleteModal`). */
  async deleteWishlist(wishlistId: string, userId: string): Promise<void> {
    await this.assertOwner(wishlistId, userId);

    await this.prisma.wishlist.update({
      where: { id: wishlistId },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * "Jadikan Perjalanan" (WORKFLOW §12, Screen114-117): atomic conversion —
   * insert `trips`, seed a single day-1 `trip_activities` row from the
   * wishlist's fields, and soft-delete the `wishlists` row — all inside one
   * Prisma transaction (ARCHITECTURE §3.4). Rolls back entirely on failure.
   */
  async convertToTrip(wishlistId: string, userId: string, dto: any) {
    const wishlist = await this.assertOwner(wishlistId, userId);

    const startDate = new Date(dto.start_date);
    const endDate = new Date(dto.end_date);

    if (startDate > endDate) {
      throw new BadRequestException({
        code: 'INVALID_DATE_RANGE',
        message: 'start_date must be on or before end_date',
      });
    }

    const isAllDay = dto.is_all_day ?? true;
    const activityStart = !isAllDay && dto.start_time ? toTimeDate(dto.start_time) : wishlist.startTime;
    const activityEnd = !isAllDay && dto.end_time ? toTimeDate(dto.end_time) : wishlist.endTime;

    const trip = await this.prisma.$transaction(async (tx) => {
      const created = await tx.trip.create({
        data: {
          creatorId: userId,
          name: dto.trip_name ?? wishlist.placeName,
          tags: dto.tags ?? (wishlist.tags as string[]) ?? [],
          status: TripStatus.fixed,
          startDate,
          endDate,
          isAllDay,
        },
      });

      await tx.tripParticipant.create({
        data: { tripId: created.id, userId },
      });

      await tx.tripActivity.create({
        data: {
          tripId: created.id,
          placeName: wishlist.placeName,
          activityDate: startDate,
          ...(activityStart ? { startTime: activityStart } : {}),
          ...(activityEnd ? { endTime: activityEnd } : {}),
          description: wishlist.notes,
          locationLabel: wishlist.locationLabel,
          mapsLink: wishlist.mapsLink ?? wishlist.link,
          refLinks: (wishlist.refLinks as { url: string; label?: string }[]) ?? [],
          thumbnailUrl: wishlist.thumbnailUrl,
          coverSource: wishlist.thumbnailUrl ? 'maps' : 'none',
        },
      });

      await tx.wishlist.update({
        where: { id: wishlistId },
        data: { deletedAt: new Date() },
      });

      return created;
    });

    return this.tripsService.getTripDetail(trip.id, userId);
  }

  /**
   * Get all unique tags from the user's active wishlists for filter chips
   * (WORKFLOW §12, `WishlistTagFilters`).
   */
  async getWishlistTags(userId: string) {
    const wishlists = await this.prisma.wishlist.findMany({
      where: { userId, deletedAt: null },
      select: { tags: true },
    });

    // Extract all tags and deduplicate
    const allTags = wishlists.flatMap((w) => (w.tags as string[]) ?? []);
    const uniqueTags = [...new Set(allTags)].sort(); // Sort alphabetically

    return { data: uniqueTags };
  }

  /** Load a wishlist item and assert `userId` owns it. Returns the row. */
  private async assertOwner(wishlistId: string, userId: string) {
    const wishlist = await this.prisma.wishlist.findFirst({
      where: { id: wishlistId, deletedAt: null },
    });

    if (!wishlist) {
      throw new NotFoundException({
        code: 'WISHLIST_NOT_FOUND',
        message: 'Wishlist item not found',
      });
    }

    if (wishlist.userId !== userId) {
      throw new ForbiddenException({
        code: 'WISHLIST_ACCESS_DENIED',
        message: 'You do not have access to this wishlist item',
      });
    }

    return wishlist;
  }

  /**
   * Fire-and-forget: resolve thumbnail_url from maps_link in the background.
   * Does not block the HTTP response (pola `activity.service.ts`, ARCHITECTURE §3.3).
   */
  private scheduleThumbnailResolve(wishlistId: string, mapsLink: string | null | undefined): void {
    if (!mapsLink) return;

    setImmediate(() => {
      this.resolveThumbnailInBackground(wishlistId, mapsLink).catch((err) => {
        this.logger.warn(`Thumbnail resolve failed for wishlist ${wishlistId}: ${err}`);
      });
    });
  }

  private async resolveThumbnailInBackground(wishlistId: string, mapsLink: string): Promise<void> {
    const thumbnailUrl = await this.googleMaps.resolveThumbnailFromMapsLink(mapsLink);
    if (!thumbnailUrl) return;

    await this.prisma.wishlist.update({
      where: { id: wishlistId },
      data: { thumbnailUrl },
    });
  }
}
