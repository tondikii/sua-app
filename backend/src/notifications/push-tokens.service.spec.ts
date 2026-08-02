import { Test, TestingModule } from '@nestjs/testing';
import { PushTokensService } from './push-tokens.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PushTokensService', () => {
  let service: PushTokensService;
  let prisma: any;

  const mockPrisma = {
    pushToken: {
      upsert: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PushTokensService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<PushTokensService>(PushTokensService);
  });

  it('should register a push token via upsert', async () => {
    mockPrisma.pushToken.upsert.mockResolvedValue({ id: 'pt-1' });

    await service.register('user-1', { token: 'ExponentPushToken[abc]', platform: 'ios' });

    expect(mockPrisma.pushToken.upsert).toHaveBeenCalledWith({
      where: { userId_token: { userId: 'user-1', token: 'ExponentPushToken[abc]' } },
      create: { userId: 'user-1', token: 'ExponentPushToken[abc]', platform: 'ios' },
      update: { platform: 'ios' },
    });
  });

  it('should unregister a push token', async () => {
    mockPrisma.pushToken.deleteMany.mockResolvedValue({ count: 1 });

    await service.unregister('user-1', 'ExponentPushToken[abc]');

    expect(mockPrisma.pushToken.deleteMany).toHaveBeenCalledWith({
      where: { userId: 'user-1', token: 'ExponentPushToken[abc]' },
    });
  });
});
