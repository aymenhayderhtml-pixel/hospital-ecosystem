# Hospital Management System

Full-stack hospital management system built with React + Vite (frontend) and Node.js + Express (backend), powered by Supabase.

## Project Structure

```
hospital-management-system/
├── client/          # React + Vite frontend
├── server/          # Node.js + Express API
└── docs/            # Documentation
```

## Quick Start

See [docs/SETUP.md](docs/SETUP.md) for full setup instructions.

```bash
# Backend
cd server
cp .env.example .env   # Fill in your credentials
npm run dev

# Frontend (separate terminal)
cd client
npm run dev
```

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, React Router, Axios
- **Backend:** Node.js, Express, Supabase, JWT, bcrypt
- **Database:** PostgreSQL (via Supabase)
