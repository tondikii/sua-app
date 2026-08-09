#!/usr/bin/env node
/**
 * Bundle the Vercel serverless handler into the repo-root `api/index.js`.
 *
 * Vercel deploys files under `<root>/api/` as functions. With Root Directory
 * `/` (repo root), the function must land at `api/index.js` in the repo root.
 * Nest's `nest build` compiles `src/vercel-handler.ts` → `dist/vercel-handler.js`
 * (with decorator metadata), and this script bundles that file — plus the whole
 * Nest dependency graph — into one self-contained root `api/index.js`. External
 * npm packages stay external (`packages=external`) and resolve from node_modules
 * at runtime (Vercel runs `pnpm install`), which keeps the bundle small and
 * avoids `Cannot find module '../backend/src/main.ts'` from importing raw TS
 * across folders.
 */
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { mkdirSync } from 'node:fs';

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = path.resolve(backendRoot, '..');

mkdirSync(path.join(repoRoot, 'api'), { recursive: true });

await build({
  entryPoints: [path.join(backendRoot, 'dist', 'vercel-handler.js')],
  outfile: path.join(repoRoot, 'api', 'index.js'),
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target: 'node20',
  packages: 'external',
  sourcemap: false,
  logLevel: 'info',
});

console.log('✓ Bundled Vercel function → api/index.js (repo root)');
