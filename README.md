# Hospital Management System

Full-stack hospital management system built with **React + Vite** (frontend) and **Node.js + Express** (backend), powered by **Supabase** (PostgreSQL).

## Project Structure

```
hospital-management-system/
├── client/               # React + Vite frontend
│   ├── src/
│   │   ├── components/   # Reusable UI (layout, patients, ProtectedRoute)
│   │   ├── pages/        # Auth pages, DashboardHome
│   │   ├── context/      # AuthContext provider
│   │   ├── services/     # API service layer (Axios)
│   │   └── App.jsx       # Root with nested routes
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/               # Node.js + Express API
│   ├── src/
│   │   ├── config/       # Supabase client
│   │   ├── controllers/  # Auth, Patient controllers
│   │   ├── middleware/    # JWT protect + role authorize
│   │   ├── routes/       # Auth, Patient, Appointment routes
│   │   ├── validators/   # express-validator rules
│   │   ├── services/     # Business logic layer
│   │   ├── utils/        # JWT helpers, logger
│   │   └── models/       # Supabase query models
│   ├── server.js         # Entry point with graceful shutdown
│   └── package.json
├── docs/                 # API.md, DATABASE.md, SETUP.md, progress.md
└── README.md
```

## Features

### ✅ Complete
- **Authentication** — Register, Login, Get Current User. JWT with bcrypt (12 rounds), role-based access (admin, doctor, receptionist, patient), email normalization, account deactivation support
- **Patient Management** — Create, list (search + pagination), view profile (with age calc), update. Auto-generated patient numbers (PAT-0001...)
- **Dashboard** — 4 stat cards, Recharts bar chart (7-day registrations), hospital summary, recent patients table
- **Layout** — Responsive sidebar (mobile drawer, desktop fixed), NavLink active states, user avatar + role + logout
- **Security** — Helmet, CORS, rate limiting, express-validator, generic auth error messages (no email enumeration)

### 🚧 Coming Next
- Appointment management module
- Edit patient page
- Connect to Supabase with real credentials

## Quick Start

```bash
# 1. Install dependencies
cd server && npm install
cd ../client && npm install

# 2. Configure environment
cp server/.env.example server/.env    # Add SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, JWT_SECRET
cp client/.env.example client/.env

# 3. Run database migrations
# Run the SQL from docs/DATABASE.md in Supabase SQL Editor

# 4. Start development servers
cd server && npm run dev   # API at http://localhost:5000
cd client && npm run dev   # UI at http://localhost:5173
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS 3, React Router 6 |
| Charts | Recharts |
| Backend | Node.js, Express 4 |
| Auth | JWT, bcryptjs |
| Database | PostgreSQL (via Supabase) |
| Validation | express-validator |
| HTTP Client | Axios |

## Testing the API

```bash
# Health check
curl http://localhost:5000/api/health

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Dr. Smith","email":"smith@hospital.com","password":"Password123","role":"doctor"}'

# Login (save the token)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"smith@hospital.com","password":"Password123"}'

# Get current user
curl http://localhost:5000/api/auth/me -H "Authorization: Bearer <token>"

# Create patient
curl -X POST http://localhost:5000/api/patients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"first_name":"John","last_name":"Doe","date_of_birth":"1985-05-15","gender":"male","phone":"+15551234567","blood_type":"O+"}'
```
