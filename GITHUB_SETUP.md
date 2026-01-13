# GitHub Setup Guide

Step-by-step guide to push your CMS Platform to GitHub.

---

## Quick Commands (Copy & Paste)

```bash
# 1. Navigate to project directory
cd /Users/aneesh/Desktop/cms-platform

# 2. Initialize git repository
git init

# 3. Add all files
git add .

# 4. Create initial commit
git commit -m "Initial commit: Full-stack CMS Platform with Admin UI, Public Catalog API, and Scheduled Publishing Worker"

# 5. Add GitHub remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# 6. Push to GitHub
git branch -M main
git push -u origin main
```

---

## Detailed Steps

### Step 1: Verify Files Are Ready

Check that these files exist:

```bash
ls -la
```

You should see:
- ✅ `.gitignore` - Excludes sensitive files
- ✅ `.env.example` - Template for environment variables
- ✅ `README.md` - Project documentation
- ✅ `backend/` - Backend source code
- ✅ `frontend/` - Frontend source code
- ✅ `worker/` - Worker source code
- ❌ `.env` - Should be listed in .gitignore (won't be committed)

### Step 2: Create GitHub Repository

1. Go to https://github.com
2. Login to your account
3. Click the "+" icon (top-right) → "New repository"

**Repository Settings:**
```
Repository name: cms-platform
Description: Full-stack CMS platform with multi-language support, scheduled publishing, and public catalog API
Visibility: ☑ Public (or Private if you prefer)
Initialize: ☐ DO NOT check any boxes (we already have files)
```

4. Click "Create repository"

### Step 3: Initialize Local Git Repository

```bash
# Navigate to project
cd /Users/aneesh/Desktop/cms-platform

# Initialize git
git init
```

### Step 4: Check What Will Be Committed

```bash
# See what files will be added
git status
```

**Verify these files are NOT listed:**
- `.env` (should be ignored)
- `node_modules/` (should be ignored)
- `.DS_Store` (should be ignored)

If you see any of these, make sure `.gitignore` is configured correctly.

### Step 5: Stage All Files

```bash
# Add all files to staging
git add .

# Verify files are staged
git status
```

You should see files in green, ready to be committed.

### Step 6: Create Initial Commit

```bash
# Create commit with descriptive message
git commit -m "Initial commit: Full-stack CMS Platform

- Admin CMS with authentication and RBAC (admin, editor, viewer)
- Public Catalog API with cursor pagination and caching
- Background worker for scheduled lesson publishing
- Docker Compose setup for local development
- Database migrations and seed data
- Multi-language support for programs and lessons
- Asset management for posters and thumbnails"
```

### Step 7: Connect to GitHub

```bash
# Add GitHub remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/cms-platform.git

# Verify remote was added
git remote -v
```

You should see:
```
origin  https://github.com/YOUR_USERNAME/cms-platform.git (fetch)
origin  https://github.com/YOUR_USERNAME/cms-platform.git (push)
```

### Step 8: Push to GitHub

```bash
# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**First time?** You might need to authenticate:
- Enter your GitHub username
- For password, use a [Personal Access Token](https://github.com/settings/tokens) (not your GitHub password)

### Step 9: Verify on GitHub

1. Go to your repository: `https://github.com/YOUR_USERNAME/cms-platform`
2. You should see all your project files
3. Verify `.env` is NOT visible (good!)
4. Check that README.md is displayed nicely

---

## What Should Be in GitHub

### ✅ Files to Commit

```
cms-platform/
├── .dockerignore
├── .env.example          ✅ Template only
├── .gitignore            ✅ Git ignore rules
├── API_DOCUMENTATION.md  ✅ API docs
├── CLAUDE.md            ✅ Requirements
├── DATABASE_STRUCTURE.md ✅ Schema docs
├── DEPLOYMENT_GUIDE.md   ✅ Deployment guide
├── GITHUB_SETUP.md       ✅ This file
├── PROJECT_ANALYSIS.md   ✅ Analysis
├── RAILWAY_QUICKSTART.md ✅ Quick deploy
├── README.md             ✅ Main docs
├── REQUIREMENTS.md       ✅ Requirements
├── docker-compose.yml    ✅ Docker config
├── package.json          ✅ Root scripts
├── backend/              ✅ All files except node_modules
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── knexfile.js
│   ├── migrations/       ✅ All migration files
│   ├── package.json
│   ├── run-migrations.js
│   ├── run-seed.js
│   └── src/              ✅ All source files
├── frontend/             ✅ All files except node_modules
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/              ✅ All source files
├── worker/               ✅ All files except node_modules
│   ├── Dockerfile
│   ├── package.json
│   └── src/
└── migrations/           ✅ If at root level
```

### ❌ Files to EXCLUDE

```
❌ .env                  (Contains secrets)
❌ node_modules/         (Dependencies, too large)
❌ .DS_Store             (OS files)
❌ *.log                 (Log files)
❌ dist/                 (Build outputs)
❌ postgres-data/        (Database data)
```

---

## After Pushing to GitHub

### Update README with Repository Link

Add this section to your README.md:

```markdown
## Repository

- **GitHub**: https://github.com/YOUR_USERNAME/cms-platform
- **Clone**: `git clone https://github.com/YOUR_USERNAME/cms-platform.git`
```

Commit and push:
```bash
git add README.md
git commit -m "Add repository link to README"
git push origin main
```

### Add Topics to Repository

On GitHub:
1. Go to your repository
2. Click the gear icon next to "About"
3. Add topics: `cms`, `nodejs`, `react`, `postgresql`, `docker`, `rest-api`, `scheduled-publishing`
4. Save changes

### Create Repository Description

Add a detailed description on GitHub:
1. Go to repository settings
2. Update description:
   ```
   Full-stack CMS platform with scheduled publishing, multi-language support, role-based access control, and public catalog API. Built with React, Node.js, Express, PostgreSQL, and Docker.
   ```

---

## Subsequent Pushes

After making changes:

```bash
# Check what changed
git status

# Stage changes
git add .

# Commit with message
git commit -m "Your descriptive message"

# Push to GitHub
git push origin main
```

---

## Common Git Commands

```bash
# See commit history
git log --oneline

# See what changed in files
git diff

# Undo unstaged changes
git checkout -- filename

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Create new branch
git checkout -b feature-name

# Switch branches
git checkout main

# Merge branch
git merge feature-name

# Pull latest changes
git pull origin main
```

---

## Troubleshooting

### Issue: "remote origin already exists"

```bash
# Remove existing remote
git remote remove origin

# Add new remote
git remote add origin https://github.com/YOUR_USERNAME/cms-platform.git
```

### Issue: ".env file is in git"

```bash
# Remove from git (but keep locally)
git rm --cached .env

# Commit the removal
git commit -m "Remove .env from git"

# Push
git push origin main
```

### Issue: "node_modules in git"

```bash
# Remove from git
git rm -r --cached node_modules

# Ensure .gitignore has node_modules/
echo "node_modules/" >> .gitignore

# Commit
git commit -m "Remove node_modules from git"
git push origin main
```

### Issue: Authentication failed

Use a Personal Access Token instead of password:
1. Go to https://github.com/settings/tokens
2. Generate new token (classic)
3. Select scopes: `repo`, `workflow`
4. Copy the token
5. Use it as password when pushing

Or set up SSH keys:
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub: Settings → SSH Keys → New SSH Key
```

Then use SSH URL:
```bash
git remote set-url origin git@github.com:YOUR_USERNAME/cms-platform.git
```

---

## GitHub Best Practices

### Write Good Commit Messages

```bash
# Bad
git commit -m "fix"
git commit -m "update"

# Good
git commit -m "Fix CORS configuration for production deployment"
git commit -m "Add pagination to catalog API endpoint"
git commit -m "Update worker interval to 60 seconds"
```

### Use Branches for Features

```bash
# Create feature branch
git checkout -b feature/add-search

# Make changes and commit
git add .
git commit -m "Add search functionality to programs list"

# Push branch
git push origin feature/add-search

# Create Pull Request on GitHub
# Merge after review
```

### Tag Releases

```bash
# Create tag
git tag -a v1.0.0 -m "Initial release"

# Push tag
git push origin v1.0.0
```

---

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Verify files are correct
3. ✅ Add repository description and topics
4. ➡️ Proceed to [Railway deployment](./RAILWAY_QUICKSTART.md)
5. ➡️ Update README with deployed URLs

---

## GitHub Checklist

- [ ] Created GitHub repository
- [ ] `.gitignore` file exists and configured
- [ ] `.env.example` exists (but not `.env`)
- [ ] Local git repository initialized
- [ ] All files committed
- [ ] Remote added to GitHub
- [ ] Pushed to GitHub successfully
- [ ] Verified files on GitHub
- [ ] `.env` and `node_modules/` NOT visible on GitHub
- [ ] README.md displays correctly
- [ ] Repository description added
- [ ] Topics added to repository

Done! Your code is on GitHub 🎉

Next: [Deploy to Railway →](./RAILWAY_QUICKSTART.md)
