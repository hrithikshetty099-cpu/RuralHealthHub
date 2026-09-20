# Rural Health Hub

Rural Health Access & Teleconsultation Hub built on the existing React/Vite frontend and Node.js/Express backend.

## Features

- Patient registration and JWT login
- Patient dashboard and protected records
- Doctor and hospital discovery
- PostgreSQL-backed appointment booking
- Online consultation prototype using WebRTC and WebSocket signaling
- Doctor consultation notes and follow-up instructions
- Authorized prescriptions
- Patient health records
- Medicine delivery requests and status tracking
- Browser voice and low-data support already present in the frontend

## Stack

- React, Vite, CSS, Lucide React
- Node.js, Express, `pg`
- PostgreSQL
- JWT and bcryptjs
- WebRTC and `ws`

## Setup

1. Install PostgreSQL and create the database:

```sql
CREATE DATABASE rural_health_hub;
```

2. Select `rural_health_hub` in pgAdmin and run `server/database.sql`.
   For an existing installation, run `server/database-update.sql` instead.

3. Create `server/.env` from `server/.env.example`:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:REPLACE_WITH_YOUR_POSTGRES_PASSWORD@localhost:5432/rural_health_hub
JWT_SECRET=REPLACE_WITH_A_LONG_RANDOM_SECRET
CLIENT_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
```

Never commit `.env` or real credentials.

The frontend does not use a third-party API key. Its API base URL is configured with `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

4. Install and start the backend:

```powershell
cd server
npm install
npm run dev
```

Optional demo directory data:

```powershell
npm run seed
```

The seed creates clearly marked demo records only. It does not create demo login accounts.

5. Install and start the frontend in a second terminal:

```powershell
cd client
npm install
npm run dev
```

Open `http://localhost:5173`.

## API and testing

The backend health check is `GET http://localhost:5000/api/health`. The patient workflow is register, login, dashboard, doctor selection, appointment booking, online consultation, doctor completion, prescription, health record, and delivery request.

Important API paths include `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/doctors`, `GET /api/hospitals`, `POST /api/appointments`, `GET /api/appointments/my`, `POST /api/consultations`, `POST /api/consultations/:id/join`, `POST /api/consultations/:id/end`, `GET /api/prescriptions/my`, `POST /api/medicine-delivery`, and `GET /api/medicine-delivery/my`.

The patient, doctor, and admin dashboards are role-routed from the JWT role. Admin data-management APIs remain protected by `requireRole('admin')`; verified provider information should be entered by an administrator rather than invented in seed data.

When `navigator.onLine` is false, the frontend keeps previously loaded local directory data visible but does not claim new server actions succeeded. Network Information API support varies by browser; low-data mode reduces media and animation where supported.

The WebRTC interface is a local prototype. HTTPS is required for production camera access, and a TURN server may be required for mobile or restrictive NAT networks. Medicine delivery is a request/tracking workflow only; no pharmacy or courier service is integrated.
