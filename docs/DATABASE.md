# Database Schema

Tables managed via Supabase PostgreSQL.

## users

| column   | type                     | notes                     |
| -------- | ------------------------ | ------------------------- |
| id       | uuid (primary key)       | auto-generated            |
| email    | text (unique)            |                           |
| password | text                     | bcrypt hashed             |
| name     | text                     |                           |
| role     | text                     | admin, doctor, patient    |
| created_at | timestamptz            | auto                      |

## patients

| column    | type                     | notes                        |
| --------- | ------------------------ | ---------------------------- |
| id        | uuid (primary key)       | auto-generated               |
| name      | text                     |                              |
| email     | text                     |                              |
| phone     | text                     |                              |
| dob       | date                     |                              |
| doctor_id | uuid (references users)  | assigned doctor              |
| status    | text                     | active, discharged, etc.     |
| created_at | timestamptz             | auto                         |

## appointments

| column    | type                     | notes                        |
| --------- | ------------------------ | ---------------------------- |
| id        | uuid (primary key)       | auto-generated               |
| doctor_id | uuid (references users)  |                              |
| patient_id | uuid (references patients) |                           |
| date      | date                     |                              |
| time      | time                     |                              |
| reason    | text                     |                              |
| status    | text                     | scheduled, completed, cancelled |
| created_at | timestamptz             | auto                         |
