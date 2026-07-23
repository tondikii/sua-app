import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { RequestIdInterceptor } from '../src/common/interceptors/request-id.interceptor';

/**
 * e2e tests for Auth + Users flow.
 *
 * These tests run against a real database (Supabase local via `supabase start`).
 * Ensure DATABASE_URL and DIRECT_URL point to a local/test Supabase instance.
 *
 * Google Sign-In flow is mocked because we can't call Google in CI.
 */
describe('Auth & Users (e2e)', () => {
  let app: INestApplication;

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
    app.useGlobalInterceptors(new RequestIdInterceptor());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /v1/health', () => {
    it('should return 200', () => {
      return request(app.getHttpServer())
        .get('/v1/health')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status', 'ok');
        });
    });
  });

  describe('POST /v1/auth/google', () => {
    it('should return 400 for missing id_token', () => {
      return request(app.getHttpServer())
        .post('/v1/auth/google')
        .send({})
        .expect(400)
        .expect((res) => {
          expect(res.body.error).toBeDefined();
        });
    });

    it('should return 401 for invalid id_token', () => {
      return request(app.getHttpServer())
        .post('/v1/auth/google')
        .send({ id_token: 'not-a-real-google-token' })
        .expect(401);
    });
  });

  describe('GET /v1/users/check-username', () => {
    it('should return available status for a username', () => {
      return request(app.getHttpServer())
        .get('/v1/users/check-username?username=testcheckuser')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('username', 'testcheckuser');
          expect(res.body).toHaveProperty('available');
        });
    });

    it('should return 400 for username with invalid characters', () => {
      return request(app.getHttpServer())
        .get('/v1/users/check-username?username=invalid-user!')
        .expect(400);
    });
  });

  describe('GET /v1/users/me (requires JWT)', () => {
    it('should return 401 when no token provided', () => {
      return request(app.getHttpServer()).get('/v1/users/me').expect(401);
    });
  });

  describe('PUT /v1/users/me (requires JWT)', () => {
    it('should return 401 when no token provided', () => {
      return request(app.getHttpServer()).put('/v1/users/me').send({ bio: 'Hello' }).expect(401);
    });
  });
});
