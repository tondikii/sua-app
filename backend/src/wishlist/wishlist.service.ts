import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TripsService } from '../trips/trips.service';
import type { CreateWishlistInput, UpdateWishlistInput, ConvertToTripInput } from '@atur-perjalanan/shared-validation';
import { WishlistSerializer } from './serializers/wishlist.serializer';
import { toTimeDate } from '../common/helpers/date.helpers';
import { GoogleMapsService } from '../common/google-maps/google-maps.service';
import { R2Service } from '../integrations/r2/r2.service';
import { normalizeWishlistTags } from './wishlist-tags';
import { TripStatus, PriorityLevel } from '@prisma/client';

@Injectable()
export class WishlistService {
  private readonly logger = new Logger(WishlistService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tripsService: TripsService,
    private readonly googleMaps: GoogleMapsService,
    private readonly r2: R2Service,
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

    // Resolve cover dari maps_link secara sinkron agar response langsung berisi
    // cover (bug: cover tidak tampil sampai refetch berikutnya).
    let thumbnailUrl = wishlist.thumbnailUrl;
    if (!thumbnailUrl) {
      thumbnailUrl = await this.resolveThumbnailNow(wishlist.id, dto.maps_link);
    }

    return WishlistSerializer.toItem(thumbnailUrl ? { ...wishlist, thumbnailUrl } : wishlist);
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
        ...(priority ? { priorityLevel: priority as PriorityLevel } : {}),
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

    // Resolve cover secara sinkron supaya response update langsung berisi cover
    // yang baru (bug: cover tidak berubah sampai refetch berikutnya).
    let thumbnailUrl = wishlist.thumbnailUrl;
    if (needsResolve) {
      const resolved = await this.resolveThumbnailNow(
        wishlistId,
        dto.maps_link ?? existing.mapsLink,
      );
      if (resolved) thumbnailUrl = resolved;
    }

    return WishlistSerializer.toItem(thumbnailUrl ? { ...wishlist, thumbnailUrl } : wishlist);
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
  async convertToTrip(wishlistId: string, userId: string, dto: ConvertToTripInput) {
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

    // Validate HH:MM format when provided (conversion is not all-day).
    const TIME_HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;
    if (!isAllDay) {
      for (const [key, value] of [
        ['start_time', dto.start_time],
        ['end_time', dto.end_time],
      ] as const) {
        if (value !== undefined && value !== null && !TIME_HHMM.test(String(value))) {
          throw new BadRequestException({
            code: 'INVALID_TIME_FORMAT',
            message: `${key} must be in HH:MM format`,
          });
        }
      }
    }

    // Activity wall-clock times: prefer the request's HH:MM, fall back to the
    // wishlist's stored times. Multi-day trips may span midnight (e.g. Sat 13:00
    // -> Sun 12:00), so end_time is allowed to be earlier in the day than
    // start_time — the DB `valid_activity_time` check was dropped for this.
    const startTimeStr = !isAllDay && dto.start_time ? dto.start_time : undefined;
    const endTimeStr = !isAllDay && dto.end_time ? dto.end_time : undefined;
    const activityStart = startTimeStr ? toTimeDate(startTimeStr) : wishlist.startTime;
    const activityEnd = endTimeStr ? toTimeDate(endTimeStr) : wishlist.endTime;

    // Trip-level wall-clock times (shown in the trip header). Multi-day trips
    // may span midnight (e.g. Sat 13:00 -> Sun 12:00), so end_time may be
    // earlier in the day than start_time.
    const tripStartTime = startTimeStr ? toTimeDate(startTimeStr) : null;
    const tripEndTime = endTimeStr ? toTimeDate(endTimeStr) : null;

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
          startTime: tripStartTime,
          endTime: tripEndTime,
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

    // Persist the wishlist's maps thumbnail into trip media (R2) so it appears
    // in the Media tab and can serve as the trip cover — same behaviour as
    // activity "Sinkron Maps". Best-effort after commit; never fails the trip.
    if (wishlist.thumbnailUrl) {
      await this.importThumbnailToTripMedia(
        trip.id,
        userId,
        wishlist.thumbnailUrl,
      ).catch((err) => {
        this.logger.warn(
          `Import wishlist thumbnail to trip media failed for wishlist ${wishlistId}: ${err}`,
        );
      });
    }

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
   * Resolve thumbnail dari maps_link secara sinkron dan persist ke DB. Tidak
   * pernah throw — return URL baru (atau null) supaya response create/update
   * langsung memuat cover. Timeout 10 detik agar tombol simpan tidak menggantung.
   */
  private async resolveThumbnailNow(
    wishlistId: string,
    mapsLink: string | null | undefined,
  ): Promise<string | null> {
    if (!mapsLink) return null;
    try {
      const thumbnailUrl = await Promise.race([
        this.googleMaps.resolveThumbnailFromMapsLink(mapsLink),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 10_000)),
      ]);
      if (!thumbnailUrl) return null;

      await this.prisma.wishlist.update({
        where: { id: wishlistId },
        data: { thumbnailUrl },
      });
      return thumbnailUrl;
    } catch (err) {
      this.logger.warn(
        `Synchronous thumbnail resolve failed for wishlist ${wishlistId}: ${err}`,
      );
      return null;
    }
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

  /**
   * Download the wishlist's maps thumbnail and store it in the trip's R2 media
   * bucket, registering a `trip_documents` row (Media tab) and setting it as
   * both the trip cover and the seeded activity's cover. Best-effort: failures
   * are logged and never roll back the trip creation.
   */
  private async importThumbnailToTripMedia(
    tripId: string,
    uploaderId: string,
    thumbnailUrl: string,
  ): Promise<void> {
    const existing = await this.prisma.tripDocument.findFirst({
      where: { tripId, storageUrl: thumbnailUrl },
    });

    let documentId: string;
    if (existing) {
      documentId = existing.id;
    } else {
      const res = await fetch(thumbnailUrl);
      if (!res.ok) return;
      const buffer = Buffer.from(await res.arrayBuffer());
      const contentType = res.headers.get('content-type') ?? 'image/jpeg';

      const { storageKey, storageUrl } = await this.r2.putObject(
        tripId,
        contentType,
        buffer,
      );

      const document = await this.prisma.tripDocument.create({
        data: {
          tripId,
          uploadedBy: uploaderId,
          mediaType: 'photo',
          storageKey,
          storageUrl,
          fromChat: false,
        },
      });
      documentId = document.id;
    }

    // Use the imported R2 media as the trip cover and the seeded activity's
    // cover (replacing the raw external URL with a stable media reference).
    await this.prisma.trip.update({
      where: { id: tripId },
      data: { coverDocumentId: documentId },
    });
    await this.prisma.tripActivity.updateMany({
      where: { tripId, dayNumber: 1 },
      data: {
        coverDocumentId: documentId,
        coverSource: 'trip_media',
        thumbnailUrl: null,
      },
    });
  }
}
