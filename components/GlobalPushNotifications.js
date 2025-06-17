import { useEffect } from 'react';

// This component ensures push notifications work on any page
// Add it to any page or component where you want notifications to be active
export default function GlobalPushNotifications() {
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      // Register service worker if not already registered
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('✅ Service Worker registered globally:', registration);
        })
        .catch(error => {
          console.error('❌ Service Worker registration failed:', error);
        });
    }
  }, []);

  // This component doesn't render anything visible
  return null;
}

// Alternative hook version
export function useGlobalPushNotifications() {
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('✅ Service Worker registered globally:', registration);
        })
        .catch(error => {
          console.error('❌ Service Worker registration failed:', error);
        });
    }
  }, []);
}
