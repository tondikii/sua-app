import { INestApplication } from '@nestjs/common';
import { Request, Response } from 'express';
import express, { Express } from 'express';
import { createApp } from '../backend/src/main.ts';
import { ExpressAdapter } from '@nestjs/platform-express';

/**
 * Vercel serverless entry (`/api` at repo root — Vercel convention).
 *
 * Root Directory project = `/` (repo root) so the workspace `node_modules`
 * (pnpm `.pnpm` store), shared packages and Prisma client — all outside
 * `backend/` — are bundled into the function. `vercel.json` (repo root)
 * rewrites every request to this function. The Nest app is built once via
 * `createApp()` (same factory as `backend/src/main.ts`) and reused for warm
 * instances; the global `/v1` prefix, CORS, exception filter and request-id
 * interceptor all come from `createApp()`.
 */
const expressApp = express() as Express;
let app: INestApplication | null = null;

type BodyRequest = Request & { body?: unknown; _body?: boolean };

async function getApp(): Promise<INestApplication> {
  if (app) return app;

  app = await createApp(new ExpressAdapter(expressApp));
  return app;
}

export default async function handler(req: Request, res: Response): Promise<void> {
  // Vercel pre-parses the JSON body; let Express know so it doesn't re-read it.
  const bodyReq = req as BodyRequest;
  if (bodyReq.body !== undefined && typeof bodyReq.body === 'object') {
    bodyReq._body = true;
  }

  await getApp();
  expressApp(req, res);
}
