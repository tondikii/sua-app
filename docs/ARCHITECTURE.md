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
│   │   │   ├── trip_handler.go
│   │   │   ├── user_handler.go
│   │   │   ├── wishlist_handler.go
│   │   │   └── chat_handler.go
│   │   ├── middleware/
│   │   │   ├── auth.go           # JWT extraction & validation
│   │   │   ├── rate_limiter.go
│   │   │   └── request_id.go
│   │   ├── service/              # Business logic layer
│   │   │   ├── auth_service.go
│   │   │   ├── trip_service.go
│   │   │   ├── user_service.go
│   │   │   ├── wishlist_service.go
│   │   │   └── chat_service.go
│   │   ├── repository/           # Data access layer
│   │   │   ├── user_repo.go
│   │   │   ├── trip_repo.go
│   │   │   ├── wishlist_repo.go
│   │   │   └── chat_repo.go
│   │   └── platform/
│   │       ├── database/
│   │       │   └── postgres.go   # pgx pool initialization
│   │       └── googleapi/
│   │           ├── auth.go       # ID token verification
│   │           └── calendar.go   # Google Calendar API client
│   ├── migrations/               # SQL migration files (golang-migrate)
│   │   ├── 000001_create_users.up.sql
│   │   ├── 000001_create_users.down.sql
│   │   ├── 000002_create_follows.up.sql
│   │   └── ...
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
├── docs/
│   ├── BRIEF.md
│   ├── PRD.md
│   ├── WORKFLOW.md
│   ├── ACCEPTANCE_CRITERIA.md
│   └── ARCHITECTURE.md           # This file
│
├── .env.example                  # Template for required env vars (no secrets)
├── docker-compose.yml            # Local dev: PostgreSQL + backend
├── Makefile                      # Unified task runner (make migrate, make test)
└── README.md
```

---

## 3. Database Architecture & Schema Strategy

### 3.1 General Rules

| Rule | Specification |
|---|---|
| **Primary Keys** | `UUID v4` (generated at the application layer via `uuid.New()`). Avoids sequential ID enumeration attacks. |
| **Timestamps** | All tables include `created_at TIMESTAMPTZ DEFAULT NOW()`. Mutable records also include `updated_at TIMESTAMPTZ DEFAULT NOW()`. |
| **Soft Deletes** | Used only on `trips` and `wishlists` via `deleted_at TIMESTAMPTZ NULL`. All queries against these tables **must** include a `WHERE deleted_at IS NULL` predicate. Hard deletes are used for ephemeral join/vote records. |
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
        boolean is_public
        timestamptz created_at
        timestamptz updated_at
    }
    follows {
        uuid follower_id FK
        uuid following_id FK
        timestamptz created_at
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

    users ||--o{ follows : "follower_id / following_id"
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
    is_public   BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_username_trgm ON users USING GIN (username gin_trgm_ops);
CREATE INDEX idx_users_name_trgm     ON users USING GIN (name gin_trgm_ops);
-- Prerequisite: CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

> **Relationship**: Self-referential M:N via `follows`. No direct FK within this table.

---

#### `follows`
```sql
CREATE TABLE follows (
    follower_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (follower_id, following_id),
    CONSTRAINT no_self_follow CHECK (follower_id <> following_id)
);

-- Indexes
CREATE INDEX idx_follows_following_id ON follows (following_id);
```

> **Relationship**: M:N self-join on `users`. The composite PK `(follower_id, following_id)` enforces uniqueness and serves as the primary lookup key.

---

#### `trips`
```sql
CREATE TABLE trips (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id  UUID NOT NULL REFERENCES users(id),
    name        VARCHAR(255) NOT NULL,
    tags        JSONB NOT NULL DEFAULT '[]',
    status      VARCHAR(20) NOT NULL DEFAULT 'voting_pending'
                    CHECK (status IN ('voting_pending', 'fixed')),
    start_date  DATE,
    end_date    DATE,
    is_public   BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at  TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_date_range CHECK (
        start_date IS NULL OR end_date IS NULL OR start_date <= end_date
    )
);

