import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { R2Service } from '../integrations/r2/r2.service';

const mockUser = {
  id: 'user-uuid-1',
  name: 'Test User',
  username: 'testuser',
  avatarUrl: null,
  bio: 'Hello!',
  websiteUrl: null,
  locationLabel: null,
  isPublic: true,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  _count: { tripsCreated: 3 },
};

describe('UsersService', () => {
  let service: UsersService;
  let prisma: {
    user: {
      findFirst: jest.Mock;
      findFirstOrThrow: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
    $queryRaw: jest.Mock;
    trip: { findMany: jest.Mock; count: jest.Mock };
  };
  let r2: {
    presignAvatarUpload: jest.Mock;
    headObject: jest.Mock;
    resolvePublicUrl: jest.Mock;
    presignDownload: jest.Mock;
    presignDownloads: jest.Mock;
  };

  beforeEach(async () => {
    prisma = {
      user: {
        findFirst: jest.fn(),
        findFirstOrThrow: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      $queryRaw: jest.fn(),
      trip: { findMany: jest.fn(), count: jest.fn() },
    };

    r2 = {
      presignAvatarUpload: jest.fn(),
      headObject: jest.fn(),
      resolvePublicUrl: jest.fn(),
      presignDownload: jest.fn().mockResolvedValue('https://cdn.example/signed/abc.jpg'),
      presignDownloads: jest.fn().mockResolvedValue(new Map()),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prisma },
        { provide: R2Service, useValue: r2 },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('searchUsers', () => {
    it('should query without cursor when cursor is omitted', async () => {
      prisma.$queryRaw.mockResolvedValue([]);

      await service.searchUsers('tondikii', undefined, 20);

      expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
    });

    it('should return paginated search results', async () => {
      prisma.$queryRaw.mockResolvedValue([
        {
          id: 'user-uuid-1',
          name: 'Tondikii',
          username: 'tondikii',
          avatar_url: null,
          trip_count: BigInt(2),
        },
      ]);

      const result = await service.searchUsers('tondikii');

      expect(result.data).toEqual([
        {
          id: 'user-uuid-1',
          name: 'Tondikii',
          username: 'tondikii',
          avatar_url: null,
          trip_count: 2,
        },
      ]);
      expect(result.next_cursor).toBeNull();
    });
  });

  describe('checkUsername', () => {
    it('should return available=true when username is free', async () => {
      prisma.user.findFirst.mockResolvedValue(null);
      const result = await service.checkUsername('freeuser');
      expect(result).toEqual({ username: 'freeuser', available: true });
    });

    it('should return available=false when username is taken', async () => {
      prisma.user.findFirst.mockResolvedValue(mockUser);
      const result = await service.checkUsername('testuser');
      expect(result).toEqual({ username: 'testuser', available: false });
    });
  });

  describe('getMe', () => {
    it('should return serialized user profile', async () => {
      prisma.user.findFirst.mockResolvedValue(mockUser);
      const result = await service.getMe('user-uuid-1');
      expect(result.id).toBe('user-uuid-1');
      expect(result.username).toBe('testuser');
      expect(result.trip_count).toBe(3);
    });

    it('should throw UnauthorizedException when account no longer exists', async () => {
      prisma.user.findFirst.mockResolvedValue(null);
      await expect(service.getMe('deleted-user')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('updateMe', () => {
    it('should update bio and return updated profile', async () => {
      const updated = { ...mockUser, bio: 'New bio' };
      prisma.user.update.mockResolvedValue(updated);
      const result = await service.updateMe('user-uuid-1', { bio: 'New bio' });
      expect(result.bio).toBe('New bio');
    });

    it('should update name when provided', async () => {
      const updated = { ...mockUser, name: 'Nama Baru' };
      prisma.user.update.mockResolvedValue(updated);
      const result = await service.updateMe('user-uuid-1', { name: 'Nama Baru' });
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ name: 'Nama Baru' }),
        }),
      );
      expect(result.name).toBe('Nama Baru');
    });
  });

  describe('presignAvatarUpload', () => {
    it('should delegate to R2 presign with user id', async () => {
      r2.presignAvatarUpload.mockResolvedValue({
        upload_url: 'https://upload.example',
        storage_key: 'avatars/user-uuid-1/abc.jpg',
        expires_in: 300,
      });
      const result = await service.presignAvatarUpload('user-uuid-1', 'image/jpeg');
      expect(r2.presignAvatarUpload).toHaveBeenCalledWith('user-uuid-1', 'image/jpeg');
      expect(result.storage_key).toBe('avatars/user-uuid-1/abc.jpg');
    });
  });

  describe('updateAvatar', () => {
    it('should reject a storage key that does not belong to the user', async () => {
      await expect(
        service.updateAvatar('user-uuid-1', 'trips/other-trip/abc.jpg'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject when the object does not exist in R2', async () => {
      r2.headObject.mockResolvedValue({ exists: false });
      await expect(
        service.updateAvatar('user-uuid-1', 'avatars/user-uuid-1/abc.jpg'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should store the storage key and return the profile with a presigned URL', async () => {
      r2.headObject.mockResolvedValue({ exists: true, size: 1234 });
      prisma.user.update.mockResolvedValue({
        ...mockUser,
        avatarUrl: 'avatars/user-uuid-1/abc.jpg',
      });

      const result = await service.updateAvatar('user-uuid-1', 'avatars/user-uuid-1/abc.jpg');

      expect(r2.headObject).toHaveBeenCalledWith('avatars/user-uuid-1/abc.jpg');
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ avatarUrl: 'avatars/user-uuid-1/abc.jpg' }),
        }),
      );
      expect(r2.presignDownload).toHaveBeenCalledWith('avatars/user-uuid-1/abc.jpg');
      expect(result.avatar_url).toBe('https://cdn.example/signed/abc.jpg');
    });
  });

  describe('deleteMe', () => {
    it('should call prisma delete', async () => {
      prisma.user.delete.mockResolvedValue(mockUser);
      await service.deleteMe('user-uuid-1');
      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 'user-uuid-1' } });
    });
  });

  describe('getPublicProfile', () => {
    it('should return profile for public user', async () => {
      prisma.user.findFirst.mockResolvedValue(mockUser);
      prisma.trip.count.mockResolvedValue(3);
      const result = await service.getPublicProfile('testuser');
      expect(result.username).toBe('testuser');
      expect(result.trip_count).toBe(3);
    });

    it('should throw NotFoundException for unknown user', async () => {
      prisma.user.findFirst.mockResolvedValue(null);
      await expect(service.getPublicProfile('unknown')).rejects.toThrow(NotFoundException);
    });
  });
});
