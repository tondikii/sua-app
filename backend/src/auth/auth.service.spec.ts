import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

// Mock google-auth-library
const mockVerifyIdToken = jest.fn();
jest.mock('google-auth-library', () => ({
  OAuth2Client: jest.fn().mockImplementation(() => ({
    verifyIdToken: mockVerifyIdToken,
  })),
}));

const mockUser = {
  id: 'user-uuid-1',
  googleId: 'google-123',
  email: 'test@example.com',
  name: 'Test User',
  username: 'testuser',
  avatarUrl: null,
  bio: null,
  websiteUrl: null,
  locationLabel: null,
  isPublic: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('AuthService', () => {
  let service: AuthService;
  let prisma: { user: { findFirst: jest.Mock; create: jest.Mock; update: jest.Mock } };
  let jwtService: { sign: jest.Mock };

  beforeEach(async () => {
    prisma = {
      user: {
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    jwtService = { sign: jest.fn().mockReturnValue('mock-jwt-token') };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config: Record<string, string> = {
                'google.clientId': 'test-client-id',
                'jwt.secret': 'test-secret',
                'supabase.jwtSecret': 'supabase-secret',
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('googleLogin', () => {
    it('should throw UnauthorizedException on invalid token', async () => {
      mockVerifyIdToken.mockRejectedValue(new Error('Invalid token'));

      await expect(service.googleLogin({ id_token: 'bad-token' })).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return access_token and is_new_user=true for new users', async () => {
      mockVerifyIdToken.mockResolvedValue({
        getPayload: () => ({
          sub: 'google-new-123',
          email: 'new@example.com',
          name: 'New User',
          picture: null,
        }),
      });

      prisma.user.findFirst.mockResolvedValue(null); // no existing user
      const newUser = { ...mockUser, username: `user_${Date.now()}` };
      prisma.user.create.mockResolvedValue(newUser);

      const result = await service.googleLogin({ id_token: 'valid-token' });

      expect(result.is_new_user).toBe(true);
      expect(result.access_token).toBe('mock-jwt-token');
    });

    it('should return is_new_user=false for returning users', async () => {
      mockVerifyIdToken.mockResolvedValue({
        getPayload: () => ({
          sub: 'google-123',
          email: 'test@example.com',
          name: 'Test User',
          picture: null,
        }),
      });

      prisma.user.findFirst.mockResolvedValue(mockUser);
      prisma.user.update.mockResolvedValue(mockUser);

      const result = await service.googleLogin({ id_token: 'valid-token' });

      expect(result.is_new_user).toBe(false);
      expect(result.user).toBeDefined();
    });
  });

  describe('completeRegistration', () => {
    it('should update username and return user', async () => {
      prisma.user.findFirst.mockResolvedValue(null); // username not taken
      prisma.user.update.mockResolvedValue({ ...mockUser, username: 'newusername' });

      const result = await service.completeRegistration('user-uuid-1', {
        username: 'newusername',
      });

      expect(result.user.username).toBe('newusername');
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { username: 'newusername' },
        }),
      );
    });

    it('should throw ConflictException when username is taken', async () => {
      prisma.user.findFirst.mockResolvedValue({ ...mockUser, id: 'other-user' });

      await expect(
        service.completeRegistration('user-uuid-1', { username: 'taken' }),
      ).rejects.toThrow(ConflictException);
    });
  });
});
