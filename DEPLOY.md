# 🚀 Deployment Guide - GitHub Pages

Deploy your invoice app for **FREE** in 5 minutes! No downloads required for you or your clients.

## Quick Deploy (3 Steps)

### Step 1: Push Your Code to GitHub

Your code is already in GitHub! Just make sure everything is committed:

```bash
git status
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Enable GitHub Pages

1. Go to your GitHub repository: `https://github.com/shevymeeker/invoice-app`
2. Click **"Settings"** (top right)
3. Click **"Pages"** (left sidebar)
4. Under **"Source"**, select:
   - Branch: `main` (or whichever branch you want to deploy)
   - Folder: `/` (root) or `/standalone` if using the standalone version
5. Click **"Save"**

### Step 3: Wait 1-2 Minutes

GitHub will build and deploy your site. Your app will be live at:

```
https://shevymeeker.github.io/invoice-app/
```

✅ **That's it!** Share this URL with anyone - they can use it immediately in their browser.

---

## Option A: Deploy Standalone Version (Simplest)

If you want the simplest deployment (single HTML file), use the standalone version:

### 1. Copy files to root or create `docs` folder

```bash
# Option 1: Use standalone folder directly
# Set GitHub Pages source to /standalone folder

# Option 2: Copy to docs folder
mkdir -p docs
cp standalone/index.html docs/
cp public/manifest.json docs/
cp public/service-worker.js docs/
cp -r public/icons docs/ # (create icons first)
```

### 2. Create icons

Before deploying, create app icons:

```bash
# Run the icon generator
node scripts/generate-placeholder-icons.js

# Or use online tool:
# 1. Visit https://realfavicongenerator.net/
# 2. Upload your logo
# 3. Download icons
# 4. Place in public/icons/ or docs/icons/
```

### 3. Commit and push

```bash
git add docs/  # or standalone/
git commit -m "Add standalone deployment files"
git push origin main
```

### 4. Set GitHub Pages source

- Go to Settings → Pages
- Set source to: `main` branch, `/docs` folder (or `/standalone`)
- Save

Your app is now live at: `https://shevymeeker.github.io/invoice-app/`

---

## Option B: Deploy React Version (If you build with React)

If you're using React/Create React App:

### 1. Update package.json

Add this line to your `package.json`:

```json
{
  "homepage": "https://shevymeeker.github.io/invoice-app",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

### 2. Install gh-pages

```bash
npm install --save-dev gh-pages
```

### 3. Deploy

```bash
npm run deploy
```

This will build your app and push it to the `gh-pages` branch automatically.

---

## Alternative Hosting (Free Options)

If you don't want to use GitHub Pages, here are other free options:

### 1. **Netlify** (Easiest, Best for PWAs)

**Via Web UI:**
1. Go to https://www.netlify.com/
2. Sign up (free)
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub account
5. Select your repository
6. Click "Deploy site"

**Via Netlify CLI:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd standalone  # or your build folder
netlify deploy --prod
```

Your site will be live at: `https://your-app-name.netlify.app`

**Benefits:**
- ✅ Custom domain support
- ✅ Automatic HTTPS
- ✅ Automatic deploys on git push
- ✅ Better PWA support than GitHub Pages

### 2. **Vercel** (Fast Deployment)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd standalone  # or your project root
vercel
```

Follow the prompts, and your site will be live at: `https://your-app.vercel.app`

### 3. **Cloudflare Pages**

1. Go to https://pages.cloudflare.com/
2. Sign up (free)
3. Connect your GitHub repository
4. Set build settings (if using React):
   - Build command: `npm run build`
   - Build output directory: `build`
5. Deploy

