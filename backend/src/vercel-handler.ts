// Must be set before importing `./main`: `main.ts` runs `bootstrap()` unless
// `VERCEL === '1'`. On the Vercel runtime the env is set, but setting it here
// makes the bundle safe to load anywhere (local tests, other hosts).
process.env.VERCEL = '1';

import { INestApplication } from '@nestjs/common';
import { Request, Response } from 'express';
import express, { Express } from 'express';
import { createApp } from './main';
import { ExpressAdapter } from '@nestjs/platform-express';

/**
 * Vercel serverless handler — compiled by `nest build` into `dist/vercel-handler.js`,
 * then bundled by esbuild (`build:function`) into a single `api/index.js` file.
 *
 * Bundling is required because Vercel does NOT bundle relative TypeScript imports
 * outside the `api/` directory at runtime — the function would fail with
 * `Cannot find module '../backend/src/main.ts'`. The esbuild bundle inlines
 * `createApp()` (from `./main`) plus the whole Nest dependency graph, while
 * external packages (`--packages=external`) resolve from node_modules at runtime.
 *
 * The global `/v1` prefix, CORS, exception filter and request-id interceptor all
 * come from `createApp()` (same factory as local bootstrap).
 */
const expressApp = express() as Express;
let app: INestApplication | null = null;

type BodyRequest = Request & { body?: unknown; _body?: boolean };

async function getApp(): Promise<INestApplication> {
  if (app) return app;

  const instance = await createApp(new ExpressAdapter(expressApp));
  await instance.init();
  app = instance;
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
