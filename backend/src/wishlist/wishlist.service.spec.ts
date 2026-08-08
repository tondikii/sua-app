import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { PrismaService } from '../prisma/prisma.service';
import { TripsService } from '../trips/trips.service';
import { GoogleMapsService } from '../common/google-maps/google-maps.service';
import { R2Service } from '../integrations/r2/r2.service';

/**
 * Unit tests for WishlistService (M8). Prisma is fully mocked; `$transaction`
 * invokes its callback with the same mock so convert-to-trip exercises the
 * tx body without a real database.
 */
describe('WishlistService', () => {
  let service: WishlistService;
  let prisma: any;
  let tripsService: any;
  let googleMaps: any;
  let r2: any;

  const OWNER = 'user-1';

  const wishlistRow = (overrides: Record<string, any> = {}) => ({
    id: 'wish-1',
    userId: OWNER,
    placeName: 'Pantai Tanjung Aan',
    startTime: new Date('2000-01-01T13:00:00Z'),
    endTime: new Date('2000-01-01T16:00:00Z'),
    locationLabel: 'Lombok',
    mapsLink: 'https://maps.google.com/xyz',
    refLinks: [{ url: 'https://example.com/guide', label: 'Panduan' }],
    notes: 'Bawa sunscreen',
    tags: ['#pantai'],
    priorityLevel: 'high',
    thumbnailUrl: null,
    deletedAt: null,
    createdAt: new Date('2026-06-01'),
    updatedAt: new Date('2026-06-01'),
    ...overrides,
  });

  beforeEach(async () => {
    prisma = {
      wishlist: {
        create: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
      },
      trip: { create: jest.fn(), update: jest.fn() },
      tripParticipant: { create: jest.fn() },
      tripActivity: { create: jest.fn(), update: jest.fn(), updateMany: jest.fn() },
      tripDocument: { create: jest.fn(), findFirst: jest.fn() },
      $transaction: jest.fn((cb: any) => cb(prisma)),
    };

    googleMaps = {
      resolveThumbnailFromMapsLink: jest.fn().mockResolvedValue(null),
    };

    r2 = {
      putObject: jest.fn().mockResolvedValue({
        storageKey: 'trips/trip-1/uuid.jpg',
        storageUrl: 'https://r2.example.com/trips/trip-1/uuid.jpg',
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WishlistService,
        { provide: PrismaService, useValue: prisma },
        {
          provide: TripsService,
          useValue: { getTripDetail: jest.fn(async (tripId: string) => ({ id: tripId })) },
        },
        { provide: GoogleMapsService, useValue: googleMaps },
        { provide: R2Service, useValue: r2 },
      ],
    }).compile();

    service = module.get<WishlistService>(WishlistService);
    tripsService = module.get(TripsService);
  });

  describe('createWishlist', () => {
    it('creates a wishlist item with defaults', async () => {
      prisma.wishlist.create.mockResolvedValue(wishlistRow());

      const result = await service.createWishlist(OWNER, {
        place_name: 'Pantai Tanjung Aan',
      } as any);

      expect(prisma.wishlist.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ userId: OWNER, priorityLevel: 'medium', tags: [] }),
        }),
      );
      expect(result.place_name).toBe('Pantai Tanjung Aan');
      expect(result.priority_level).toBe('high'); // reflects mocked create() return
    });

    it('normalizes tags to #Titlecase', async () => {
      prisma.wishlist.create.mockResolvedValue(wishlistRow());

      await service.createWishlist(OWNER, {
        place_name: 'Pantai',
        tags: ['pantai', '#PANTAI', '  ', '#', 'sUnSeT'],
      } as any);

      expect(prisma.wishlist.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ tags: ['#Pantai', '#Sunset'] }),
        }),
      );
    });

    it('stores maps_link + ref_links', async () => {
      prisma.wishlist.create.mockResolvedValue(
        wishlistRow({
          mapsLink: 'https://maps.google.com/abc',
          refLinks: [{ url: 'https://example.com/x', label: 'X' }],
        }),
      );

      await service.createWishlist(OWNER, {
        place_name: 'Pantai',
        maps_link: 'https://maps.google.com/abc',
        ref_links: [{ url: 'https://example.com/x', label: 'X' }],
      } as any);

      expect(prisma.wishlist.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            mapsLink: 'https://maps.google.com/abc',
            refLinks: [{ url: 'https://example.com/x', label: 'X' }],
          }),
        }),
      );
    });

    it('resolves thumbnail synchronously when maps_link set', async () => {
      prisma.wishlist.create.mockResolvedValue(wishlistRow());
      googleMaps.resolveThumbnailFromMapsLink.mockResolvedValue('https://thumb.example.com/a.jpg');

      const result = await service.createWishlist(OWNER, {
        place_name: 'Pantai',
        maps_link: 'https://maps.google.com/abc',
      } as any);

      expect(googleMaps.resolveThumbnailFromMapsLink).toHaveBeenCalledWith(
        'https://maps.google.com/abc',
      );
      expect(prisma.wishlist.update).toHaveBeenCalledWith({
        where: { id: 'wish-1' },
        data: { thumbnailUrl: 'https://thumb.example.com/a.jpg' },
      });
      expect(result.thumbnail_url).toBe('https://thumb.example.com/a.jpg');
    });

    it('does not resolve thumbnail without maps_link', async () => {
      prisma.wishlist.create.mockResolvedValue(wishlistRow());

      await service.createWishlist(OWNER, { place_name: 'Pantai' } as any);

      expect(googleMaps.resolveThumbnailFromMapsLink).not.toHaveBeenCalled();
    });
  });

  describe('listWishlists', () => {
    it('returns items with next_cursor null when no more pages', async () => {
      prisma.wishlist.findMany.mockResolvedValue([wishlistRow()]);

      const result = await service.listWishlists(OWNER, {});

      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe('wish-1');
      expect(result.next_cursor).toBeNull();
    });

    it('sets next_cursor when there are more results', async () => {
      const rows = Array.from({ length: 21 }, (_, i) => wishlistRow({ id: `wish-${i}` }));
      prisma.wishlist.findMany.mockResolvedValue(rows);

      const result = await service.listWishlists(OWNER, { limit: 20 });

      expect(result.data).toHaveLength(20);
      expect(result.next_cursor).toBe('wish-19');
    });

    it('filters by priority and tag', async () => {
      prisma.wishlist.findMany.mockResolvedValue([]);

      await service.listWishlists(OWNER, { priority: 'high', tag: '#pantai' });

      expect(prisma.wishlist.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            priorityLevel: 'high',
            tags: { array_contains: ['#pantai'] },
          }),
        }),
      );
    });

    it('backfills thumbnails for wishlists with maps link but no thumbnail', async () => {
      prisma.wishlist.findMany.mockResolvedValue([
        wishlistRow({ id: 'wish-1', mapsLink: 'https://maps.google.com/a', thumbnailUrl: null }),
        wishlistRow({ id: 'wish-2', mapsLink: 'https://maps.google.com/b', thumbnailUrl: 'https://img/cover.jpg' }),
        wishlistRow({ id: 'wish-3', mapsLink: null, thumbnailUrl: null }),
      ]);
      googleMaps.resolveThumbnailFromMapsLink.mockResolvedValue('https://thumb.example.com/x.jpg');

      await service.listWishlists(OWNER, {});
      await new Promise((r) => setTimeout(r, 5));

      // only wish-1 lacks a thumbnail and has a maps link → resolved
      expect(googleMaps.resolveThumbnailFromMapsLink).toHaveBeenCalledWith(
        'https://maps.google.com/a',
      );
      expect(googleMaps.resolveThumbnailFromMapsLink).not.toHaveBeenCalledWith(
        'https://maps.google.com/b',
      );
      expect(prisma.wishlist.update).toHaveBeenCalledWith({
        where: { id: 'wish-1' },
        data: { thumbnailUrl: 'https://thumb.example.com/x.jpg' },
      });
    });

    it('upgrades Yandex fallback thumbnails to real photos on backfill', async () => {
      prisma.wishlist.findMany.mockResolvedValue([
        wishlistRow({
          id: 'wish-y',
          mapsLink: 'https://maps.google.com/y',
          thumbnailUrl: 'https://static-maps.yandex.ru/1.x/?ll=107.5%2C-6.8&z=15&size=400%2C300',
        }),
      ]);
      googleMaps.resolveThumbnailFromMapsLink.mockResolvedValue(
        'https://lh3.googleusercontent.com/PHOTO',
      );

      await service.listWishlists(OWNER, {});
      await new Promise((r) => setTimeout(r, 5));

      expect(googleMaps.resolveThumbnailFromMapsLink).toHaveBeenCalledWith(
        'https://maps.google.com/y',
      );
      expect(prisma.wishlist.update).toHaveBeenCalledWith({
        where: { id: 'wish-y' },
        data: { thumbnailUrl: 'https://lh3.googleusercontent.com/PHOTO' },
      });
    });
  });

  describe('updateWishlist', () => {
    it('updates fields for the owner', async () => {
      prisma.wishlist.findFirst.mockResolvedValue(wishlistRow());
      prisma.wishlist.update.mockResolvedValue(wishlistRow({ placeName: 'Updated' }));

      const result = await service.updateWishlist('wish-1', OWNER, { place_name: 'Updated' });

      expect(result.place_name).toBe('Updated');
    });

    it('throws Forbidden when not owner', async () => {
      prisma.wishlist.findFirst.mockResolvedValue(wishlistRow({ userId: 'other' }));
      await expect(service.updateWishlist('wish-1', OWNER, { place_name: 'x' })).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('throws NotFound when missing', async () => {
      prisma.wishlist.findFirst.mockResolvedValue(null);
      await expect(service.updateWishlist('nope', OWNER, { place_name: 'x' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteWishlist', () => {
    it('soft-deletes for the owner', async () => {
      prisma.wishlist.findFirst.mockResolvedValue(wishlistRow());
      prisma.wishlist.update.mockResolvedValue({});

      await service.deleteWishlist('wish-1', OWNER);

      expect(prisma.wishlist.update).toHaveBeenCalledWith({
        where: { id: 'wish-1' },
        data: { deletedAt: expect.any(Date) },
      });
    });

    it('throws Forbidden when not owner', async () => {
      prisma.wishlist.findFirst.mockResolvedValue(wishlistRow({ userId: 'other' }));
      await expect(service.deleteWishlist('wish-1', OWNER)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('convertToTrip', () => {
    it('creates trip + seeds day-1 activity + soft-deletes wishlist atomically', async () => {
      prisma.wishlist.findFirst.mockResolvedValue(wishlistRow());
      prisma.trip.create.mockResolvedValue({ id: 'trip-1' });
      prisma.tripParticipant.create.mockResolvedValue({});
      prisma.tripActivity.create.mockResolvedValue({});
      prisma.wishlist.update.mockResolvedValue({});

      const result = await service.convertToTrip('wish-1', OWNER, {
        start_date: '2026-08-01',
        end_date: '2026-08-05',
      } as any);

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(prisma.trip.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            creatorId: OWNER,
            status: 'fixed',
            name: 'Pantai Tanjung Aan',
          }),
        }),
      );
      expect(prisma.tripParticipant.create).toHaveBeenCalledWith({
        data: { tripId: 'trip-1', userId: OWNER },
      });
      expect(prisma.tripActivity.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            tripId: 'trip-1',
            placeName: 'Pantai Tanjung Aan',
            locationLabel: 'Lombok',
            mapsLink: 'https://maps.google.com/xyz',
            refLinks: [{ url: 'https://example.com/guide', label: 'Panduan' }],
          }),
        }),
      );
      expect(prisma.wishlist.update).toHaveBeenCalledWith({
        where: { id: 'wish-1' },
        data: { deletedAt: expect.any(Date) },
      });
      expect(tripsService.getTripDetail).toHaveBeenCalledWith('trip-1', OWNER);
      expect(result.id).toBe('trip-1');
    });

    it('rejects start_date after end_date', async () => {
      prisma.wishlist.findFirst.mockResolvedValue(wishlistRow());

      await expect(
        service.convertToTrip('wish-1', OWNER, {
          start_date: '2026-08-05',
          end_date: '2026-08-01',
        } as any),
      ).rejects.toThrow(BadRequestException);

      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('uses request start_time/end_time when not all-day', async () => {
      prisma.wishlist.findFirst.mockResolvedValue(wishlistRow());
      prisma.trip.create.mockResolvedValue({ id: 'trip-1' });
      prisma.tripParticipant.create.mockResolvedValue({});
      prisma.tripActivity.create.mockResolvedValue({});
      prisma.wishlist.update.mockResolvedValue({});

      await service.convertToTrip('wish-1', OWNER, {
        start_date: '2026-08-01',
        end_date: '2026-08-02',
        is_all_day: false,
        start_time: '13:00',
        end_time: '12:00',
      } as any);

      const activityData = prisma.tripActivity.create.mock.calls[0][0].data;
      expect(activityData.startTime).toEqual(new Date('1970-01-01T13:00:00Z'));
      expect(activityData.endTime).toEqual(new Date('1970-01-01T12:00:00Z'));

      // Trip-level times must also be stored (header shows them).
      const tripData = prisma.trip.create.mock.calls[0][0].data;
      expect(tripData.startTime).toEqual(new Date('1970-01-01T13:00:00Z'));
      expect(tripData.endTime).toEqual(new Date('1970-01-01T12:00:00Z'));
      expect(tripData.isAllDay).toBe(false);
    });

    it('rejects invalid HH:MM time format', async () => {
      prisma.wishlist.findFirst.mockResolvedValue(wishlistRow());

      await expect(
        service.convertToTrip('wish-1', OWNER, {
          start_date: '2026-08-01',
          end_date: '2026-08-02',
          is_all_day: false,
          start_time: '25:99',
          end_time: '12:00',
        } as any),
      ).rejects.toThrow(BadRequestException);

      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('allows end_time earlier than start_time (multi-day activity)', async () => {
      prisma.wishlist.findFirst.mockResolvedValue(wishlistRow());
      prisma.trip.create.mockResolvedValue({ id: 'trip-1' });
      prisma.tripParticipant.create.mockResolvedValue({});
      prisma.tripActivity.create.mockResolvedValue({});
      prisma.wishlist.update.mockResolvedValue({});

      const result = await service.convertToTrip('wish-1', OWNER, {
        start_date: '2026-08-01',
        end_date: '2026-08-02',
        is_all_day: false,
        start_time: '13:00',
        end_time: '12:00',
      } as any);

      expect(result.id).toBe('trip-1');
    });

    it('imports wishlist thumbnail to trip media and sets it as cover', async () => {
      prisma.wishlist.findFirst.mockResolvedValue(
        wishlistRow({ thumbnailUrl: 'https://lh3.googleusercontent.com/PHOTO' }),
      );
      prisma.trip.create.mockResolvedValue({ id: 'trip-1' });
      prisma.tripParticipant.create.mockResolvedValue({});
      prisma.tripActivity.create.mockResolvedValue({ id: 'act-1' });
      prisma.wishlist.update.mockResolvedValue({});
      prisma.tripDocument.findFirst.mockResolvedValue(null);
      prisma.tripDocument.create.mockResolvedValue({ id: 'doc-1' });
      prisma.trip.update.mockResolvedValue({});
      prisma.tripActivity.update.mockResolvedValue({});

      // Mock global fetch used by importThumbnailToTripMedia.
      const originalFetch = global.fetch;
      (global as any).fetch = jest.fn().mockResolvedValue({
        ok: true,
        headers: { get: () => 'image/jpeg' },
        arrayBuffer: async () => new ArrayBuffer(8),
      });

      try {
        await service.convertToTrip('wish-1', OWNER, {
          start_date: '2026-08-01',
          end_date: '2026-08-02',
        } as any);
      } finally {
        (global as any).fetch = originalFetch;
      }

      expect(r2.putObject).toHaveBeenCalledWith(
        'trip-1',
        'image/jpeg',
        expect.any(Buffer),
      );
      expect(prisma.tripDocument.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            tripId: 'trip-1',
            uploadedBy: OWNER,
            mediaType: 'photo',
            fromChat: false,
          }),
        }),
      );
      expect(prisma.trip.update).toHaveBeenCalledWith({
        where: { id: 'trip-1' },
        data: { coverDocumentId: 'doc-1' },
      });
      expect(prisma.tripActivity.updateMany).toHaveBeenCalledWith({
        where: { tripId: 'trip-1', dayNumber: 1 },
        data: { coverDocumentId: 'doc-1', coverSource: 'trip_media', thumbnailUrl: null },
      });
    });

    it('throws Forbidden when not owner', async () => {
      prisma.wishlist.findFirst.mockResolvedValue(wishlistRow({ userId: 'other' }));

      await expect(
        service.convertToTrip('wish-1', OWNER, {
          start_date: '2026-08-01',
          end_date: '2026-08-05',
        } as any),
      ).rejects.toThrow(ForbiddenException);
    });

    it('throws NotFound when wishlist missing', async () => {
      prisma.wishlist.findFirst.mockResolvedValue(null);

      await expect(
        service.convertToTrip('nope', OWNER, {
          start_date: '2026-08-01',
          end_date: '2026-08-05',
        } as any),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getWishlistTags', () => {
    it('returns empty array when user has no wishlists', async () => {
      prisma.wishlist.findMany.mockResolvedValue([]);

      const result = await service.getWishlistTags(OWNER);

      expect(result.data).toEqual([]);
    });

    it('returns sorted unique tags from user wishlists', async () => {
      prisma.wishlist.findMany.mockResolvedValue([
        wishlistRow({ tags: ['#pantai', '#sunset'] }),
        wishlistRow({ tags: ['#kuliner', '#pantai'] }), // duplicate #pantai
        wishlistRow({ tags: ['#snorkeling'] }),
      ]);

      const result = await service.getWishlistTags(OWNER);

      expect(result.data).toEqual(['#kuliner', '#pantai', '#snorkeling', '#sunset']);
    });

    it('excludes soft-deleted wishlist tags', async () => {
      prisma.wishlist.findMany.mockResolvedValue([
        wishlistRow({ tags: ['#pantai'] }),
        // soft-deleted wishlist should be filtered out by the service's WHERE clause
      ]);

      const result = await service.getWishlistTags(OWNER);

      expect(result.data).toEqual(['#pantai']);
      expect(prisma.wishlist.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ deletedAt: null }),
        }),
      );
    });

    it('handles wishlists with empty/null tags arrays', async () => {
      prisma.wishlist.findMany.mockResolvedValue([
        wishlistRow({ tags: [] }),
        wishlistRow({ tags: null }),
        wishlistRow({ tags: ['#alam'] }),
      ]);

      const result = await service.getWishlistTags(OWNER);

      expect(result.data).toEqual(['#alam']);
    });
  });
});
