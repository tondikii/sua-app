import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { PrismaService } from '../prisma/prisma.service';

describe('InvitationsService', () => {
  let service: InvitationsService;
  let prisma: any;

  const INVITER = 'inviter-1';
  const TRIP = 'trip-1';

  const invRow = (overrides: Record<string, any> = {}) => ({
    id: 'inv-1',
    tripId: TRIP,
    invitedBy: INVITER,
    invitedUserId: 'invitee-1',
    invitedEmail: null,
    method: 'username',
    status: 'pending',
    createdAt: new Date('2026-06-01'),
    updatedAt: new Date('2026-06-01'),
    ...overrides,
  });

  beforeEach(async () => {
    prisma = {
      trip: { findFirst: jest.fn() },
      user: { findFirst: jest.fn() },
      tripInvitation: {
        create: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
      },
      tripParticipant: { upsert: jest.fn() },
      $transaction: jest.fn((cb: any) => cb(prisma)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [InvitationsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<InvitationsService>(InvitationsService);
  });

  describe('createInvitation — validation', () => {
    it('rejects when both username and email are provided', async () => {
      await expect(
        service.createInvitation(TRIP, INVITER, { username: 'a', email: 'a@b.com' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('rejects when neither username nor email provided', async () => {
      await expect(service.createInvitation(TRIP, INVITER, {})).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throws NotFound when trip is missing', async () => {
      prisma.trip.findFirst.mockResolvedValue(null);
      await expect(service.createInvitation(TRIP, INVITER, { username: 'x' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws Forbidden when inviter is not a participant', async () => {
      prisma.trip.findFirst.mockResolvedValue({ id: TRIP, participants: [{ userId: 'someone' }] });
      await expect(service.createInvitation(TRIP, INVITER, { username: 'x' })).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('createInvitation — username', () => {
    beforeEach(() => {
      prisma.trip.findFirst.mockResolvedValue({
        id: TRIP,
        participants: [{ userId: INVITER }],
      });
    });

    it('creates a pending invitation to an existing user', async () => {
      prisma.user.findFirst.mockResolvedValue({ id: 'invitee-1' });
      prisma.tripInvitation.findFirst.mockResolvedValue(null);
      prisma.tripInvitation.create.mockResolvedValue(invRow());

      const result = await service.createInvitation(TRIP, INVITER, { username: 'invitee' });

      expect(result.status).toBe('pending');
      expect(result.method).toBe('username');
      expect(prisma.tripInvitation.create).toHaveBeenCalledWith({
        data: {
          tripId: TRIP,
          invitedBy: INVITER,
          invitedUserId: 'invitee-1',
          method: 'username',
          status: 'pending',
        },
      });
    });

    it('throws NotFound when username does not exist', async () => {
      prisma.user.findFirst.mockResolvedValue(null);
      await expect(service.createInvitation(TRIP, INVITER, { username: 'ghost' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('rejects inviting yourself', async () => {
      prisma.user.findFirst.mockResolvedValue({ id: INVITER });
      await expect(service.createInvitation(TRIP, INVITER, { username: 'me' })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('rejects when user is already a participant', async () => {
      prisma.trip.findFirst.mockResolvedValue({
        id: TRIP,
        participants: [{ userId: INVITER }, { userId: 'invitee-1' }],
      });
      prisma.user.findFirst.mockResolvedValue({ id: 'invitee-1' });
      await expect(
        service.createInvitation(TRIP, INVITER, { username: 'invitee' }),
      ).rejects.toThrow(ConflictException);
    });

    it('rejects when a pending invitation already exists', async () => {
      prisma.user.findFirst.mockResolvedValue({ id: 'invitee-1' });
      prisma.tripInvitation.findFirst.mockResolvedValue(invRow());
      await expect(
        service.createInvitation(TRIP, INVITER, { username: 'invitee' }),
      ).rejects.toThrow(ConflictException);
    });

    it('reactivates a declined invitation instead of duplicating (undang kembali)', async () => {
      prisma.user.findFirst.mockResolvedValue({ id: 'invitee-1' });
      prisma.tripInvitation.findFirst.mockResolvedValue(invRow({ status: 'declined' }));
      prisma.tripInvitation.update.mockResolvedValue(invRow({ status: 'pending' }));

      const result = await service.createInvitation(TRIP, INVITER, { username: 'invitee' });

      expect(prisma.tripInvitation.update).toHaveBeenCalledWith({
        where: { id: 'inv-1' },
        data: { status: 'pending', method: 'username', invitedBy: INVITER },
      });
      expect(prisma.tripInvitation.create).not.toHaveBeenCalled();
      expect(result.status).toBe('pending');
    });

    it('reactivates a cancelled invitation', async () => {
      prisma.user.findFirst.mockResolvedValue({ id: 'invitee-1' });
      prisma.tripInvitation.findFirst.mockResolvedValue(invRow({ status: 'cancelled' }));
      prisma.tripInvitation.update.mockResolvedValue(invRow({ status: 'pending' }));

      await service.createInvitation(TRIP, INVITER, { username: 'invitee' });

      expect(prisma.tripInvitation.update).toHaveBeenCalled();
      expect(prisma.tripInvitation.create).not.toHaveBeenCalled();
    });
  });

  describe('createInvitation — email', () => {
    beforeEach(() => {
      prisma.trip.findFirst.mockResolvedValue({
        id: TRIP,
        participants: [{ userId: INVITER }],
      });
    });

    it('creates an email invitation for an unregistered address', async () => {
      prisma.user.findFirst.mockResolvedValue(null);
      prisma.tripInvitation.findFirst.mockResolvedValue(null);
      prisma.tripInvitation.create.mockResolvedValue(
        invRow({ method: 'email', invitedUserId: null, invitedEmail: 'friend@example.com' }),
      );

      const result = await service.createInvitation(TRIP, INVITER, {
        email: 'friend@example.com',
      });

      expect(result.method).toBe('email');
      expect(result.invited_email).toBe('friend@example.com');
    });

    it('links an existing user when the email is registered', async () => {
      prisma.user.findFirst.mockResolvedValue({ id: 'invitee-2' });
      prisma.tripInvitation.findFirst.mockResolvedValue(null);
      prisma.tripInvitation.create.mockResolvedValue(
        invRow({ method: 'email', invitedUserId: 'invitee-2', invitedEmail: 'a@b.com' }),
      );

      await service.createInvitation(TRIP, INVITER, { email: 'A@B.com' });

      expect(prisma.tripInvitation.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ invitedUserId: 'invitee-2', invitedEmail: 'a@b.com' }),
        }),
      );
    });
  });

  describe('getUserInvitations', () => {
    it('returns enriched invitations with next_cursor', async () => {
      prisma.tripInvitation.findMany.mockResolvedValue([
        {
          ...invRow(),
          trip: {
            id: TRIP,
            name: 'Trip',
            startDate: null,
            endDate: null,
            status: 'voting_pending',
            isAllDay: true,
            startTime: null,
            endTime: null,
          },
          inviter: { id: INVITER, name: 'Inviter', username: 'inviter', avatarUrl: null },
        },
      ]);

      const result = await service.getUserInvitations('invitee-1');
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toHaveProperty('trip');
      expect(result.data[0]).toHaveProperty('inviter');
      expect(result.next_cursor).toBeNull();
    });
  });

  describe('respondToInvitation', () => {
    it('accepts: updates status and upserts participant', async () => {
      prisma.tripInvitation.findUnique.mockResolvedValue(invRow());
      prisma.tripInvitation.update.mockResolvedValue({});
      prisma.tripParticipant.upsert.mockResolvedValue({});

      await service.respondToInvitation(TRIP, 'inv-1', 'invitee-1', true);

      expect(prisma.tripInvitation.update).toHaveBeenCalledWith({
        where: { id: 'inv-1' },
        data: { status: 'accepted' },
      });
      expect(prisma.tripParticipant.upsert).toHaveBeenCalled();
    });

    it('declines: updates status without adding participant', async () => {
      prisma.tripInvitation.findUnique.mockResolvedValue(invRow());
      prisma.tripInvitation.update.mockResolvedValue({});

      await service.respondToInvitation(TRIP, 'inv-1', 'invitee-1', false);

      expect(prisma.tripInvitation.update).toHaveBeenCalledWith({
        where: { id: 'inv-1' },
        data: { status: 'declined' },
      });
      expect(prisma.tripParticipant.upsert).not.toHaveBeenCalled();
    });

    it('throws Forbidden when responder is not the invitee', async () => {
      prisma.tripInvitation.findUnique.mockResolvedValue(invRow());
      await expect(service.respondToInvitation(TRIP, 'inv-1', 'stranger', true)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('throws BadRequest when invitation is not pending', async () => {
      prisma.tripInvitation.findUnique.mockResolvedValue(invRow({ status: 'accepted' }));
      await expect(service.respondToInvitation(TRIP, 'inv-1', 'invitee-1', true)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throws NotFound when invitation belongs to another trip', async () => {
      prisma.tripInvitation.findUnique.mockResolvedValue(invRow({ tripId: 'other' }));
      await expect(service.respondToInvitation(TRIP, 'inv-1', 'invitee-1', true)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('cancelInvitation', () => {
    it('cancels a pending invitation as the inviter', async () => {
      prisma.tripInvitation.findUnique.mockResolvedValue(invRow());
      prisma.tripInvitation.update.mockResolvedValue({});
      await service.cancelInvitation(TRIP, 'inv-1', INVITER);
      expect(prisma.tripInvitation.update).toHaveBeenCalledWith({
        where: { id: 'inv-1' },
        data: { status: 'cancelled' },
      });
    });

    it('throws Forbidden when caller is not the inviter', async () => {
      prisma.tripInvitation.findUnique.mockResolvedValue(invRow({ invitedBy: 'other' }));
      await expect(service.cancelInvitation(TRIP, 'inv-1', INVITER)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('throws BadRequest when invitation is not pending', async () => {
      prisma.tripInvitation.findUnique.mockResolvedValue(invRow({ status: 'declined' }));
      await expect(service.cancelInvitation(TRIP, 'inv-1', INVITER)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
