import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { GoogleCalendarController } from './google-calendar.controller';
import { GoogleCalendarService } from './google-calendar.service';
import { PrismaService } from '../../prisma/prisma.service';

const prismaMock = {
  trip: {
    findFirst: jest.fn(),
  },
};

const calendarMock = {
  buildAuthUrl: jest.fn().mockReturnValue('https://accounts.google.com/...'),
  handleCallback: jest.fn(),
  createEvent: jest.fn(),
};

describe('GoogleCalendarController', () => {
  let controller: GoogleCalendarController;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoogleCalendarController],
      providers: [
        { provide: GoogleCalendarService, useValue: calendarMock },
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();
    controller = module.get<GoogleCalendarController>(GoogleCalendarController);
  });

  it('should return an auth URL for the current user', () => {
    const result = controller.getAuthUrl({ userId: 'u1' }, '/trip/abc');
    expect(calendarMock.buildAuthUrl).toHaveBeenCalledWith('u1', '/trip/abc');
    expect(result.auth_url).toContain('accounts.google.com');
  });

  it('should reject trip_id missing', async () => {
    await expect(controller.createEvent({ userId: 'u1' }, {})).rejects.toThrow(BadRequestException);
  });

  it('should reject voting_pending trip', async () => {
    prismaMock.trip.findFirst.mockResolvedValue({
      id: 't1',
      name: 'Trip',
      status: 'voting_pending',
      startDate: new Date('2026-08-15'),
      endDate: new Date('2026-08-17'),
      isAllDay: true,
      startTime: null,
      endTime: null,
    });
    await expect(controller.createEvent({ userId: 'u1' }, { trip_id: 't1' })).rejects.toThrow(
      BadRequestException,
    );
    expect(calendarMock.createEvent).not.toHaveBeenCalled();
  });

  it('should create event for fixed trip with date-only conversion', async () => {
    prismaMock.trip.findFirst.mockResolvedValue({
      id: 't1',
      name: 'Lombok',
      status: 'fixed',
      startDate: new Date('2026-08-15T00:00:00.000Z'),
      endDate: new Date('2026-08-17T00:00:00.000Z'),
      isAllDay: true,
      startTime: null,
      endTime: null,
    });
    calendarMock.createEvent.mockResolvedValue({ id: 'evt-1', html_link: null });

    const result = await controller.createEvent({ userId: 'u1' }, { trip_id: 't1' });

    expect(calendarMock.createEvent).toHaveBeenCalledWith(
      'u1',
      expect.objectContaining({
        startDate: '2026-08-15',
        endDate: '2026-08-17',
        isAllDay: true,
      }),
    );
    expect(result.id).toBe('evt-1');
  });
});
