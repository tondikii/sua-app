# Product Requirements Document (PRD)

## 1. Authentication (Google Sign-In)
* **Goal**: Frictionless onboarding.
* **Flow**:
  * User taps "Continue with Google".
  * System verifies email against the database.
  * If new user: Auto-register and create profile using Google metadata (Name, Email, Avatar).
  * If existing user: Generate session token and log in.

## 2. Profile & Couple Feature
* **Goal**: Establish the "shared space" for the couple.
* **Features**:
  * Display user's basic Google info.
  * **Add Partner Flow**:
    * Search for a partner via Email.
    * If partner exists in DB: Send an in-app pairing request.
    * If partner does not exist: Trigger an email invitation ("Your partner invited you to Sua").
  * **State**: The app UI adapts to show a "Coupled" state once the request is accepted.

## 3. Explore (Main Discovery Feature)
* **Goal**: Provide instant location recommendations based on activity types.
* **Features**:
  * **Location Input**: Defaults to device GPS coordinates (City level), allows manual text override (e.g., "Bandung").
  * **Activity Categories**: Fetched from DB (e.g., Makan, Nonton, Ngafe, Badminton, WFC).
  * **Behavior (Two-Step Flow)**:
    1. User selects an Activity Category (e.g., "Ngafe").
    2. The App sends the `category` and `city` to the backend.
    3. **Keyword Transformation**: The backend translates the casual category into a mapped Google Maps query (e.g., "Ngafe" -> "Cafe", "Makan" -> "Restoran").
    4. Backend fetches results from Google Places API using query `"{Mapped Keyword} di {City}"` (e.g., "Cafe di Jakarta Selatan").
  * **UI Output**: A scrollable list of specific places (e.g., "Starbucks", "Kopi Kenangan") showing rating, distance, and photo.

## 4. Itinerary: "Agenda Sua"
* **Goal**: Commit to a plan and sync it to calendars.
* **Features**:
  * **Input**: Date picker, Time range picker.
  * **Builder**: Add one or multiple places (selected from the Explore tab or Wishlist).
  * **Output**: Generates a shareable "Itinerary Card".
  * **Integration**: Automatically creates an event in the partner's Google Calendar.

## 5. Wishlist
* **Goal**: Organize saved places with actionable priority.
* **Features**:
  * Save places from the "Explore" tab.
  * Categorize by activity type.
  * **Emotional Sorting System**:
    * `Pengen banget-bangett` (Highest priority / Must go)
    * `Pengen bangett` (High priority / Looks great)
    * `Pengen ajaa` (Low priority / Good for backup)