# Deployment Guide

Complete guide for setting up GitHub repository and deploying to Railway.

---

## Part 1: GitHub Repository Setup

### Step 1: Create .gitignore File

First, create a `.gitignore` file to exclude sensitive and unnecessary files:

```bash
# Create .gitignore in project root
touch .gitignore
```

Add the following content to `.gitignore`:

```gitignore
# Environment variables
.env
.env.local
.env.production

# Node modules
node_modules/
*/node_modules/

# Logs
logs/
*.log
npm-debug.log*

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS files
.DS_Store
Thumbs.db

# Build outputs
dist/
build/
*.tsbuildinfo

# Claude AI context (optional - keep if you want Claude to access history)
# .claude/

# Database data (for local Docker volumes)
postgres-data/
pg-data/

# Temporary files
tmp/
temp/
```

### Step 2: Create .env.example File

Create a template for environment variables (without sensitive values):

```bash
# Create .env.example
touch .env.example
```

Add this content to `.env.example`:

```bash
# Database Configuration
DB_HOST=db
DB_USER=cms_user
DB_PASSWORD=cms_pass
DB_NAME=cms

# API Configuration
JWT_SECRET=your_secret_key_here
PORT=3000

# Worker Configuration (optional)
WORKER_INTERVAL_MS=60000
```

### Step 3: Initialize Git Repository

```bash
# Navigate to project directory
cd /Users/aneesh/Desktop/cms-platform

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: CMS Platform with Admin UI, Public Catalog API, and Worker"
```

### Step 4: Create GitHub Repository

1. Go to [GitHub](https://github.com) and log in
2. Click the "+" icon in top-right corner
3. Select "New repository"
4. Fill in details:
   - **Repository name**: `cms-platform` (or your preferred name)
   - **Description**: "Full-stack CMS platform with scheduled publishing, multi-language support, and public catalog API"
   - **Visibility**: Public or Private (your choice)
   - **DO NOT** initialize with README, .gitignore, or license (we already have them)
5. Click "Create repository"

### Step 5: Connect Local Repository to GitHub

```bash
# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/cms-platform.git

# Verify remote was added
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 6: Verify Repository Contents

Your GitHub repository should now contain:
- ✅ `backend/` - Backend API source code
- ✅ `frontend/` - React frontend source code
- ✅ `worker/` - Background worker source code
- ✅ `migrations/` - Database migrations (if at root level)
- ✅ `docker-compose.yml` - Docker orchestration
- ✅ `package.json` - Root npm scripts
- ✅ `README.md` - Project documentation
- ✅ `API_DOCUMENTATION.md` - API reference
- ✅ `DATABASE_STRUCTURE.md` - Database schema docs
- ✅ `.env.example` - Environment template
- ✅ `.gitignore` - Git ignore rules
- ❌ `.env` - (Should NOT be in repo - contains secrets)
- ❌ `node_modules/` - (Should NOT be in repo)

---

## Part 2: Railway Deployment

Railway is perfect for this project as it supports:
- PostgreSQL databases (managed)
- Multiple services (frontend, backend, worker)
- Automatic HTTPS
- Simple environment variable management

### Prerequisites

1. Create a [Railway account](https://railway.app)
2. Install Railway CLI (optional, but recommended):
   ```bash
   npm install -g @railway/cli
   ```

### Deployment Architecture on Railway

```
┌─────────────────────────────────────────────────────────┐
│                     Railway Project                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Frontend   │  │   Backend    │  │    Worker    │ │
│  │   (Vite)     │  │   (Express)  │  │   (Cron)     │ │
│  │   Port 5173  │  │   Port 3000  │  │   No port    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│         │                  │                 │          │
│         └──────────────────┴─────────────────┘          │
│                            │                             │
│                   ┌────────▼────────┐                   │
│                   │   PostgreSQL    │                   │
│                   │    (Managed)    │                   │
│                   └─────────────────┘                   │
└─────────────────────────────────────────────────────────┘
```

---

## Step-by-Step Railway Deployment

### Step 1: Create New Railway Project

1. Log in to [Railway Dashboard](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Authorize Railway to access your GitHub account
5. Select the `cms-platform` repository you just created
6. Railway will detect the project but we'll configure it manually

### Step 2: Add PostgreSQL Database

1. In your Railway project dashboard, click "+ New"
2. Select "Database" → "PostgreSQL"
3. Railway will provision a managed PostgreSQL database
4. Note: Railway automatically creates these environment variables:
   - `DATABASE_URL` (connection string)
   - `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`

### Step 3: Deploy Backend Service

1. Click "+ New" → "GitHub Repo" → Select your repository
2. Configure the service:
   - **Name**: `backend`
   - **Root Directory**: `/backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. Add Environment Variables (click on the backend service → "Variables" tab):
   ```
   NODE_ENV=production
   PORT=3000
   JWT_SECRET=<generate-a-strong-secret>

   # Database (use Railway's PostgreSQL variables)
   DB_HOST=${{Postgres.PGHOST}}
   DB_USER=${{Postgres.PGUSER}}
   DB_PASSWORD=${{Postgres.PGPASSWORD}}
   DB_NAME=${{Postgres.PGDATABASE}}
   DB_PORT=${{Postgres.PGPORT}}
   ```

4. **Important**: Add custom build script to run migrations:
   - Go to "Settings" tab
   - Under "Deploy", set "Custom Build Command":
     ```bash
     npm install && node run-migrations.js && node run-seed.js
     ```
   - This ensures migrations and seed data run on every deploy

5. Click "Deploy" to start the backend service

6. Get the public URL:
   - Go to "Settings" → "Networking"
   - Click "Generate Domain"
   - Copy the domain (e.g., `backend-production-abc123.up.railway.app`)
   - This is your **Deployed API URL**

### Step 4: Deploy Worker Service

1. Click "+ New" → "GitHub Repo" → Select your repository again
2. Configure the service:
   - **Name**: `worker`
   - **Root Directory**: `/worker`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. Add Environment Variables:
   ```
   NODE_ENV=production

   # Database (use Railway's PostgreSQL variables)
   DB_HOST=${{Postgres.PGHOST}}
   DB_USER=${{Postgres.PGUSER}}
   DB_PASSWORD=${{Postgres.PGPASSWORD}}
   DB_NAME=${{Postgres.PGDATABASE}}
   DB_PORT=${{Postgres.PGPORT}}

   # Worker configuration (optional)
   WORKER_INTERVAL_MS=60000
   ```

4. Click "Deploy"
5. Worker doesn't need a public URL (it's a background service)

