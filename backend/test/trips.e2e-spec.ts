import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import request = require('supertest');
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';

/**
 * End-to-end coverage for Milestone 4 (Trips & Invitations).
 *
 * Requires a reachable Postgres (DATABASE_URL) — the suite TRUNCATEs `users`
 * (cascade) before running and signs real JWTs so requests pass JwtAuthGuard.
 */
describe('Trips E2E (M4)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  let userId: string;
  let userToken: string;
  let otherUserId: string;
  let otherToken: string;

  let tripId: string;

  const auth = (token: string) => ({ Authorization: `Bearer ${token}` });

  // Remote Postgres (Supabase pooler) can be slow on cold connections.
  jest.setTimeout(60000);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('v1');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    jwt = moduleFixture.get<JwtService>(JwtService);

    await prisma.$executeRawUnsafe('TRUNCATE TABLE users CASCADE');

    const user1 = await prisma.user.create({
      data: {
        googleId: 'google-e2e-1',
        email: 'user1@example.com',
        name: 'User One',
        username: 'user1_travel',
      },
    });
    userId = user1.id;
    userToken = jwt.sign({ sub: userId });

    const user2 = await prisma.user.create({
      data: {
        googleId: 'google-e2e-2',
        email: 'user2@example.com',
        name: 'User Two',
        username: 'user2_travel',
      },
    });
    otherUserId = user2.id;
    otherToken = jwt.sign({ sub: otherUserId });
  }, 60000);

  afterAll(async () => {
    await app.close();
  });

  describe('POST /v1/trips', () => {
    it('creates a fixed-date trip and auto-adds the creator', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/trips')
        .set(auth(userToken))
        .send({
          name: 'Lombok Beach Trip',
          tags: ['#pantai', '#alam'],
          start_date: '2027-06-19',
          end_date: '2027-06-22',
          is_all_day: true,
        })
        .expect(HttpStatus.CREATED);

      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe('Lombok Beach Trip');
      expect(res.body.status).toBe('fixed');
      expect(res.body.tags).toEqual(['#pantai', '#alam']);
      expect(res.body.participant_count).toBe(1);

      tripId = res.body.id;

      const participants = await prisma.tripParticipant.findMany({ where: { tripId } });
      expect(participants).toHaveLength(1);
      expect(participants[0].userId).toBe(userId);
    });

    it('creates a voting trip with candidates + auto poll + deadline', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/trips')
        .set(auth(userToken))
        .send({
          name: 'Raja Ampat Voting Trip',
          tags: ['#diving'],
          candidates: [
            { start_date: '2027-07-01', end_date: '2027-07-05' },
            { start_date: '2027-07-15', end_date: '2027-07-20' },
          ],
        })
        .expect(HttpStatus.CREATED);

      expect(res.body.status).toBe('voting_pending');
      expect(res.body.voting_deadline).toBeTruthy();
      expect(res.body.date_candidates).toHaveLength(2);

      const poll = await prisma.tripPoll.findFirst({
        where: { tripId: res.body.id, pollType: 'tanggal' },
      });
      expect(poll).not.toBeNull();
      expect(poll?.status).toBe('active');
    });

    it('rejects a trip with neither dates nor candidates', async () => {
      await request(app.getHttpServer())
        .post('/v1/trips')
        .set(auth(userToken))
        .send({ name: 'Empty Trip' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('rejects unauthenticated requests', async () => {
      await request(app.getHttpServer())
        .post('/v1/trips')
        .send({ name: 'No Auth', start_date: '2027-06-19', end_date: '2027-06-22' })
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('GET /v1/trips', () => {
    it('lists upcoming trips in a { data, next_cursor } envelope', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/trips?tab=upcoming')
        .set(auth(userToken))
        .expect(HttpStatus.OK);

      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0]).toHaveProperty('participant_count');
      expect(res.body.data[0]).toHaveProperty('participants_preview');
      expect(res.body).toHaveProperty('next_cursor');
    });

    it('rejects an invalid tab value', async () => {
      await request(app.getHttpServer())
        .get('/v1/trips?tab=bogus')
        .set(auth(userToken))
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/trips/:tripId', () => {
    it('returns detail for the creator', async () => {
      const res = await request(app.getHttpServer())
        .get(`/v1/trips/${tripId}`)
        .set(auth(userToken))
        .expect(HttpStatus.OK);

      expect(res.body.id).toBe(tripId);
      expect(res.body.name).toBe('Lombok Beach Trip');
      expect(res.body.creator.username).toBe('user1_travel');
    });

    it('denies access to a non-participant', async () => {
      await request(app.getHttpServer())
        .get(`/v1/trips/${tripId}`)
        .set(auth(otherToken))
        .expect(HttpStatus.FORBIDDEN);
    });

    it('returns 404 for a missing trip', async () => {
      await request(app.getHttpServer())
        .get('/v1/trips/00000000-0000-0000-0000-000000000000')
        .set(auth(userToken))
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('PUT /v1/trips/:tripId', () => {
    it('updates the trip as creator', async () => {
      const res = await request(app.getHttpServer())
        .put(`/v1/trips/${tripId}`)
        .set(auth(userToken))
        .send({ name: 'Updated Lombok Trip', is_public: true })
        .expect(HttpStatus.OK);

      expect(res.body.name).toBe('Updated Lombok Trip');
      expect(res.body.is_public).toBe(true);
    });

    it('denies update by a non-creator', async () => {
      await request(app.getHttpServer())
        .put(`/v1/trips/${tripId}`)
        .set(auth(otherToken))
        .send({ name: 'Hacked' })
        .expect(HttpStatus.FORBIDDEN);
    });
  });

  describe('POST /v1/trips/:tripId/invitations', () => {
    it('invites a user by username', async () => {
      const res = await request(app.getHttpServer())
        .post(`/v1/trips/${tripId}/invitations`)
        .set(auth(userToken))
        .send({ username: 'user2_travel' })
        .expect(HttpStatus.CREATED);

      expect(res.body.status).toBe('pending');
      expect(res.body.method).toBe('username');
      expect(res.body.invited_user_id).toBe(otherUserId);
    });

    it('rejects a duplicate pending invitation', async () => {
      await request(app.getHttpServer())
        .post(`/v1/trips/${tripId}/invitations`)
        .set(auth(userToken))
        .send({ username: 'user2_travel' })
        .expect(HttpStatus.CONFLICT);
    });

    it('denies invites from a non-participant', async () => {
      await request(app.getHttpServer())
        .post(`/v1/trips/${tripId}/invitations`)
        .set(auth(otherToken))
        .send({ username: 'user1_travel' })
        .expect(HttpStatus.FORBIDDEN);
    });

    it('returns 404 when inviting a non-existent username', async () => {
      await request(app.getHttpServer())
        .post(`/v1/trips/${tripId}/invitations`)
        .set(auth(userToken))
        .send({ username: 'ghost_user' })
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('GET /v1/trips/invitations', () => {
    it('lists pending invitations for the invitee', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/trips/invitations')
        .set(auth(otherToken))
        .expect(HttpStatus.OK);

      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0]).toHaveProperty('trip');
      expect(res.body.data[0]).toHaveProperty('inviter');
    });
  });

  describe('PUT /v1/trips/:tripId/invitations/:id (accept)', () => {
    it('accepts the invitation and adds the invitee as participant', async () => {
      const invitation = await prisma.tripInvitation.findFirst({
        where: { tripId, invitedUserId: otherUserId, status: 'pending' },
      });
      expect(invitation).not.toBeNull();

      await request(app.getHttpServer())
        .put(`/v1/trips/${tripId}/invitations/${invitation!.id}`)
        .set(auth(otherToken))
        .send({ accept: true })
        .expect(HttpStatus.NO_CONTENT);

      const participant = await prisma.tripParticipant.findUnique({
        where: { tripId_userId: { tripId, userId: otherUserId } },
      });
      expect(participant).not.toBeNull();

      const updated = await prisma.tripInvitation.findUnique({ where: { id: invitation!.id } });
      expect(updated?.status).toBe('accepted');
    });
  });

  describe('Invitation decline flow', () => {
    it('declines an invitation without adding a participant', async () => {
      // user2 (a participant now) invites nobody new; instead invite a fresh user.
      const user3 = await prisma.user.create({
        data: {
          googleId: 'google-e2e-3',
          email: 'user3@example.com',
          name: 'User Three',
          username: 'user3_travel',
        },
      });
      const user3Token = jwt.sign({ sub: user3.id });

      const created = await request(app.getHttpServer())
        .post(`/v1/trips/${tripId}/invitations`)
        .set(auth(userToken))
        .send({ username: 'user3_travel' })
        .expect(HttpStatus.CREATED);

      await request(app.getHttpServer())
        .put(`/v1/trips/${tripId}/invitations/${created.body.id}`)
        .set(auth(user3Token))
        .send({ accept: false })
        .expect(HttpStatus.NO_CONTENT);

      const participant = await prisma.tripParticipant.findUnique({
        where: { tripId_userId: { tripId, userId: user3.id } },
      });
      expect(participant).toBeNull();

      const inv = await prisma.tripInvitation.findUnique({ where: { id: created.body.id } });
      expect(inv?.status).toBe('declined');
    });
  });

  describe('Invitation cancel flow (inviter only)', () => {
    it('cancels a pending invitation', async () => {
      const user4 = await prisma.user.create({
        data: {
          googleId: 'google-e2e-4',
          email: 'user4@example.com',
          name: 'User Four',
          username: 'user4_travel',
        },
      });

      const created = await request(app.getHttpServer())
        .post(`/v1/trips/${tripId}/invitations`)
        .set(auth(userToken))
        .send({ username: 'user4_travel' })
        .expect(HttpStatus.CREATED);

      await request(app.getHttpServer())
        .delete(`/v1/trips/${tripId}/invitations/${created.body.id}`)
        .set(auth(userToken))
        .expect(HttpStatus.NO_CONTENT);

      const inv = await prisma.tripInvitation.findUnique({ where: { id: created.body.id } });
      expect(inv?.status).toBe('cancelled');

      // The invited user should no longer see it in their pending list.
      const user4Token = jwt.sign({ sub: user4.id });
      const list = await request(app.getHttpServer())
        .get('/v1/trips/invitations')
        .set(auth(user4Token))
        .expect(HttpStatus.OK);
      expect(list.body.data).toHaveLength(0);
    });
  });

  describe('GET /v1/trips/:tripId/members', () => {
    it('returns members + outstanding invitations', async () => {
      const res = await request(app.getHttpServer())
        .get(`/v1/trips/${tripId}/members`)
        .set(auth(userToken))
        .expect(HttpStatus.OK);

      expect(res.body).toHaveProperty('is_creator', true);
      expect(Array.isArray(res.body.members)).toBe(true);
      // creator + accepted user2
      expect(res.body.members.length).toBe(2);
      expect(res.body.members.some((m: any) => m.role === 'creator')).toBe(true);
      expect(Array.isArray(res.body.invitations)).toBe(true);
    });

    it('surfaces a declined invitation as state=rejected (re-invitable)', async () => {
      // user3 declined earlier in the "decline flow" suite.
      const res = await request(app.getHttpServer())
        .get(`/v1/trips/${tripId}/members`)
        .set(auth(userToken))
        .expect(HttpStatus.OK);

      const rejected = res.body.invitations.find((i: any) => i.state === 'rejected');
      expect(rejected).toBeDefined();
      expect(rejected.invited_user?.username).toBe('user3_travel');
    });
  });

  describe('Re-invite flow (undang kembali)', () => {
    it('reactivates a declined invitation without creating a duplicate', async () => {
      const before = await prisma.tripInvitation.count({
        where: { tripId, invitedUser: { username: 'user3_travel' } },
      });

      const res = await request(app.getHttpServer())
        .post(`/v1/trips/${tripId}/invitations`)
        .set(auth(userToken))
        .send({ username: 'user3_travel' })
        .expect(HttpStatus.CREATED);

      expect(res.body.status).toBe('pending');

      const after = await prisma.tripInvitation.count({
        where: { tripId, invitedUser: { username: 'user3_travel' } },
      });
      expect(after).toBe(before); // reactivated, not duplicated

      // Clean up so member-count assertions below stay deterministic.
      await prisma.tripInvitation.updateMany({
        where: { tripId, invitedUser: { username: 'user3_travel' } },
        data: { status: 'cancelled' },
      });
    });
  });

  describe('DELETE /v1/trips/:tripId/members/:memberId (creator only)', () => {
    it('removes an accepted member', async () => {
      await request(app.getHttpServer())
        .delete(`/v1/trips/${tripId}/members/${otherUserId}`)
        .set(auth(userToken))
        .expect(HttpStatus.NO_CONTENT);

      const participant = await prisma.tripParticipant.findUnique({
        where: { tripId_userId: { tripId, userId: otherUserId } },
      });
      expect(participant).toBeNull();
    });

    it('refuses to remove the creator', async () => {
      await request(app.getHttpServer())
        .delete(`/v1/trips/${tripId}/members/${userId}`)
        .set(auth(userToken))
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('PUT /v1/trips/:tripId/cover', () => {
    it('sets the trip cover to a document in the trip', async () => {
      const doc = await prisma.tripDocument.create({
        data: {
          tripId,
          uploadedBy: userId,
          mediaType: 'photo',
          storageKey: 'test-key',
          storageUrl: 'https://example.com/photo.jpg',
        },
      });

      const res = await request(app.getHttpServer())
        .put(`/v1/trips/${tripId}/cover`)
        .set(auth(userToken))
        .send({ document_id: doc.id })
        .expect(HttpStatus.OK);

      expect(res.body.cover_image_url).toBe('https://example.com/photo.jpg');
    });
  });

  describe('GET /v1/trips?tab=completed', () => {
    it('returns fixed trips whose end_date is in the past', async () => {
      const past = await prisma.trip.create({
        data: {
          creatorId: userId,
          name: 'Past Trip',
          status: 'fixed',
          startDate: new Date('2020-01-01'),
          endDate: new Date('2020-01-05'),
        },
      });
      await prisma.tripParticipant.create({ data: { tripId: past.id, userId } });

      const res = await request(app.getHttpServer())
        .get('/v1/trips?tab=completed')
        .set(auth(userToken))
        .expect(HttpStatus.OK);

      expect(res.body.data.some((t: any) => t.id === past.id)).toBe(true);
    });
  });

  describe('DELETE /v1/trips/:tripId (soft delete)', () => {
    it('soft-deletes the trip as creator', async () => {
      await request(app.getHttpServer())
        .delete(`/v1/trips/${tripId}`)
        .set(auth(userToken))
        .expect(HttpStatus.NO_CONTENT);

      const trip = await prisma.trip.findUnique({ where: { id: tripId } });
      expect(trip?.deletedAt).not.toBeNull();
    });

    it('denies delete by a non-creator', async () => {
      const trip = await prisma.trip.create({
        data: {
          creatorId: userId,
          name: 'Trip for delete test',
          status: 'fixed',
          startDate: new Date('2027-06-19'),
          endDate: new Date('2027-06-22'),
        },
      });
      await prisma.tripParticipant.create({ data: { tripId: trip.id, userId } });

      await request(app.getHttpServer())
        .delete(`/v1/trips/${trip.id}`)
        .set(auth(otherToken))
        .expect(HttpStatus.FORBIDDEN);
    });
  });
});
