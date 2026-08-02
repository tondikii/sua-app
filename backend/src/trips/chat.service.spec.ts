import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ChatService } from './chat.service';
import { PrismaService } from '../prisma/prisma.service';
import { R2Service } from '../integrations/r2/r2.service';

describe('ChatService', () => {
  let service: ChatService;
  let prisma: any;

  const TRIP = 'trip-1';
  const USER = 'user-1';
  const OTHER = 'user-2';
  const MESSAGE = 'msg-1';

  const senderRow = (id = USER) => ({ id, name: 'User', username: 'user', avatarUrl: null });

  beforeEach(async () => {
    prisma = {
      trip: { findFirst: jest.fn() },
      tripMessage: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        count: jest.fn().mockResolvedValue(0),
      },
      tripDocument: { create: jest.fn() },
      tripMessageRead: { upsert: jest.fn(), findUnique: jest.fn().mockResolvedValue(null) },
      $transaction: jest.fn((cb: any) => cb(prisma)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        { provide: PrismaService, useValue: prisma },
        {
          provide: R2Service,
          useValue: {
            presignDownload: jest.fn((key: string) => `https://r2.example.com/get/${key}`),
            extractStorageKey: jest.fn((url: string) =>
              url.replace('https://cdn.example.com/', ''),
            ),
          },
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
  });

  describe('listMessages', () => {
    it('lists messages for a participant, most recent first', async () => {
      prisma.trip.findFirst.mockResolvedValue({ id: TRIP });
      prisma.tripMessage.findMany.mockResolvedValue([
        {
          id: MESSAGE,
          tripId: TRIP,
          senderId: USER,
          messageKind: 'text',
          messageText: 'Halo semua!',
          mediaUrl: null,
          mediaDuration: null,
          replyToId: null,
          deletedAt: null,
          createdAt: new Date('2026-07-01T10:00:00Z'),
          sender: senderRow(),
          replyTo: null,
        },
      ]);

      const result = await service.listMessages(TRIP, USER);

      expect(result.data).toHaveLength(1);
      expect(result.data[0].message_text).toBe('Halo semua!');
      expect(result.next_cursor).toBeNull();
    });

    it('throws NotFound for a non-participant', async () => {
      prisma.trip.findFirst.mockResolvedValue(null);
      await expect(service.listMessages(TRIP, USER)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createMessage', () => {
    beforeEach(() => {
      prisma.trip.findFirst.mockResolvedValue({ id: TRIP });
    });

    it('creates a text message', async () => {
      prisma.tripMessage.create.mockResolvedValue({
        id: MESSAGE,
        tripId: TRIP,
        senderId: USER,
        messageKind: 'text',
        messageText: 'Halo!',
        mediaUrl: null,
        mediaDuration: null,
        replyToId: null,
        deletedAt: null,
        createdAt: new Date(),
        sender: senderRow(),
        replyTo: null,
      });

      const result = await service.createMessage(TRIP, USER, {
        message_kind: 'text',
        message_text: 'Halo!',
      });

      expect(result.message_text).toBe('Halo!');
      expect(prisma.tripDocument.create).not.toHaveBeenCalled();
    });

    it('rejects text message without message_text', async () => {
      await expect(service.createMessage(TRIP, USER, { message_kind: 'text' })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('rejects photo message without media_url', async () => {
      await expect(service.createMessage(TRIP, USER, { message_kind: 'photo' })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('creates a photo message and auto-inserts a trip_documents row with from_chat=true', async () => {
      prisma.tripMessage.create.mockResolvedValue({
        id: MESSAGE,
        tripId: TRIP,
        senderId: USER,
        messageKind: 'photo',
        messageText: null,
        mediaUrl: 'https://cdn.example.com/trips/trip-1/abc.jpg',
        mediaDuration: null,
        replyToId: null,
        deletedAt: null,
        createdAt: new Date(),
        sender: senderRow(),
        replyTo: null,
      });

      await service.createMessage(TRIP, USER, {
        message_kind: 'photo',
        media_url: 'https://cdn.example.com/trips/trip-1/abc.jpg',
      });

      expect(prisma.tripDocument.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            tripId: TRIP,
            mediaType: 'photo',
            storageUrl: 'https://cdn.example.com/trips/trip-1/abc.jpg',
            fromChat: true,
          }),
        }),
      );
    });

    it('throws NotFound when reply_to_id does not belong to the trip', async () => {
      prisma.tripMessage.findFirst.mockResolvedValue(null);
      await expect(
        service.createMessage(TRIP, USER, {
          message_kind: 'text',
          message_text: 'Balas',
          reply_to_id: 'nope',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteMessage', () => {
    it('soft-deletes a message for its sender', async () => {
      prisma.tripMessage.findFirst.mockResolvedValue({
        id: MESSAGE,
        tripId: TRIP,
        senderId: USER,
        deletedAt: null,
      });

      await service.deleteMessage(TRIP, MESSAGE, USER);

      expect(prisma.tripMessage.update).toHaveBeenCalledWith({
        where: { id: MESSAGE },
        data: { deletedAt: expect.any(Date) },
      });
    });

    it('throws Forbidden when caller is not the sender', async () => {
      prisma.tripMessage.findFirst.mockResolvedValue({
        id: MESSAGE,
        tripId: TRIP,
        senderId: OTHER,
        deletedAt: null,
      });
      await expect(service.deleteMessage(TRIP, MESSAGE, USER)).rejects.toThrow(ForbiddenException);
    });

    it('throws NotFound when message missing', async () => {
      prisma.tripMessage.findFirst.mockResolvedValue(null);
      await expect(service.deleteMessage(TRIP, MESSAGE, USER)).rejects.toThrow(NotFoundException);
    });
  });

  describe('markRead', () => {
    it('upserts the read cursor for a participant', async () => {
      prisma.trip.findFirst.mockResolvedValue({ id: TRIP });
      await service.markRead(TRIP, USER);
      expect(prisma.tripMessageRead.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { tripId_userId: { tripId: TRIP, userId: USER } },
        }),
      );
    });
  });
});
