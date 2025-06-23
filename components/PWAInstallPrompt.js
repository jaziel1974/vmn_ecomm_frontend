import { useState, useEffect } from 'react';
import styled from 'styled-components';

const InstallPrompt = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #1B422E;
  color: white;
  padding: 15px 20px;
  border-radius: 0;
  box-shadow: 0 -4px 12px rgba(0,0,0,0.15);
  z-index: 2000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: slideUp 0.3s ease-out;
  width: 100vw;
  max-width: 100vw;

  @media (min-width: 600px) {
    left: 20px;
    right: 20px;
    bottom: 20px;
    border-radius: 8px;
    width: auto;
    max-width: 500px;
    margin: 0 auto;
    padding: 15px 32px;
  }

  @keyframes slideUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const InstallButton = styled.button`
  background: #FEBA51;
  color: #1B422E;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  margin-left: 10px;

  &:hover {
    background: #e6a54a;
  }
`;

const CloseButton = styled.button`
  background: transparent;
  color: white;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
  margin-left: 10px;
`;

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);  useEffect(() => {
    // Set mounted to true after component mounts
    setIsMounted(true);

    // Only run in browser
    if (typeof window === 'undefined') return;

    // Check if already dismissed this session (only in browser)
    if (sessionStorage.getItem('pwa-install-dismissed') === 'true') {
      setIsDismissed(true);
    }

    // Check if running as standalone (already installed)
    setIsStandalone(window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches);
    
    // Check if iOS
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, show custom install instructions
    if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.navigator.standalone && !window.matchMedia('(display-mode: standalone)').matches) {
      setTimeout(() => setShowInstallPrompt(true), 3000); // Show after 3 seconds
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // For Android/Chrome
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };
  const handleClose = () => {
    setShowInstallPrompt(false);
    setIsDismissed(true);
    // Don't show again for this session (only in browser)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pwa-install-dismissed', 'true');
    }
  };
  // Don't render until component is mounted (prevents SSR issues)
  if (!isMounted) {
    return null;
  }

  // Don't show if already dismissed this session
  if (isDismissed) {
    return null;
  }

  // Don't show if already running as standalone app
  if (isStandalone) {
    return null;
  }

  if (!showInstallPrompt) {
    return null;
  }

  return (
    <InstallPrompt>
      <div>
        <strong>📱 Install VMN Store</strong>
        <br />
        {isIOS ? (
          <small>Tap the share button and select "Add to Home Screen"</small>
        ) : (
          <small>Get the full app experience</small>
        )}
      </div>
      <div>
        {!isIOS && (
          <InstallButton onClick={handleInstallClick}>
            Install
          </InstallButton>
        )}
        <CloseButton onClick={handleClose}>×</CloseButton>
      </div>
    </InstallPrompt>
  );
}
