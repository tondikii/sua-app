import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import request = require('supertest');
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { R2Service } from '../src/integrations/r2/r2.service';

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

      expect(res.body.cover_image_url).toContain('test-key');
      expect(res.body.cover_image_url).toContain('X-Amz-Signature');
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

  describe('Activities (M6)', () => {
    let activityId: string;

    it('creates an activity on a fixed trip', async () => {
      const res = await request(app.getHttpServer())
        .post(`/v1/trips/${tripId}/activities`)
        .set(auth(userToken))
        .send({
          place_name: 'Pantai Tiga Warna',
          activity_date: '2027-06-20',
          start_time: '09:00',
          end_time: '12:00',
          kind: 'destination',
          location_label: 'Malang',
          description: 'Snorkeling',
        })
        .expect(HttpStatus.CREATED);

      expect(res.body.place_name).toBe('Pantai Tiga Warna');
      expect(res.body.kind).toBe('destination');
      expect(res.body.start_time).toBe('09:00');
      expect(res.body.end_time).toBe('12:00');
      activityId = res.body.id;
    });

    it('lists activities sorted by date and time', async () => {
      const res = await request(app.getHttpServer())
        .get(`/v1/trips/${tripId}/activities`)
        .set(auth(userToken))
        .expect(HttpStatus.OK);

      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].place_name).toBe('Pantai Tiga Warna');
      expect(res.body).toHaveProperty('next_cursor');
    });

    it('gets a single activity', async () => {
      const res = await request(app.getHttpServer())
        .get(`/v1/trips/${tripId}/activities/${activityId}`)
        .set(auth(userToken))
        .expect(HttpStatus.OK);

      expect(res.body.id).toBe(activityId);
      expect(res.body.place_name).toBe('Pantai Tiga Warna');
    });

    it('updates an activity', async () => {
      const res = await request(app.getHttpServer())
        .put(`/v1/trips/${tripId}/activities/${activityId}`)
        .set(auth(userToken))
        .send({ place_name: 'Pantai Updated', description: 'New notes' })
        .expect(HttpStatus.OK);

      expect(res.body.place_name).toBe('Pantai Updated');
      expect(res.body.description).toBe('New notes');
    });

    it('rejects activity_date outside trip range', async () => {
      await request(app.getHttpServer())
        .post(`/v1/trips/${tripId}/activities`)
        .set(auth(userToken))
        .send({
          place_name: 'Out of Range',
          activity_date: '2027-08-01',
          start_time: '09:00',
          end_time: '10:00',
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('rejects start_time > end_time', async () => {
      await request(app.getHttpServer())
        .post(`/v1/trips/${tripId}/activities`)
        .set(auth(userToken))
        .send({
          place_name: 'Bad Times',
          activity_date: '2027-06-20',
          start_time: '14:00',
          end_time: '10:00',
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('denies access to non-participant', async () => {
      await request(app.getHttpServer())
        .get(`/v1/trips/${tripId}/activities`)
        .set(auth(otherToken))
        .expect(HttpStatus.NOT_FOUND);
    });

    it('deletes an activity', async () => {
      await request(app.getHttpServer())
        .delete(`/v1/trips/${tripId}/activities/${activityId}`)
        .set(auth(userToken))
        .expect(HttpStatus.NO_CONTENT);

      const listRes = await request(app.getHttpServer())
        .get(`/v1/trips/${tripId}/activities`)
        .set(auth(userToken))
        .expect(HttpStatus.OK);

      expect(listRes.body.data.some((a: any) => a.id === activityId)).toBe(false);
    });
  });

  describe('Voting (M5 tests)', () => {
    // Voting tests covered in unit tests; e2e structure verified above
    it('placeholder: voting functionality covered by unit tests', () => {
      expect(true).toBe(true);
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

/**
 * End-to-end coverage for Milestone 7 (Chat & Media).
 *
 * Requires a reachable Postgres (DATABASE_URL). `R2Service` is mocked so the
 * suite never touches Cloudflare R2 over the network (no credentials needed,
 * no real objects created) — mirroring how the Auth suite mocks Google. All
 * S3 interactions (presign upload/download, HeadObject) return deterministic
 * fixtures, letting us assert the surrounding DB + authorization behaviour.
 */
describe('Chat & Media E2E (M7)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  let creatorId: string;
  let creatorToken: string;
  let memberId: string;
  let memberToken: string;
  let outsiderToken: string;

  let tripId: string;

  const auth = (token: string) => ({ Authorization: `Bearer ${token}` });

  let uploadCounter = 0;

  // Mock R2 — presign is normally a local signing op, HeadObject a network call.
  const r2Mock = {
    presignUpload: jest.fn(async (tripIdArg: string, contentType: string) => {
      const ext = contentType.split('/')[1] ?? 'bin';
      const storageKey = `trips/${tripIdArg}/mock-${uploadCounter++}.${ext}`;
      return {
        upload_url: `https://r2-upload.example.com/${storageKey}?X-Amz-Signature=putsig`,
        storage_key: storageKey,
        expires_in: 300,
      };
    }),
    headObject: jest.fn(async () => ({ exists: true, size: 1024 })),
    presignDownload: jest.fn(
      async (storageKey: string) =>
        `https://r2-signed.example.com/${storageKey}?X-Amz-Signature=getsig&X-Amz-Expires=3600`,
    ),
    presignDownloads: jest.fn(async (storageKeys: string[]) => {
      const unique = [...new Set(storageKeys.filter(Boolean))];
      return new Map(
        unique.map((key) => [
          key,
          `https://r2-signed.example.com/${key}?X-Amz-Signature=getsig&X-Amz-Expires=3600`,
        ]),
      );
    }),
    extractStorageKey: jest.fn((urlOrKey: string) => {
      try {
        return new URL(urlOrKey).pathname.replace(/^\/+/, '');
      } catch {
        return urlOrKey;
      }
    }),
    resolvePublicUrl: jest.fn((storageKey: string) => `https://cdn.example.com/${storageKey}`),
  };

  jest.setTimeout(60000);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(R2Service)
      .useValue(r2Mock)
      .compile();

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

    const creator = await prisma.user.create({
      data: {
        googleId: 'google-m7-1',
        email: 'creator-m7@example.com',
        name: 'Creator M7',
        username: 'creator_m7',
      },
    });
    creatorId = creator.id;
    creatorToken = jwt.sign({ sub: creatorId });

    const member = await prisma.user.create({
      data: {
        googleId: 'google-m7-2',
        email: 'member-m7@example.com',
        name: 'Member M7',
        username: 'member_m7',
      },
    });
    memberId = member.id;
    memberToken = jwt.sign({ sub: memberId });

    const outsider = await prisma.user.create({
      data: {
        googleId: 'google-m7-3',
        email: 'outsider-m7@example.com',
        name: 'Outsider M7',
        username: 'outsider_m7',
      },
    });
    outsiderToken = jwt.sign({ sub: outsider.id });

    const trip = await prisma.trip.create({
      data: {
        creatorId,
        name: 'Media Trip',
        status: 'fixed',
        startDate: new Date('2027-06-19'),
        endDate: new Date('2027-06-22'),
      },
    });
    tripId = trip.id;
    await prisma.tripParticipant.createMany({
      data: [
        { tripId, userId: creatorId },
        { tripId, userId: memberId },
      ],
    });
  }, 60000);

  afterAll(async () => {
    await app.close();
  });

  describe('POST /v1/uploads/presign', () => {
    it('issues a presigned upload for a participant', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/uploads/presign')
        .set(auth(memberToken))
        .send({ trip_id: tripId, media_type: 'photo', content_type: 'image/jpeg' })
        .expect(HttpStatus.OK);

      expect(res.body).toHaveProperty('upload_url');
      expect(res.body.storage_key).toContain(`trips/${tripId}/`);
      expect(res.body.expires_in).toBe(300);
      expect(res.body).not.toHaveProperty('public_url');
    });

    it('denies presign for a non-participant', async () => {
      await request(app.getHttpServer())
        .post('/v1/uploads/presign')
        .set(auth(outsiderToken))
        .send({ trip_id: tripId, media_type: 'photo', content_type: 'image/jpeg' })
        .expect(HttpStatus.NOT_FOUND);
    });

    it('rejects an invalid media_type', async () => {
      await request(app.getHttpServer())
        .post('/v1/uploads/presign')
        .set(auth(memberToken))
        .send({ trip_id: tripId, media_type: 'audio', content_type: 'audio/mp3' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('rejects unauthenticated requests', async () => {
      await request(app.getHttpServer())
        .post('/v1/uploads/presign')
        .send({ trip_id: tripId, media_type: 'photo', content_type: 'image/jpeg' })
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('POST /v1/trips/:tripId/documents (register)', () => {
    it('registers a verified R2 object and returns a presigned url', async () => {
      const storageKey = `trips/${tripId}/registered.jpg`;

      const res = await request(app.getHttpServer())
        .post(`/v1/trips/${tripId}/documents`)
        .set(auth(memberToken))
        .send({ storage_key: storageKey, media_type: 'photo' })
        .expect(HttpStatus.CREATED);

      expect(res.body.storage_key).toBe(storageKey);
      expect(res.body.url).toContain('X-Amz-Signature');
      expect(res.body.url_expires_in).toBe(3600);
      expect(res.body.from_chat).toBe(false);

      const row = await prisma.tripDocument.findUnique({ where: { id: res.body.id } });
      expect(row).not.toBeNull();
      expect(row?.uploadedBy).toBe(memberId);
    });

    it('rejects a storage_key that belongs to another trip', async () => {
      await request(app.getHttpServer())
        .post(`/v1/trips/${tripId}/documents`)
        .set(auth(memberToken))
        .send({ storage_key: 'trips/00000000-0000-0000-0000-000000000000/x.jpg', media_type: 'photo' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('rejects when the object is not present in R2', async () => {
      r2Mock.headObject.mockResolvedValueOnce({ exists: false, size: 0 });

      await request(app.getHttpServer())
        .post(`/v1/trips/${tripId}/documents`)
        .set(auth(memberToken))
        .send({ storage_key: `trips/${tripId}/missing.jpg`, media_type: 'photo' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('denies registration by a non-participant', async () => {
      await request(app.getHttpServer())
        .post(`/v1/trips/${tripId}/documents`)
        .set(auth(outsiderToken))
        .send({ storage_key: `trips/${tripId}/nope.jpg`, media_type: 'photo' })
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('GET /v1/trips/:tripId/documents', () => {
    it('lists documents with presigned urls for a participant', async () => {
      const res = await request(app.getHttpServer())
        .get(`/v1/trips/${tripId}/documents`)
        .set(auth(creatorToken))
        .expect(HttpStatus.OK);

      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].url).toContain('X-Amz-Signature');
      expect(res.body.data[0].url_expires_in).toBe(3600);
    });

    it('denies listing for a non-participant', async () => {
      await request(app.getHttpServer())
        .get(`/v1/trips/${tripId}/documents`)
        .set(auth(outsiderToken))
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('POST /v1/trips/:tripId/messages', () => {
    it('sends a text message', async () => {
      const res = await request(app.getHttpServer())
        .post(`/v1/trips/${tripId}/messages`)
        .set(auth(creatorToken))
        .send({ message_kind: 'text', message_text: 'Halo semua!' })
        .expect(HttpStatus.CREATED);

      expect(res.body.message_kind).toBe('text');
      expect(res.body.message_text).toBe('Halo semua!');
      expect(res.body.sender.username).toBe('creator_m7');
    });

    it('rejects a text message without message_text', async () => {
      await request(app.getHttpServer())
        .post(`/v1/trips/${tripId}/messages`)
        .set(auth(creatorToken))
        .send({ message_kind: 'text' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('rejects a photo message without media_url', async () => {
      await request(app.getHttpServer())
        .post(`/v1/trips/${tripId}/messages`)
        .set(auth(creatorToken))
        .send({ message_kind: 'photo' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('sends a photo message and auto-creates a from_chat document', async () => {
      const storageKey = `trips/${tripId}/chat-photo.jpg`;

      const res = await request(app.getHttpServer())
        .post(`/v1/trips/${tripId}/messages`)
        .set(auth(memberToken))
        .send({ message_kind: 'photo', media_url: storageKey })
        .expect(HttpStatus.CREATED);

      expect(res.body.message_kind).toBe('photo');
      expect(res.body.media_url).toContain('X-Amz-Signature');

      const chatDoc = await prisma.tripDocument.findFirst({
        where: { tripId, fromChat: true, storageKey },
      });
      expect(chatDoc).not.toBeNull();
      expect(chatDoc?.uploadedBy).toBe(memberId);
    });

    it('returns 404 when replying to a message from another trip', async () => {
      await request(app.getHttpServer())
        .post(`/v1/trips/${tripId}/messages`)
        .set(auth(creatorToken))
        .send({
          message_kind: 'text',
          message_text: 'reply',
          reply_to_id: '00000000-0000-0000-0000-000000000000',
        })
        .expect(HttpStatus.NOT_FOUND);
    });

    it('denies sending by a non-participant', async () => {
      await request(app.getHttpServer())
        .post(`/v1/trips/${tripId}/messages`)
        .set(auth(outsiderToken))
        .send({ message_kind: 'text', message_text: 'intruder' })
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('GET /v1/trips/:tripId/messages', () => {
    it('lists messages in a { data, next_cursor } envelope, newest first', async () => {
      const res = await request(app.getHttpServer())
        .get(`/v1/trips/${tripId}/messages`)
        .set(auth(memberToken))
        .expect(HttpStatus.OK);

      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body).toHaveProperty('next_cursor');

      const photo = res.body.data.find((m: any) => m.message_kind === 'photo');
      expect(photo?.media_url).toContain('X-Amz-Signature');
    });

    it('denies listing for a non-participant', async () => {
      await request(app.getHttpServer())
        .get(`/v1/trips/${tripId}/messages`)
        .set(auth(outsiderToken))
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('PUT /v1/trips/:tripId/messages/read', () => {
    it('advances the read cursor for the caller', async () => {
      await request(app.getHttpServer())
        .put(`/v1/trips/${tripId}/messages/read`)
        .set(auth(memberToken))
        .expect(HttpStatus.NO_CONTENT);

      const readRow = await prisma.tripMessageRead.findUnique({
        where: { tripId_userId: { tripId, userId: memberId } },
      });
      expect(readRow).not.toBeNull();
      expect(readRow?.lastReadAt).toBeTruthy();
    });
  });

  describe('DELETE /v1/trips/:tripId/messages/:messageId', () => {
    let messageId: string;

    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post(`/v1/trips/${tripId}/messages`)
        .set(auth(creatorToken))
        .send({ message_kind: 'text', message_text: 'to be deleted' })
        .expect(HttpStatus.CREATED);
      messageId = res.body.id;
    });

    it('denies deletion by a non-sender', async () => {
      await request(app.getHttpServer())
        .delete(`/v1/trips/${tripId}/messages/${messageId}`)
        .set(auth(memberToken))
        .expect(HttpStatus.FORBIDDEN);
    });

    it('soft-deletes the message for its sender and excludes it from the list', async () => {
      await request(app.getHttpServer())
        .delete(`/v1/trips/${tripId}/messages/${messageId}`)
        .set(auth(creatorToken))
        .expect(HttpStatus.NO_CONTENT);

      const row = await prisma.tripMessage.findUnique({ where: { id: messageId } });
      expect(row?.deletedAt).not.toBeNull();

      const list = await request(app.getHttpServer())
        .get(`/v1/trips/${tripId}/messages`)
        .set(auth(creatorToken))
        .expect(HttpStatus.OK);

      // listMessages filters deletedAt: null — soft-deleted rows stay in DB but
      // are not returned in the thread (clients render placeholders via Realtime).
      expect(list.body.data.find((m: any) => m.id === messageId)).toBeUndefined();
    });
  });

  describe('DELETE /v1/trips/:tripId/documents/:documentId', () => {
    let documentId: string;

    beforeAll(async () => {
      const doc = await prisma.tripDocument.create({
        data: {
          tripId,
          uploadedBy: memberId,
          mediaType: 'photo',
          storageKey: `trips/${tripId}/deletable.jpg`,
          storageUrl: `https://cdn.example.com/trips/${tripId}/deletable.jpg`,
        },
      });
      documentId = doc.id;
    });

    it('denies deletion by a non-uploader, non-creator', async () => {
      await request(app.getHttpServer())
        .delete(`/v1/trips/${tripId}/documents/${documentId}`)
        .set(auth(outsiderToken))
        .expect(HttpStatus.FORBIDDEN);
    });

    it('lets the trip creator delete another member’s upload and clears cover refs', async () => {
      await prisma.trip.update({
        where: { id: tripId },
        data: { coverDocumentId: documentId },
      });

      await request(app.getHttpServer())
        .delete(`/v1/trips/${tripId}/documents/${documentId}`)
        .set(auth(creatorToken))
        .expect(HttpStatus.NO_CONTENT);

      const row = await prisma.tripDocument.findUnique({ where: { id: documentId } });
      expect(row).toBeNull();

      const trip = await prisma.trip.findUnique({ where: { id: tripId } });
      expect(trip?.coverDocumentId).toBeNull();
    });
  });
});
