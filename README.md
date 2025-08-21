# Human Evaluation Platform (HEF) – Frontend

The **HEF Frontend** is the web UI for configuring workspaces, evaluations,
assigning tasks to reviewers, and visualizing results.

The platform is developed under the ChatMED project (https://cordis.europa.eu/project/id/101159214).

👉 Backend API: https://github.com/ChatMED/hef

---

## Features

- Create/manage workspaces
- Create/manage evaluations
- Metrics dashboards
- Works with the HEF backend API

## Quickstart

### Prerequisites

- Node.js 18+
- npm (or yarn/pnpm)
- A running backend (default dev example: `http://localhost:8080`)

### Clone & Install

```bash
git clone https://github.com/ChatMED/hef-frontend.git
cd hef-frontend
npm install
```

### Configure Environment

Create `.env.local` in the project root:

```ini
# backend API base URL
VITE_API_BASE_URL=http://localhost:8080
# optional flags
VITE_AUTH_ENABLED=true
# VITE_SENTRY_DSN=
```

### Run Dev Server

```bash
npm run dev
```

Vite will print the local URL (commonly `http://localhost:3000`).

---

## Scripts

```bash
npm run dev        # start dev server
npm run build      # production build -> dist/
npm run preview    # preview the production build locally
npm run lint       # lint
npm run test       # run unit tests (if configured)
```

---

## Troubleshooting

- **CORS errors**: allow the frontend origin in the backend CORS settings.
- **Env not applied**: restart dev server after editing `.env`.

