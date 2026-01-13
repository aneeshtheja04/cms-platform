# Setup & Deployment Summary

Quick reference for GitHub setup and Railway deployment.

---

## 📋 Overview

This project needs to be:
1. **Version controlled** on GitHub
2. **Deployed** to Railway with all services running

---

## 🚀 Quick Start (30 Minutes)

### Part 1: GitHub (10 minutes)

```bash
# 1. Navigate to project
cd /Users/aneesh/Desktop/cms-platform

# 2. Initialize git
git init

# 3. Add and commit
git add .
git commit -m "Initial commit: CMS Platform"

# 4. Create repo on GitHub (go to github.com)
# Then connect:
git remote add origin https://github.com/YOUR_USERNAME/cms-platform.git
git branch -M main
git push -u origin main
```

**Detailed guide**: [GITHUB_SETUP.md](./GITHUB_SETUP.md)

---

### Part 2: Railway (20 minutes)

1. **Create Project** on [Railway](https://railway.app)
2. **Add PostgreSQL** database
3. **Deploy Backend**:
   - Root: `/backend`
   - Variables: DB config + JWT_SECRET
   - Build command: `npm install && node run-migrations.js && node run-seed.js`
4. **Deploy Worker**:
   - Root: `/worker`
   - Variables: DB config
5. **Deploy Frontend**:
   - Root: `/frontend`
   - Variables: `VITE_API_URL=<backend-url>`

**Quick guide**: [RAILWAY_QUICKSTART.md](./RAILWAY_QUICKSTART.md)
**Detailed guide**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

## 📁 Files Created

New files added to help with deployment:

| File | Purpose |
|------|---------|
| `.gitignore` | Excludes sensitive files from git |
| `.env.example` | Template for environment variables |
| `GITHUB_SETUP.md` | Detailed GitHub setup instructions |
| `RAILWAY_QUICKSTART.md` | Fast Railway deployment guide |
| `DEPLOYMENT_GUIDE.md` | Complete deployment documentation |
| `SETUP_SUMMARY.md` | This file - quick reference |

---

## ⚠️ Important Notes

### Before Pushing to GitHub

Make sure `.env` is NOT committed:
```bash
# Should show .env as ignored
git status
```

### Environment Variables

**Local Development** (`.env` file):
```bash
DB_HOST=db
DB_USER=cms_user
DB_PASSWORD=cms_pass
DB_NAME=cms
JWT_SECRET=supersecret
PORT=3000
```

**Production** (Railway variables):
```bash
# Backend
DB_HOST=${{Postgres.PGHOST}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_NAME=${{Postgres.PGDATABASE}}
JWT_SECRET=<generate-strong-secret>
PORT=3000
NODE_ENV=production

# Worker
DB_HOST=${{Postgres.PGHOST}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_NAME=${{Postgres.PGDATABASE}}
NODE_ENV=production

# Frontend
VITE_API_URL=https://your-backend.up.railway.app
NODE_ENV=production
```

---

## ✅ Verification Checklist

### GitHub

- [ ] Repository created on GitHub
- [ ] Code pushed successfully
- [ ] `.env` NOT visible in repository
- [ ] `node_modules/` NOT in repository
- [ ] README displays correctly
- [ ] All source files present

### Railway Deployment

- [ ] PostgreSQL database running
- [ ] Backend service active with public URL
- [ ] Worker service active (no public URL needed)
- [ ] Frontend service active with public URL
- [ ] All environment variables configured
- [ ] Health check returns 200 OK
- [ ] Can login to CMS
- [ ] Public catalog API works
- [ ] Worker publishes scheduled lessons

---

## 🧪 Testing After Deployment

### 1. Test Backend Health

```bash
curl https://YOUR-BACKEND-URL.up.railway.app/health
```

Expected:
```json
{"status":"ok","database":"connected","timestamp":"..."}
```

### 2. Test Frontend

1. Open: `https://YOUR-FRONTEND-URL.up.railway.app`
2. Login with: `admin@cms.com` / `admin123`
3. Should see Programs list

### 3. Test Public Catalog API

```bash
curl https://YOUR-BACKEND-URL.up.railway.app/catalog/programs
```

Should return published programs with pagination.

### 4. Test Worker

1. Login to CMS
2. Create new lesson
3. Schedule for 2 minutes from now
4. Wait 2 minutes
5. Refresh - status should be "published"
6. Check Railway worker logs

---

## 🔧 Common Issues & Fixes

### Issue: "Cannot connect to database"

**Fix**: Check database environment variables in Railway
```bash
DB_HOST=${{Postgres.PGHOST}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_NAME=${{Postgres.PGDATABASE}}
```

### Issue: "CORS error" in browser

**Fix**: Update `backend/src/index.js`:
```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-frontend.up.railway.app'  // Add this
  ]
}));
```

### Issue: Migrations didn't run

**Fix**: Check Railway backend logs for migration errors, or run manually:
```bash
railway run --service=backend node run-migrations.js
```

### Issue: Frontend can't reach backend

**Fix**: Verify `VITE_API_URL` in frontend service variables

---

## 📊 Cost Estimate

**Railway Pricing:**
- Free tier: 500 hours/month
- Hobby Plan: $5/month (recommended)

**This project uses:**
- 3 services (frontend, backend, worker)
- 1 PostgreSQL database

**Estimated cost:** $5-10/month

---

## 📚 Documentation Index

| Document | Description | When to Use |
|----------|-------------|-------------|
| [README.md](./README.md) | Main project documentation | Overview and local setup |
| [GITHUB_SETUP.md](./GITHUB_SETUP.md) | GitHub repository setup | First time pushing to GitHub |
| [RAILWAY_QUICKSTART.md](./RAILWAY_QUICKSTART.md) | Quick Railway deployment | Fast deployment (20 min) |
| [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) | Complete deployment guide | Detailed deployment steps |
| [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | API reference | API integration |
| [DATABASE_STRUCTURE.md](./DATABASE_STRUCTURE.md) | Database schema | Understanding data model |
| [REQUIREMENTS.md](./REQUIREMENTS.md) | Project requirements | Original requirements |

---

## 🎯 Project Structure

```
cms-platform/
├── backend/              # Express API server
│   ├── src/
│   │   ├── config/       # Database configuration
│   │   ├── controllers/  # Request handlers
│   │   ├── middlewares/  # Auth, error handling
│   │   ├── routes/       # API routes
│   │   └── services/     # Business logic
│   ├── migrations/       # Database migrations
│   └── Dockerfile
│
├── frontend/             # React + Vite app
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── contexts/     # Auth context
│   │   ├── pages/        # Page components
│   │   └── api/          # API client
│   └── Dockerfile
│
├── worker/               # Scheduled publishing worker
│   ├── src/
│   │   └── index.js      # Worker logic
│   └── Dockerfile
│
├── docker-compose.yml    # Local development
├── .env                  # Local environment (not in git)
├── .env.example          # Environment template
└── .gitignore            # Git ignore rules
```

---

## 🔐 Security Checklist

Before production:

- [ ] Change default JWT_SECRET
- [ ] Use strong database password
- [ ] Update default user passwords
- [ ] Configure proper CORS origins
- [ ] Enable HTTPS (Railway does this)
- [ ] Review user permissions
- [ ] Set up rate limiting
- [ ] Enable logging and monitoring

---

## 📱 Deployed URLs Template

After deployment, update README.md with:

```markdown
## Deployed URLs

- **Frontend (CMS Web App)**: https://frontend-production-xxx.up.railway.app
- **Backend API**: https://backend-production-xxx.up.railway.app
- **API Health Check**: https://backend-production-xxx.up.railway.app/health
- **Public Catalog API**: https://backend-production-xxx.up.railway.app/catalog/programs
- **Database**: Managed by Railway (PostgreSQL)
- **Worker**: Running in background
```

---

## 🎬 Demo Flow

To demonstrate the system:

1. **Login**: Access frontend URL, login as editor
2. **View Content**: Browse existing programs and lessons
3. **Create Lesson**: Add a new lesson to a program
4. **Schedule**: Schedule the lesson for 2 minutes from now
5. **Monitor**: Watch Railway worker logs
6. **Verify**: After 2 minutes, lesson status changes to "published"
7. **Public API**: Check catalog API - new lesson appears
8. **Done**: Full workflow demonstrated

---

## 💡 Tips

### For Development

```bash
# Start everything locally
docker compose up --build

# View logs
docker compose logs -f api
docker compose logs -f worker

# Run migrations only
npm run migrate

# Seed database
npm run seed

# Stop all services
docker compose down
```

### For Deployment

- Railway auto-deploys on git push to main
- Check logs in Railway dashboard for errors
- Use Railway CLI for advanced operations
- Database backups are automatic on Railway

### For Debugging

- Check Railway service logs first
- Verify environment variables are set
- Test API endpoints with curl
- Check browser console for frontend errors

---

## 📞 Support Resources

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Docker Docs**: https://docs.docker.com/

---

## 🚦 Next Steps

1. ✅ Push code to GitHub → [GITHUB_SETUP.md](./GITHUB_SETUP.md)
2. ✅ Deploy to Railway → [RAILWAY_QUICKSTART.md](./RAILWAY_QUICKSTART.md)
3. ✅ Test deployment → Use verification checklist above
4. ✅ Update README with URLs
5. ✅ Share with stakeholders
6. ⏭️ Set up monitoring (optional)
7. ⏭️ Configure custom domain (optional)
8. ⏭️ Set up CI/CD (optional)

---

## ✨ Project Features

Reminder of what you've built:

- ✅ **Full-stack CMS** with React + Node.js
- ✅ **Authentication & RBAC** (admin, editor, viewer)
- ✅ **Multi-language support** for programs and lessons
- ✅ **Scheduled publishing** with background worker
- ✅ **Public Catalog API** with pagination and caching
- ✅ **Asset management** for posters and thumbnails
- ✅ **Database migrations** for reproducible setup
- ✅ **Docker Compose** for local development
- ✅ **Seed data** for quick testing
- ✅ **Health checks** for monitoring
- ✅ **Complete documentation**

---

Good luck with your deployment! 🚀
