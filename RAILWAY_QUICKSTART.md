# Railway Quick Start Guide

Fast-track deployment guide for Railway. For complete details, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).

---

## Prerequisites

1. GitHub account with this repository pushed
2. Railway account ([Sign up here](https://railway.app))

---

## 5-Minute Deployment

### 1. Create Project on Railway

1. Go to [Railway Dashboard](https://railway.app)
2. Click "New Project"
3. Click "Deploy from GitHub repo"
4. Select your `cms-platform` repository

### 2. Add PostgreSQL Database

1. In project dashboard, click "+ New"
2. Select "Database" → "PostgreSQL"
3. Done! Railway auto-configures connection variables

### 3. Deploy Backend

1. Click "+ New" → "GitHub Repo" → Select repository
2. **Settings**:
   - Name: `backend`
   - Root Directory: `/backend`
   - Build Command: Leave default
   - Start Command: `npm start`

3. **Variables** tab - Add these:
   ```
   NODE_ENV=production
   PORT=3000
   JWT_SECRET=your_super_secret_jwt_key_change_this
   DB_HOST=${{Postgres.PGHOST}}
   DB_USER=${{Postgres.PGUSER}}
   DB_PASSWORD=${{Postgres.PGPASSWORD}}
   DB_NAME=${{Postgres.PGDATABASE}}
   DB_PORT=${{Postgres.PGPORT}}
   ```

4. **Settings** → "Deploy" → Set Custom Build Command:
   ```bash
   npm install && node run-migrations.js && node run-seed.js
   ```

5. Click "Deploy"
6. Once deployed, go to "Settings" → "Networking" → "Generate Domain"
7. **Copy this URL** - This is your Backend API URL

### 4. Deploy Worker

1. Click "+ New" → "GitHub Repo" → Select repository
2. **Settings**:
   - Name: `worker`
   - Root Directory: `/worker`
   - Start Command: `npm start`

3. **Variables** tab - Add these:
   ```
   NODE_ENV=production
   DB_HOST=${{Postgres.PGHOST}}
   DB_USER=${{Postgres.PGUSER}}
   DB_PASSWORD=${{Postgres.PGPASSWORD}}
   DB_NAME=${{Postgres.PGDATABASE}}
   DB_PORT=${{Postgres.PGPORT}}
   WORKER_INTERVAL_MS=60000
   ```

4. Click "Deploy"

### 5. Deploy Frontend

1. Click "+ New" → "GitHub Repo" → Select repository
2. **Settings**:
   - Name: `frontend`
   - Root Directory: `/frontend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run preview`

3. **Variables** tab - Add:
   ```
   NODE_ENV=production
   VITE_API_URL=YOUR_BACKEND_URL_FROM_STEP_3
   ```
   **Important**: Replace with actual backend URL (e.g., `https://backend-production-abc.up.railway.app`)

4. Click "Deploy"
5. Once deployed, go to "Settings" → "Networking" → "Generate Domain"
6. **Copy this URL** - This is your Frontend URL

---

## 6. Update CORS (Important!)

Update your backend CORS configuration to allow frontend requests:

1. Edit `backend/src/index.js`:
   ```javascript
   app.use(cors({
     origin: [
       'http://localhost:5173',
       'https://YOUR_FRONTEND_URL.up.railway.app'  // Add this
     ],
     credentials: true
   }));
   ```

2. Commit and push:
   ```bash
   git add backend/src/index.js
   git commit -m "Configure CORS for Railway"
   git push origin main
   ```

3. Railway will auto-deploy

---

## 7. Test Your Deployment

### Test Backend
```bash
curl https://YOUR_BACKEND_URL.up.railway.app/health
```

### Test Frontend
Open `https://YOUR_FRONTEND_URL.up.railway.app` in browser

Login with:
- Email: `admin@cms.com`
- Password: `admin123`

### Test Public API
```bash
curl https://YOUR_BACKEND_URL.up.railway.app/catalog/programs
```

---

## Your Deployed URLs

Once deployed, you'll have:

- **Frontend (CMS)**: `https://frontend-production-xxx.up.railway.app`
- **Backend API**: `https://backend-production-xxx.up.railway.app`
- **Health Check**: `https://backend-production-xxx.up.railway.app/health`
- **Catalog API**: `https://backend-production-xxx.up.railway.app/catalog/programs`
- **Database**: Managed by Railway (internal only)
- **Worker**: Running in background (no public URL)

---

## Cost

- **Free for 500 hours/month** on Hobby tier
- Or **$5/month** for Hobby plan (recommended)
- 3 services + 1 database

---

## Troubleshooting

### Backend won't start
- Check "Logs" tab in Railway
- Verify database variables are set
- Ensure migrations ran (check build logs)

### Frontend shows errors
- Verify `VITE_API_URL` is correct
- Check backend CORS configuration
- Clear browser cache

### Worker not publishing
- Check worker logs in Railway
- Verify database connection variables
- Test by creating a scheduled lesson

---

## Common Issues

### Issue: "Cannot connect to database"
**Solution**: Double-check database variables in backend/worker services

### Issue: "CORS error" in browser console
**Solution**: Update backend CORS to include frontend domain

### Issue: Migrations didn't run
**Solution**:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and link
railway login
railway link

# Run migrations manually
railway run --service=backend node run-migrations.js
```

---

## Next Steps

1. Update README.md with your deployed URLs
2. Test the complete workflow (create → schedule → publish)
3. Share the URLs with stakeholders
4. Set up custom domain (optional)

---

## Need Help?

- Full guide: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- Railway docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway

---

## Deployment Checklist

- [ ] PostgreSQL database created on Railway
- [ ] Backend service deployed with environment variables
- [ ] Worker service deployed with environment variables
- [ ] Frontend service deployed with correct API URL
- [ ] CORS configured in backend for frontend domain
- [ ] All services showing "Active" status in Railway
- [ ] Health check endpoint returns 200 OK
- [ ] Can login to CMS frontend
- [ ] Catalog API returns published programs
- [ ] Worker publishes scheduled lessons (test this!)
- [ ] README updated with deployed URLs

Done! Your CMS is live 🚀
