import React, { useState, useEffect } from 'react';
import {
  shouldShowInstallPrompt,
  dismissInstallPrompt,
  getInstallInstructions,
  getPlatform,
  triggerInstallPrompt
} from '../utils/pwa';
import './InstallPrompt.css';

/**
 * PWA Installation Prompt Component
 * Shows platform-specific installation instructions
 */
const InstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [instructions, setInstructions] = useState(null);

  useEffect(() => {
    // Check if we should show the install prompt
    if (shouldShowInstallPrompt()) {
      setShowPrompt(true);
      setInstructions(getInstallInstructions());
    }

    // Listen for the beforeinstallprompt event (Chrome, Edge, etc.)
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Save the event so it can be triggered later
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleDismiss = () => {
    dismissInstallPrompt();
    setShowPrompt(false);
  };

  const handleInstallClick = async () => {
    const platform = getPlatform();

    // For Chrome/Edge on Android/Desktop, use the native prompt
    if (deferredPrompt && platform !== 'ios') {
      const accepted = await triggerInstallPrompt(deferredPrompt);
      if (accepted) {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
    // For iOS and other browsers, the instructions are already shown
  };

  if (!showPrompt || !instructions) {
    return null;
  }

  return (
    <div className="install-prompt-overlay">
      <div className="install-prompt-container">
        <button
          className="install-prompt-close"
          onClick={handleDismiss}
          aria-label="Close"
        >
          ✕
        </button>

        <div className="install-prompt-header">
          <span className="install-prompt-icon">{instructions.icon}</span>
          <h2>{instructions.title}</h2>
        </div>

        <div className="install-prompt-body">
          <p className="install-prompt-intro">
            Install Owensboro Mowing Company Invoice App for quick access and offline use!
          </p>

          {instructions.note && (
            <div className="install-prompt-note">
              {instructions.note}
            </div>
          )}

          <div className="install-prompt-steps">
            <h3>Installation Steps:</h3>
            <ol>
              {instructions.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>

          {/* Show native install button for supported browsers */}
          {deferredPrompt && getPlatform() !== 'ios' && (
            <button
              className="install-prompt-button-primary"
              onClick={handleInstallClick}
            >
              Install Now
            </button>
          )}

          <div className="install-prompt-benefits">
            <h3>Benefits:</h3>
            <ul>
              <li>✓ Works completely offline</li>
              <li>✓ Faster access from your home screen</li>
              <li>✓ No app store required</li>
              <li>✓ Same great features as a native app</li>
            </ul>
          </div>
        </div>

        <div className="install-prompt-footer">
          <button
            className="install-prompt-button-secondary"
            onClick={handleDismiss}
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
