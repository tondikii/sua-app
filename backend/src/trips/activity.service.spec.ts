import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleMapsService } from '../common/google-maps/google-maps.service';

describe('ActivityService', () => {
  let service: ActivityService;
  let prisma: any;
  let googleMaps: any;

  const TRIP = 'trip-1';
  const USER = 'user-1';
  const ACTIVITY = 'act-1';

  beforeEach(async () => {
    prisma = {
      trip: { findFirst: jest.fn() },
      tripActivity: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    googleMaps = {
      resolveThumbnailFromMapsLink: jest.fn().mockResolvedValue(null),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityService,
        { provide: PrismaService, useValue: prisma },
        { provide: GoogleMapsService, useValue: googleMaps },
      ],
    }).compile();

    service = module.get<ActivityService>(ActivityService);
  });

  describe('listActivities', () => {
    it('lists activities for a participant', async () => {
      prisma.trip.findFirst.mockResolvedValue({ id: TRIP });
      prisma.tripActivity.findMany.mockResolvedValue([
        {
          id: ACTIVITY,
          tripId: TRIP,
          placeName: 'Beach',
          activityDate: new Date('2027-06-20'),
          startTime: new Date('1970-01-01T09:00:00'),
          endTime: new Date('1970-01-01T12:00:00'),
          kind: 'activity',
          description: 'Swimming',
          locationLabel: 'Pantai Tiga Warna',
          mapsLink: null,
          refLinks: [],
          coverSource: 'none',
          coverIcon: null,
          coverDocumentId: null,
          thumbnailUrl: null,
          sortOrder: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          coverDocument: null,
        },
      ]);

      const result = await service.listActivities(TRIP, USER);

      expect(result.data).toHaveLength(1);
      expect(result.data[0].place_name).toBe('Beach');
    });

    it('throws NotFound for non-participant', async () => {
      prisma.trip.findFirst.mockResolvedValue(null);
      await expect(service.listActivities(TRIP, USER)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createActivity', () => {
    beforeEach(() => {
      prisma.trip.findFirst.mockResolvedValue({
        id: TRIP,
        status: 'fixed',
        startDate: new Date('2027-06-19'),
        endDate: new Date('2027-06-22'),
      });
    });

    it('creates an activity', async () => {
      prisma.tripActivity.create.mockResolvedValue({
        id: ACTIVITY,
        tripId: TRIP,
        placeName: 'Breakfast',
        activityDate: new Date('2027-06-20'),
        startTime: new Date('1970-01-01T09:00:00'),
        endTime: new Date('1970-01-01T10:00:00'),
        kind: 'meal',
        description: null,
        locationLabel: null,
        mapsLink: null,
        refLinks: [],
        coverSource: 'none',
        coverIcon: null,
        coverDocumentId: null,
        thumbnailUrl: null,
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        coverDocument: null,
      });

      const result = await service.createActivity(TRIP, USER, {
        place_name: 'Breakfast',
        start_time: '09:00',
        end_time: '10:00',
        kind: 'meal',
        activity_date: '2027-06-20',
      });

      expect(result.place_name).toBe('Breakfast');
      expect(result.kind).toBe('meal');
    });

    it('rejects start_time > end_time', async () => {
      await expect(
        service.createActivity(TRIP, USER, {
          place_name: 'Bad Time',
          start_time: '14:00',
          end_time: '10:00',
          activity_date: '2027-06-20',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('rejects activity_date outside trip range', async () => {
      await expect(
        service.createActivity(TRIP, USER, {
          place_name: 'Out of Range',
          start_time: '09:00',
          end_time: '10:00',
          activity_date: '2027-07-01', // outside 06-19 to 06-22
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('rejects activity_date when trip voting_pending', async () => {
      prisma.trip.findFirst.mockResolvedValue({
        id: TRIP,
        status: 'voting_pending',
      });

      // activity_date optional when voting_pending
      prisma.tripActivity.create.mockResolvedValue({
        id: ACTIVITY,
        tripId: TRIP,
        placeName: 'Flexible Activity',
        activityDate: null,
        startTime: new Date('1970-01-01T09:00:00'),
        endTime: new Date('1970-01-01T10:00:00'),
        kind: 'activity',
        description: null,
        locationLabel: null,
        mapsLink: null,
        refLinks: [],
        coverSource: 'none',
        coverIcon: null,
        coverDocumentId: null,
        thumbnailUrl: null,
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        coverDocument: null,
      });

      const result = await service.createActivity(TRIP, USER, {
        place_name: 'Flexible Activity',
        start_time: '09:00',
        end_time: '10:00',
        // no activity_date
      });

      expect(result.activity_date).toBeNull();
    });

    it('schedules background thumbnail resolve when maps_link provided', async () => {
      const scheduleSpy = jest.spyOn(service as any, 'scheduleThumbnailResolve');

      prisma.tripActivity.create.mockResolvedValue({
        id: ACTIVITY,
        tripId: TRIP,
        placeName: 'Beach',
        activityDate: new Date('2027-06-20'),
        startTime: new Date('1970-01-01T09:00:00'),
        endTime: new Date('1970-01-01T10:00:00'),
        kind: 'destination',
        description: null,
        locationLabel: null,
        mapsLink: 'https://maps.google.com/?q=-8.4,115.1',
        refLinks: [],
        coverSource: 'none',
        coverIcon: null,
        coverDocumentId: null,
        thumbnailUrl: null,
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        coverDocument: null,
      });

      await service.createActivity(TRIP, USER, {
        place_name: 'Beach',
        start_time: '09:00',
        end_time: '10:00',
        activity_date: '2027-06-20',
        maps_link: 'https://maps.google.com/?q=-8.4,115.1',
      });

      expect(scheduleSpy).toHaveBeenCalledWith(
        ACTIVITY,
        'https://maps.google.com/?q=-8.4,115.1',
      );
    });
  });

  describe('updateActivity', () => {
    beforeEach(() => {
      prisma.trip.findFirst.mockResolvedValue({
        id: TRIP,
        status: 'fixed',
        startDate: new Date('2027-06-19'),
        endDate: new Date('2027-06-22'),
      });
      prisma.tripActivity.findFirst.mockResolvedValue({
        id: ACTIVITY,
        tripId: TRIP,
        placeName: 'Old Name',
        activityDate: new Date('2027-06-20'),
        startTime: new Date('1970-01-01T09:00:00'),
        endTime: new Date('1970-01-01T10:00:00'),
        kind: 'activity',
        description: null,
        locationLabel: null,
        mapsLink: null,
        refLinks: [],
        coverSource: 'none',
        coverIcon: null,
        coverDocumentId: null,
        thumbnailUrl: null,
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    it('updates place_name', async () => {
      prisma.tripActivity.update.mockResolvedValue({
        id: ACTIVITY,
        tripId: TRIP,
        placeName: 'New Name',
        activityDate: new Date('2027-06-20'),
        startTime: new Date('1970-01-01T09:00:00'),
        endTime: new Date('1970-01-01T10:00:00'),
        kind: 'activity',
        description: null,
        locationLabel: null,
        mapsLink: null,
        refLinks: [],
        coverSource: 'none',
        coverIcon: null,
        coverDocumentId: null,
        thumbnailUrl: null,
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        coverDocument: null,
      });

      const result = await service.updateActivity(
        TRIP,
        ACTIVITY,
        USER,
        { place_name: 'New Name' },
      );

      expect(result.place_name).toBe('New Name');
    });
  });

  describe('deleteActivity', () => {
    beforeEach(() => {
      prisma.trip.findFirst.mockResolvedValue({ id: TRIP });
      prisma.tripActivity.findFirst.mockResolvedValue({ id: ACTIVITY });
    });

    it('deletes an activity', async () => {
      await service.deleteActivity(TRIP, ACTIVITY, USER);
      expect(prisma.tripActivity.delete).toHaveBeenCalledWith({
        where: { id: ACTIVITY },
      });
    });
  });
});
