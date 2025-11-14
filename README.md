# 🏡 Owensboro Mowing Company - Invoice App

Simple, offline-capable invoice manager. Works on any device - **no downloads required!**

## ✅ For Users (You & Your Clients)

**Just open the URL and use it immediately!**

👉 **No installations, no app stores, no downloads** - it works directly in your browser.

🎯 **Optional:** Install it on your phone for quick access (completely optional!)

---

## 🚀 Quick Deploy with GitHub Actions (Recommended)

**Automatic deployment on every push!**

### Step 1: Enable GitHub Actions
1. Go to: https://github.com/shevymeeker/invoice-app/settings/pages
2. Under "Build and deployment" → Source: Select **"GitHub Actions"**

### Step 2: Push the workflow file
```bash
git add .github/workflows/deploy.yml
git commit -m "Add auto-deploy workflow"
git push origin main
```

### Step 3: Your app deploys automatically!
Live at: `https://shevymeeker.github.io/invoice-app/`

Every time you push to `main`, it automatically deploys. Track deployments in the Actions tab.

📖 **Full guides:**
- [GITHUB_ACTIONS_DEPLOY.md](GITHUB_ACTIONS_DEPLOY.md) - Auto-deploy setup (recommended)
- [DEPLOY.md](DEPLOY.md) - Manual deployment & other hosting options

---

## ✨ Features

- **Super Simple:** Just 3 tabs - Clients, Estimates, Invoices
- **No Downloads:** Works directly in any web browser
- **Offline-First:** Works completely offline after first visit
- **Client Management:** Store client names, phone numbers, emails, and addresses
- **Estimates:** Create estimates that can be converted to invoices
- **Quick Invoicing:** Add line items with description, quantity, and price
- **PDF Generation:** Create professional PDFs instantly
- **Share via SMS:** Send invoices via text message on iOS/Android
- **PWA Installable:** Optionally install on your phone like a real app
- **Data Sync:** Export/import to move data between devices
- **100% Private:** All data stays on your device, nothing stored on servers

---

## 🎯 How to Use

### Simple Workflow
1. **Clients Tab:** Add your clients (name, phone, email, address)
2. **Estimates Tab:** Create estimates for jobs
3. **Invoices Tab:**
   - Create invoice from estimate OR
   - Create new invoice from scratch
   - Add line items (description, qty, price)
   - Share via text or email

### Optional: Install on Your Phone

**iPhone:**
1. Open in Safari
2. Tap Share button (square with arrow)
3. Tap "Add to Home Screen"

**Android:**
1. Open in Chrome
2. Tap "Install App" when prompted

**Desktop:**
1. Open in Chrome or Edge
2. Click install icon in address bar

---

## 📁 What's Included

### Database Schema
Complete offline-first database with:
- **Clients:** name, phone, email, address
- **Estimates:** clientId, items, total, status (draft/sent/approved/rejected)
- **Invoices:** clientId, estimateId (optional), items, total, status (draft/sent/paid)

📖 See [src/database/README.md](src/database/README.md) for full API documentation

### PWA Install Prompt
- Automatic platform detection (iOS/Android/Desktop)
- Platform-specific installation instructions
- Beautiful UI with dismissal option
- Smart re-show logic (7 days)

📖 See [PWA_SETUP.md](PWA_SETUP.md) for PWA setup guide

### Business Configuration
- Owensboro Mowing Company details
- EIN: 93-2058075
- Contact info pre-configured

---

## 🔒 Privacy & Security

- **100% Client-Side:** All data stored locally on each device
- **No Servers:** Nothing sent anywhere
- **No Accounts:** No login required
- **No Tracking:** No analytics or cookies
- **HTTPS:** Secure connection when deployed

---

## 📝 Files Overview

```
├── standalone/           ← Deploy this for simplest setup
│   ├── index.html       ← Complete app in one file
│   ├── manifest.json    ← PWA configuration
│   └── service-worker.js ← Offline support
│
├── src/
│   ├── database/        ← IndexedDB operations
│   │   ├── clients.js   ← Client CRUD
│   │   ├── estimates.js ← Estimate CRUD
│   │   ├── invoices.js  ← Invoice CRUD
│   │   └── sync.js      ← Export/Import
│   │
│   ├── components/
│   │   └── InstallPrompt.jsx ← PWA install UI
│   │
│   ├── utils/
│   │   └── pwa.js       ← Platform detection
│   │
│   └── config/
│       └── business.js  ← Company info
│
├── DEPLOY.md            ← Deployment guide
├── PWA_SETUP.md         ← PWA setup guide
└── README.md            ← You are here
```

---

## 🎨 Customization

### Change Business Info
Edit `src/config/business.js`:
```javascript
export const BUSINESS_INFO = {
  name: 'Your Company Name',
  address: 'Your Address',
  phone: 'Your Phone',
  // ...
};
```

### Change Colors
Edit the gradient in `standalone/index.html` or CSS files:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Add Your Logo
Replace placeholder icons in `public/icons/` with your logo:
- Visit https://realfavicongenerator.net/
- Upload your logo (512x512px)
- Download and replace icons

---

## 🆘 Support

**For deployment issues:** See [DEPLOY.md](DEPLOY.md)

**For PWA setup:** See [PWA_SETUP.md](PWA_SETUP.md)

**For database operations:** See [src/database/README.md](src/database/README.md)

---

## 📜 License

Free to use for Owensboro Mowing Company and clients.
