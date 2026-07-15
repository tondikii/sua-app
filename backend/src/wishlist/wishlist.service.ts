import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TripsService } from '../trips/trips.service';
import { CreateWishlistDto, UpdateWishlistDto, ConvertToTripDto } from './dto';
import { WishlistSerializer } from './serializers/wishlist.serializer';
import { TripStatus } from '@prisma/client';

const toTimeDate = (time?: string): Date | null =>
  time ? new Date(`2000-01-01T${time}:00`) : null;

@Injectable()
export class WishlistService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tripsService: TripsService,
  ) {}

  /** Create a wishlist item for the current user (WORKFLOW §12, `WishlistFormSheet`). */
  async createWishlist(userId: string, dto: CreateWishlistDto) {
    const wishlist = await this.prisma.wishlist.create({
      data: {
        userId,
        placeName: dto.place_name,
        startTime: toTimeDate(dto.start_time),
        endTime: toTimeDate(dto.end_time),
        locationLabel: dto.location_label,
        link: dto.link,
        notes: dto.notes,
        tags: dto.tags ?? [],
        priorityLevel: dto.priority_level ?? 'medium',
        thumbnailUrl: dto.thumbnail_url,
      },
    });

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
        ...(priority ? { priorityLevel: priority as any } : {}),
        ...(tag ? { tags: { array_contains: [tag] } } : {}),
        ...(cursor ? { id: { lt: cursor } } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: take + 1,
    });

    const hasMore = wishlists.length > take;
    const results = hasMore ? wishlists.slice(0, take) : wishlists;

    return {
      data: results.map((w) => WishlistSerializer.toItem(w)),
      next_cursor: hasMore ? results[results.length - 1]?.id ?? null : null,
    };
  }

  /** Update a wishlist item — owner only. */
  async updateWishlist(wishlistId: string, userId: string, dto: UpdateWishlistDto) {
    await this.assertOwner(wishlistId, userId);

    const wishlist = await this.prisma.wishlist.update({
      where: { id: wishlistId },
      data: {
        placeName: dto.place_name,
        startTime: dto.start_time !== undefined ? toTimeDate(dto.start_time) : undefined,
        endTime: dto.end_time !== undefined ? toTimeDate(dto.end_time) : undefined,
        locationLabel: dto.location_label,
        link: dto.link,
        notes: dto.notes,
        tags: dto.tags ?? undefined,
        priorityLevel: dto.priority_level,
        thumbnailUrl: dto.thumbnail_url,
      },
    });

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
  async convertToTrip(wishlistId: string, userId: string, dto: ConvertToTripDto) {
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
          ...(wishlist.startTime ? { startTime: wishlist.startTime } : {}),
          ...(wishlist.endTime ? { endTime: wishlist.endTime } : {}),
          description: wishlist.notes,
          locationLabel: wishlist.locationLabel,
          mapsLink: wishlist.link,
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
}