# SSO Training Exercise — Command Center

## Project Overview
A simulated Enterprise Rent-A-Car SSO login page built for security awareness training.
The page captures a username and password into a database to demonstrate how credential
harvesting works. A prominent disclaimer banner makes clear this is a training exercise.

---

## Stack Decisions

| Layer      | Choice         | Reason                                                                 |
|------------|----------------|------------------------------------------------------------------------|
| Frontend   | Vanilla HTML/CSS/JS | No build tools needed. Easy to read, teach, and modify.           |
| Backend    | Node.js + Express   | Lightweight, widely known, minimal boilerplate.                   |
| Database   | PostgreSQL (Railway)| Managed, persistent, free tier available, no local setup needed.  |
| Deployment | Railway             | Git-push deploys, managed Postgres, custom domain support.        |

---

## Project Structure

```
vishwa_sboof/
├── COMMAND_CENTER.md       ← You are here
├── package.json            ← Node dependencies
├── server.js               ← Express backend + DB logic
├── .env.example            ← Environment variable template
├── Procfile                ← Railway process definition
└── public/
    ├── index.html          ← Sign-in page (Enterprise-styled + disclaimer)
    ├── thankyou.html       ← Post-login confirmation page
    └── styles.css          ← Enterprise brand styles
```

---

## Implementation Steps

### Step 1 — Local file creation ✅
All project files are created in `vishwa_sboof/`. No code changes needed.

### Step 2 — Install Node.js (if not already installed)
1. Download from https://nodejs.org (LTS version)
2. Verify: open a terminal and run `node -v` and `npm -v`

### Step 3 — Install dependencies locally (for testing)
```bash
cd path/to/vishwa_sboof
npm install
```

### Step 4 — Create a Railway account and project
1. Go to https://railway.app and sign up (free)
2. Click **New Project** → **Deploy from GitHub repo**
3. Connect your GitHub account if not already connected

### Step 5 — Push code to GitHub
```bash
git init
git add .
git commit -m "Initial SSO training exercise"
gh repo create vishwa-sso-demo --public --push --source=.
# or manually create a repo on github.com and push
```

### Step 6 — Deploy to Railway
1. In Railway, select your GitHub repo
2. Railway will auto-detect Node.js and deploy
3. Click **+ New** → **Database** → **Add PostgreSQL** within the same project
4. Railway automatically injects `DATABASE_URL` as an environment variable

### Step 7 — Set environment variables in Railway
In your Railway service → **Variables** tab, add:
```
NODE_ENV=production
```
`DATABASE_URL` is injected automatically by the Railway Postgres plugin.

### Step 8 — Set a custom domain
1. In Railway → your service → **Settings** → **Networking** → **Custom Domain**
2. Enter your desired domain (e.g., `sso-demo.yourdomain.com`)
3. Add the CNAME record shown to your DNS provider
4. Wait for DNS propagation (usually < 10 minutes)

---

## How it works (teaching notes)

1. User visits the page → sees an Enterprise-styled login form + large disclaimer banner
2. User enters any username and password → clicks **Sign In**
3. The browser sends a `POST /login` request to the Express server
4. Express inserts the username and password into a `credentials` table in PostgreSQL
5. Express responds with a redirect to `/thankyou.html`
6. The user sees the thank-you page

**Key SSO concepts this demonstrates:**
- How credentials flow from a browser form to a server
- Why HTTPS matters (credentials in transit)
- Why users should verify they are on the correct domain before entering credentials
- How a phishing page can look identical to a real one (hence the disclaimer banner)

---

## Viewing captured credentials (for the demo)

Connect to your Railway Postgres instance using any Postgres client:
```
Connection string: (copy DATABASE_URL from Railway Variables tab)
```
Then run:
```sql
SELECT * FROM credentials ORDER BY created_at DESC;
```

Or use Railway's built-in **Data** tab on the Postgres service.

---

## Status

- [x] Files created
- [ ] Node.js installed locally
- [ ] `npm install` run
- [ ] GitHub repo created and code pushed
- [ ] Railway project created
- [ ] PostgreSQL added to Railway project
- [ ] Deployment successful
- [ ] Custom domain configured
