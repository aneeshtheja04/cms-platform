# ZenCMS Platform

A full-stack Content Management System with Admin interface, Public Catalog API, and Scheduled Publishing capabilities.

## 🚀 Deployed URLs

- **Frontend (CMS Admin)**: https://frontend-production-c995.up.railway.app
- **Backend API**: https://backend-production-9b06.up.railway.app
- **API Health Check**: https://backend-production-9b06.up.railway.app/health
- **Public Catalog API**: https://backend-production-9b06.up.railway.app/catalog/programs

## 📋 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@cms.com | admin123 |
| Editor | editor@cms.com | editor123 |
| Viewer | viewer@cms.com | viewer123 |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Users                                │
└────────────┬──────────────────────────────┬─────────────────┘
             │                              │
             │ CMS Admin UI                 │ Public Catalog API
             │ (Auth Required)              │ (Public Read-Only)
             ▼                              ▼
    ┌─────────────────┐           ┌─────────────────┐
    │    Frontend     │           │  Catalog API    │
    │   React + Vite  │           │   /catalog/*    │
    │  (Port 5173)    │           │                 │
    └────────┬────────┘           └────────┬────────┘
             │                              │
             │ HTTPS                        │ HTTPS
             │ (CORS Protected)             │ (Public)
             ▼                              ▼
    ┌──────────────────────────────────────────────┐
    │            Backend API                       │
    │         Express + Node.js                    │
    │          (Port 3000)                         │
    │                                              │
    │  Routes:                                     │
    │  • /api/auth   - Authentication             │
    │  • /api/users  - User management (RBAC)     │
    │  • /api/programs - Program CRUD             │
    │  • /api/terms  - Term management            │
    │  • /api/lessons - Lesson management         │
    │  • /catalog/*  - Public read-only API       │
    └───────────────────┬──────────────────────────┘
                        │
                        │ PostgreSQL Connection
                        ▼
             ┌──────────────────────┐
             │   PostgreSQL DB      │
             │                      │
             │  Tables:             │
             │  • users             │
             │  • programs          │
             │  • terms             │
             │  • lessons           │
             │  • topics            │
             │  • program_assets    │
             │  • lesson_assets     │
             │  • migrations        │
             └──────────┬───────────┘
                        │
                        │ Polls every 60s
                        ▼
             ┌──────────────────────┐
             │   Worker Service     │
             │   (Background Job)   │
             │                      │
             │  • Checks scheduled  │
             │    lessons           │
             │  • Auto-publishes    │
             │    when time arrives │
             └──────────────────────┘
```

### Component Responsibilities

- **Frontend**: React-based admin dashboard with authentication, role-based access control (Admin/Editor/Viewer), and full CRUD operations for content management
- **Backend API**: Express.js REST API with JWT authentication, RBAC middleware, and separate public catalog endpoints
- **PostgreSQL**: Relational database storing all content, users, and metadata with foreign key constraints
- **Worker**: Node.js cron job that runs every 60 seconds to auto-publish scheduled lessons and update program statuses

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Router 7** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library

### Backend
- **Node.js 20** - Runtime
- **Express 5** - Web framework
- **PostgreSQL** - Database
- **pg** - PostgreSQL client
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **dotenv** - Environment variables
- **CORS** - Cross-origin resource sharing

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Railway** - Cloud deployment platform

---

## 🚀 Local Setup

### Prerequisites
- Docker and Docker Compose installed
- Node.js 20+ (for running npm scripts)
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cms-platform
   ```

2. **Start all services**
   ```bash
   npm run dev
   ```

   This command will:
   - Build Docker images for all services
   - Start PostgreSQL database
   - Run migrations automatically
   - Seed database with sample data
   - Start backend API server
   - Start worker service
   - Start frontend dev server

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - Health Check: http://localhost:3000/health

4. **Login with demo credentials**
   - Email: `admin@cms.com`
   - Password: `admin123`

### Fresh Start (Reset Everything)

```bash
npm run dev:fresh
```

This will:
- Stop and remove all containers and volumes
- Delete all database data
- Rebuild everything from scratch
- Run migrations and seed data

---

## 📂 Project Structure

```
cms-platform/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── api/             # API client and endpoints
│   │   ├── components/      # Reusable UI components
│   │   ├── layouts/         # Page layouts (Dashboard, Auth)
│   │   ├── pages/           # Route components
│   │   ├── contexts/        # React context providers
│   │   └── assets/          # Static assets (images, logos)
│   ├── Dockerfile           # Frontend production build
│   └── vite.config.mjs      # Vite configuration
│
├── backend/                  # Express.js backend API
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   ├── controllers/     # Business logic
│   │   ├── services/        # Data access layer
│   │   ├── middlewares/     # Auth, error handling
│   │   └── config/          # Database configuration
│   ├── migrations/          # SQL migration files
│   ├── run-migrations.js    # Migration runner script
│   ├── run-seed.js          # Database seed script
│   └── Dockerfile           # Backend production build
│
├── worker/                   # Background worker service
│   ├── src/
│   │   ├── jobs/            # Scheduled job definitions
│   │   └── config/          # Worker configuration
│   └── Dockerfile           # Worker production build
│
├── docker-compose.yml        # Local development orchestration
├── package.json             # Root npm scripts
└── README.md                # This file
```

---

## 🗄️ Database

### How Migrations Run

**Local Development:**
- Migrations run automatically when you start services with `npm run dev`
- Migrations are tracked in the `migrations` table
- Only new migrations are executed (idempotent)

**Manual Migration:**
```bash
npm run migrate
```

**Production (Railway):**
- Migrations run automatically on container startup
- Defined in `backend/Dockerfile` CMD: `node run-migrations.js && node run-seed.js && node src/index.js`

### Migration Files

Located in `backend/migrations/`, executed in alphabetical order:
- `20260112000001_create_users.sql` - User accounts and RBAC
- `20260112000002_create_topics.sql` - Content topics/categories
- `20260112000003_create_programs.sql` - Educational programs
- `20260112000004_create_program_topics.sql` - Program-topic relationships
- `20260112000005_create_terms.sql` - Program terms/modules
- `20260112000006_create_lessons.sql` - Lesson content
- `20260112000007_create_program_assets.sql` - Program posters
- `20260112000008_create_lesson_assets.sql` - Lesson thumbnails

### How Seed Runs

**Local Development:**
```bash
npm run seed
```

**Production:**
- Seed runs automatically after migrations on first deployment
- Idempotent: checks if data exists before seeding
- Creates 3 users (admin, editor, viewer), 2 programs, 6 lessons, and sample assets

**Seed Data Includes:**
- 3 users with different roles
- 4 topics (Mathematics, Science, Programming, Language Learning)
- 2 programs (1 multi-language, 1 single-language)
- 2 terms
- 6 lessons (2 published, 1 scheduled, 3 draft)
- Program posters (portrait + landscape variants)
- Lesson thumbnails (portrait + landscape variants)

---

## 📜 Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Rebuild and start all services (preserves DB data) |
| `npm run dev:fresh` | Complete fresh start (removes DB, rebuilds, migrates, seeds) |
| `npm start` | Start all services without rebuilding |
| `npm stop` | Stop all services |
| `npm run restart` | Restart all services |
| `npm run logs` | View logs from all services (follow mode) |
| `npm run migrate` | Run database migrations |
| `npm run seed` | Seed database with sample data |
| `npm run db:reset` | Complete database reset (recreate + migrate + seed) |

---

## 🎬 Demo Flow

### 1. Login as Editor

1. Navigate to https://frontend-production-c995.up.railway.app
2. Login with:
   - Email: `editor@cms.com`
   - Password: `editor123`
3. You'll see the ZenCMS dashboard

### 2. Create/Edit Lesson and Schedule Publish

1. Click **"Programs"** in the sidebar
2. Click on **"Introduction to Programming"** program
3. Click **"View Terms"** button
4. Click on **"Getting Started"** term
5. Click **"Add Lesson"** button
6. Fill in the lesson details:
   - Title: "Advanced Functions"
   - Content Type: Video
   - Duration: 600000 ms (10 minutes)
   - Content Language: English
   - Content URL: `https://example.com/video.mp4`
7. Upload thumbnail URLs for portrait and landscape variants
8. Click **"Schedule"** button
9. Set publish date to **2 minutes from now**
10. Click **"Confirm"**

### 3. Wait for Worker → Verify It Becomes Published

1. Wait for approximately 2 minutes
2. The worker service runs every 60 seconds
3. Refresh the lesson list
4. The lesson status will change from **"Scheduled"** to **"Published"**
5. The program status will automatically become **"Published"** (if it wasn't already)

### 4. Verify Public Catalog Now Includes It

1. Open a new browser tab (or use curl/Postman)
2. Make a GET request to the public catalog API:
   ```bash
   curl https://backend-production-9b06.up.railway.app/catalog/programs
   ```
3. You should see the "Introduction to Programming" program in the response
4. Get specific program details:
   ```bash
   curl https://backend-production-9b06.up.railway.app/catalog/programs/{program-id}
   ```
5. Verify the newly published lesson appears in the terms → lessons list
6. Only **published lessons** are shown in the catalog API (drafts and scheduled lessons are hidden)

---

## 🔐 Authentication & Authorization

### Roles

| Role | Permissions |
|------|-------------|
| **Admin** | Full access: manage users, programs, lessons, topics, and all CMS features |
| **Editor** | Manage programs, lessons, topics; create/edit/publish/schedule content |
| **Viewer** | Read-only access to all CMS content |

### JWT Authentication

- Tokens issued on login with 24-hour expiration
- Stored in localStorage on client
- Sent in `Authorization: Bearer <token>` header
- Backend validates and decodes JWT on protected routes
- Middleware checks role permissions for each endpoint

---

## 📡 API Endpoints

### Admin API (Authentication Required)

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| POST | `/api/auth/login` | User login | Public |
| GET | `/api/auth/me` | Get current user | All |
| GET | `/api/users` | List all users | Admin |
| POST | `/api/users` | Create user | Admin |
| PATCH | `/api/users/:id` | Update user | Admin |
| DELETE | `/api/users/:id` | Delete user | Admin |
| GET | `/api/programs` | List programs | All |
| POST | `/api/programs` | Create program | Admin, Editor |
| PATCH | `/api/programs/:id` | Update program | Admin, Editor |
| DELETE | `/api/programs/:id` | Delete program | Admin |
| GET | `/api/topics` | List topics | All |
| POST | `/api/topics` | Create topic | Admin, Editor |
| GET | `/api/lessons/:id` | Get lesson | All |
| PATCH | `/api/lessons/:id` | Update lesson | Admin, Editor |
| POST | `/api/lessons/:id/publish` | Publish lesson | Admin, Editor |
| POST | `/api/lessons/:id/schedule` | Schedule lesson | Admin, Editor |

### Public Catalog API (No Authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/catalog/programs` | List published programs with filters |
| GET | `/catalog/programs/:id` | Get program details with published lessons |
| GET | `/catalog/lessons/:id` | Get published lesson details |

**Query Parameters for `/catalog/programs`:**
- `language` - Filter by primary language (e.g., `en`, `te`, `hi`)
- `topic` - Filter by topic name
- `cursor` - Pagination cursor
- `limit` - Results per page (default: 10)

---

## ⚙️ Worker Service

### Scheduled Publishing

The worker service automatically publishes scheduled lessons:

- **Interval**: Runs every 60 seconds
- **Query**: Finds lessons with `status='scheduled' AND publish_at <= NOW()`
- **Action**: Updates lesson status to `'published'` and sets `published_at`
- **Auto-Publish Programs**: If a program has at least 1 published lesson, the program status becomes `'published'`

### Concurrency Safety

- Uses database transactions for atomic updates
- Idempotent: safe to run multiple worker instances
- Row-level locking prevents duplicate processing

---

## 🌐 Deployment (Railway)

### Services Deployed

1. **PostgreSQL** - Managed database
2. **Backend** - Express API server
3. **Worker** - Background scheduler
4. **Frontend** - React SPA

### Environment Variables

**Backend:**
```bash
NODE_ENV=production
PORT=3000
JWT_SECRET=<secure-random-string>
DB_HOST=${{Postgres.PGHOST}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_PORT=${{Postgres.PGPORT}}
```

**Frontend:**
```bash
VITE_API_URL=https://backend-production-9b06.up.railway.app
```

**Worker:**
```bash
NODE_ENV=production
DB_HOST=${{Postgres.PGHOST}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_PORT=${{Postgres.PGPORT}}
WORKER_INTERVAL_MS=60000
```

### Deployment Guide

See [RAILWAY_QUICKSTART.md](./RAILWAY_QUICKSTART.md) for detailed deployment instructions.

---

## 🐛 Troubleshooting

### Services won't start locally
```bash
npm stop
npm run dev:fresh
```

### Database connection issues
```bash
npm run db:reset
```

### Frontend shows 404 errors
- Verify backend is running: `curl http://localhost:3000/health`
- Check CORS configuration in `backend/src/index.js`
- Ensure `VITE_API_URL` is set correctly in `frontend/.env`

### Worker not publishing scheduled lessons
- Check worker logs: `docker compose logs -f worker`
- Verify database connection
- Test by creating a lesson scheduled for 1-2 minutes in the future

### View service logs
```bash
# All services
npm run logs

# Specific service
docker compose logs -f api
docker compose logs -f worker
docker compose logs -f web
docker compose logs -f db
```

---

## ✨ Features

- ✅ Multi-language content support (English, Telugu, Hindi)
- ✅ Role-based access control (Admin, Editor, Viewer)
- ✅ Scheduled lesson publishing with worker automation
- ✅ Program, Term, and Lesson hierarchical management
- ✅ Multi-variant asset management (portrait, landscape, square, banner)
- ✅ Public catalog API with filtering and pagination
- ✅ Responsive UI with modern design (Tailwind CSS)
- ✅ JWT authentication with secure password hashing
- ✅ Database migrations with tracking
- ✅ Idempotent seed data
- ✅ Docker containerization for all services
- ✅ Production deployment on Railway

---

## 📄 License

This project is part of a take-home assignment.

---

## 🙏 Acknowledgments

Built with Claude Sonnet 4.5 using Claude Code.

---

**Generated with ZenCMS** 🚀
