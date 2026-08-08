import type { IncomingMessage, ServerResponse } from 'http';
import { createApp } from './main';

/**
 * Vercel serverless entry point.
 *
 * Vercel invokes this handler for every request to the backend function. The
 * Nest app (Express adapter) is built lazily on first invocation and cached in
 * the module scope for subsequent warm invocations — the standard pattern for
 * running an Express/Nest app on Vercel Functions.
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
