# 🚀 Deploy with GitHub Actions (Recommended)

Automatic deployment on every push - the easiest way to deploy!

## ✅ One-Time Setup (2 Steps)

### Step 1: Enable GitHub Pages via Actions

1. Go to your repository: https://github.com/shevymeeker/invoice-app
2. Click **"Settings"** (top right)
3. Click **"Pages"** (left sidebar)
4. Under **"Build and deployment"**:
   - Source: Select **"GitHub Actions"**

That's it! No need to select a branch or folder.

### Step 2: Push the Workflow File

The workflow file is already created at `.github/workflows/deploy.yml`.

Just commit and push it:

```bash
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions deployment workflow"
git push origin main
```

## 🎉 Done!

Now every time you push to `main` branch, your app automatically deploys!

Your app will be live at:
```
https://shevymeeker.github.io/invoice-app/
```

---

## 📊 Monitor Deployments

### View Deployment Status

1. Go to your repository
2. Click the **"Actions"** tab
3. See your deployments in real-time

Each push creates a new deployment that you can track.

### Check Live URL

After the action completes (usually 1-2 minutes), visit:
```
https://shevymeeker.github.io/invoice-app/
```

---

## 🔄 How It Works

```
You push code → GitHub Actions runs → App deploys automatically
```

### What Happens When You Push:

1. **GitHub detects your push** to the `main` branch
2. **Actions workflow runs**:
   - Checks out your code
   - Uploads the `/standalone` folder
   - Deploys to GitHub Pages
3. **Your app is live** at the URL above
4. **Takes 1-2 minutes** total

---

## ⚙️ Workflow Details

The workflow file (`.github/workflows/deploy.yml`) does this:

```yaml
# Triggers on:
- Every push to main branch
- Manual trigger from Actions tab

# Deploys:
- The /standalone folder (your complete app)

# Permissions:
- Read contents
- Write to Pages
- ID token for deployment
```

---

## 🔧 Customization

### Deploy a Different Folder

Edit `.github/workflows/deploy.yml`:

```yaml
- name: Upload artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: './standalone'  # Change this path
```

### Deploy on Different Branch

Edit the `on:` section:

```yaml
on:
  push:
    branches: [ main, production ]  # Add more branches
```

### Deploy Only Specific Files

Add a filter:

```yaml
on:
  push:
    branches: [ main ]
    paths:
      - 'standalone/**'  # Only deploy when standalone/ changes
      - '.github/workflows/**'
```

---

## 🚫 Troubleshooting

### Action Fails with "Permission denied"

**Fix:** Enable Pages via Actions
1. Settings → Pages
2. Source: "GitHub Actions"

### Action Doesn't Run

**Check:**
- File is at `.github/workflows/deploy.yml` (exact path)
- You pushed to the `main` branch
- Workflow is enabled: Actions tab → Enable workflow

### App Shows 404

**Wait 2-3 minutes** after the action completes. GitHub Pages takes time to propagate.

**Check:**
- Actions tab shows green checkmark (deployment succeeded)
- Settings → Pages shows the URL
- Try hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

---

## 🎯 Benefits Over Manual Deployment

| Manual Pages Setup | GitHub Actions |
|-------------------|----------------|
| Select branch/folder manually | Automatically deploys |
| Update by pushing to specific branch | Update by pushing anywhere |
| One-time setup, no automation | Continuous deployment |
| Can't track deployment history | Full deployment history in Actions |
| No build customization | Can add build steps, tests, etc. |

---

## 📝 Testing the Deployment

### After First Setup:

1. Make a small change to `standalone/index.html`
2. Commit and push:
   ```bash
   git add standalone/index.html
   git commit -m "Test deployment"
   git push origin main
   ```
3. Watch the Actions tab - you'll see the workflow run
4. After 1-2 minutes, refresh your live URL

---

## 🔄 Updating Your App

Now that Actions is set up, updating is simple:

```bash
# Make changes to your code
vim standalone/index.html

# Commit and push
git add .
git commit -m "Update app"
git push origin main

# That's it! GitHub Actions deploys automatically
```

Check the Actions tab to see the deployment progress.

---

## 🌟 Advanced: Add Build Steps

If you later add a build process (React, etc.), update the workflow:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      # Add Node.js setup
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      # Install dependencies and build
      - name: Install and Build
        run: |
          npm install
          npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './build'  # Or wherever your build outputs
```

---

## 📋 Quick Reference

**Repository Settings:**
- https://github.com/shevymeeker/invoice-app/settings/pages

**Actions Dashboard:**
- https://github.com/shevymeeker/invoice-app/actions

**Live App URL:**
- https://shevymeeker.github.io/invoice-app/

**Deploy Now (Manual):**
- Go to Actions tab
- Click "Deploy to GitHub Pages" workflow
- Click "Run workflow"

---

## 🎉 Summary

1. ✅ One-time setup: Enable GitHub Actions in Pages settings
2. ✅ Push the workflow file
3. ✅ Every push to `main` automatically deploys
4. ✅ Monitor deployments in the Actions tab
5. ✅ Share your live URL with clients

**No manual deployment ever again!** Just push and it's live.
