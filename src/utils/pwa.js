/**
 * PWA Detection and Installation Utilities
 */

/**
 * Detect if the app is running as an installed PWA
 * @returns {boolean} True if running as PWA
 */
export const isPWA = () => {
  // Check if running in standalone mode
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

  // Check iOS standalone mode
  const isIOSStandalone = window.navigator.standalone === true;

  return isStandalone || isIOSStandalone;
};

/**
 * Detect the user's platform
 * @returns {string} 'ios', 'android', or 'desktop'
 */
export const getPlatform = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();

  // Check for iOS
  const isIOS = /iphone|ipad|ipod/.test(userAgent);
  if (isIOS) return 'ios';

  // Check for Android
  const isAndroid = /android/.test(userAgent);
  if (isAndroid) return 'android';

  // Default to desktop
  return 'desktop';
};

/**
 * Detect the user's browser
 * @returns {string} 'safari', 'chrome', 'firefox', 'edge', or 'other'
 */
export const getBrowser = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();

  if (/safari/.test(userAgent) && !/chrome/.test(userAgent)) return 'safari';
  if (/chrome/.test(userAgent)) return 'chrome';
  if (/firefox/.test(userAgent)) return 'firefox';
  if (/edg/.test(userAgent)) return 'edge';

  return 'other';
};

/**
 * Check if browser supports PWA installation
 * @returns {boolean} True if browser supports PWA
 */
export const supportsPWA = () => {
  // Check for beforeinstallprompt event support (Chrome, Edge, etc.)
  return 'BeforeInstallPromptEvent' in window || getPlatform() === 'ios';
};

/**
 * Check if the install prompt should be shown
 * @returns {boolean} True if prompt should be shown
 */
export const shouldShowInstallPrompt = () => {
  // Don't show if already installed as PWA
  if (isPWA()) return false;

  // Don't show if user dismissed it recently (within 7 days)
  const dismissedAt = localStorage.getItem('pwaPromptDismissed');
  if (dismissedAt) {
    const daysSinceDismissed = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60 * 24);
    if (daysSinceDismissed < 7) return false;
  }

  // Show the prompt
  return true;
};

/**
 * Mark the install prompt as dismissed
 */
export const dismissInstallPrompt = () => {
  localStorage.setItem('pwaPromptDismissed', Date.now().toString());
};

/**
 * Clear the dismissed state (for testing or if user wants to see it again)
 */
export const resetInstallPrompt = () => {
  localStorage.removeItem('pwaPromptDismissed');
};

/**
 * Get platform-specific installation instructions
 * @returns {Object} Instructions object with title and steps
 */
export const getInstallInstructions = () => {
  const platform = getPlatform();
  const browser = getBrowser();

  if (platform === 'ios') {
    return {
      platform: 'iOS',
      icon: '🍎',
      title: 'Install on iPhone/iPad',
      steps: [
        'Tap the Share button (square with arrow) at the bottom of Safari',
        'Scroll down and tap "Add to Home Screen"',
        'Tap "Add" in the top right corner',
        'The app icon will appear on your home screen'
      ],
      note: browser !== 'safari'
        ? '⚠️ Note: Installation only works in Safari browser on iOS. Please open this page in Safari.'
        : null
    };
  }

  if (platform === 'android') {
    return {
      platform: 'Android',
      icon: '🤖',
      title: 'Install on Android',
      steps: [
        'Tap the menu button (three dots) in the top right corner',
        'Tap "Install App" or "Add to Home Screen"',
        'Tap "Install" in the popup',
        'The app icon will appear on your home screen'
      ],
      note: browser !== 'chrome'
        ? '⚠️ Note: Installation works best in Chrome browser on Android.'
        : null
    };
  }

  // Desktop
  return {
    platform: 'Desktop',
    icon: '💻',
    title: 'Install on Desktop',
    steps: [
      'Click the install icon in the address bar (or menu)',
      'Click "Install" in the popup',
      'The app will open in its own window',
      'Find it in your apps menu or taskbar'
    ],
    note: null
  };
};

/**
 * Trigger native install prompt (Chrome/Edge)
 * @param {Event} deferredPrompt - The beforeinstallprompt event
 * @returns {Promise<boolean>} True if user accepted the install
 */
export const triggerInstallPrompt = async (deferredPrompt) => {
  if (!deferredPrompt) return false;

  // Show the native install prompt
  deferredPrompt.prompt();

  // Wait for the user to respond
  const { outcome } = await deferredPrompt.userChoice;

  // Return true if user accepted
  return outcome === 'accepted';
};
