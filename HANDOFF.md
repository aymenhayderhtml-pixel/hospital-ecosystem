# HANDOFF.md — Session Context for MediCare HMS

Paste this file at the start of your next AI session to restore full project context.

---

## Project Status

MediCare HMS is a full-stack hospital management system. **All Phase 2 modules are complete and working.**

### What's Fully Working
- **Auth** — Register, login, JWT, role-based access (admin, doctor, receptionist, patient)
- **Patients** — CRUD with search, pagination, auto-generated IDs (PAT-XXXX)
- **Appointments** — Booking with double-booking prevention, role-filtered views
- **Doctors** — Listing with specialty filter (backed by doctors table)
- **Medical Records** — Visit history with diagnosis, symptoms, prescriptions
- **Inventory** — Stock tracking, low-stock alerts, expiry date monitoring
- **Dashboard** — Live stats (patients, appointments, doctors), 7-day bar chart, hospital capacity, top diagnoses pie chart, recent patients table
- **Settings** — Tabbed page with user management (admin), hospital info, profile update, password change
- **Billing** — Invoices with atomic inventory deduction (PostgreSQL function), line items, paid/cancelled workflow
- **Dark Theme** — Full dark mode across all 28+ components via Tailwind `dark:` classes, localStorage persistence, system preference fallback, toggle in sidebar

### Last Thing Built
**Dark Theme** — Added `darkMode: 'class'` to Tailwind config, created ThemeContext + ThemeToggle, applied `dark:bg-gray-800`/`dark:bg-gray-900`/`dark:text-white` etc. across all components. The sidebar toggle switches the entire UI. Fixed duplicate dark classes and data display bugs (Dr. Dr. prefix, patient name column).

### Known Issues
- No known bugs. The project is in a stable state.

## How to Continue

Start a new AI session by pasting this file and saying "let's continue" or specifying what to build next.

### Possible Next Features (Priority Order)
1. **Print & Export** — Generate PDF invoices and medical reports
2. **Notifications** — In-app alerts for low inventory, upcoming appointments
3. **Enhanced Dashboard** — More charts, date range pickers, exportable reports
4. **Patient Portal** — Self-service login for patients to view records
5. **Audit Logging** — Track who changed what and when
6. **Dark Theme Polish** — Refine any remaining light areas (scrollbars, selects)

## Complete File Listing

### Server (`server/`)
```
src/
├── config/
│   ├── database.js
│   └── supabase.js
├── controllers/
│   ├── appointmentController.js
│   ├── authController.js
│   ├── billingController.js
│   ├── dashboardController.js
│   ├── doctorController.js
│   ├── inventoryController.js
│   ├── patientController.js
│   ├── recordController.js
│   └── settingsController.js
├── middleware/
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   └── validateMiddleware.js
├── models/
│   ├── Patient.js
│   └── User.js
├── routes/
│   ├── appointmentRoutes.js
│   ├── authRoutes.js
│   ├── billingRoutes.js
│   ├── dashboardRoutes.js
│   ├── doctorRoutes.js
│   ├── index.js
│   ├── inventoryRoutes.js
│   ├── patientRoutes.js
│   ├── recordRoutes.js
│   └── settingsRoutes.js
├── services/
│   ├── appointmentService.js
│   ├── authService.js
│   └── patientService.js
├── utils/
│   ├── helpers.js
│   ├── jwt.js
│   └── logger.js
├── validators/
│   ├── appointmentValidator.js
│   ├── authValidator.js
│   ├── billingValidator.js
│   ├── inventoryValidator.js
│   ├── patientValidator.js
│   ├── recordValidator.js
│   └── settingsValidator.js
├── app.js
└── server.js
```

### Client (`client/`)
```
src/
├── components/
│   ├── appointments/
│   │   ├── AppointmentForm.jsx
│   │   ├── AppointmentList.jsx
│   │   └── DoctorAppointments.jsx
│   ├── billing/
│   │   ├── InvoiceDetail.jsx
│   │   ├── InvoiceForm.jsx
│   │   └── InvoiceList.jsx
│   ├── common/
│   │   └── ThemeToggle.jsx
│   ├── dashboard/
│   │   ├── AppointmentsBarChart.jsx
│   │   └── TopDiagnosesChart.jsx
│   ├── inventory/
│   │   ├── InventoryAlerts.jsx
│   │   ├── InventoryForm.jsx
│   │   └── InventoryList.jsx
│   ├── layout/
│   │   ├── MainLayout.jsx
│   │   └── Sidebar.jsx
│   ├── patients/
│   │   ├── PatientForm.jsx
│   │   ├── PatientList.jsx
│   │   └── PatientProfile.jsx
│   ├── records/
│   │   ├── MedicalRecordForm.jsx
│   │   ├── PatientHistory.jsx
│   │   └── RecordDetail.jsx
│   ├── settings/
│   │   └── CreateUserModal.jsx
│   └── ProtectedRoute.jsx
├── context/
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
├── pages/
│   ├── auth/
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   ├── dashboard/
│   │   └── DashboardHome.jsx
│   └── settings/
│       ├── HospitalTab.jsx
│       ├── ProfileTab.jsx
│       ├── SettingsPage.jsx
│       └── UsersTab.jsx
├── services/
│   ├── api.js
│   ├── appointmentService.js
│   ├── authService.js
│   ├── billingService.js
│   ├── dashboardService.js
│   ├── doctorService.js
│   ├── inventoryService.js
│   ├── patientService.js
│   ├── recordService.js
│   └── settingsService.js
├── App.jsx
└── main.jsx
```

### Other
```
docs/
├── API.md
├── DATABASE.md
├── SETUP.md
├── progress.md
README.md
AGENT.md
HANDOFF.md
```
