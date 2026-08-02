import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { GoogleCalendarService } from './google-calendar.service';
import { PrismaService } from '../../prisma/prisma.service';
import { OAuth2Client } from 'google-auth-library';

const mockOAuth = {
  generateAuthUrl: jest.fn().mockReturnValue('https://accounts.google.com/o/oauth2/v2/auth?...'),
  getToken: jest.fn(),
  setCredentials: jest.fn(),
  refreshAccessToken: jest.fn(),
};

jest.mock('google-auth-library', () => ({
  OAuth2Client: jest.fn().mockImplementation(() => mockOAuth),
}));

const configMock = {
  get: jest.fn((key: string) => {
    const map: Record<string, string> = {
      'google.calendarClientId': 'cal-client-id',
      'google.calendarClientSecret': 'cal-client-secret',
      'app.webUrl': 'http://localhost:8081',
    };
    return map[key];
  }),
};

const prismaMock = {
  user: {
    findFirst: jest.fn(),
    update: jest.fn(),
  },
};

describe('GoogleCalendarService', () => {
  let service: GoogleCalendarService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleCalendarService,
        { provide: ConfigService, useValue: configMock },
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();
    service = module.get<GoogleCalendarService>(GoogleCalendarService);
  });

  describe('buildAuthUrl', () => {
    it('should include offline access + calendar.events scope', () => {
      const url = service.buildAuthUrl('user-1', '/trip/abc');
      expect(mockOAuth.generateAuthUrl).toHaveBeenCalledWith(
        expect.objectContaining({
          access_type: 'offline',
          prompt: 'consent',
          scope: 'https://www.googleapis.com/auth/calendar.events',
        }),
      );
      expect(url).toContain('https://accounts.google.com');
    });

    it('should throw when not configured', () => {
      (configMock.get as jest.Mock).mockReturnValueOnce(undefined).mockReturnValueOnce(undefined);
      const svc = new GoogleCalendarService(prismaMock as any, configMock as any);
      expect(() => svc.buildAuthUrl('user-1')).toThrow(BadRequestException);
    });
  });

  describe('handleCallback', () => {
    it('should store tokens and return redirect URL', async () => {
      mockOAuth.getToken.mockResolvedValue({
        tokens: { access_token: 'at', refresh_token: 'rt', expiry_date: 1700000000000 },
      });
      prismaMock.user.update.mockResolvedValue({});

      const state = Buffer.from(JSON.stringify({ userId: 'user-1', redirectPath: '/trip/abc' })).toString('base64url');
      const result = await service.handleCallback('code-1', state);

      expect(prismaMock.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            googleAccessToken: 'at',
            googleRefreshToken: 'rt',
          }),
        }),
      );
      expect(result.redirectUrl).toBe('http://localhost:8081/trip/abc');
    });

    it('should reject invalid state', async () => {
      await expect(service.handleCallback('code-1', 'not-valid')).rejects.toThrow(BadRequestException);
    });
  });

  describe('createEvent', () => {
    const baseTrip = {
      name: 'Lombok Trip',
      startDate: '2026-08-15',
      endDate: '2026-08-17',
      isAllDay: true,
      startTime: null,
      endTime: null,
    };

    it('should create an all-day event with end date +1 (exclusive)', async () => {
      prismaMock.user.findFirst.mockResolvedValue({
        googleAccessToken: 'at',
        googleRefreshToken: null,
        googleTokenExpiresAt: new Date(Date.now() + 3600_000),
      });
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 'evt-1', htmlLink: 'https://calendar.google.com/evt' }),
      } as any) as any;

      const result = await service.createEvent('user-1', baseTrip);

      const [url, init] = (global.fetch as jest.Mock).mock.calls[0];
      expect(url).toBe('https://www.googleapis.com/calendar/v3/calendars/primary/events');
      expect(init.headers.Authorization).toBe('Bearer at');
      const body = JSON.parse(init.body);
      expect(body.start).toEqual({ date: '2026-08-15' });
      expect(body.end).toEqual({ date: '2026-08-18' }); // exclusive
      expect(result.id).toBe('evt-1');
    });

    it('should create a timed event with local wall-clock dateTime', async () => {
      prismaMock.user.findFirst.mockResolvedValue({
        googleAccessToken: 'at',
        googleRefreshToken: null,
        googleTokenExpiresAt: new Date(Date.now() + 3600_000),
      });
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 'evt-2', htmlLink: null }),
      } as any) as any;

      await service.createEvent('user-1', {
        ...baseTrip,
        isAllDay: false,
        startTime: '08:30',
        endTime: '17:45',
      });

      const init = (global.fetch as jest.Mock).mock.calls[0][1];
      const body = JSON.parse(init.body);
      expect(body.start).toEqual({ dateTime: '2026-08-15T08:30:00' });
      expect(body.end).toEqual({ dateTime: '2026-08-17T17:45:00' });
    });

    it('should refresh the token when expired', async () => {
      prismaMock.user.findFirst.mockResolvedValue({
        googleAccessToken: 'old-at',
        googleRefreshToken: 'rt',
        googleTokenExpiresAt: new Date(Date.now() - 1000),
      });
      mockOAuth.refreshAccessToken.mockResolvedValue({
        credentials: { access_token: 'new-at', expiry_date: Date.now() + 3600_000 },
      });
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 'evt-3' }),
      } as any) as any;

      await service.createEvent('user-1', baseTrip);

      expect(mockOAuth.setCredentials).toHaveBeenCalledWith({ refresh_token: 'rt' });
      expect(prismaMock.user.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ googleAccessToken: 'new-at' }) }),
      );
      const init = (global.fetch as jest.Mock).mock.calls[0][1];
      expect(init.headers.Authorization).toBe('Bearer new-at');
    });

    it('should throw UnauthorizedException when not connected', async () => {
      prismaMock.user.findFirst.mockResolvedValue({ googleAccessToken: null });
      await expect(service.createEvent('user-1', baseTrip)).rejects.toThrow(UnauthorizedException);
    });
  });
});
