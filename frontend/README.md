# AB Apps 2 Frontend

React + TypeScript frontend powered by Vite.

## Requirements

- Node.js 20+
- npm 10+

## Setup

1. From the project root, go to the frontend directory:

```bash
cd frontend
```

2. Create your local environment file(s) and add variables:

```bash
cp .env.sample .env.local
cp .env.sample .env.production.local # Used with preview:host
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

The app is available at `http://localhost:5173` by default.

5. Start the preview production server:

```bash
npm run build
npm run preview:host
```

## Environment Variables

Set these in `.env`:

- `VITE_BACKEND_BASE_URL`: Backend API base URL (example: `http://localhost:8000` or `http://192.168.1.x:8000` for preview)
- `VITE_ACCESS_TOKEN_NAME`: Local storage key for the access token
- `VITE_REFRESH_TOKEN_NAME`: Local storage key for the refresh token
- `VITE_GOOGLE_MAPS_API_KEY`: Google Maps API key (optional, required for map features)

## Scripts

- `npm run dev`: Start Vite dev server
- `npm run build`: Type-check and build for production
- `npm run preview`: Preview the production build locally
- `npm run lint`: Run ESLint

## Backend Dependency

This frontend expects the Django backend API to be running and reachable at `VITE_BACKEND_BASE_URL`.
