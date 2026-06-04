# Database Schema

Tables managed via Supabase PostgreSQL.

## users

```sql
CREATE TYPE user_role AS ENUM ('admin', 'doctor', 'receptionist', 'patient');

CREATE TABLE users (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       VARCHAR(255) NOT NULL,
  email      VARCHAR(255) UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,        -- bcrypt hash
  role       user_role NOT NULL DEFAULT 'patient',
  is_active  BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Important:** Do **not** enable Row-Level Security on the `users` table. Auth is handled server-side via JWT middleware.

### Indexes

```sql
CREATE INDEX idx_users_email ON users(LOWER(email));
CREATE INDEX idx_users_role ON users(role);
```

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
