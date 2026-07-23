import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { PrismaService } from '../prisma/prisma.service';
import { TripsService } from '../trips/trips.service';

/**
 * Unit tests for WishlistService (M8). Prisma is fully mocked; `$transaction`
 * invokes its callback with the same mock so convert-to-trip exercises the
 * tx body without a real database.
 */
describe('WishlistService', () => {
  let service: WishlistService;
  let prisma: any;
  let tripsService: any;

  const OWNER = 'user-1';

  const wishlistRow = (overrides: Record<string, any> = {}) => ({
    id: 'wish-1',
    userId: OWNER,
    placeName: 'Pantai Tanjung Aan',
    startTime: new Date('2000-01-01T13:00:00'),
    endTime: new Date('2000-01-01T16:00:00'),
    locationLabel: 'Lombok',
    link: 'https://maps.google.com/xyz',
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
      trip: { create: jest.fn() },
      tripParticipant: { create: jest.fn() },
      tripActivity: { create: jest.fn() },
      $transaction: jest.fn((cb: any) => cb(prisma)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WishlistService,
        { provide: PrismaService, useValue: prisma },
        {
          provide: TripsService,
          useValue: { getTripDetail: jest.fn(async (tripId: string) => ({ id: tripId })) },
        },
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

      expect(result.tags).toEqual([]);
    });

    it('returns sorted unique tags from user wishlists', async () => {
      prisma.wishlist.findMany.mockResolvedValue([
        wishlistRow({ tags: ['#pantai', '#sunset'] }),
        wishlistRow({ tags: ['#kuliner', '#pantai'] }), // duplicate #pantai
        wishlistRow({ tags: ['#snorkeling'] }),
      ]);

      const result = await service.getWishlistTags(OWNER);

      expect(result.tags).toEqual(['#kuliner', '#pantai', '#snorkeling', '#sunset']);
    });

    it('excludes soft-deleted wishlist tags', async () => {
      prisma.wishlist.findMany.mockResolvedValue([
        wishlistRow({ tags: ['#pantai'] }),
        // soft-deleted wishlist should be filtered out by the service's WHERE clause
      ]);

      const result = await service.getWishlistTags(OWNER);

      expect(result.tags).toEqual(['#pantai']);
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

      expect(result.tags).toEqual(['#alam']);
    });
  });
});
