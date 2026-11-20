# Frontend — ParcelTrack

## Purpose
The frontend is a lightweight client application built using **React** and **Vite** with **JavaScript** and **Tailwind CSS**. It provides the interface for both agency desk operators and parcel recipients.

## Assigned Modules
- `public/`: Static files and favicon.
- `src/assets/`: Icons, imagery, and static assets.
- `src/components/common/`: Shared layout widgets, navigation, error notices.
- `src/components/ui/`: Primitive UI building blocks (buttons, inputs, cards).
- `src/layout/`: Page wrappers and dashboard shells.
- `src/pages/auth/`: Agency operator login screen.
- `src/pages/dashboard/`: Operational dashboard for parcel movements.
- `src/pages/parcels/`: Parcel intake registration and inventory list.
- `src/pages/tracking/`: Public tracking lookup screen.
- `src/services/`: HTTP service clients for backend REST communication.
- `src/hooks/`: Custom state management and lifecycle hooks.
- `src/utils/`: Formatting helpers (currency in XAF, date formats, status colors).
- `src/styles/`: Global stylesheets.

## Connection to Backend
The application will consume the FastAPI backend REST API exchanging JSON payloads over endpoints prefixed with `/api/v1`.

## Placeholder Setup
*Dependencies are not installed yet during the repository scaffolding stage.*

```bash
# Future setup:
npm install
npm run dev
```
