# Architecture Blueprint: Atur Perjalanan

> **Purpose**: This document is the canonical technical reference for AI coding assistants, developers, and automated tooling. It defines the authoritative structure, patterns, and contracts that all generated code, migrations, and scaffolding must conform to. Deviation from this document requires explicit justification.

---

## Table of Contents

1. [High-Level System Architecture](#1-high-level-system-architecture)
2. [Monorepo Directory Structure](#2-monorepo-directory-structure)
3. [Database Architecture & Schema Strategy](#3-database-architecture--schema-strategy)
4. [Backend Architecture Pattern (Go/Gin)](#4-backend-architecture-pattern-gogin)
5. [Mobile Architecture Pattern (KMP)](#5-mobile-architecture-pattern-kmp)

---

## 1. High-Level System Architecture

### 1.1 Component Overview

The system is composed of three primary tiers: the KMP mobile client, the Go/Gin backend, and the PostgreSQL data layer. All external service interactions are proxied through the backend — the mobile client **never** communicates with Google APIs directly.

```mermaid
graph TD
    subgraph "Mobile Client (KMP)"
        UI_Android["Android Native UI\n(Jetpack Compose)"]
        UI_iOS["iOS Native UI\n(SwiftUI)"]
        Shared["Shared KMM Module\n(Ktor · Kotlinx.Serialization\nCoroutines · StateFlow)"]
        UI_Android --> Shared
        UI_iOS --> Shared
    end

    subgraph "Backend (Go / Gin)"
        GW["API Gateway Layer\n(Gin Router · Middleware)"]
        Auth["Auth Middleware\n(JWT Validation)"]
        Handlers["HTTP Handlers"]
        Services["Service Layer\n(Business Logic)"]
        Repos["Repository Layer\n(DB Abstraction)"]
        GW --> Auth --> Handlers --> Services --> Repos
    end

    subgraph "Data Layer"
        PG[("PostgreSQL\n(Primary Store)")]
        ConnPool["pgx Connection Pool"]
        Repos --> ConnPool --> PG
    end

    subgraph "Google APIs"
        GAuth["Google Identity\n(OAuth 2.0 / OIDC)"]
        GCal["Google Calendar API\n(v3)"]
    end

    Shared -- "HTTPS REST/JSON" --> GW
    Services -- "Token Exchange &\nID Token Verification" --> GAuth
    Services -- "Create / Update Events" --> GCal
```

### 1.2 Request Lifecycle

```
Mobile Client
  └─ HTTPS Request (Bearer JWT)
       └─ Gin Router  →  Auth Middleware (validate JWT)
            └─ Handler  (parse & validate request body)
                 └─ Service  (enforce business rules, orchestrate)
                      └─ Repository  (execute parameterized SQL via pgx)
                           └─ PostgreSQL
```

### 1.3 Authentication Flow

```mermaid
sequenceDiagram
    participant App as KMP App
    participant BE as Go Backend
    participant GID as Google Identity

    App->>GID: Initiate Google Sign-In (OAuth 2.0)
    GID-->>App: ID Token (JWT)
    App->>BE: POST /v1/auth/google  { id_token }
    BE->>GID: Verify ID Token (tokeninfo endpoint / JWKS)
    GID-->>BE: Verified claims { sub, email, name, picture }
    BE->>BE: Upsert user record in `users` table
    alt New User (no username)
        BE-->>App: 200 { app_token, is_new_user: true }
        App->>BE: POST /v1/auth/complete-registration  { username }
        BE-->>App: 200 { app_token, user }
    else Returning User
        BE-->>App: 200 { app_token, user }
    end
```

---

## 2. Monorepo Directory Structure

The repository uses a flat monorepo strategy. Each top-level subdirectory is an independently buildable unit. Shared tooling lives at the root.

```
atur-perjalanan/
│
├── .github/
│   └── workflows/
│       ├── backend-ci.yml        # Go test, lint, build
│       └── mobile-ci.yml         # KMP build, unit tests
│
├── backend/                      # Go / Gin service
│   ├── cmd/
│   │   └── api/
│   │       └── main.go           # Entry point; wires DI, starts server
│   ├── internal/
│   │   ├── config/
│   │   │   └── config.go         # Env var loading (no hardcoded secrets)
│   │   ├── domain/               # Pure domain structs & interfaces
│   │   │   ├── user.go
│   │   │   ├── trip.go
│   │   │   ├── wishlist.go
│   │   │   └── errors.go         # Typed domain errors
│   │   ├── handler/              # HTTP layer (Gin handlers)
│   │   │   ├── auth_handler.go
│   │   │   ├── trip_handler.go   # trips + chat (messages) + voting endpoints
│   │   │   ├── user_handler.go
│   │   │   ├── wishlist_handler.go
│   │   │   └── response.go       # shared error envelope + DTO helpers
│   │   ├── middleware/
│   │   │   ├── auth.go           # JWT extraction & validation
│   │   │   ├── rate_limiter.go
│   │   │   └── request_id.go
│   │   ├── service/              # Business logic layer
│   │   │   ├── trip_service.go   # trips, invitations, voting, chat
│   │   │   ├── user_service.go   # auth upsert, profile, search
│   │   │   └── wishlist_service.go
│   │   ├── repository/           # Data access layer (one file per table)
│   │   │   ├── user_repo.go
│   │   │   ├── trip_repo.go
│   │   │   ├── trip_invitation_repo.go
│   │   │   ├── trip_date_candidate_repo.go
│   │   │   ├── trip_destination_repo.go
│   │   │   ├── trip_message_repo.go
│   │   │   └── wishlist_repo.go
│   │   └── platform/
│   │       ├── database/
│   │       │   └── postgres.go   # pgx pool initialization
│   │       ├── jwtutil/
│   │       │   └── jwtutil.go    # HS256 sign / verify
│   │       └── googleapi/
│   │           ├── auth.go       # ID token verification
│   │           └── calendar.go   # Google Calendar API client (M11)
│   ├── migrations/               # SQL migration files (golang-migrate)
│   │   ├── 000001_create_extensions.up.sql
│   │   ├── 000002_create_users.up.sql
│   │   └── ...                   # sequential .up.sql / .down.sql pairs
│   ├── go.mod
│   └── go.sum
│
├── mobile/                       # Kotlin Multiplatform project
│   ├── shared/                   # KMM shared module
│   │   ├── src/
│   │   │   ├── commonMain/kotlin/
│   │   │   │   └── com/aturperjalanan/
│   │   │   │       ├── data/
│   │   │   │       │   ├── remote/   # Ktor API clients
│   │   │   │       │   ├── local/    # SQLDelight local cache
│   │   │   │       │   └── repository/
│   │   │   │       ├── domain/
│   │   │   │       │   ├── model/
│   │   │   │       │   └── usecase/
│   │   │   │       └── presentation/
│   │   │   │           └── viewmodel/ # Shared ViewModels (StateFlow)
│   │   │   ├── androidMain/kotlin/
│   │   │   └── iosMain/kotlin/
│   │   └── build.gradle.kts
│   ├── androidApp/               # Android-specific Jetpack Compose UI
│   │   └── src/main/
│   │       └── com/aturperjalanan/android/
│   │           └── ui/
│   └── iosApp/                   # iOS-specific SwiftUI
│
├── figma/                        # Figma Make export — 125-screen React preview (design reference only)
│   ├── src/app/components/screens/  # Screen3Auth … Screen125DesignTokens
│   └── src/app/components/colors.ts # Canonical design tokens
│
├── docs/
│   ├── BRIEF.md
│   ├── PRD.md
│   ├── WORKFLOW.md
│   ├── ACCEPTANCE_CRITERIA.md
│   ├── FIGMA.md                  # Screen inventory, tokens, API gap analysis
│   ├── MILESTONES.md
│   └── ARCHITECTURE.md           # This file
│
├── .env.example                  # Template for required env vars (no secrets)
├── docker-compose.yml            # Local dev: PostgreSQL + backend
├── Makefile                      # Unified task runner (make migrate, make test)
└── README.md
```

---

## 3. Database Architecture & Schema Strategy

> **Design sync (Juli 2026)**: Dokumen ini membedakan **schema/API yang sudah ada di repo** (migrasi `000001`–`000015`, handler Go) vs **target desain Figma** (`figma/`, `docs/WORKFLOW.md`). Implementasi gap → milestone **M5.2** (lihat `docs/MILESTONES.md`). UI memakai label **Itinerary/aktivitas**; tabel/endpoint saat ini masih `trip_destinations` / `/destinations`.

### 3.0 Migration Inventory (Implemented)

| Migrasi | Isi |
|---------|-----|
| `000001` | Extension `pg_trgm`; fungsi `trigger_set_updated_at()` |
| `000002` | Tabel `users` (+ `is_public`, trigram index username/name) |
| `000003` | Tabel `follows` (composite PK; belum dipakai UI MVP) |
| `000004` | Tabel `trips` (status, dates, tags, `is_public`, soft delete) |
| `000005` | Tabel `trip_participants` |
| `000006` | Tabel `trip_invitations` (username \| email) |
| `000007` | Tabel `trip_date_candidates` |
| `000008` | Tabel `trip_date_votes` |
| `000009` | Tabel `trip_destinations` (minimal: place, maps, 1 ref link, sort_order) |
| `000010` | Tabel `trip_messages` (text only) |
| `000011` | Tabel `wishlists` (minimal: place, link, tags, priority) |
| `000012` | Alter `trips`: +`cover_image_url`, +`voting_deadline` |
| `000013` | Alter `trip_messages`: +`deleted_at` (soft delete) |
| `000014` | Enum `notification_type` + tabel `notifications` |
| `000015` | View `user_follow_counts` (belum dipakai repo Go; counts via query langsung) |

**Total: 15 migrasi.** Semua definisi tabel di §3.3 di bawah ini yang **tidak** punya label 🔜 sudah tercermin di migrasi di atas.

### 3.0.1 Design Sync Status Matrix

Status vs **125 layar Figma** (`docs/FIGMA.md`, `docs/WORKFLOW.md`):

| Domain UI | Layar (§) | Schema DB | API | Catatan |
|-----------|-----------|-----------|-----|---------|
| Auth + username | §2 (3–4) | ✅ `users` | ✅ `POST /auth/google`, `complete-registration`, `GET /check-username` | — |
| Beranda tabs + undangan | §3 (5–8) | ✅ | ✅ `GET /trips?tab=`, `GET /trips/invitations`, `PUT …/invitations/:id` | Tab Undangan = endpoint terpisah |
| Notifikasi | §3 (9) | ✅ `notifications` | ✅ CRUD read + unread-count | Tipe `follow` ditunda post-MVP |
| Pencarian + profil publik | §4 (10–13) | ✅ | ✅ `GET /users/search`, `GET /:username`, `GET /:username/trips` | Riwayat search = lokal |
| Profil + edit | §5 (15–18) | ✅ | ✅ `GET/PUT /users/me` | 🔜 social URL, avatar upload, `DELETE /users/me` |
| Create trip + undang | §6 (21–41) | ⚠️ partial | ⚠️ partial | 🔜 `is_all_day`, `start_time`, `end_time`; batalkan undangan |
| Itinerary / aktivitas | §7 (42–55) | ⚠️ thin | ⚠️ thin | 🔜 times, kind, cover, multi-ref, `PUT` edit |
| Voting multi-tipe | §8 (56–75) | ❌ no `trip_polls` | ⚠️ date only | Tanggal via `candidates`; Aktivitas/Lainnya → M5.2/M9 |
| Chat text | §9 (76, 86–88) | ✅ text + soft delete | ✅ GET/POST/DELETE messages | Hapus hanya pesan sendiri (`Screen88`); `Screen87` tanpa Hapus |
| Chat media + reply | §9 (77–85, 89–92) | ❌ | ❌ | 🔜 `media_type`, upload, `reply_to_id`; reply quote UI di preview |
| Media tab + cover | §10 (93–94) | ❌ no `trip_documents` | ❌ | 🔜 upload, list, set cover |
| Kelola trip | §11 (95–103) | ✅ partial | ⚠️ partial | 🔜 list members, remove member, cancel invite |
| Wishlist | §12 (104–117) | ⚠️ thin | ✅ CRUD basic | 🔜 times, location, notes, convert atomic |
| Google Calendar | §11 (96) | — | ❌ | M11 |

Legenda: ✅ selaras desain · ⚠️ ada tapi field/kontrak kurang · ❌ belum ada · 🔜 target M5.2 kecuali disebut lain.

### 3.1 General Rules

| Rule | Specification |
|---|---|
| **Primary Keys** | `UUID v4` (generated at the application layer via `uuid.New()`). Avoids sequential ID enumeration attacks. |
| **Timestamps** | All tables include `created_at TIMESTAMPTZ DEFAULT NOW()`. Mutable records also include `updated_at TIMESTAMPTZ DEFAULT NOW()`. |
| **Soft Deletes** | `trips`, `wishlists`, dan `trip_messages` memakai `deleted_at TIMESTAMPTZ NULL`. Semua query **wajib** `WHERE deleted_at IS NULL` (kecuali admin/audit). Hard delete untuk join/vote records. |
| **Migrations** | Managed by `golang-migrate`. All schema changes are versioned, sequential `.up.sql` / `.down.sql` files. Direct DDL on production is forbidden. |
| **Character Encoding** | `UTF-8` (PostgreSQL `ENCODING 'UTF8'`). |
| **Text Search** | Tag-based filtering uses the `GIN` index on `jsonb` columns. Full-text search (username/name) uses `pg_trgm` with a `GIN` index. |

### 3.2 Entity-Relationship Overview

```mermaid
erDiagram
    users {
        uuid id PK
        varchar google_id UK
        varchar email UK
        varchar name
        varchar username UK
        text avatar_url
        text bio
        timestamptz created_at
        timestamptz updated_at
    }
    trips {
        uuid id PK
        uuid creator_id FK
        varchar name
        jsonb tags
        varchar status
        date start_date
        date end_date
        boolean is_public
        timestamptz deleted_at
        timestamptz created_at
        timestamptz updated_at
    }
    trip_participants {
        uuid trip_id FK
        uuid user_id FK
        timestamptz joined_at
    }
    trip_invitations {
        uuid id PK
        uuid trip_id FK
        uuid invited_by FK
        uuid invited_user_id
        varchar invited_email
        varchar method
        varchar status
        timestamptz created_at
        timestamptz updated_at
    }
    trip_date_candidates {
        uuid id PK
        uuid trip_id FK
        date start_date
        date end_date
        timestamptz created_at
    }
    trip_date_votes {
        uuid candidate_id FK
        uuid user_id FK
        timestamptz created_at
    }
    trip_destinations {
        uuid id PK
        uuid trip_id FK
        varchar place_name
        text maps_link
        text reference_link
        integer sort_order
        timestamptz created_at
    }
    trip_messages {
        uuid id PK
        uuid trip_id FK
        uuid sender_id FK
        text message_text
        timestamptz created_at
    }
    wishlists {
        uuid id PK
        uuid user_id FK
        varchar place_name
        text link
        jsonb tags
        varchar priority_level
        timestamptz deleted_at
        timestamptz created_at
        timestamptz updated_at
    }

    users ||--o{ trips : "creator_id"
    trips ||--o{ trip_participants : "trip_id"
    users ||--o{ trip_participants : "user_id"
    trips ||--o{ trip_invitations : "trip_id"
    trips ||--o{ trip_date_candidates : "trip_id"
    trip_date_candidates ||--o{ trip_date_votes : "candidate_id"
    users ||--o{ trip_date_votes : "user_id"
    trips ||--o{ trip_destinations : "trip_id"
    trips ||--o{ trip_messages : "trip_id"
    users ||--o{ trip_messages : "sender_id"
    users ||--o{ wishlists : "user_id"
```

### 3.3 Table Definitions

#### `users`
```sql
CREATE TABLE users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    google_id   VARCHAR(255) NOT NULL UNIQUE,
    email       VARCHAR(320) NOT NULL UNIQUE,
    name        VARCHAR(255) NOT NULL,
    username    VARCHAR(50)  NOT NULL UNIQUE,
    avatar_url  TEXT,
    bio         TEXT,
    is_public   BOOLEAN NOT NULL DEFAULT TRUE,   -- post-MVP account privacy; MVP: profil publik
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

> 🔜 **M5.2 (desain `Screen18EditProfil`)**: kolom opsional `website_url TEXT`, `location_label TEXT` untuk link sosial & pin lokasi di kartu profil.

---

#### `trips` *(000004 + 000012 — implemented)*
```sql
CREATE TABLE trips (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id      UUID NOT NULL REFERENCES users(id),
    name            VARCHAR(255) NOT NULL,
    tags            JSONB NOT NULL DEFAULT '[]',
    status          VARCHAR(20) NOT NULL DEFAULT 'voting_pending'
                        CHECK (status IN ('voting_pending', 'fixed')),
    start_date      DATE,
    end_date        DATE,
    is_public       BOOLEAN NOT NULL DEFAULT FALSE,
    cover_image_url TEXT,              -- M5.1; default resolver di service layer
    voting_deadline TIMESTAMPTZ,       -- M5.1; set saat create dengan >1 kandidat; clear on lock
    deleted_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_date_range CHECK (
        start_date IS NULL OR end_date IS NULL OR start_date <= end_date
    )
);
```

> 🔜 **M5.2 (desain §6 `Screen22`–`Screen31`)**: `is_all_day BOOLEAN DEFAULT TRUE`, `start_time TIME`, `end_time TIME` — waktu perjalanan non-sepanjang-hari.
>
> 🔜 **M5.2b (desain §10 `Screen93`)**: `cover_document_id UUID REFERENCES trip_documents(id)` — cover dari media trip (menggantikan URL manual).

> **Relationship**: 1:N dengan `users` (creator). M:N via `trip_participants`. 1:N dengan kandidat tanggal, aktivitas, pesan, undangan. 🔜 `trip_documents`, `trip_polls` (§3.5).

---

#### `trip_participants`
```sql
CREATE TABLE trip_participants (
    trip_id   UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    user_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (trip_id, user_id)
);

-- Indexes
CREATE INDEX idx_trip_participants_user_id ON trip_participants (user_id);
```

> **Relationship**: Resolves the M:N between `trips` and `users`. The composite PK enforces that a user can only appear once per trip.

---

#### `trip_invitations`
```sql
CREATE TABLE trip_invitations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id         UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    invited_by      UUID NOT NULL REFERENCES users(id),
    invited_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    invited_email   VARCHAR(320),
    method          VARCHAR(10) NOT NULL CHECK (method IN ('username', 'email')),
    status          VARCHAR(10) NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'accepted', 'declined')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT invitation_target_check CHECK (
        (method = 'username' AND invited_user_id IS NOT NULL) OR
        (method = 'email'    AND invited_email   IS NOT NULL)
    )
);

-- Indexes
CREATE INDEX idx_trip_invitations_invited_user ON trip_invitations (invited_user_id)
    WHERE status = 'pending';
CREATE INDEX idx_trip_invitations_trip_id      ON trip_invitations (trip_id);
```

---

#### `trip_date_candidates`
```sql
CREATE TABLE trip_date_candidates (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id    UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date   DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_candidate_range CHECK (start_date <= end_date)
);

-- Indexes
CREATE INDEX idx_trip_date_candidates_trip_id ON trip_date_candidates (trip_id);
```

---

#### `trip_date_votes`
```sql
CREATE TABLE trip_date_votes (
    candidate_id UUID NOT NULL REFERENCES trip_date_candidates(id) ON DELETE CASCADE,
    user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (candidate_id, user_id)
);

-- Indexes
CREATE INDEX idx_trip_date_votes_user_id ON trip_date_votes (user_id);
```

> **Relationship**: M:N between `trip_date_candidates` and `users`. The composite PK ensures one vote per user per candidate.

---

#### `trip_destinations` *(000009 — implemented; UI = aktivitas itinerary)*
> **UI mapping**: Tab Itinerary di Figma. Endpoint: `/v1/trips/:id/destinations`. Rename ke `trip_activities` post-MVP jika diperlukan.

```sql
-- ── Implemented (000009) ──
CREATE TABLE trip_destinations (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id        UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    place_name     VARCHAR(255) NOT NULL,
    maps_link      TEXT,
    reference_link TEXT,              -- single link only today
    sort_order     INTEGER NOT NULL DEFAULT 0,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

> 🔜 **M5.2 — enrich aktivitas** (selaras `ActivityDraft` di `ActivityParts.tsx`):

```sql
-- Target columns (migration 000016+)
ALTER TABLE trip_destinations
    ADD COLUMN activity_date     DATE,           -- hari itinerary (derived from trip range)
    ADD COLUMN start_time        TIME NOT NULL DEFAULT '09:00',
    ADD COLUMN end_time          TIME NOT NULL DEFAULT '10:00',
    ADD COLUMN kind              VARCHAR(20) DEFAULT 'activity'
        CHECK (kind IN ('gather','transport','meal','activity','destination')),
    ADD COLUMN description       TEXT,
    ADD COLUMN location_label    TEXT,
    ADD COLUMN ref_links         JSONB NOT NULL DEFAULT '[]',  -- [{url, label?}]
    ADD COLUMN cover_source      VARCHAR(20) DEFAULT 'none'
        CHECK (cover_source IN ('none','maps','trip_media','device','icon')),
    ADD COLUMN cover_icon        VARCHAR(50),    -- icon id when cover_source=icon
    ADD COLUMN cover_document_id UUID,           -- FK trip_documents when cover_source=trip_media
    ADD COLUMN thumbnail_url     TEXT;           -- resolved from maps_link via Places/Static API
```

| Figma field (`ActivityDraft`) | Target column |
|-------------------------------|---------------|
| `title` | `place_name` |
| `startTime` / `endTime` | `start_time` / `end_time` |
| `kind` | `kind` |
| `location` / `mapsPlaceName` | `location_label` |
| `description` | `description` |
| `maps_link` (form) | `maps_link` |
| `refLinks[]` | `ref_links` JSONB |
| `coverSource` / `coverIcon` / `coverUrl` | `cover_source`, `cover_icon`, `thumbnail_url`, `cover_document_id` |

---

#### `trip_messages`
```sql
CREATE TABLE trip_messages (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id      UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    sender_id    UUID NOT NULL REFERENCES users(id),
    message_text TEXT NOT NULL,
    deleted_at   TIMESTAMPTZ,              -- soft delete (M5.1); sender-only DELETE endpoint
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_trip_messages_trip_active
    ON trip_messages (trip_id, created_at DESC)
    WHERE deleted_at IS NULL;
```

> **Note**: Index partial `(trip_id, created_at DESC) WHERE deleted_at IS NULL` melayani query chat utama: N pesan terbaru per trip. Long-press delete (Figma `Screen88` pesan sendiri) → set `deleted_at`, bukan hard delete. `Screen87` (pesan orang lain) tidak menampilkan opsi Hapus.

---

#### `notifications` *(M5.1)*
```sql
CREATE TYPE notification_type AS ENUM (
    'invite', 'follow', 'voting_deadline', 'destination_update'
);

CREATE TABLE notifications (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type        notification_type NOT NULL,
    actor_id    UUID REFERENCES users(id) ON DELETE SET NULL,
    trip_id     UUID REFERENCES trips(id) ON DELETE CASCADE,
    payload     JSONB NOT NULL DEFAULT '{}',
    is_read     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_unread
    ON notifications (user_id, created_at DESC)
    WHERE is_read = FALSE;
```

> **UI**: Tab Beranda bell → `Screen9Notifikasi`. Badge unread via `GET /v1/notifications/unread-count`.

---

#### `user_follow_counts` *(view — migration 000015; post-MVP follow feature)*
```sql
CREATE OR REPLACE VIEW user_follow_counts AS
SELECT u.id AS user_id,
       COUNT(DISTINCT f_in.follower_id)  AS followers_count,
       COUNT(DISTINCT f_out.following_id) AS following_count
FROM users u
LEFT JOIN follows f_in  ON f_in.following_id  = u.id
LEFT JOIN follows f_out ON f_out.follower_id  = u.id
GROUP BY u.id;
```

> View sudah tersedia; fitur follow UI/API ditunda post-MVP (lihat §4.3.1).

---

#### `wishlists` *(000011 — implemented)*
```sql
CREATE TABLE wishlists (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    place_name     VARCHAR(255) NOT NULL,
    link           TEXT,
    tags           JSONB NOT NULL DEFAULT '[]',
    priority_level VARCHAR(10) NOT NULL DEFAULT 'medium'
                       CHECK (priority_level IN ('high', 'medium', 'low')),
    deleted_at     TIMESTAMPTZ,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

> 🔜 **M5.2 — enrich wishlist** (selaras `WishlistItem` di `WishlistParts.tsx`, §12):

```sql
ALTER TABLE wishlists
    ADD COLUMN start_time      TIME,
    ADD COLUMN end_time        TIME,
    ADD COLUMN location_label  TEXT,
    ADD COLUMN notes           TEXT,
    ADD COLUMN thumbnail_url   TEXT;
```

| Figma field | Target column | API enum |
|-------------|---------------|----------|
| `name` | `place_name` | — |
| `startTime` / `endTime` | `start_time` / `end_time` | — |
| `priority` Tinggi/Menengah/Rendah | `priority_level` | `high` / `medium` / `low` |
| `location` | `location_label` | — |
| `link` | `link` | — |
| `notes` | `notes` | — |
| `image` | `thumbnail_url` | resolved or default asset |

### 3.4 Transaction Safety Rules

All operations that mutate more than one table **must** execute inside an explicit transaction. The following flows are the primary examples:

| Operation | Tables Mutated in Transaction |
|---|---|
| Accept trip invitation (username) | `trip_invitations` (status→accepted), `trip_participants` (INSERT) |
| Lock trip date poll | `trips` (dates, status→fixed, clear `voting_deadline`), `trip_date_candidates` winner applied |
| Create trip with date candidates | `trips` (INSERT), `trip_date_candidates` (bulk INSERT), set `voting_deadline` |
| 🔜 Wishlist → trip convert (§12) | `trips` (INSERT), `trip_destinations` (1 aktivitas hari 1), `wishlists` (soft DELETE) — **atomic** |
| 🔜 Set trip cover from media (§10) | `trips.cover_document_id`, clear previous cover flag on old document |
| Calendar event (post-lock) | User-confirmed modal → create event for invitees (M11). Background job after commit. |

### 3.5 Design-Target Tables (Belum Dimigrasi)

Skema di bawah **wajib** ada sebelum mobile M8–M10 bisa 1:1 dengan Figma. Milestone implementasi: **M5.2** (`docs/MILESTONES.md`).

#### `trip_documents` 🔜 M5.2b *(desain §10)*
```sql
CREATE TABLE trip_documents (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id     UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL REFERENCES users(id),
    media_type  VARCHAR(10) NOT NULL CHECK (media_type IN ('photo', 'video')),
    storage_url TEXT NOT NULL,
    from_chat   BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```
> Cover trip: `trips.cover_document_id` → salah satu row. UI: tab Media → "Jadikan Cover" (`Screen93`).

#### `trip_polls` + options + votes 🔜 M5.2c *(desain §8)*
```sql
CREATE TABLE trip_polls (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id     UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    poll_type   VARCHAR(20) NOT NULL CHECK (poll_type IN ('tanggal', 'destinasi', 'lainnya')),
    title       VARCHAR(255) NOT NULL,
    status      VARCHAR(20) NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'locked', 'cancelled', 'expired')),
    deadline    TIMESTAMPTZ,
    locked_at   TIMESTAMPTZ,
    created_by  UUID NOT NULL REFERENCES users(id),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE trip_poll_options (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id      UUID NOT NULL REFERENCES trip_polls(id) ON DELETE CASCADE,
    label        TEXT NOT NULL,
    sort_order   INTEGER NOT NULL DEFAULT 0,
    candidate_id UUID REFERENCES trip_date_candidates(id)
);

CREATE TABLE trip_poll_votes (
    poll_id     UUID NOT NULL REFERENCES trip_polls(id) ON DELETE CASCADE,
    option_id   UUID NOT NULL REFERENCES trip_poll_options(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (poll_id, user_id)
);
```
> Auto-create poll `tanggal` saat trip create dengan >1 kandidat. UI: max 1 Tanggal + 1 Aktivitas (`destinasi`) aktif (`VotingParts.tsx`). **Voting tanggal** di form sheet tidak punya field judul — judul tetap di card pipeline (`Tanggal Perjalanan`); aktivitas/lainnya punya `title` di `trip_polls`.

#### `trip_message_reads` 🔜 M5.2d *(badge unread chat — §9)*
```sql
CREATE TABLE trip_message_reads (
    trip_id      UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    last_read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (trip_id, user_id)
);
```

#### Chat media columns 🔜 M5.2e *(§9 Screen77–85, reply quote Screen89–92)*
```sql
ALTER TABLE trip_messages
    ADD COLUMN message_kind   VARCHAR(10) NOT NULL DEFAULT 'text'
        CHECK (message_kind IN ('text', 'photo', 'video')),
    ADD COLUMN media_url      TEXT,
    ADD COLUMN media_duration INTERVAL,
    ADD COLUMN reply_to_id    UUID REFERENCES trip_messages(id);
```

---

## 4. Backend Architecture Pattern (Go/Gin)

### 4.1 Layered (Clean) Architecture

The backend enforces a strict three-layer architecture. **Dependencies flow inward only**: handlers depend on services; services depend on repositories; repositories depend on the database driver. No layer may import from a layer above it.

```
cmd/api/main.go          — Composition root: wire dependencies, start server
    │
    ├── internal/handler  — HTTP concerns ONLY (parse request, call service, write response)
    │       └── depends on → service interfaces
    │
    ├── internal/service  — Business rules, orchestration, external API calls
    │       └── depends on → repository interfaces + platform clients
    │
    └── internal/repository — SQL execution, data mapping to/from domain structs
            └── depends on → *pgxpool.Pool
```

### 4.2 Interface-Driven Design

Each service and repository is defined as a Go interface in `internal/domain`. This enables:
- Unit testing handlers and services with mock implementations.
- Dependency injection at the composition root without circular imports.

```go
// internal/domain/trip.go (example interface contracts)

type TripRepository interface {
    Create(ctx context.Context, trip *Trip) error
    FindByID(ctx context.Context, id uuid.UUID) (*Trip, error)
    ListByParticipant(ctx context.Context, userID uuid.UUID, cursor *uuid.UUID, limit int) ([]*Trip, error)
    Update(ctx context.Context, trip *Trip) error
    SoftDelete(ctx context.Context, id uuid.UUID) error
    IsParticipant(ctx context.Context, tripID, userID uuid.UUID) (bool, error)
    IsCreator(ctx context.Context, tripID, userID uuid.UUID) (bool, error)
}

type TripService interface {
    CreateTrip(ctx context.Context, creatorID uuid.UUID, input CreateTripInput) (*Trip, error)
    InviteParticipant(ctx context.Context, tripID uuid.UUID, inviterID uuid.UUID, input InviteInput) error
    LockDate(ctx context.Context, tripID uuid.UUID, requesterID uuid.UUID, candidateID uuid.UUID) error
}
```

### 4.3 API Versioning & Routing

Base URL: `/v1`. Auth: `Authorization: Bearer <JWT>` kecuali disebut **Public**. Rate limit: **120 req/min** per IP (`middleware.RateLimiter`).

#### 4.3.0 Implemented Endpoints (35 — M0–M5.1 ✅)

| Method | Path | Auth | Handler | Desain / § |
|--------|------|------|---------|------------|
| GET | `/health` | Public | inline | — |
| POST | `/v1/auth/google` | Public | `PostGoogle` | §2 |
| POST | `/v1/auth/complete-registration` | JWT | `PostCompleteRegistration` | §2 |
| GET | `/v1/users/check-username?username=` | Public | `GetCheckUsername` | §2 Screen4 |
| GET | `/v1/users/search?q=&limit=&cursor=` | Public | `Search` | §4, §6 undang |
| GET | `/v1/users/me` | JWT | `GetMe` | §5 |
| PUT | `/v1/users/me` | JWT | `PutMe` `{bio?, is_public?}` | §5 |
| GET | `/v1/users/:username` | Optional JWT | `GetProfile` | §4, §5 |
| GET | `/v1/users/:username/trips` | Optional JWT | `GetUserTrips` | §4, §5 |
| POST | `/v1/users/:username/follow` | JWT | `PostFollow` | post-MVP |
| DELETE | `/v1/users/:username/follow` | JWT | `DeleteFollow` | post-MVP |
| GET | `/v1/notifications/?cursor=` | JWT | `ListNotifications` | §3 Screen9 |
| GET | `/v1/notifications/unread-count` | JWT | `GetUnreadCount` | §3 badge |
| PUT | `/v1/notifications/:id/read` | JWT | `MarkRead` | §3 |
| PUT | `/v1/notifications/read-all` | JWT | `MarkAllRead` | §3 |
| GET | `/v1/trips/?tab=upcoming\|completed&cursor=` | JWT | `GetTrips` enriched | §3 |
| POST | `/v1/trips/` | JWT | `PostTrip` | §6 |
| GET | `/v1/trips/invitations` | JWT | `GetMyInvitations` enriched | §3 tab Undangan |
| GET | `/v1/trips/:tripId` | JWT | `GetTrip` enriched | §7–§11 |
| PUT | `/v1/trips/:tripId` | JWT | `PutTrip` | §11 Screen103 |
| DELETE | `/v1/trips/:tripId` | JWT | `DeleteTrip` soft | §11 Screen95 |
| POST | `/v1/trips/:tripId/invitations` | JWT | `PostTripInvitation` `{username\|email}` | §6, §11 |
| PUT | `/v1/trips/:tripId/invitations/:id` | JWT | `PutTripInvitation` `{accept: bool}` | §3, §6 |
| GET | `/v1/trips/:tripId/candidates` | JWT | `GetTripDateCandidates` enriched | §8 tanggal |
| POST | `/v1/trips/:tripId/candidates/:candidateId/vote` | JWT | `PostTripCandidateVote` | §8 |
| DELETE | `/v1/trips/:tripId/candidates/:candidateId/vote` | JWT | `DeleteTripCandidateVote` | §8 |
| POST | `/v1/trips/:tripId/candidates/:candidateId/lock` | JWT | `PostTripCandidateLock` creator | §8 Screen73 |
| GET | `/v1/trips/:tripId/destinations` | JWT | `GetTripDestinations` | §7 |
| POST | `/v1/trips/:tripId/destinations` | JWT | `PostTripDestination` | §7 |
| DELETE | `/v1/trips/:tripId/destinations/:destinationId` | JWT | `DeleteTripDestination` | §7 Screen55 |
| GET | `/v1/trips/:tripId/messages?cursor=` | JWT | `GetTripMessages` enriched | §9 |
| POST | `/v1/trips/:tripId/messages` | JWT | `PostTripMessage` `{message}` — 🔜 `{reply_to_id?}` M5.2e | §9 |
| DELETE | `/v1/trips/:tripId/messages/:messageId` | JWT | `DeleteTripMessage` soft (sender only) | §9 Screen88 |
| GET | `/v1/wishlists/?priority=&tag[]=&cursor=` | JWT | `GetWishlists` | §12 |
| POST | `/v1/wishlists/` | JWT | `PostWishlist` | §12 |
| PUT | `/v1/wishlists/:id` | JWT | `PutWishlist` | §12 Screen111 |
| DELETE | `/v1/wishlists/:id` | JWT | `DeleteWishlist` soft | §12 Screen113 |

#### 4.3.1 Request/Response Contracts (Implemented)

**`POST /v1/trips/`** — selaras §6 create trip:

```json
{
  "name": "Lombok Weekend Escape",
  "tags": ["#Pantai", "#Alam"],
  "start_date": "2026-06-19",
  "end_date": "2026-06-22",
  "candidates": [],
  "cover_image_url": null
}
```

| Mode | Body | DB effect |
|------|------|-----------|
| Tanggal pasti | `start_date` + `end_date`, `candidates` kosong | `status=fixed` |
| Multi-kandidat | `candidates[{start_date,end_date}]` (2–3), dates null | `status=voting_pending`, rows di `trip_date_candidates`, `voting_deadline` auto-set |

> 🔜 M5.2: tambah `is_all_day`, `start_time`, `end_time`, `voting_deadline` optional override.

**`POST /v1/trips/:tripId/destinations`** — aktivitas minimal (§7):

```json
{
  "place_name": "Pantai Tanjung Aan",
  "maps_link": "https://maps.app.goo.gl/...",
  "reference_link": "https://tiktok.com/..."
}
```

> 🔜 M5.2: payload penuh selaras `ActivityDraft` (times, kind, ref_links[], cover_*).

**`PUT /v1/trips/:tripId/invitations/:id`** — Terima/Tolak undangan (§3 tab Undangan, §6):

```json
{ "accept": true }
```

**Trip enriched response** (list/detail/invitations): `cover_image_url`, `participant_count`, `participants_preview[]`, `voting_deadline`.

#### 4.3.2 Design-Gap Endpoints (Target M5.2 🔜)

Endpoint berikut **belum ada** di `router.go` tetapi **wajib** untuk parity 125 layar Figma:

| Priority | Method | Path | Desain | § |
|----------|--------|------|--------|---|
| P0 | PUT | `/v1/trips/:tripId/destinations/:id` | Edit aktivitas (`Screen54`) | §7 |
| P0 | GET | `/v1/trips/:tripId/members` | Daftar anggota + pending (`Screen97`) | §11 |
| P0 | DELETE | `/v1/trips/:tripId/invitations/:id` | Batalkan undangan pending (`Screen41`) | §6, §11 |
| P0 | POST | `/v1/wishlists/:id/convert-to-trip` | Jadikan Perjalanan atomic (`Screen114`–`117`) | §12 |
| P1 | DELETE | `/v1/users/me` | Hapus akun (`Screen20`) | §5 |
| P1 | POST/GET/DELETE | `/v1/trips/:tripId/documents` | Media tab upload/list/delete | §10 |
| P1 | PUT | `/v1/trips/:tripId/cover` | `{document_id}` set cover dari media | §10 |
| P1 | POST | `/v1/trips/:tripId/messages` (multipart) | Kirim foto/video + caption | §9 |
| P1 | PUT | `/v1/trips/:tripId/messages/read` | Mark chat read (unread badge) | §9 |
| P1 | POST | `/v1/trips/:tripId/messages` | Extend `{message}` + optional `{reply_to_id}` | §9 Screen89–92 |
| P2 | CRUD | `/v1/trips/:tripId/polls` + `…/vote` + `…/lock` | Multi-voting Aktivitas/Lainnya | §8 |
| P2 | DELETE | `/v1/trips/:tripId/members/:userId` | Keluarkan anggota (creator) | §11 |
| P3 | POST | `/v1/auth/logout` | Revoke refresh (opsional; local OK) | §5 |
| M11 | POST | `/v1/integrations/google-calendar/events` | Tambah ke kalender (`Screen96`) | §11 |

#### 4.3.3 Workflow → API Quick Map

| WORKFLOW § | Primary endpoints (✅ = implemented) |
|------------|--------------------------------------|
| §1 Onboarding | — (local flag) |
| §2 Auth | ✅ `POST /auth/google`, `complete-registration`, `GET /check-username` |
| §3 Beranda | ✅ `GET /trips?tab=`, `GET /trips/invitations`, `PUT …/invitations/:id`, ✅ notifications |
| §4 Pencarian | ✅ `GET /users/search`, `GET /:username`, `GET /:username/trips` |
| §5 Profil | ✅ `GET/PUT /users/me`, `GET /:username/trips` (own username); 🔜 `DELETE /users/me` |
| §6 Create + undang | ✅ `POST /trips`, `POST …/invitations`; 🔜 trip times, 🔜 cancel invite |
| §7 Itinerary | ✅ list/add/delete destinations; 🔜 `PUT` edit, enriched fields |
| §8 Voting | ✅ date candidates/vote/lock; 🔜 polls CRUD (Aktivitas/Lainnya) |
| §9 Chat | ✅ text messages + delete (own only); 🔜 media, 🔜 reply payload, 🔜 read cursor |
| §10 Media | 🔜 documents + cover |
| §11 Kelola | ✅ `PUT/DELETE /trips/:id`; 🔜 members, 🔜 calendar M11 |
| §12 Wishlist | ✅ CRUD wishlists; 🔜 convert atomic |
| §13 System | — (client patterns) |

#### 4.3.4 Route Tree (Reference)

```
/v1/
├── auth/
│   ├── POST   /google                   # Exchange Google ID token for app JWT
│   └── POST   /complete-registration    # Set username for new users (JWT required)
├── users/
│   ├── GET    /check-username           # Real-time username availability ✅
│   ├── GET    /search                   # Search users (trigram, cursor paginated)
│   ├── GET    /me                       # Current user profile
│   ├── PUT    /me                       # Update bio, is_public
│   ├── GET    /:username                # Profile lookup (optional auth)
│   ├── GET    /:username/trips          # Profile trip grid ✅
│   ├── POST   /:username/follow         # post-MVP (code exists)
│   └── DELETE /:username/follow         # post-MVP
├── notifications/                       # ✅ M5.1
│   ├── GET    /
│   ├── GET    /unread-count
│   ├── PUT    /:id/read
│   └── PUT    /read-all
├── trips/
│   ├── GET    /                         # ?tab=upcoming|completed ✅
│   ├── POST   /
│   ├── GET    /invitations
│   ├── GET    /:tripId
│   ├── PUT    /:tripId
│   ├── DELETE /:tripId
│   ├── POST   /:tripId/invitations
│   ├── PUT    /:tripId/invitations/:id  # {accept: bool}
│   ├── GET    /:tripId/destinations     # UI: tab Itinerary / aktivitas
│   ├── POST   /:tripId/destinations
│   ├── DELETE /:tripId/destinations/:id
│   ├── GET    /:tripId/candidates       # Date voting only (legacy → poll tanggal)
│   ├── POST   /:tripId/candidates/:id/vote
│   ├── DELETE /:tripId/candidates/:id/vote
│   ├── POST   /:tripId/candidates/:id/lock
│   ├── GET    /:tripId/messages
│   ├── POST   /:tripId/messages         # text only today
│   └── DELETE /:tripId/messages/:messageId
└── wishlists/
    ├── GET    /
    ├── POST   /
    ├── PUT    /:id
    └── DELETE /:id
```

> **M5.1 ✅ selesai**: Notifications, delete chat, username check, trip tabs, profile trips, enriched responses, voting reminder cron.
>
> **M5.2 🔜**: Tutup gap §4.3.2 + schema §3.5 sebelum mobile M6–M10. Detail checklist: `docs/MILESTONES.md § M5.2`.

> **UI ↔ Backend naming**: Figma/preview memakai **Itinerary / aktivitas**; API & tabel saat ini memakai `trip_destinations` dan path `/destinations`. Voting type `destinasi` di UI ditampilkan sebagai label **Aktivitas**.

### 4.3.5 Profile & Trip Visibility

MVP fokus pada *trip planner* — tidak ada sistem follow/follower. Pencarian user tersedia untuk mengundang partisipan trip.

| Flag | Table | Meaning |
|------|-------|---------|
| Profile grid trip | `trips.is_public` | Creator opts in which trips appear on their public profile grid |

**Authorization matrix** for `GET /v1/users/:username` and `GET /v1/users/:username/trips`:

| Viewer | `GET /:username` | `GET /:username/trips` |
|--------|------------------|------------------------|
| Anyone | Full profile (bio, avatar, `public_trip_count`) | Creator trips where `trips.is_public = true` |
| Owner | Full | All creator trips |

> **Post-MVP (deferred)**: Sistem follow/follower, akun privat berbasis follower (`users.is_public`), endpoint `POST/DELETE /:username/follow`, mutual follow saat terima undangan, notifikasi tipe `follow`.

**Trip list tabs** (`GET /v1/trips?tab=`):

| Tab | Rule |
|-----|------|
| `upcoming` (default) | Participant trips where `end_date IS NULL OR end_date >= CURRENT_DATE` (includes all `voting_pending`) |
| `completed` | `end_date IS NOT NULL AND end_date < CURRENT_DATE` |
| Invitations | Separate endpoint `GET /v1/trips/invitations` (unchanged) |

**Voting deadline** (`trips.voting_deadline`, set when `candidates.length > 1`):

- Default: `LEAST(created_at + 14 days, MIN(candidates.start_date) - 3 days)`, clamped ≥ `created_at + 7 days`
- Cleared when trip locks (`status = fixed`)
- Background job sends `voting` notifications at H-7d, H-1d, H-1h before deadline to participants who have not voted

**Trip detail tab counters** (`TripDetailTabs`):
- Itinerary → aktivitas count
- Voting → active polls count (tab hidden when 0)
- Chat → **unread messages only** (`trip_messages` read cursor per user)
- Media → `trip_documents.length` (**badge always shown, including 0**)

**Cover image** (`trips.cover_document_id`, nullable):
- Selected from trip media via tab Media UI ("Jadikan Cover").
- Beranda card resolves URL from linked document; default gradient/asset when NULL.
- File upload to object storage deferred to M8+ mobile.

**Scalability hooks** (no breaking changes planned):

- `GET /users/:username/trips?role=created|participated|all` — MVP uses `created` only

### 4.4 Authentication Middleware

```go
// Pseudocode — internal/middleware/auth.go

func AuthRequired(jwtSecret []byte) gin.HandlerFunc {
    return func(c *gin.Context) {
        token := extractBearerToken(c.GetHeader("Authorization"))
        if token == "" {
            c.AbortWithStatusJSON(401, ErrUnauthorized)
            return
        }
        claims, err := validateJWT(token, jwtSecret)
        if err != nil {
            c.AbortWithStatusJSON(401, ErrTokenInvalid)
            return
        }
        c.Set("userID", claims.Subject) // uuid string
        c.Next()
    }
}
```

- JWTs are signed with `HS256` using a secret loaded exclusively from environment variables.
- Token payload contains only `sub` (user UUID) and `exp`. No sensitive data in the JWT payload.
- Token expiry: **24 hours**. Refresh token strategy to be defined in a future iteration.

### 4.5 Connection Pooling Strategy

```go
// internal/platform/database/postgres.go

pool, err := pgxpool.New(ctx, os.Getenv("DATABASE_URL"))
config := pool.Config()
config.MaxConns        = 20   // Tune per deployment (start: 4 × CPU cores)
config.MinConns        = 5
config.MaxConnLifetime = 30 * time.Minute
config.MaxConnIdleTime = 5 * time.Minute
config.HealthCheckPeriod = 1 * time.Minute
```

- Use `pgx/v5` (native driver) — **do not** use `database/sql` + `lib/pq`. `pgx` avoids reflection overhead and has superior PostgreSQL type support.
- All repository methods accept `context.Context` as their first parameter to propagate request deadlines and cancellation signals.
- Set a per-request DB deadline: `ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)`.

### 4.6 Performance Rules

| Concern | Rule |
|---|---|
| **N+1 Queries** | Strictly forbidden. Use SQL `JOIN` or batched `IN (...)` queries. Never query inside a loop. |
| **Pagination** | All list endpoints use keyset (cursor-based) pagination, not `OFFSET`. Default page size: 20 records. Maximum: 100. |
| **JSON Serialization** | Use `encoding/json` from the standard library. Only introduce `go-json` if profiling reveals a bottleneck. |
| **Google API Calls** | Never synchronously block an HTTP response on a Google API call. Execute in a goroutine or background job after the DB transaction commits. |
| **Rate Limiting** | Apply per-IP rate limiting via middleware on all `/v1/` routes (e.g., `golang.org/x/time/rate` or `ulule/limiter`). |
| **Error Responses** | Always return a structured JSON body: `{ "error": { "code": "TRIP_NOT_FOUND", "message": "..." } }`. Never leak internal errors or stack traces to clients. |

---

## 5. Mobile Architecture Pattern (KMP)

### 5.1 Module Boundaries

The KMP project is divided into three modules. Platform-specific UI code is **not** in the shared module.

```
mobile/
├── shared/          # Pure Kotlin — no Android/iOS framework imports
│   ├── data/        # API clients (Ktor), local DB (SQLDelight), repository impls
│   ├── domain/      # Data models (data classes), use case interfaces
│   └── presentation/# ViewModels exposing StateFlow<UiState>
│
├── androidApp/      # Jetpack Compose — consumes shared ViewModels directly
└── iosApp/          # SwiftUI — wraps shared ViewModels via Kotlin/Native
```

### 5.2 Shared Data Layer

```
shared/src/commonMain/kotlin/com/aturperjalanan/data/
├── remote/
│   ├── ApiClient.kt          # Ktor HttpClient config (JSON, auth, timeout)
│   ├── TripApiService.kt     # Ktor DSL API calls, returns Result<T>
│   ├── UserApiService.kt
│   └── dto/                  # Kotlinx.Serialization DTOs (mirror API JSON)
├── local/
│   └── AppDatabase.sq        # SQLDelight schema for offline cache
└── repository/
    ├── TripRepositoryImpl.kt # Implements domain interface; coordinates remote + local
    └── UserRepositoryImpl.kt
```

**Ktor Client Configuration:**
```kotlin
// commonMain — ApiClient.kt
val httpClient = HttpClient {
    install(ContentNegotiation) { json(Json { ignoreUnknownKeys = true }) }
    install(Auth) {
        bearer {
            loadTokens { BearerTokens(TokenStore.accessToken, "") }
        }
    }
    install(HttpTimeout) {
        requestTimeoutMillis  = 10_000
        connectTimeoutMillis  = 5_000
        socketTimeoutMillis   = 10_000
    }
}
```

### 5.3 Shared Domain & Presentation Layer

```
shared/src/commonMain/kotlin/com/aturperjalanan/
├── domain/
│   ├── model/
│   │   ├── Trip.kt           # Pure Kotlin data class (no framework annotations)
│   │   ├── User.kt
│   │   └── Wishlist.kt
│   ├── repository/           # Interfaces only (implemented in data layer)
│   │   └── TripRepository.kt
│   └── usecase/
│       ├── GetTripsUseCase.kt
│       └── LockTripDateUseCase.kt
│
└── presentation/
    └── viewmodel/
        ├── TripListViewModel.kt  # StateFlow<TripListUiState>; no Android import
        └── TripDetailViewModel.kt
```

**ViewModel Pattern:**
```kotlin
// commonMain — TripListViewModel.kt
class TripListViewModel(private val getTrips: GetTripsUseCase) : ViewModel() {
    private val _uiState = MutableStateFlow<TripListUiState>(TripListUiState.Loading)
    val uiState: StateFlow<TripListUiState> = _uiState.asStateFlow()

    fun loadTrips() {
        viewModelScope.launch {
            _uiState.value = getTrips().fold(
                onSuccess = { TripListUiState.Success(it) },
                onFailure = { TripListUiState.Error(it.message ?: "Unknown error") }
            )
        }
    }
}
```

### 5.4 Native UI Integration

| Platform | Mechanism |
|---|---|
| **Android** | `collectAsStateWithLifecycle()` on the shared `StateFlow`. ViewModel is instantiated via `viewModel { TripListViewModel(...) }` (Koin for DI). |
| **iOS** | Wrap the shared ViewModel in an `ObservableObject` using `createPublisher()` from `KMPNativeCoroutines`, or use `@StateObject` with a manual `Combine` bridge. |

### 5.5 Offline Cache Strategy

- **SQLDelight** is used as the single source of truth for local persistence.
- The repository layer applies a **cache-then-network** strategy for list endpoints (home screen trips, wishlist): emit cached data immediately, then refresh from the network and update the cache.
- Chat messages use a **network-first** strategy given their real-time nature.
- Auth tokens are stored in the platform-specific secure storage: `EncryptedSharedPreferences` on Android, `Keychain` on iOS. **Never** store tokens in SQLDelight or plain `SharedPreferences`.

### 5.6 Dependency Injection

Koin is used for DI in the shared module, with platform-specific modules for Android and iOS.

```kotlin
// commonMain — di/SharedModule.kt
val sharedModule = module {
    single { ApiClient.create() }
    single<TripRepository> { TripRepositoryImpl(get(), get()) }
    factory { GetTripsUseCase(get()) }
    viewModel { TripListViewModel(get()) }
}
```

---

## Appendix: Environment Variables

The following environment variables are required by the backend. They must **never** be committed to the repository. Use `.env.example` as a reference template.

| Variable | Description |
|---|---|
| `DATABASE_URL` | Full PostgreSQL connection string (`postgres://user:pass@host:5432/dbname`) |
| `JWT_SECRET` | Random 256-bit secret for signing application JWTs |
| `GOOGLE_CLIENT_ID` | OAuth 2.0 Client ID from Google Cloud Console |
| `GOOGLE_CALENDAR_SA_KEY` | Path to Google service account JSON key file |
| `PORT` | HTTP server port (default: `8080`) |
| `APP_ENV` | `development` \| `staging` \| `production` |
