# Progress Log

## 2026-06-04

### Initial Setup
- Created project folder structure: `client/`, `server/`, `docs/`
- Set up React + Vite frontend with Tailwind CSS
- Set up Node.js + Express backend
- Installed all dependencies for both client and server

### Authentication System — Complete
- **Supabase config:** Switched to `SUPABASE_SERVICE_ROLE_KEY` for server-side operations
- **JWT utility:** `generateToken` and `verifyToken` with issuer validation
- **Auth controller:** `register`, `login`, `getMe` endpoints
  - bcrypt at 12 salt rounds
  - Case-insensitive email lookup (`ilike`)
  - Generic error messages (prevents email enumeration)
  - Account active check (`is_active` field)
  - Password stripped from responses
- **Auth middleware:** `protect` (JWT verify with expired token handling) and `authorize` (role-based access)
- **Validators:** Registration (name length, email, password strength, role enum) and login validation via express-validator
- **Auth routes:** `/register` and `/login` public, `/me` protected
- **Updated existing routes** (patients, appointments) to use new `protect` middleware

### Frontend Auth — Complete
- **Auth API service:** Axios instance with JWT request interceptor and 401 global redirect
- **Unified API client** (`api.js`) for all service imports
- **AuthContext:** `AuthProvider` + `useAuth` hook, persists to localStorage, exposes login/register/logout/hasRole/isAuthenticated
- **ProtectedRoute:** Redirects to login with preserved return path, optional role-gating
- **LoginPage:** Full form with show/hide password, loading spinner, error handling, redirect-after-login
- **RegisterPage:** Form with password strength indicator, confirm password, role selection cards, client-side validation
- **App.jsx:** BrowserRouter + AuthProvider at root level, routes for login, register, dashboard, admin

### Patient Registration Module — Complete
- **Supabase SQL:** `patients` table with auto-generated patient numbers (PAT-0001...), indexes, and updated_at trigger
- **Patient controller:** `createPatient`, `getAllPatients` (search + pagination), `getPatientById` (with age calc + created_by join), `updatePatient` (partial update + duplicate check)
- **Patient validators:** Comprehensive validation for create (all required fields, regex patterns, date ranges) and update (all optional, same rules)
- **Patient routes:** All routes protected via `router.use(protect)`, validators wired to POST and PUT
- **Frontend patientService.js:** Object-based API with `create`, `getAll`, `getById`, `update`
- **PatientForm:** Multi-section form (personal, contact, medical, emergency) with client-side validation, field errors, loading state, redirect on success
- **PatientList:** Searchable table with pagination, gender badges, search across name/number/phone/email
- **PatientProfile:** Profile card with gradient header, initials avatar, age calculation, all sections displayed, related user info
- **Dashboard:** Nav with user info + logout, quick-action cards (Patients, Appointments, Reports), welcome message
- **App.jsx:** Routes wired for `/patients`, `/patients/new`, `/patients/:id`

### Pending
- Create Supabase `users` and `patients` tables via SQL Editor
- Set up real credentials in `.env` files
- Connect to real Supabase project
- Appointment management module
- Edit patient page
