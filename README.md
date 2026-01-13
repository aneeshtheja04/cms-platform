# CMS Platform

A full-stack CMS platform with Admin interface, Public Catalog API, and Scheduled Publishing.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, React Router
- **Backend**: Node.js, Express, PostgreSQL
- **Infrastructure**: Docker, Docker Compose

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Node.js (for running npm scripts)

### Start the Application

```bash
npm run dev
```

This will:
1. Rebuild services with latest code changes
2. Automatically run migrations and seed data
3. Start all services and show logs

**Note:** Database data is now persistent! Running `npm run dev` multiple times won't lose your data.

### Fresh Start (Reset Everything)

```bash
npm run dev:fresh
```

This will:
1. Stop and remove all containers and volumes
2. Rebuild everything from scratch
3. Run migrations and seed data automatically
4. Start all services

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Rebuild and start all services with latest changes (preserves DB) |
| `npm run dev:fresh` | Complete fresh start (removes DB, rebuilds, migrates, seeds) |
| `npm run setup` | Run migrations and seed data (use after first `npm run dev`) |
| `npm start` | Start all services without rebuilding |
| `npm stop` | Stop all services |
| `npm run restart` | Restart all services |
| `npm run logs` | View logs from all services (follow mode) |
| `npm run migrate` | Run database migrations |
| `npm run seed` | Seed database with sample data |
| `npm run db:reset` | Complete database reset (recreate + migrate + seed) |

## Access URLs

- **Frontend (React App)**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Health Check**: http://localhost:3000/health
- **Database**: localhost:5432

## Project Structure

```
cms-platform/
├── frontend/          # React frontend (Vite + Tailwind)
├── backend/           # Node.js API server
├── worker/            # Background worker for scheduled publishing
├── migrations/        # Database migrations
├── docker-compose.yml # Docker services configuration
└── package.json       # Root npm scripts
```

## Development Workflow

1. **Make changes** to frontend/backend code
2. **Run** `npm run dev` to rebuild and restart services
3. **View logs** with `npm run logs` if needed
4. **Access** http://localhost:5173 to test

## Docker Services

- **db**: PostgreSQL 15 database
- **api**: Backend API server (Express)
- **worker**: Background job processor
- **web**: Frontend development server (Vite)

## Troubleshooting

### Services won't start
```bash
npm stop
npm run dev
```

### Database connection issues
```bash
npm run db:reset
```

### Frontend shows 404 errors
Make sure the API is running and accessible at http://localhost:3000

### View service logs
```bash
# All services
npm run logs

# Specific service
docker compose logs -f api
docker compose logs -f web
```

## Features

- ✅ Multi-language content support
- ✅ Role-based access control (Admin, Editor, Viewer)
- ✅ Scheduled lesson publishing
- ✅ Program, Term, and Lesson management
- ✅ Asset management (posters, thumbnails)
- ✅ Public catalog API
- ✅ Responsive drawer UI for details
