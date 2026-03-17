# Acceptance Criteria

We use Given-When-Then format to clearly define expected behaviors for automated testing and AI-assisted development.

## 1. Authentication
* **Scenario: New user login**
  * **Given** a user who has never used Sua
  * **When** they authenticate via Google Sign-In
  * **Then** a new user record is created in the database and they are routed to the Home screen.

## 2. Couple Feature
* **Scenario: Sending invite to unregistered user**
  * **Given** User A is on the Profile screen
  * **When** they search for an email `partner@test.com` that is not in the DB
  * **Then** the system prompts User A to send an email invitation to that address.

## 3. Explore Feature
* **Scenario: Searching for activities**
  * **Given** the user is on the Explore tab with GPS enabled
  * **When** they tap the "Makan" category
  * **Then** the app displays a list of restaurants near their current GPS coordinates fetched from Google Maps.

## 4. Itinerary (Agenda Sua)
* **Scenario: Creating an itinerary**
  * **Given** a user has selected 2 places and a time range
  * **When** they submit the itinerary
  * **Then** an Itinerary Card appears in both their app and their partner's app
  * **And** a Google Calendar event is successfully pushed via API.

## 5. Wishlist
* **Scenario: Filtering by emotional urgency**
  * **Given** a user has 10 items in their wishlist with varying priorities
  * **When** they select the filter "Pengen banget-bangett"
  * **Then** the list only displays items tagged with that exact highest priority.