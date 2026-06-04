# API Reference

Base URL: `http://localhost:5000/api`

## Health

```
GET /health
```

## Auth

### Register
```
POST /auth/register
Body: { "name": "...", "email": "...", "password": "...", "role": "patient|doctor|receptionist|admin" }
```

### Login
```
POST /auth/login
Body: { "email": "...", "password": "..." }
```

### Get Current User (requires Bearer token)
```
GET /auth/me
```

## Patients (requires Bearer token)

```
GET    /patients          ?doctor_id=&status=
GET    /patients/:id
POST   /patients          { name, email, phone, dob, doctor_id, status }
PUT    /patients/:id      { ...fields }
DELETE /patients/:id
```

## Appointments (requires Bearer token)

```
GET    /appointments      ?doctor_id=&patient_id=&status=&date=
POST   /appointments      { doctor_id, patient_id, date, time, reason }
```
