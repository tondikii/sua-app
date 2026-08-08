import { Test, TestingModule } from '@nestjs/testing';
import { PushNotificationsService } from './push-notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { NotificationType } from '@prisma/client';

const mockExpoInstances: Array<{ sendPushNotificationsAsync: jest.Mock }> = [];

jest.mock('expo-server-sdk', () => {
  class MockExpo {
    static isExpoPushToken = jest.fn((token: unknown) => {
      return typeof token === 'string' && token.startsWith('ExponentPushToken');
    });
    chunkPushNotifications = jest.fn((messages: unknown[]) => [messages]);
    sendPushNotificationsAsync = jest.fn().mockResolvedValue([
      { status: 'ok', id: 'ticket-1' },
      { status: 'error', details: { error: 'DeviceNotRegistered' } },
    ]);

    constructor(_opts: any) {
      mockExpoInstances.push(this);
    }
  }
  return { Expo: MockExpo };
});

describe('PushNotificationsService', () => {
  let service: PushNotificationsService;
  let config: { get: jest.Mock };

  const mockPrisma = {
    user: { findUnique: jest.fn() },
    trip: { findUnique: jest.fn() },
    pushToken: { findMany: jest.fn(), deleteMany: jest.fn() },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockExpoInstances.length = 0;
    mockPrisma.user.findUnique.mockResolvedValue({ name: 'Budi' });
    mockPrisma.trip.findUnique.mockResolvedValue({ name: 'Liburan Bali' });

    config = { get: jest.fn().mockReturnValue('test-token') };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PushNotificationsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: ConfigService, useValue: config },
      ],
    }).compile();

    service = module.get<PushNotificationsService>(PushNotificationsService);
  });

  it('should be a no-op when EXPO_ACCESS_TOKEN is not configured', async () => {
    config.get.mockReturnValue('');

    await (service as any).send(['user-1'], {
      type: NotificationType.invite,
      actorId: 'user-2',
      tripId: 'trip-1',
    });

    expect(mockPrisma.pushToken.findMany).not.toHaveBeenCalled();
  });

  it('should not send when recipient has no registered push tokens', async () => {
    mockPrisma.pushToken.findMany.mockResolvedValue([]);

    await (service as any).send(['user-1'], {
      type: NotificationType.invite,
      actorId: 'user-2',
      tripId: 'trip-1',
    });

    expect(mockPrisma.pushToken.findMany).toHaveBeenCalledWith({
      where: { userId: { in: ['user-1'] } },
      select: { userId: true, token: true },
    });
  });

  it('should filter non-Expo tokens and prune invalid ones', async () => {
    mockPrisma.pushToken.findMany.mockResolvedValue([
      { userId: 'user-1', token: 'ExponentPushToken[valid]' },
      { userId: 'user-1', token: 'ExponentPushToken[invalid]' },
      { userId: 'user-2', token: 'not-an-expo-token' },
    ]);

    await (service as any).send(['user-1', 'user-2'], {
      type: NotificationType.activity_update,
      actorId: 'user-2',
      tripId: 'trip-1',
      payload: { activity_name: 'Pantai' },
    });

    const { Expo } = jest.requireMock('expo-server-sdk');
    expect(Expo.isExpoPushToken).toHaveBeenCalled();
    expect(mockExpoInstances[0].sendPushNotificationsAsync).toHaveBeenCalled();
    // The DeviceNotRegistered message should be pruned.
    expect(mockPrisma.pushToken.deleteMany).toHaveBeenCalledWith({
      where: { token: { in: ['ExponentPushToken[invalid]'] } },
    });
  });

  it('should build correct invite content', async () => {
    mockPrisma.pushToken.findMany.mockResolvedValue([
      { userId: 'user-1', token: 'ExponentPushToken[valid]' },
    ]);

    await (service as any).send(['user-1'], {
      type: NotificationType.invite,
      actorId: 'user-2',
      tripId: 'trip-1',
      payload: { invitation_id: 'inv-1' },
    });

    const messages = mockExpoInstances[0].sendPushNotificationsAsync.mock.calls[0][0];
    expect(messages[0]).toMatchObject({
      title: 'Undangan Perjalanan',
      body: 'Budi mengundangmu ke Liburan Bali',
      data: { type: 'invite', trip_id: 'trip-1', invitation_id: 'inv-1' },
      sound: 'default',
    });
  });

  it('sendAsync should swallow errors from the underlying send', async () => {
    mockPrisma.user.findUnique.mockRejectedValue(new Error('db down'));

    // Fire-and-forget: returns void and never throws synchronously.
    expect(() =>
      service.sendAsync(['user-1'], {
        type: NotificationType.invite,
      } as any),
    ).not.toThrow();
  });
});
