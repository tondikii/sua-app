import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { RequestIdInterceptor } from './common/interceptors/request-id.interceptor';
import { ExpressAdapter } from '@nestjs/platform-express';

/** Build & configure the Nest app without listening (used by local bootstrap
 *  and the Vercel serverless handler in `api/index.ts`). */
export async function createApp(
  adapter?: ExpressAdapter,
): Promise<INestApplication> {
  const app = adapter
    ? await NestFactory.create(AppModule, adapter)
    : await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('v1');

  // NOTE: No global ValidationPipe here. All request bodies are validated
  // per-endpoint with ZodValidationPipe (shared-validation schemas). A global
  // class-validator pipe with `forbidNonWhitelisted` rejects type-alias bodies
  // (metatype Object) before the Zod pipe runs — which broke /auth/google and
  // every other Zod-validated endpoint with "Validation failed".

  // Global exception filter — structured JSON error envelope
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global request-id interceptor
  app.useGlobalInterceptors(new RequestIdInterceptor());

  // CORS — dev: allow all origins; production: whitelist APP_WEB_URL so the
  // static web app (Cloudflare Pages) can call the API. Play Store native
  // builds don't send Origin, so they are unaffected.
  const appWebUrl = process.env.APP_WEB_URL ?? 'http://localhost:8081';
  app.enableCors({
    origin:
      process.env.APP_ENV === 'production'
        ? [appWebUrl]
        : true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id'],
  });

  // Swagger (dev only)
  if (process.env.APP_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Atur Perjalanan API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  return app;
}

/** Local / Docker entry — Vercel (`api/index.ts`) uses createApp() directly. */
async function bootstrap() {
  const app = await createApp();
  const port = process.env.PORT ?? 8080;
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}/v1`);
}

if (process.env.VERCEL !== '1') {
  bootstrap();
}
