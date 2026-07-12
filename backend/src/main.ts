import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { RequestIdInterceptor } from './common/interceptors/request-id.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('v1');

  // Global validation pipe — strip unknown fields, transform types
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global exception filter — structured JSON error envelope
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global request-id interceptor
  app.useGlobalInterceptors(new RequestIdInterceptor());

  // CORS — tighten in production via APP_ENV
  app.enableCors({
    origin: process.env.APP_ENV === 'production' ? false : true,
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

  const port = process.env.PORT ?? 8080;
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}/v1`);
}

bootstrap();
