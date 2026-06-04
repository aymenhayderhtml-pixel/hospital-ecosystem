# Setup Guide

## Prerequisites

- Node.js 18+
- npm

## Backend Setup

```bash
cd server
cp .env.example .env
# Edit .env with your Supabase credentials and JWT secret
npm install
npm run dev
```

Server runs at `http://localhost:5000`.

## Frontend Setup

```bash
cd client
cp .env.example .env
# Edit .env with your Supabase anon key
npm install
npm run dev
```

Client runs at `http://localhost:5173`.

## Verify

```bash
curl http://localhost:5000/api/health
# => { "status": "ok", ... }
```