### Step 5: Deploy Frontend Service

1. Click "+ New" → "GitHub Repo" → Select your repository again
2. Configure the service:
   - **Name**: `frontend`
   - **Root Directory**: `/frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run preview` (for production preview)

3. Add Environment Variables:
   ```
   NODE_ENV=production
   VITE_API_URL=https://your-backend-url.up.railway.app
   ```

   **Important**: Replace `your-backend-url` with the actual backend URL from Step 3.6

4. Click "Deploy"

5. Get the public URL:
   - Go to "Settings" → "Networking"
   - Click "Generate Domain"
   - Copy the domain (e.g., `frontend-production-xyz789.up.railway.app`)
   - This is your **Deployed CMS Web App URL**

### Step 6: Configure Frontend to Use Backend API

Update the frontend's environment variable with the correct backend URL:

1. Go to the frontend service in Railway
2. Click "Variables" tab
3. Update `VITE_API_URL` with your backend URL from Step 3.6
4. Redeploy the frontend (Railway auto-deploys on variable change)

### Step 7: Configure CORS on Backend

Ensure your backend allows requests from the frontend domain:

1. Update `backend/src/index.js` CORS configuration:
   ```javascript
   app.use(cors({
     origin: [
       'http://localhost:5173', // Local development
       'https://your-frontend-url.up.railway.app' // Production
     ],
     credentials: true
   }));
   ```

2. Commit and push changes:
   ```bash
   git add backend/src/index.js
   git commit -m "Configure CORS for Railway deployment"
   git push origin main
   ```

3. Railway will auto-deploy the backend with new changes

---

## Step 8: Verify Deployment

### Test Backend API

```bash
# Test health endpoint
curl https://your-backend-url.up.railway.app/health

# Expected response:
# {"status":"ok","database":"connected","timestamp":"..."}
```

### Test Frontend

1. Open your frontend URL: `https://your-frontend-url.up.railway.app`
2. You should see the login page
3. Login with default credentials:
   - Email: `admin@cms.com`
   - Password: `admin123`

### Test Public Catalog API

```bash
# List published programs
curl https://your-backend-url.up.railway.app/catalog/programs

# Should return programs with published lessons
```

### Test Worker

1. Login to the CMS
2. Create a lesson and schedule it for 2 minutes from now
3. Wait 2 minutes
4. Check if the lesson status changed to "published"
5. Check Railway logs for the worker service to see publishing activity

---

## Step 9: Update README with Deployed URLs

Update your `README.md` with the deployment information:

```markdown
## Deployed URLs

- **Frontend (CMS Web App)**: https://your-frontend-url.up.railway.app
- **Backend API**: https://your-backend-url.up.railway.app
- **API Health Check**: https://your-backend-url.up.railway.app/health
- **Public Catalog API**: https://your-backend-url.up.railway.app/catalog/programs
```

Commit and push:
```bash
git add README.md
git commit -m "Add deployed URLs to README"
git push origin main
```

---

## Monitoring and Logs

### View Service Logs on Railway

1. Go to Railway dashboard
2. Click on any service (backend, frontend, worker)
3. Click "Logs" tab
4. You'll see real-time logs