### 4. **Firebase Hosting**

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Deploy
firebase deploy
```

---

## Custom Domain (Optional)

If you want to use your own domain (e.g., `invoices.owensboromowing.com`):

### For GitHub Pages:

1. Buy a domain (Namecheap, Google Domains, etc.)
2. Add a file named `CNAME` to your repo with your domain:
   ```
   invoices.owensboromowing.com
   ```
3. In your domain registrar, add DNS records:
   ```
   Type: CNAME
   Name: invoices
   Value: shevymeeker.github.io
   ```
4. In GitHub Settings → Pages, add your custom domain

### For Netlify/Vercel:

1. In your hosting dashboard, go to Domain settings
2. Add your custom domain
3. Update DNS records as instructed
4. HTTPS is automatically configured

---

## Testing Your Deployed App

After deployment, test these things:

### ✅ Desktop Testing
- [ ] Open URL in Chrome
- [ ] Click through the app
- [ ] Check if install prompt appears
- [ ] Try installing the app
- [ ] Test offline mode (DevTools → Network → Offline)

### ✅ Mobile Testing

**iOS (iPhone/iPad):**
- [ ] Open URL in Safari
- [ ] Check if install prompt shows iOS instructions
- [ ] Try installing: Share → Add to Home Screen
- [ ] Open installed app
- [ ] Turn on Airplane Mode, verify it works offline

**Android:**
- [ ] Open URL in Chrome
- [ ] Check if install prompt appears
- [ ] Click "Install Now" button
- [ ] Open installed app
- [ ] Turn on Airplane Mode, verify it works offline

---

## Sharing with Clients

Once deployed, share the URL with your clients:

### Via Text Message:
```
Hi! Use our new invoice app:
https://shevymeeker.github.io/invoice-app

Works on any device - no downloads needed!
You can optionally install it on your phone
for quick access.
```

### Via QR Code:

Create a QR code pointing to your URL:
1. Go to https://www.qr-code-generator.com/
2. Enter your URL
3. Download QR code
4. Print on business cards or invoices

### Via Email:
```
Subject: New Online Invoice System

We've launched a new invoice management system!

🔗 Access it here: https://shevymeeker.github.io/invoice-app

✅ Works on any device (phone, tablet, computer)
✅ No downloads or accounts required
✅ Optional: Install it like an app for quick access
✅ Works offline once installed

Just open the link and start using it!
```

---

## Updating Your App

To make changes after deployment:

### GitHub Pages:
```bash
# Make your changes
git add .
git commit -m "Update invoice app"
git push origin main

# GitHub Pages will automatically redeploy (takes 1-2 minutes)
```

### Netlify/Vercel:
```bash
# Make your changes
git add .
git commit -m "Update invoice app"
git push origin main

# Automatically deploys on push!
```

---

## Troubleshooting

### GitHub Pages shows 404

- Wait 2-3 minutes after enabling Pages
- Check Settings → Pages to see if it's still building
- Verify your branch name is correct
- Make sure `index.html` is in the root or selected folder

### Icons not showing

- Verify icons are in the `icons/` folder
- Check paths in `manifest.json` are correct
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)

### PWA not installing

- HTTPS is required (GitHub Pages provides this automatically)
- Check browser console for errors
- Try in Chrome or Safari (best PWA support)
- Clear browser cache and try again

### Service Worker not working

- Service workers require HTTPS (except localhost)
- Check `service-worker.js` is in the root directory
- Check browser console for registration errors
- Try in incognito mode to rule out caching issues

---

## Security & Privacy

### Data Storage
- All data is stored **locally** on each user's device (IndexedDB)
- Nothing is sent to any server
- Each user has their own separate data
- No accounts or login required

### HTTPS
- GitHub Pages automatically provides HTTPS
- This is required for PWAs and keeps data secure
- URLs will start with `https://`

### Privacy
- No tracking or analytics by default
- No cookies
- No data collection
- Completely private and offline

---

## Next Steps

After deployment:

1. ✅ Test on your devices
2. ✅ Share with one client for testing
3. ✅ Get feedback
4. ✅ Share with more clients
5. ✅ Add your business logo (replace placeholder icons)
6. ✅ Customize colors if desired

---

## Support

If something doesn't work:

1. Check browser console (F12 → Console tab)
2. Verify HTTPS is working (URL starts with `https://`)
3. Try incognito/private browsing mode
4. Check GitHub Pages is enabled in Settings
5. Wait a few minutes after deployment

---

## Summary

**For You:**
- Push code to GitHub
- Enable GitHub Pages
- Share the URL

**For Your Clients:**
- Open the URL
- Use immediately (no downloads)
- Optional: Install as app for quick access

**That's it!** No servers to manage, no hosting fees, no complicated setup. Just a URL that works everywhere.
