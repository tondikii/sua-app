import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import request = require('supertest');
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';

/**
 * End-to-end coverage for Milestone 8 (Wishlist & Trip Conversion).
 *
 * Requires a reachable Postgres (DATABASE_URL) — the suite TRUNCATEs `users`
 * (cascade) before running and signs real JWTs so requests pass JwtAuthGuard.
 */
describe('Wishlist E2E (M8)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  let userId: string;
  let userToken: string;
  let otherUserId: string;
  let otherToken: string;

  let wishlistId: string;

  const auth = (token: string) => ({ Authorization: `Bearer ${token}` });

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
        googleId: 'google-e2e-wish-1',
        email: 'wish1@example.com',
        name: 'Wish One',
        username: 'wish_one',
      },
    });
    userId = user1.id;
    userToken = jwt.sign({ sub: userId });

    const user2 = await prisma.user.create({
      data: {
        googleId: 'google-e2e-wish-2',
        email: 'wish2@example.com',
        name: 'Wish Two',
        username: 'wish_two',
      },
    });
    otherUserId = user2.id;
    otherToken = jwt.sign({ sub: otherUserId });
  }, 60000);

  afterAll(async () => {
    await app.close();
  });

  describe('POST /v1/wishlists', () => {
    it('creates a wishlist item with defaults', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/wishlists')
        .set(auth(userToken))
        .send({
          place_name: 'Pantai Tanjung Aan',
          start_time: '13:00',
          end_time: '16:00',
          location_label: 'Lombok, NTB',
          link: 'https://maps.google.com/xyz',
          notes: 'Bawa sunscreen',
          tags: ['#pantai', '#sunset'],
          priority_level: 'high',
        })
        .expect(HttpStatus.CREATED);

      expect(res.body.place_name).toBe('Pantai Tanjung Aan');
      expect(res.body.priority_level).toBe('high');
      expect(res.body.tags).toEqual(['#pantai', '#sunset']);
      wishlistId = res.body.id;
    });

    it('rejects missing place_name', async () => {
      await request(app.getHttpServer())
        .post('/v1/wishlists')
        .set(auth(userToken))
        .send({ priority_level: 'medium' })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/wishlists', () => {
    it('lists the current user items and filters by priority/tag', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/wishlists')
        .set(auth(userToken))
        .expect(HttpStatus.OK);

      expect(res.body.data.some((w: any) => w.id === wishlistId)).toBe(true);

      const filtered = await request(app.getHttpServer())
        .get('/v1/wishlists?priority=high&tag=%23pantai')
        .set(auth(userToken))
        .expect(HttpStatus.OK);

      expect(filtered.body.data.some((w: any) => w.id === wishlistId)).toBe(true);
    });

    it('does not leak another user’s wishlist items', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/wishlists')
        .set(auth(otherToken))
        .expect(HttpStatus.OK);

      expect(res.body.data.some((w: any) => w.id === wishlistId)).toBe(false);
    });
  });

  describe('PUT /v1/wishlists/:id', () => {
    it('updates fields for the owner', async () => {
      const res = await request(app.getHttpServer())
        .put(`/v1/wishlists/${wishlistId}`)
        .set(auth(userToken))
        .send({ notes: 'Updated notes' })
        .expect(HttpStatus.OK);

      expect(res.body.notes).toBe('Updated notes');
    });

    it('rejects a non-owner', async () => {
      await request(app.getHttpServer())
        .put(`/v1/wishlists/${wishlistId}`)
        .set(auth(otherToken))
        .send({ notes: 'Hijacked' })
        .expect(HttpStatus.FORBIDDEN);
    });
  });

  describe('POST /v1/wishlists/:id/convert-to-trip', () => {
    it('atomically creates a trip + day-1 activity and soft-deletes the wishlist', async () => {
      const res = await request(app.getHttpServer())
        .post(`/v1/wishlists/${wishlistId}/convert-to-trip`)
        .set(auth(userToken))
        .send({ start_date: '2026-08-01', end_date: '2026-08-05' })
        .expect(HttpStatus.CREATED);

      expect(res.body.status).toBe('fixed');
      expect(res.body.start_date).toBe('2026-08-01');

      const activities = await request(app.getHttpServer())
        .get(`/v1/trips/${res.body.id}/activities`)
        .set(auth(userToken))
        .expect(HttpStatus.OK);

      const seeded = Array.isArray(activities.body) ? activities.body : activities.body.data;
      expect(seeded.some((a: any) => a.place_name === 'Pantai Tanjung Aan')).toBe(true);

      // Wishlist is now soft-deleted — no longer listed, and re-converting fails.
      const list = await request(app.getHttpServer())
        .get('/v1/wishlists')
        .set(auth(userToken))
        .expect(HttpStatus.OK);
      expect(list.body.data.some((w: any) => w.id === wishlistId)).toBe(false);

      await request(app.getHttpServer())
        .post(`/v1/wishlists/${wishlistId}/convert-to-trip`)
        .set(auth(userToken))
        .send({ start_date: '2026-09-01', end_date: '2026-09-05' })
        .expect(HttpStatus.NOT_FOUND);
    });

    it('rejects an invalid date range without mutating anything', async () => {
      const create = await request(app.getHttpServer())
        .post('/v1/wishlists')
        .set(auth(userToken))
        .send({ place_name: 'Bukit Merese' })
        .expect(HttpStatus.CREATED);

      await request(app.getHttpServer())
        .post(`/v1/wishlists/${create.body.id}/convert-to-trip`)
        .set(auth(userToken))
        .send({ start_date: '2026-09-05', end_date: '2026-09-01' })
        .expect(HttpStatus.BAD_REQUEST);

      // Still present (not soft-deleted) since the transaction never ran.
      const list = await request(app.getHttpServer())
        .get('/v1/wishlists')
        .set(auth(userToken))
        .expect(HttpStatus.OK);
      expect(list.body.data.some((w: any) => w.id === create.body.id)).toBe(true);
    });
  });

  describe('DELETE /v1/wishlists/:id', () => {
    it('soft-deletes for the owner', async () => {
      const create = await request(app.getHttpServer())
        .post('/v1/wishlists')
        .set(auth(userToken))
        .send({ place_name: 'Air Terjun Sendang Gile' })
        .expect(HttpStatus.CREATED);

      await request(app.getHttpServer())
        .delete(`/v1/wishlists/${create.body.id}`)
        .set(auth(userToken))
        .expect(HttpStatus.NO_CONTENT);

      const list = await request(app.getHttpServer())
        .get('/v1/wishlists')
        .set(auth(userToken))
        .expect(HttpStatus.OK);
      expect(list.body.data.some((w: any) => w.id === create.body.id)).toBe(false);
    });

    it('rejects a non-owner', async () => {
      const create = await request(app.getHttpServer())
        .post('/v1/wishlists')
        .set(auth(userToken))
        .send({ place_name: 'Gili Trawangan' })
        .expect(HttpStatus.CREATED);

      await request(app.getHttpServer())
        .delete(`/v1/wishlists/${create.body.id}`)
        .set(auth(otherToken))
        .expect(HttpStatus.FORBIDDEN);
    });
  });
});