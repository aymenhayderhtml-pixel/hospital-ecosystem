# AGENT.md — AI Assistant Instructions for MediCare HMS

## Project Patterns (MUST Follow)

### Backend
- **Controllers** use inline `validationResult()` from express-validator — do NOT use the validate middleware wrapper
- **Route files** start with `router.use(protect)` for auth, then add `authorize('admin', ...)` per-route for mutations
- **Service layer** sits between controllers and models — controllers call services, services call models or supabase directly
- **Error responses** always return `{ success: boolean, message: string, data?: {} }`
- **Validation errors** always return `{ success: false, errors: [{ field, message }] }`

### Frontend
- **Services** always import from `./api` — the axios instance at `client/src/services/api.js`
- **API calls** use `import api from './api'` then `api.get('/endpoint')`, not `axios` directly
- **Service files** export an object with method names: `export const fooService = { create, getAll, getById, update }`
- **Components** fetch data in `useEffect`, manage loading/error/empty states
- **Auth state** comes from `useAuth()` hook in AuthContext — provides `user`, `token`, `login`, `logout`, `hasRole`

### Route Order (Critical)
Route ordering in Express matters — **specific routes MUST come before parameterized routes**:
```js
// ✅ CORRECT
router.get('/patient/:patientId', handler);   // Specific first
router.get('/:id', handler);                   // Parameterized after
router.get('/alerts', handler);                // Specific first
router.get('/:id', handler);                   // Parameterized after
```

## Supabase Tables & Key Fields

| Table | Key Fields |
|-------|-----------|
| `users` | id, name, email, password, role (admin\|doctor\|receptionist\|patient), is_active, created_at |
| `doctors` | id, user_id (FK→users), name, specialty, phone, available_days (TEXT[]), created_at |
| `patients` | id, patient_number (PAT-XXXX), first_name, last_name, date_of_birth, gender, phone, email, blood_type, address, emergency_contact_name, emergency_contact_phone, created_by (FK→users), created_at |
| `appointments` | id, patient_id (FK→patients), doctor_id (FK→doctors), appointment_date, appointment_time, reason, status (pending\|confirmed\|cancelled), notes, created_at |
| `medical_records` | id, patient_id (FK→patients), doctor_id (FK→doctors), appointment_id (FK→appointments, nullable), visit_date, diagnosis, symptoms, prescription, notes, follow_up_date, created_at |
| `inventory` | id, name, category (medicine\|equipment\|supply), quantity, unit (tablets\|ml\|pieces\|boxes), min_quantity, unit_price, supplier_name, expiry_date, created_at |
| `invoices` | id, patient_id (FK→patients), medical_record_id (FK→records), invoice_number (INV-XXXX), status (unpaid\|paid\|cancelled), subtotal, tax_amount, total_amount, notes, created_by (FK→users), created_at, paid_at |
| `invoice_items` | id, invoice_id (FK→invoices), item_type (medicine\|service), inventory_item_id (FK→inventory), item_name, quantity, unit_price, total_price, created_at |
| `hospital_settings` | hospital_name, address, phone, email, logo_url, total_beds |

## Common Mistakes & Fixes

### 1. Wrong Import Path for API
```
❌ import API from './authService';
❌ import API from '../api';
✅ import api from './api';
```

### 2. Wrong Field Names
Always check the Supabase tables section above before writing queries. Common mistakes:
- `specialty` not `specialization`
- `min_quantity` not `minQuantity`
- `unit_price` not `unitPrice`
- `appointment_date` not `appointmentDate`
- `appointment_time` not `appointmentTime`
- `follow_up_date` not `followUpDate`
- `invoice_number` not `invoiceNo`
- `appointment_id` not `appointmentId`
- Doctor's table has `name` directly — no user join needed (`d.user.name` is wrong, use `d.name`)

### 3. DB Triggers Don't Exist
The SQL function `update_updated_at_column()` does NOT exist in the Supabase database. Handle `updated_at` inline in the controller by passing `new Date().toISOString()`.

### 4. New Module Checklist
For each new module, create files in this order:
1. `validators/moduleValidator.js` — express-validator chains
2. `controllers/moduleController.js` — inline validationResult handlers
3. `routes/moduleRoutes.js` — protect + authorize + validators
4. Register in `routes/index.js` — `router.use('/module', require('./moduleRoutes'))`
5. `client/src/services/moduleService.js` — API service importing from `./api`
6. `client/src/components/module/` — React components
7. Wire routes in `client/src/App.jsx`

### 5. Database Joins in Supabase
When joining related tables in Supabase, use the `!inner` hint for required joins:
```js
.select(`
  id, field1, field2,
  related:related_table!inner (id, name)
`)
```
Foreign key fields in the database use `snake_case`. The join alias in the response matches the key name.

### 6. Auth Middleware
```js
const { protect, authorize } = require('../middleware/authMiddleware');
router.use(protect);                          // All routes protected
router.post('/', authorize('admin'), handler); // Role-gated mutation
```