-- Indexes
CREATE INDEX idx_trips_creator_id ON trips (creator_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_trips_status     ON trips (status)     WHERE deleted_at IS NULL;
CREATE INDEX idx_trips_tags       ON trips USING GIN (tags);
```

> **Relationship**: 1:N with `users` (creator). M:N with `users` via `trip_participants`. 1:N with `trip_date_candidates`, `trip_destinations`, `trip_messages`, `trip_invitations`.

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

#### `trip_destinations`
```sql
CREATE TABLE trip_destinations (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id        UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    place_name     VARCHAR(255) NOT NULL,
    maps_link      TEXT,
    reference_link TEXT,
    sort_order     INTEGER NOT NULL DEFAULT 0,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_trip_destinations_trip_id ON trip_destinations (trip_id);
```

---

#### `trip_messages`
```sql
CREATE TABLE trip_messages (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id      UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    sender_id    UUID NOT NULL REFERENCES users(id),
    message_text TEXT NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_trip_messages_trip_created ON trip_messages (trip_id, created_at DESC);
```

> **Note**: The composite index on `(trip_id, created_at DESC)` directly serves the primary chat query: fetch the N most recent messages for a given trip.

---

#### `wishlists`
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

-- Indexes
CREATE INDEX idx_wishlists_user_id      ON wishlists (user_id)  WHERE deleted_at IS NULL;
CREATE INDEX idx_wishlists_priority     ON wishlists (user_id, priority_level) WHERE deleted_at IS NULL;
CREATE INDEX idx_wishlists_tags         ON wishlists USING GIN (tags);
```

### 3.4 Transaction Safety Rules

All operations that mutate more than one table **must** execute inside an explicit transaction. The following flows are the primary examples:

| Operation | Tables Mutated in Transaction |
|---|---|
| Accept trip invitation (username) | `trip_invitations` (status→accepted), `trip_participants` (INSERT), `follows` (INSERT mutual, `ON CONFLICT DO NOTHING`) |
| Lock trip date | `trips` (start/end date, status→fixed), `trip_date_candidates` (no change), trigger Google Calendar call *after* commit |
| Create trip with date candidates | `trips` (INSERT), `trip_date_candidates` (bulk INSERT) |
| Google Calendar sync | Executed **outside** the DB transaction, after a successful commit. Use a background job or idempotent retry queue — never block the HTTP response on an external API call. |

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
    FindByParticipant(ctx context.Context, userID uuid.UUID) ([]*Trip, error)
    Update(ctx context.Context, trip *Trip) error
    SoftDelete(ctx context.Context, id uuid.UUID) error
}

type TripService interface {
    CreateTrip(ctx context.Context, creatorID uuid.UUID, input CreateTripInput) (*Trip, error)
    InviteParticipant(ctx context.Context, tripID uuid.UUID, inviterID uuid.UUID, input InviteInput) error
    LockDate(ctx context.Context, tripID uuid.UUID, requesterID uuid.UUID, candidateID uuid.UUID) error
}
```

### 4.3 API Versioning & Routing

```
/v1/
├── auth/
│   ├── POST   /google                   # Exchange Google ID token for app JWT
│   └── POST   /complete-registration    # Set username for new users
├── users/
│   ├── GET    /me                       # Get current user profile
│   ├── PUT    /me                       # Update bio, is_public
│   ├── GET    /search                   # Search users by name (trigram-based, cursor paginated)
│   ├── GET    /:username                # Get public profile
│   ├── POST   /:username/follow         # Follow a user
│   └── DELETE /:username/follow         # Unfollow a user
├── trips/
│   ├── GET    /                         # List trips for authenticated user
│   ├── POST   /                         # Create a trip
│   ├── GET    /:tripId                  # Get trip detail
│   ├── PUT    /:tripId                  # Update trip info
│   ├── DELETE /:tripId                  # Soft-delete trip (creator only)
│   ├── POST   /:tripId/invitations      # Invite participant
│   ├── PUT    /:tripId/invitations/:id  # Accept / decline invitation
│   ├── GET    /:tripId/destinations     # List destinations
│   ├── POST   /:tripId/destinations     # Add destination
│   ├── DELETE /:tripId/destinations/:id # Remove destination
│   ├── GET    /:tripId/candidates       # List date candidates + vote counts
│   ├── POST   /:tripId/candidates/:id/vote    # Cast a vote
│   ├── DELETE /:tripId/candidates/:id/vote    # Retract a vote
│   ├── POST   /:tripId/candidates/:id/lock    # Lock date (creator only)
│   └── GET    /:tripId/messages         # Paginated chat messages
│   └── POST   /:tripId/messages         # Send chat message
└── wishlists/
    ├── GET    /                          # List user's wishlists
    ├── POST   /                          # Create wishlist item
    ├── PUT    /:wishlistId               # Update wishlist item
    └── DELETE /:wishlistId               # Soft-delete wishlist item
```

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
