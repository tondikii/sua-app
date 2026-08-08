import 'reflect-metadata';
import { createApp } from '../dist/main.js';
import type { Request, Response } from 'express';

/**
 * Vercel serverless entry point (`/api` folder convention, Vercel Root Directory
 * = backend/).
 *
 * `createApp()` — exported by src/main.ts (which wires up AppModule, CORS, the
 * global validation pipe, the exception filter, the request-id interceptor and
 * the `/v1` prefix) — is reused as the single source of truth so local
 * (port 8080) and Vercel behave identically. Importing the compiled
 * `../dist/main.js` (rather than re-bundling raw `src/` from source via esbuild)
 * avoids re-transpiling the full Nest tree on Vercel and is the path that was
 * already verified to cold-start successfully.
 *
 * Mirrors the proven handler structure from
 * uangku-app/apps/server/api/index.ts: the app is created once on first
 * invocation and cached in module scope for warm invocations; the Express
 * instance (retrieved via the Nest HttpAdapter) is the actual handler Vercel
 * invokes.
 */
let cachedHandler: ((req: Request, res: Response) => void) | null = null;

async function getHandler() {
  if (cachedHandler) return cachedHandler;

  const app = await createApp();
  await app.init();
  cachedHandler = app
    .getHttpAdapter()
    .getInstance() as unknown as ((req: Request, res: Response) => void);
  return cachedHandler;
}

export default async function handler(req: Request, res: Response) {
  // Vercel pre-parses the body — mark it so Express doesn't double-parse it.
  if (req.body !== undefined) {
    (req as any)._body = true;
  }
  const appHandler = await getHandler();
  return appHandler(req, res);
}
