# Railway Deployment Guide

## One-time setup

### Step 1 — Push the code to GitHub

1. Go to [github.com](https://github.com) and create a new **private** repository called `workloop-website`
2. Don't add a README or .gitignore (you already have one)
3. Open a terminal in `C:\Users\TomHynne\workloop-website\` and run:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/workloop-website.git
git push -u origin main
```

> Replace `YOUR_USERNAME` with your GitHub username.

---

### Step 2 — Create a Railway account

1. Go to [railway.app](https://railway.app)
2. Click **Login** → **Login with GitHub**
3. Authorise Railway to access your GitHub account

---

### Step 3 — Create a new project on Railway

1. Click **New Project**
2. Select **Deploy from GitHub repo**
3. Find and select `workloop-website`
4. Railway detects your `Dockerfile` automatically — no config needed
5. Click **Deploy Now**

Railway will build and deploy in ~2 minutes. You'll see live build logs.

---

### Step 4 — Get a public URL

1. Once deployed, go to your project → **Settings** → **Networking**
2. Click **Generate Domain**
3. Railway gives you a free URL like `workloop-website-production.up.railway.app`

Your site is now live on that URL. ✅

---

### Step 5 — Connect your own domain (workloop.no)

1. In Railway → **Settings** → **Networking** → **Custom Domain**
2. Type in your domain, e.g. `workloop.no`
3. Railway shows you a DNS record to add — it looks like this:

| Type  | Name | Value                        |
|-------|------|------------------------------|
| CNAME | @    | `your-project.up.railway.app` |

4. Log in to your domain registrar (the place you bought `workloop.no`)
5. Find **DNS settings** and add that CNAME record
6. Wait 5–30 minutes for DNS to propagate
7. Railway automatically handles HTTPS/SSL — nothing to configure

---

## Deploying updates (every time you make changes)

Once the one-time setup above is done, deploying new changes is just two commands:

```bash
git add .
git commit -m "Describe what you changed"
git push
```

Railway detects the push and automatically rebuilds and redeploys. Takes ~2 minutes.
**No manual steps needed after initial setup.**

---

## Checking logs / debugging

In Railway → your project → **Deployments** → click a deployment → **View Logs**

Contact form submissions appear here as they come in (until email is wired up).

---

## Costs

| Usage | Price |
|-------|-------|
| Hobby plan (recommended) | $5/month |
| Free trial | $5 credit, no card needed to start |

The Hobby plan keeps your app running 24/7. The free tier sleeps after inactivity.
