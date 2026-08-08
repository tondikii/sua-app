# ── Atur Perjalanan — Backend (NestJS) ───────────────────────────────
# Multi-stage build. Target production image is slim (node:20-alpine).
#
# NOTE: packages/shared-* declare `main: ./src/index.ts` (source is consumed
# directly by TypeScript), so we do NOT build them separately — tsc (via
# `nest build`) compiles everything together.
# ─────────────────────────────────────────────────────────────────────

# ── Stage 1: Build ───────────────────────────────────────────────────
FROM node:20-alpine AS build

RUN corepack enable
WORKDIR /app

# Install workspace deps (monorepo: backend + shared packages).
# `--frozen-lockfile` for reproducible installs; `--ignore-scripts` avoids
# husky/postinstall noise (Prisma generate runs explicitly below).
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY package.json ./
COPY backend/package.json ./backend/package.json
COPY packages/shared-types/package.json ./packages/shared-types/package.json
COPY packages/shared-validation/package.json ./packages/shared-validation/package.json

RUN pnpm install --frozen-lockfile --ignore-scripts

# Copy source
COPY tsconfig.base.json ./
COPY backend ./backend
COPY packages/shared-types ./packages/shared-types
COPY packages/shared-validation ./packages/shared-validation

# Generate Prisma client, then build NestJS
RUN pnpm --filter backend exec prisma generate
RUN pnpm --filter backend build

# ── Stage 2: Runtime ─────────────────────────────────────────────────
FROM node:20-alpine AS runtime

ENV NODE_ENV=production
WORKDIR /app

# Prisma client runtime + engine binaries
COPY --from=build /app/node_modules/.pnpm /app/node_modules/.pnpm
COPY --from=build /app/node_modules/.prisma /app/node_modules/.prisma

# Built NestJS output + Prisma schema (for `prisma migrate deploy`)
COPY --from=build /app/backend/dist ./dist
COPY --from=build /app/backend/prisma ./prisma

EXPOSE 8080

# Prisma queries need the generated client resolvable; nest build emits
# `@prisma/client` requires resolved from backend's node_modules during build.
# We expose node_modules symlink structure:
ENV NODE_PATH=/app/node_modules

# `prisma migrate deploy` runs manually via Render Shell (free tier no preDeployCommand); start the API here.
CMD ["node", "dist/main"]
