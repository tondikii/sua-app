import 'reflect-metadata';
import { INestApplication } from '@nestjs/common';
import { createApp } from '../src/main';
import type { Request, Response } from 'express';

/**
 * Vercel serverless entry point (`backend/api/`; Vercel Root Directory =
 * `backend/`). Follows uangku-app/apps/server/api/index.ts: the app is built
 * once on first invocation and cached for warm invocations, and Vercel's
 * pre-parsed body is flagged with `_body` so Express doesn't re-parse it.
 *
 * Deviation from a literal copy: atur keeps its production config (global
 * `/v1` prefix, ValidationPipe, HttpExceptionFilter, RequestIdInterceptor,
 * env-aware CORS) in the `createApp()` factory in `src/main.ts`. We reuse it
 * instead of inlining a bare `AppModule` — otherwise the `/v1` global prefix
 * would be dropped and every route (e.g. `/v1/health`) would 404 on Vercel.
 * `createApp()` builds AppModule, so the app is still wired "from app.module".
 *
 * Imported from `../src/main` (source), like uangku sourcing `src/app.module`.
 */
let cachedApp: INestApplication | null = null;

async function getApp(): Promise<INestApplication> {
  if (cachedApp) return cachedApp;
  cachedApp = await createApp();
  await cachedApp.init();
  return cachedApp;
}

export default async (req: Request, res: Response) => {
  // Vercel pre-parses the body — mark it so Express doesn't double-parse it.
  if (req.body !== undefined) {
    (req as any)._body = true;
  }
  const app = await getApp();
  return app.getHttpAdapter().getInstance()(req, res);
};
