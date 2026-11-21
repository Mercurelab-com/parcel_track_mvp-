# Public Customer Parcel Tracking Module (Member 4)

This module implements the **Public Customer Tracking Lookup Screen** for ParcelTrack based on the approved **Google Stitch UI Design**.

## 1. Module Responsibility
As Member 4, this module provides the customer-facing interface allowing senders and recipients to look up any parcel by its tracking code without authentication.

## 2. Supported Lifecycle Statuses
The module strictly adheres to the four required lifecycle statuses:
1. `REGISTERED` — Parcel intake completed at dispatch agency (e.g. Douala).
2. `IN_TRANSIT` — Shipment traveling along transport corridor (e.g. Douala ↔ Bamenda).
3. `ARRIVED` — Package arrived at destination agency counter (triggers the prominent Arrival Notification Banner).
4. `COLLECTED` — Parcel released to the recipient upon national ID card verification.

## 3. Directory Layout
```
frontend/src/pages/tracking/
├── components/
│   ├── ArrivalNotificationBanner.jsx  # Highlighted counter pickup alert for ARRIVED state
│   ├── JourneyTimeline.jsx            # 4-stage vertical stepper with active/done/pending styling
│   ├── ParcelInfoCard.jsx             # Two-column verified registration & route card
│   ├── TrackingFooter.jsx             # Public footer
│   ├── TrackingHeader.jsx             # Customer portal navigation header
│   ├── TrackingLoading.jsx            # Animated pulsing loading screen
│   ├── TrackingNotFound.jsx           # Friendly error view with retry input
│   ├── TrackingSearchBar.jsx          # Search bar with quick demo testing chips
│   └── TrackingStatusCard.jsx         # Current delivery status highlight card
├── mockData.js                        # Mock dataset for Douala ↔ Bamenda route + fetch helper
├── types.js                           # Status enum and design tokens
├── TrackingPage.jsx                   # Master tracking page container
├── index.js                           # Public barrel export
└── standalone-preview.html            # Zero-dependency browser preview with full interactivity
```

## 4. How to Test and Run

### Option A: Zero-Config Instant Browser Preview
Open the standalone preview file directly in any modern browser:
```
frontend/src/pages/tracking/standalone-preview.html
```
You can double-click this file or open it with Chrome/Edge. It includes React 18, Tailwind CSS, Google Fonts, and the full interactive tracking logic with quick demo buttons for all 4 statuses.

### Option B: Integration with Main App (`App.jsx`)
In the main `frontend/src/App.jsx`, Member 4's module can be mounted as:
```javascript
import TrackingPage from './pages/tracking';

function App() {
  return <TrackingPage />;
}

export default App;
```

### Option C: Quick Demo Tracking Numbers
The mock dataset includes the following ready-to-test tracking numbers:
* `PT-2026-001` — **IN_TRANSIT** (Google Stitch reference shipment, Douala to Bamenda)
* `PT-DLA-BDA-001` — **ARRIVED** (Displays counter pickup instructions at Bamenda Commercial Ave)
* `PT-DLA-BDA-002` — **REGISTERED** (Newly registered parcel in Douala Akwa)
* `PT-DLA-BDA-003` — **COLLECTED** (Recipient collected)
* `PT-2026-999` — **NOT FOUND** (Tests friendly error view and retry functionality)
