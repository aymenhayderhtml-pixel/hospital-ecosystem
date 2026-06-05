# MediCare HMS — Hospital Management System

A full-stack hospital management system for managing patients, appointments, medical records, inventory, billing, and staff. Built with React + Vite and Node.js + Express, powered by Supabase (PostgreSQL).

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

## Completed Modules

- **Auth** — Register, Login, JWT authentication, role-based access (admin, doctor, receptionist, patient)
- **Patients** — CRUD with search, pagination, auto-generated patient numbers
- **Appointments** — Booking with double-booking prevention, role-based filtering
- **Doctors** — Listing, specialty filter, linked to user accounts
- **Medical Records** — Clinical visit history with diagnosis, symptoms, prescriptions
- **Inventory** — Stock tracking with low-stock alerts, expiry monitoring, category filtering
- **Dashboard** — Live stats, 7-day appointment chart, top diagnoses, hospital capacity
- **Settings** — User management, hospital info, profile update, password change
- **Billing** — Invoice creation with atomic inventory deduction, status management
- **Dark Theme** — System preference detection, localStorage persistence, toggle in sidebar

## Project Structure

```
hospital/
├── client/                     # React + Vite frontend
│   ├── src/
│   │   ├── components/         # UI components by domain
│   │   │   ├── appointments/   # AppointmentList, AppointmentForm, DoctorAppointments
│   │   │   ├── billing/        # InvoiceList, InvoiceForm, InvoiceDetail
│   │   │   ├── common/         # ThemeToggle
│   │   │   ├── dashboard/      # BarChart, PieChart
│   │   │   ├── inventory/      # InventoryList, InventoryForm, InventoryAlerts
│   │   │   ├── layout/         # MainLayout, Sidebar
│   │   │   ├── patients/       # PatientList, PatientForm, PatientProfile
│   │   │   ├── records/        # MedicalRecordForm, PatientHistory, RecordDetail
│   │   │   ├── settings/       # CreateUserModal
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/            # AuthContext, ThemeContext
│   │   ├── pages/              # Auth pages, Dashboard, Settings tabs
│   │   ├── services/           # API service layer (Axios)
│   │   ├── App.jsx             # Root with nested routes
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                     # Node.js + Express API
│   ├── src/
│   │   ├── config/             # Supabase client
│   │   ├── controllers/        # Request handlers (inline validationResult)
│   │   ├── middleware/          # protect (JWT), authorize (roles), error handler
│   │   ├── models/             # Data model classes
│   │   ├── routes/             # Express routers with mount at /api
│   │   ├── services/           # Business logic layer
│   │   ├── utils/              # JWT helpers, logger, sanitize
│   │   └── validators/         # express-validator chains
│   ├── server.js               # Entry point with graceful shutdown
│   └── package.json
├── docs/                       # API.md, DATABASE.md, SETUP.md
└── README.md
```

## Quick Start

```bash
# Install dependencies
cd server && npm install
cd ../client && npm install

# Configure environment
cp server/.env.example server/.env    # Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, JWT_SECRET
cp client/.env.example client/.env

# Run SQL migrations in Supabase SQL Editor (see docs/DATABASE.md)

# Start development (both terminals)
cd server && npm run dev   # API at http://localhost:5000
cd client && npm run dev   # UI at http://localhost:5173
```

## Environment Variables

### Backend (`server/.env`)
| Variable | Description |
|----------|-------------|
| `PORT` | API port (default: 5000) |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `JWT_SECRET` | Secret for signing JWT tokens |

### Frontend (`client/.env`)
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | API base URL (default: `/api`) |

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register user |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/me` | Protected | Current user |
| GET/POST | `/api/patients` | Protected | List/Create patients |
| GET/PUT | `/api/patients/:id` | Protected | Get/Update patient |
| GET/POST | `/api/appointments` | Protected | List/Create appointments |
| PATCH | `/api/appointments/:id/status` | Protected | Update status |
| GET | `/api/doctors` | Protected | List doctors |
| GET/POST | `/api/records` | Protected | List/Create records |
| PUT | `/api/records/:id` | Protected | Update record |
| GET/POST | `/api/inventory` | Protected | List/Create inventory |
| GET | `/api/inventory/alerts` | Protected | Low stock/expiry alerts |
| PUT/DELETE | `/api/inventory/:id` | Admin | Update/Delete item |
| GET | `/api/dashboard/stats` | Protected | Live dashboard stats |
| GET | `/api/dashboard/appointments-chart` | Protected | 7-day chart data |
| GET | `/api/dashboard/top-diagnoses` | Protected | Top diagnoses |
| GET | `/api/dashboard/hospital-summary` | Protected | Bed capacity |
| GET | `/api/settings/users` | Admin | List users |
| POST | `/api/settings/users` | Admin | Create user |
| GET/PUT | `/api/settings/hospital` | Protected | Get/Update hospital info |
| PATCH | `/api/settings/profile` | Protected | Update own profile |
| PATCH | `/api/settings/password` | Protected | Change password |
| POST | `/api/billing/invoices` | Protected | Create invoice |
| GET | `/api/billing/invoices` | Protected | List invoices |
| PATCH | `/api/billing/invoices/:id/status` | Protected | Mark paid/cancelled |
