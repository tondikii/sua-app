import { INestApplication } from '@nestjs/common';
import { Express, Request, Response } from 'express';
import express from 'express';
import { createApp } from '../src/main';
import { ExpressAdapter } from '@nestjs/platform-express';

/**
 * Vercel serverless entry (`/api` directory, Vercel convention).
 *
 * `backend/vercel.json` rewrites every request to this function. The Nest app
 * is built once via `createApp()` (same factory as `main.ts`) and reused for
 * warm instances to avoid re-running DI container initialization on every
 * request. The global `/v1` prefix, CORS, exception filter and request-id
 * interceptor all come from `createApp()`.
 */
const expressApp: Express = express();
let app: INestApplication | null = null;

async function getApp(): Promise<INestApplication> {
  if (app) return app;

  app = await createApp(new ExpressAdapter(expressApp));
  return app;
}

export default async function handler(req: Request, res: Response): Promise<void> {
  // Vercel pre-parses the JSON body; let Express know so it doesn't re-read it.
  if (req.body !== undefined && typeof req.body === 'object') {
    (req as Request & { _body?: boolean })._body = true;
  }

  await getApp();
  expressApp(req, res);
}
