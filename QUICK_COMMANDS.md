# Quick Commands Cheat Sheet

Copy-paste ready commands for GitHub and Railway deployment.

---

## 🐙 GitHub Setup (Copy & Paste)

```bash
# Navigate to project
cd /Users/aneesh/Desktop/cms-platform

# Initialize git
git init

# Stage all files
git add .

# Create initial commit
git commit -m "Initial commit: Full-stack CMS Platform with Admin UI, Public Catalog API, and Scheduled Publishing Worker

- Admin CMS with authentication and RBAC (admin, editor, viewer)
- Public Catalog API with cursor pagination and caching
- Background worker for scheduled lesson publishing
- Docker Compose setup for local development
- Database migrations and seed data
- Multi-language support for programs and lessons
- Asset management for posters and thumbnails"

# STEP 1: Create repository on GitHub first
# Go to github.com → New repository → Name: cms-platform
# DO NOT initialize with README or .gitignore

# STEP 2: Add remote (REPLACE YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/cms-platform.git

# STEP 3: Push to GitHub
git branch -M main
git push -u origin main
```

---

## 🔐 Generate Strong JWT Secret

```bash
# macOS/Linux
openssl rand -base64 32

# Or Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output - you'll need it for Railway backend environment variables.

---

## 🚂 Railway Environment Variables

### Backend Service

```bash
NODE_ENV=production
PORT=3000
JWT_SECRET=PASTE_GENERATED_SECRET_HERE
DB_HOST=${{Postgres.PGHOST}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_PORT=${{Postgres.PGPORT}}
```

### Worker Service

```bash
NODE_ENV=production
DB_HOST=${{Postgres.PGHOST}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_PORT=${{Postgres.PGPORT}}
WORKER_INTERVAL_MS=60000
```

### Frontend Service

```bash
NODE_ENV=production
VITE_API_URL=https://YOUR-BACKEND-URL.up.railway.app
```

**Note**: Replace `YOUR-BACKEND-URL` with actual backend URL from Railway.

---

## 🧪 Testing Commands

```bash
# Test backend health
curl https://YOUR-BACKEND-URL.up.railway.app/health

# Test catalog API - list programs
curl https://YOUR-BACKEND-URL.up.railway.app/catalog/programs

# Test catalog API - with pagination
curl "https://YOUR-BACKEND-URL.up.railway.app/catalog/programs?limit=5"

# Test catalog API - filter by language
curl "https://YOUR-BACKEND-URL.up.railway.app/catalog/programs?language=en"

# Check cache headers
curl -I https://YOUR-BACKEND-URL.up.railway.app/catalog/programs

# Test specific program
curl https://YOUR-BACKEND-URL.up.railway.app/catalog/programs/PROGRAM_ID_HERE

# Test specific lesson
curl https://YOUR-BACKEND-URL.up.railway.app/catalog/lessons/LESSON_ID_HERE
```

---

## 📝 Git Commands for Updates

```bash
# Check status
git status

# Stage all changes
git add .

# Commit with message
git commit -m "Your descriptive message here"

# Push to GitHub (Railway auto-deploys)
git push origin main

# View commit history
git log --oneline --graph --all

# Create new branch
git checkout -b feature/new-feature

# Switch back to main
git checkout main

# Merge branch
git merge feature/new-feature
```

---

## 🔧 Railway CLI Commands (Optional)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# Deploy from CLI
railway up

# View logs
railway logs

# Run migrations manually
railway run --service=backend node run-migrations.js

# Run seed manually
railway run --service=backend node run-seed.js

# Open dashboard
railway open

# Check status
railway status
```

---

## 🐳 Local Development Commands

```bash
# Start all services
docker compose up --build

# Start in background
docker compose up -d

# View logs
docker compose logs -f

# View specific service logs
docker compose logs -f api
docker compose logs -f worker
docker compose logs -f web

# Stop all services
docker compose down

# Remove volumes (reset database)
docker compose down -v

# Restart services
docker compose restart

# Run migrations
npm run migrate

# Seed database
npm run seed

# Reset database
npm run db:reset
```

---

## 📊 Database Commands

```bash
# Connect to local PostgreSQL
docker compose exec db psql -U cms_user -d cms

# List tables
\dt

# Describe table
\d programs

# Run query
SELECT * FROM users;

# Exit
\q

# Backup database (local)
docker compose exec db pg_dump -U cms_user cms > backup.sql

# Restore database (local)
cat backup.sql | docker compose exec -T db psql -U cms_user cms
```

---

## 🔍 Debugging Commands

```bash
# Check if services are running
docker compose ps

# Check container logs
docker compose logs api
docker compose logs worker

# Execute command in container
docker compose exec api npm run migrate

# Check network connectivity
docker compose exec api ping db

# Check environment variables
docker compose exec api printenv

# Restart specific service
docker compose restart api

# Rebuild specific service
docker compose up -d --build api
```

---

## 🌐 CORS Configuration Update

After deploying to Railway, update backend CORS:

```javascript
// backend/src/index.js

app.use(cors({
  origin: [
    'http://localhost:5173',  // Local development
    'https://frontend-production-xxx.up.railway.app'  // Production
  ],
  credentials: true
}));
```

Commit and push:
```bash
git add backend/src/index.js
git commit -m "Configure CORS for Railway production deployment"
git push origin main
```

---

## 📦 Package Management

```bash
# Install dependencies (all services)
cd backend && npm install
cd ../frontend && npm install
cd ../worker && npm install

# Update dependencies
npm update

# Check for outdated packages
npm outdated

# Audit for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

---

## 🔑 Default Credentials

After seeding database:

```
Admin:
  Email: admin@cms.com
  Password: admin123

Editor:
  Email: editor@cms.com
  Password: editor123

Viewer:
  Email: viewer@cms.com
  Password: viewer123
```

**Important**: Change these in production!

---

## 📱 Access URLs (Local)

```
Frontend:  http://localhost:5173
Backend:   http://localhost:3000
Health:    http://localhost:3000/health
Catalog:   http://localhost:3000/catalog/programs
Database:  localhost:5432
```

---

## 🚨 Emergency Commands

```bash
# Remove .env from git if accidentally committed
git rm --cached .env
git commit -m "Remove .env from git"
git push origin main

# Reset last commit (keep changes)
git reset --soft HEAD~1

# Force push (use carefully!)
git push --force origin main

# Revert to specific commit
git revert COMMIT_HASH

# Stash changes
git stash

# Apply stashed changes
git stash pop

# Clean untracked files
git clean -fd
```

---

## 🎯 Quick Verification

```bash
# Verify .gitignore working
git status
# Should NOT see: .env, node_modules/

# Verify migrations
docker compose exec api npm run migrate

# Verify seed data
docker compose exec db psql -U cms_user cms -c "SELECT count(*) FROM users;"

# Verify worker is running
docker compose logs worker | tail -20

# Check all services health
curl http://localhost:3000/health
curl http://localhost:5173
```

---

## 📈 Monitoring

```bash
# Check Railway service status
railway status

# Stream Railway logs
railway logs --follow

# Check Railway variables
railway variables

# Check Railway service info
railway service
```

---

## 🔄 Update After Changes

```bash
# Make changes to code

# Test locally
docker compose down
docker compose up --build

# If tests pass, commit
git add .
git commit -m "Description of changes"
git push origin main

# Railway auto-deploys
# Monitor at: https://railway.app/dashboard
```

---

## 💾 Backup Commands

```bash
# Backup entire project
tar -czf cms-platform-backup.tar.gz cms-platform/

# Backup database only
docker compose exec db pg_dump -U cms_user cms > db-backup-$(date +%Y%m%d).sql

# Export environment variables
cp .env .env.backup
```

---

## 🎨 Frontend Dev Commands

```bash
cd frontend

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## 🔧 Backend Dev Commands

```bash
cd backend

# Start server with nodemon
npm run dev

# Run migrations
npm run migrate

# Rollback migration
npm run migrate:rollback

# Seed database
node run-seed.js

# Create new migration
npx knex migrate:make migration_name --knexfile knexfile.js
```

---

## ⚡ Quick Troubleshooting

```bash
# Backend won't start
docker compose logs api
docker compose restart api

# Database connection issues
docker compose exec db psql -U cms_user -c "SELECT 1;"

# Frontend can't reach backend
# Check VITE_API_URL in .env or Railway variables

# Worker not publishing
docker compose logs worker
# Check database time vs. lesson publish_at time

# Migrations failed
docker compose exec api node run-migrations.js

# Port already in use
lsof -ti:3000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

---

## 📚 Quick Links

- Railway Dashboard: https://railway.app
- GitHub Repository: https://github.com/YOUR_USERNAME/cms-platform
- Deployed Frontend: https://frontend-production-xxx.up.railway.app
- Deployed Backend: https://backend-production-xxx.up.railway.app

---

## 🎓 Learning Resources

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Docker version
docker --version

# Check Docker Compose version
docker compose version

# Check PostgreSQL version
docker compose exec db psql --version

# Check git version
git --version
```

---

## 🎯 Pro Tips

```bash
# Use aliases for common commands
alias dc='docker compose'
alias dcl='docker compose logs -f'
alias dce='docker compose exec'

# Then use like:
dc up -d
dcl api
dce api npm run migrate

# Add to ~/.bashrc or ~/.zshrc to persist
```

---

## ✅ Final Checklist

```bash
# GitHub
git remote -v  # Verify remote is set
git log --oneline  # Verify commits exist
git push origin main  # Verify push works

# Railway
railway login  # Verify CLI works
railway status  # Verify deployment status
curl https://backend-url/health  # Verify backend is live
curl https://frontend-url  # Verify frontend is live

# Testing
# Open frontend in browser
# Login with admin@cms.com / admin123
# Create and schedule a lesson
# Wait for worker to publish it
# Check catalog API for the lesson
```

---

**All set! You're ready to deploy 🚀**
