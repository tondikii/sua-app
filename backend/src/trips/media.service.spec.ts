import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { MediaService } from './media.service';
import { PrismaService } from '../prisma/prisma.service';
import { R2Service } from '../integrations/r2/r2.service';

describe('MediaService', () => {
  let service: MediaService;
  let prisma: any;
  let r2: any;

  const TRIP = 'trip-1';
  const USER = 'user-1';
  const OTHER = 'user-2';
  const DOC = 'doc-1';

  const docRow = (overrides: Record<string, any> = {}) => ({
    id: DOC,
    tripId: TRIP,
    uploadedBy: USER,
    mediaType: 'photo',
    storageKey: `trips/${TRIP}/abc.jpg`,
    storageUrl: 'https://cdn.example.com/trips/trip-1/abc.jpg',
    fromChat: false,
    createdAt: new Date('2026-07-01'),
    ...overrides,
  });

  beforeEach(async () => {
    prisma = {
      trip: { findFirst: jest.fn(), update: jest.fn(), updateMany: jest.fn() },
      tripDocument: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
        count: jest.fn().mockResolvedValue(1),
      },
      tripActivity: { updateMany: jest.fn() },
      $transaction: jest.fn((cb: any) => cb(prisma)),
    };

    r2 = {
      presignUpload: jest.fn(),
      presignDownload: jest.fn((key: string) => `https://r2.example.com/get/${key}`),
      headObject: jest.fn(),
      resolvePublicUrl: jest.fn((key: string) => `https://cdn.example.com/${key}`),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MediaService,
        { provide: PrismaService, useValue: prisma },
        { provide: R2Service, useValue: r2 },
      ],
    }).compile();

    service = module.get<MediaService>(MediaService);
  });

  describe('presignUpload', () => {
    it('issues a presigned URL for a participant', async () => {
      prisma.trip.findFirst.mockResolvedValue({ id: TRIP, coverDocumentId: null });
      r2.presignUpload.mockResolvedValue({
        upload_url: 'https://r2.example.com/put',
        storage_key: `trips/${TRIP}/xyz.jpg`,
        expires_in: 300,
      });

      const result = await service.presignUpload(USER, {
        trip_id: TRIP,
        media_type: 'photo',
        content_type: 'image/jpeg',
      });

      expect(result.storage_key).toContain(TRIP);
      expect(r2.presignUpload).toHaveBeenCalledWith(TRIP, 'image/jpeg');
    });

    it('throws NotFound for a non-participant', async () => {
      prisma.trip.findFirst.mockResolvedValue(null);
      await expect(
        service.presignUpload(USER, {
          trip_id: TRIP,
          media_type: 'photo',
          content_type: 'image/jpeg',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('listDocuments', () => {
    it('lists documents and flags the cover', async () => {
      prisma.trip.findFirst.mockResolvedValue({ id: TRIP, coverDocumentId: DOC });
      prisma.tripDocument.findMany.mockResolvedValue([docRow()]);

      const result = await service.listDocuments(TRIP, USER);

      expect(result.data).toHaveLength(1);
      expect(result.data[0].is_cover).toBe(true);
    });
  });

  describe('createDocument', () => {
    beforeEach(() => {
      prisma.trip.findFirst.mockResolvedValue({ id: TRIP, coverDocumentId: null });
    });

    it('registers a verified R2 object', async () => {
      r2.headObject.mockResolvedValue({ exists: true, size: 1024 });
      prisma.tripDocument.create.mockResolvedValue(docRow());
      prisma.tripDocument.count.mockResolvedValue(1);
      prisma.trip.update.mockResolvedValue({});

      const result = await service.createDocument(TRIP, USER, {
        storage_key: `trips/${TRIP}/abc.jpg`,
        media_type: 'photo',
      });

      expect(result.url).toContain('abc.jpg');
      expect(prisma.tripDocument.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ fromChat: false, mediaType: 'photo' }),
        }),
      );
      expect(prisma.trip.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { coverDocumentId: DOC } }),
      );
    });

    it('does not overwrite existing cover on second media', async () => {
      // Second non-chat doc: count >1 and already has cover
      prisma.trip.findFirst.mockResolvedValueOnce({ id: TRIP, coverDocumentId: null }); // assertParticipant
      prisma.trip.findFirst.mockResolvedValueOnce({ id: TRIP, coverDocumentId: DOC }); // trip cover already set
      r2.headObject.mockResolvedValue({ exists: true });
      prisma.tripDocument.create.mockResolvedValue(docRow({ id: 'doc-2' }));
      prisma.tripDocument.count.mockResolvedValue(2);

      const result = await service.createDocument(TRIP, USER, {
        storage_key: `trips/${TRIP}/second.jpg`,
        media_type: 'photo',
      });

      expect(result.is_cover).toBe(false);
      expect(prisma.trip.update).not.toHaveBeenCalled();
    });

    it('rejects a storage_key from another trip', async () => {
      await expect(
        service.createDocument(TRIP, USER, {
          storage_key: `trips/other-trip/abc.jpg`,
          media_type: 'photo',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('rejects when the object does not exist in R2', async () => {
      r2.headObject.mockResolvedValue({ exists: false });
      await expect(
        service.createDocument(TRIP, USER, {
          storage_key: `trips/${TRIP}/missing.jpg`,
          media_type: 'photo',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteDocument', () => {
    it('deletes for the uploader and clears cover references', async () => {
      prisma.trip.findFirst.mockResolvedValue({ id: TRIP, creatorId: OTHER });
      prisma.tripDocument.findFirst.mockResolvedValue(docRow());

      await service.deleteDocument(TRIP, DOC, USER);

      expect(prisma.trip.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({ data: { coverDocumentId: null } }),
      );
      expect(prisma.tripDocument.delete).toHaveBeenCalledWith({ where: { id: DOC } });
    });

    it('allows the trip creator to delete someone else’s upload', async () => {
      prisma.trip.findFirst.mockResolvedValue({ id: TRIP, creatorId: USER });
      prisma.tripDocument.findFirst.mockResolvedValue(docRow({ uploadedBy: OTHER }));

      await service.deleteDocument(TRIP, DOC, USER);

      expect(prisma.tripDocument.delete).toHaveBeenCalled();
    });

    it('throws Forbidden for a non-uploader, non-creator', async () => {
      prisma.trip.findFirst.mockResolvedValue({ id: TRIP, creatorId: OTHER });
      prisma.tripDocument.findFirst.mockResolvedValue(docRow({ uploadedBy: OTHER }));

      await expect(service.deleteDocument(TRIP, DOC, USER)).rejects.toThrow(ForbiddenException);
    });

    it('throws NotFound when document missing', async () => {
      prisma.trip.findFirst.mockResolvedValue({ id: TRIP, creatorId: USER });
      prisma.tripDocument.findFirst.mockResolvedValue(null);
      await expect(service.deleteDocument(TRIP, DOC, USER)).rejects.toThrow(NotFoundException);
    });
  });
});
