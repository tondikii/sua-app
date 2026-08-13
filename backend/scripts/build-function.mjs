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
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = path.resolve(backendRoot, '..');

/**
 * Inline the workspace packages (`@atur-perjalanan/*`) into the bundle so the
 * deployed `api/index.js` is self-contained for the Zod schemas. Other npm
 * packages stay external and resolve from node_modules at runtime.
 *
 * Without this, Vercel resolves `@atur-perjalanan/shared-validation` from the
 * workspace `dist/` on the server — which can go stale if the build cache is
 * restored, causing "Validation failed" from an old schema even after redeploy.
 */
const inlineWorkspacePackages = {
  name: 'inline-workspace-packages',
  setup(build) {
    for (const pkg of ['@atur-perjalanan/shared-validation', '@atur-perjalanan/shared-types']) {
      build.onResolve({ filter: new RegExp(`^${pkg.replace('/', '\\/')}$`) }, (args) => {
        return {
          path: require.resolve(pkg, { paths: [backendRoot] }),
          namespace: 'file',
        };
      });
    }
  },
};

mkdirSync(path.join(repoRoot, 'api'), { recursive: true });

await build({
  entryPoints: [path.join(backendRoot, 'dist', 'vercel-handler.js')],
  outfile: path.join(repoRoot, 'api', 'index.js'),
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target: 'node20',
  packages: 'external',
  plugins: [inlineWorkspacePackages],
  sourcemap: false,
  logLevel: 'info',
});

console.log('✓ Bundled Vercel function → api/index.js (repo root)');
