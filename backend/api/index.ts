import 'reflect-metadata';
import type { IncomingMessage, ServerResponse } from 'http';
import { createApp } from '../dist/main.js';

/**
 * Vercel serverless entry point (/api folder convention, Vercel root = backend/).
 *
 * Vercel bundles this file (and its imports) with esbuild, which includes the
 * compiled shared workspace packages (@atur-perjalanan/shared-*, built to JS)
 * that the compiled backend requires at runtime. The Nest app (Express
 * adapter) is built lazily on first invocation and cached in module scope for
 * warm invocations — the standard pattern for Express/Nest on Vercel Functions.
 */
let cachedHandler: ((req: IncomingMessage, res: ServerResponse) => void) | null = null;

async function getHandler() {
  if (!cachedHandler) {
    const app = await createApp();
    await app.init();
    cachedHandler = app.getHttpAdapter().getInstance() as (
      req: IncomingMessage,
      res: ServerResponse,
    ) => void;
  }
  return cachedHandler;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const appHandler = await getHandler();
  return appHandler(req, res);
}
