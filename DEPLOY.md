# Deploy to Vercel via GitHub

## First time setup (do this once)

### 1. Create a GitHub repository

Go to https://github.com/new and create a new repo called `startup-os` (private is fine).

### 2. Push this project to GitHub

Open Terminal, navigate to this folder, then run:

```bash
cd path/to/startup-os
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/startup-os.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

### 3. Connect to Vercel

1. Go to https://vercel.com and sign in with GitHub
2. Click "Add New Project"
3. Import your `startup-os` repository
4. Vercel auto-detects Vite — no config needed
5. Click "Deploy"

Your app will be live at `https://startup-os-xxx.vercel.app` within 60 seconds.

---

## Every future update

After making changes in the `startup-os` folder, just run:

```bash
git add .
git commit -m "describe what you changed"
git push
```

Vercel auto-deploys on every push to `main`. No manual steps needed.

---

## Local development

To run the app locally on your computer:

```bash
npm install     # first time only
npm run dev     # starts at http://localhost:5173
```

---

## Notes

- All your progress data (task completions, notes, journal) is saved in your browser's localStorage — it persists between sessions on the same device/browser.
- If you open the app on a different device, it starts fresh. To sync between devices in future, we can add a simple backend (Supabase free tier).
