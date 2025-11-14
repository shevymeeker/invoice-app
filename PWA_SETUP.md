# PWA Setup Guide

Complete guide to setting up the Progressive Web App (PWA) features for the Owensboro Mowing Company Invoice App.

## Features Implemented

✅ **Platform Detection** - Automatically detects iOS, Android, or Desktop
✅ **Install Prompt** - Shows installation instructions when opened in browser
✅ **Offline Support** - Works completely offline with IndexedDB + Service Worker
✅ **Auto-Hide** - Prompt automatically hides when app is installed
✅ **Smart Dismissal** - Remembers if user dismissed prompt (won't show again for 7 days)
✅ **Native Install Button** - One-click install on Chrome/Edge (Android/Desktop)
✅ **Responsive Design** - Beautiful UI on all screen sizes

## Quick Integration

### 1. Add InstallPrompt to Your App

In your main `App.js` or `App.jsx`:

```javascript
import React from 'react';
import InstallPrompt from './components/InstallPrompt';
// ... your other imports

function App() {
  return (
    <div className="App">
      {/* Add the InstallPrompt component */}
      <InstallPrompt />

      {/* Your other components */}
      <YourMainContent />
    </div>
  );
}

export default App;
```

That's it! The prompt will automatically show for users who haven't installed the app yet.

### 2. Register the Service Worker

In your `index.js` or `index.jsx`:

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { register as registerServiceWorker } from './utils/serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker for offline functionality
registerServiceWorker({
  onSuccess: () => {
    console.log('App is ready for offline use!');
  },
  onUpdate: (registration) => {
    console.log('New version available! Please refresh.');
    // Optionally show a prompt to refresh
  }
});
```

### 3. Add Manifest to Your HTML

In your `public/index.html`, add this to the `<head>` section:

```html
<head>
  <!-- ... other meta tags ... -->

  <!-- PWA Manifest -->
  <link rel="manifest" href="/manifest.json">

  <!-- Theme color for address bar (matches manifest) -->
  <meta name="theme-color" content="#667eea">

  <!-- iOS specific meta tags -->
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="OMC Invoices">

  <!-- iOS icons -->
  <link rel="apple-touch-icon" href="/icons/icon-152x152.png">
  <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png">

  <!-- Standard favicon -->
  <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-192x192.png">
</head>
```

## Icon Setup

### Create App Icons

You need to create icons in the following sizes and place them in `public/icons/`:

- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png` (iOS)
- `icon-192x192.png` (Android)
- `icon-384x384.png`
- `icon-512x512.png` (Android)

### Quick Icon Generation

#### Option 1: Using Online Tools
1. Visit https://realfavicongenerator.net/
2. Upload your logo/icon (at least 512x512px)
3. Download the generated icons
4. Place them in `public/icons/`

#### Option 2: Using ImageMagick (Command Line)
```bash
# Install ImageMagick first
# brew install imagemagick (Mac)
# sudo apt-get install imagemagick (Linux)

# Create all sizes from a source image
convert logo.png -resize 72x72 public/icons/icon-72x72.png
convert logo.png -resize 96x96 public/icons/icon-96x96.png
convert logo.png -resize 128x128 public/icons/icon-128x128.png
convert logo.png -resize 144x144 public/icons/icon-144x144.png
convert logo.png -resize 152x152 public/icons/icon-152x152.png
convert logo.png -resize 192x192 public/icons/icon-192x192.png
convert logo.png -resize 384x384 public/icons/icon-384x384.png
convert logo.png -resize 512x512 public/icons/icon-512x512.png
```

#### Option 3: Simple Placeholder (For Testing)
If you just want to test, you can use a simple SVG placeholder:

```bash
mkdir -p public/icons
# Create a simple colored square for each size (temporary)
# Use a tool like https://placeholder.com/ or create simple colored PNGs
```

## How It Works

### User Flow

1. **User opens the app in a web browser**
   - InstallPrompt component automatically detects they're in a browser (not installed)
   - Shows a beautiful modal with platform-specific instructions

2. **iOS Users (Safari)**
   - See instructions: "Tap Share → Add to Home Screen"
   - Can dismiss with "Maybe Later" (won't show again for 7 days)

3. **Android Users (Chrome)**
   - See instructions for manual install OR
   - Can click "Install Now" button for one-click install
   - Native browser prompt appears

4. **Desktop Users (Chrome/Edge)**
   - See instructions for desktop install OR
   - Can click "Install Now" for one-click install

5. **After Installation**
   - App opens in standalone mode (no browser UI)
   - InstallPrompt never shows again (detected as installed)
   - Works completely offline

### Platform Detection

The app automatically detects:
- **iOS** (iPhone/iPad) → Shows Safari-specific instructions
- **Android** → Shows Chrome-specific instructions
- **Desktop** → Shows desktop install instructions

It also detects the browser and shows warnings if the user is on a non-recommended browser (e.g., Chrome on iOS instead of Safari).

## Customization

### Change Prompt Dismiss Duration

In `src/utils/pwa.js`, modify the `shouldShowInstallPrompt` function:

```javascript
// Change from 7 days to 30 days
if (daysSinceDismissed < 30) return false;
```

### Disable Auto-Show

If you want to manually control when the prompt shows:

```javascript
// In InstallPrompt.jsx
const [showPrompt, setShowPrompt] = useState(false);

// Add a manual trigger button somewhere in your app
<button onClick={() => setShowPrompt(true)}>
  Install App
</button>
```

### Change Colors/Styling

Edit `src/components/InstallPrompt.css` to match your brand colors.

### Update Business Name

The prompt currently says "Owensboro Mowing Company Invoice App". To change this, edit:

`src/components/InstallPrompt.jsx` line with the intro text:

```javascript
<p className="install-prompt-intro">
  Install [Your Business Name] for quick access and offline use!
</p>
```

## Testing

### Test on Different Platforms

**iOS (Safari):**
1. Open the app in Safari on iPhone/iPad
2. Should see install prompt with iOS instructions
3. Follow instructions to install

**Android (Chrome):**
1. Open in Chrome on Android
2. Should see install prompt with Android instructions
3. Click "Install Now" button or follow manual steps

**Desktop (Chrome/Edge):**
1. Open in Chrome or Edge
2. Should see install prompt with desktop instructions
3. Click "Install Now" or look for install icon in address bar

### Test Offline Mode

1. Install the app
2. Open DevTools → Application → Service Workers
3. Check "Offline" mode
4. Refresh the app - should still work!

### Test Dismiss Functionality

1. Click "Maybe Later" on the install prompt
2. Refresh the page - prompt should not appear
3. To reset: Open DevTools → Console → Run:
   ```javascript
   localStorage.removeItem('pwaPromptDismissed')
   ```

## Deployment Checklist

Before deploying to production:

- [ ] All icon sizes created and placed in `public/icons/`
- [ ] `manifest.json` configured with correct app name and colors
- [ ] Service worker registered in `index.js`
- [ ] InstallPrompt component added to App
- [ ] Manifest link added to `index.html`
- [ ] iOS meta tags added to `index.html`
- [ ] Test on iOS Safari
- [ ] Test on Android Chrome
- [ ] Test on Desktop Chrome/Edge
- [ ] Test offline functionality
- [ ] App runs on HTTPS (required for PWA - localhost is ok for testing)

## Troubleshooting

### Prompt doesn't show

1. **Check if already installed**: The prompt won't show if the app is already installed as a PWA
2. **Check localStorage**: Run `localStorage.getItem('pwaPromptDismissed')` - if set, the prompt was dismissed
3. **Reset**: Run `localStorage.removeItem('pwaPromptDismissed')` and refresh

### Service Worker not registering

1. **HTTPS required**: Service Workers require HTTPS (except on localhost)
2. **Check path**: Ensure `service-worker.js` is in the `public/` folder
3. **Check console**: Look for errors in DevTools → Console
4. **Scope issues**: Service worker must be at root level or higher than the pages it controls

### Icons not showing

1. **Check paths**: Ensure icons are in `public/icons/` folder
2. **Check manifest**: Verify `manifest.json` paths are correct
3. **Cache issue**: Clear browser cache or use incognito mode
4. **File names**: Ensure exact match between manifest and actual files

### App not working offline

1. **Service Worker**: Check if registered in DevTools → Application → Service Workers
2. **Cache**: Verify files are cached in DevTools → Application → Cache Storage
3. **Update URLs**: Ensure all your app's URLs are listed in `service-worker.js` `urlsToCache`

## Advanced Features

### Add Update Notification

When a new version is available, show a notification:

```javascript
// In index.js
registerServiceWorker({
  onUpdate: (registration) => {
    const confirmUpdate = window.confirm(
      'New version available! Reload to update?'
    );
    if (confirmUpdate) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }
});
```

### Add to Screenshots

Add screenshots to `public/screenshots/` and they'll appear in app stores and install prompts on some platforms.

### Custom Install Button

Add a permanent install button to your settings page:

```javascript
import { isPWA, getPlatform } from '../utils/pwa';

function Settings() {
  const [showInstallButton, setShowInstallButton] = useState(!isPWA());

  return (
    <div>
      {showInstallButton && (
        <button onClick={() => {/* trigger InstallPrompt */}}>
          📲 Install App
        </button>
      )}
    </div>
  );
}
```

## Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Manifest Generator](https://www.simicart.com/manifest-generator.html/)
- [Icon Generator](https://realfavicongenerator.net/)
- [Service Worker Guide](https://developers.google.com/web/fundamentals/primers/service-workers)

## Support

If you encounter any issues:

1. Check the browser console for errors
2. Verify all files are in the correct locations
3. Test in incognito mode to rule out caching issues
4. Ensure you're using HTTPS (or localhost)