### Check Database

1. Click on the PostgreSQL service
2. Click "Data" tab to browse tables
3. Or use "Connect" tab to get connection details for external tools

---

## Environment Variables Summary

### Backend Service
```bash
NODE_ENV=production
PORT=3000
JWT_SECRET=<your-secret>
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
VITE_API_URL=https://your-backend-url.up.railway.app
```

---

## Troubleshooting

### Backend won't start

**Check logs for database connection errors:**
- Ensure database environment variables are correct
- Verify PostgreSQL service is running
- Check if migrations ran successfully

**Fix**: Manually run migrations from Railway CLI:
```bash
railway run npm run migrate
```

### Frontend shows API errors

**Issue**: CORS errors or "Network Error"

**Fix**:
1. Verify `VITE_API_URL` in frontend environment variables
2. Check CORS configuration in backend
3. Ensure backend URL is accessible

### Worker not publishing lessons

**Check worker logs:**
- Verify worker is running (check Railway logs)
- Check database connection
- Ensure lessons are scheduled correctly (publish_at is in the past)

**Fix**: Restart worker service from Railway dashboard

### Database migrations failed

**Issue**: Tables not created

**Fix**:
1. Connect to Railway PostgreSQL using connection string
2. Manually run migrations:
   ```bash
   railway run npm run migrate
   ```

---

## Cost Estimation

Railway pricing (as of 2024):

- **Hobby Plan**: $5/month
  - 500 hours of usage
  - Shared resources
  - Good for demos and small projects

- **Pro Plan**: $20/month
  - Unlimited usage
  - Better performance
  - Production-grade

For this project:
- 3 services (backend, frontend, worker) + 1 database
- Estimated: $5-10/month on Hobby plan
- Each service uses resources only when active

---

## Alternative Deployment Options

If you prefer other platforms:

### Option 1: Render.com
- Similar to Railway
- Free tier available
- Good for small projects

### Option 2: Fly.io
- Great for global deployments
- Docker-based
- Free allowance

### Option 3: AWS (Advanced)
- Use AWS Elastic Beanstalk for backend/frontend
- AWS RDS for PostgreSQL
- AWS Lambda for worker (with EventBridge)
- More complex but production-grade

### Option 4: Vercel + Heroku
- Vercel for frontend (free tier)
- Heroku for backend + worker
- Heroku Postgres for database

---

## Continuous Deployment

Railway automatically deploys when you push to GitHub:

1. Make changes locally
2. Commit and push:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```
3. Railway detects the push and auto-deploys
4. Monitor deployment in Railway dashboard

---

## Security Checklist

Before going to production:

- [ ] Change default passwords (database, JWT secret)
- [ ] Use strong JWT_SECRET (generate with `openssl rand -base64 32`)
- [ ] Enable HTTPS (Railway does this automatically)
- [ ] Set up proper CORS origins (don't use wildcard `*`)
- [ ] Review user roles and permissions
- [ ] Add rate limiting to public APIs
- [ ] Set up monitoring and alerts
- [ ] Regular database backups (Railway has automatic backups)

---

## Demo Flow for Evaluation

Once deployed, demonstrate the following:

1. **Login**: Access CMS at frontend URL, login as editor
2. **Create Content**: Create a new lesson
3. **Schedule Publish**: Schedule the lesson for 2 minutes from now
4. **Wait**: Observe the worker logs in Railway
5. **Verify**: Refresh the lesson - status should change to "published"
6. **Public API**: Call `/catalog/programs` - the new lesson should appear

---

## Support and Resources

- [Railway Documentation](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [GitHub Actions for CI/CD](https://docs.github.com/en/actions)

---

## Quick Reference Commands

```bash
# GitHub Setup
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/cms-platform.git
git push -u origin main

# Railway CLI (optional)
npm install -g @railway/cli
railway login
railway link
railway up  # Deploy from CLI
railway logs  # View logs
railway run npm run migrate  # Run commands

# Local Development
docker compose up --build  # Start all services locally
npm run migrate  # Run migrations
npm run seed  # Seed database
```

---

## Next Steps After Deployment

1. ✅ Share the deployed URLs with stakeholders
2. ✅ Update API_DOCUMENTATION.md with production URLs
3. ✅ Set up custom domains (optional, requires DNS configuration)
4. ✅ Configure monitoring and error tracking (e.g., Sentry)
5. ✅ Set up automated backups
6. ✅ Document deployment architecture in README

---

## Conclusion

You now have:
- ✅ Code version-controlled on GitHub
- ✅ Frontend deployed and accessible via HTTPS
- ✅ Backend API deployed and accessible via HTTPS
- ✅ PostgreSQL database managed and running
- ✅ Worker running in the background
- ✅ Automatic deployments on git push
- ✅ Environment variables securely managed
- ✅ Health checks and monitoring

Your CMS Platform is live and production-ready!
