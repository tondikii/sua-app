# System Architecture

## High-Level Overview
Sua utilizes a Client-Server architecture. The backend is a stateless REST API built in Go, designed for speed and concurrency. The client is a Kotlin Multiplatform app sharing business logic across Android and iOS, with native Compose UIs.

## 1. Backend (Go)
* **Pattern**: Clean Architecture (Layered: Handlers -> Usecases -> Repositories).
* **Database**: PostgreSQL.
* **Authentication**: JWT tokens issued after validating Google OAuth tokens.
* **External Services**:
  * `Google Places API`: Used by the `Explore` service.
  * `Google Calendar API`: Used by the `Itinerary` service.
  * `SMTP/Email Service`: Used by the `Couple` service for invitations.

## 2. Mobile (KMP)
* **UI Layer**: Compose Multiplatform (Declarative UI).
* **Shared Logic**:
  * `Ktor`: HTTP Client for API communication.
  * `Kotlinx.serialization`: JSON parsing.
  * `SQLDelight`: Local caching (optional for offline wishlist viewing).
  * `MVI/MVVM Pattern`: State management for UI screens.

## 3. Data Flow (Example: Explore Feature)
1. KMP App requests device location.
2. User taps "WFC".
3. KMP App sends `GET /api/v1/explore?activity=WFC&lat=-6.20&lng=106.81` to Go Backend.
4. Go Backend formats request and calls Google Places API.
5. Go Backend maps Google's response to internal `Place` struct.
6. KMP App receives JSON, parses it, and updates the Compose UI State.