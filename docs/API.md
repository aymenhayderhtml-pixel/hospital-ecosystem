# API Reference

Base URL: `http://localhost:5000/api`

## Health

```
GET /health
```

## Auth

```
POST /auth/register    { email, password, name, role? }
POST /auth/login       { email, password }
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
