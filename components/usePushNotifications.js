import { useEffect, useState } from 'react';

// VAPID public key for push notifications
const VAPID_PUBLIC_KEY = 'BKmtDxB_-E1gkfRryAGQFQ3OTTR-JhK3ejFggMC9Km3O_hLY6lK7XwZ9lSAP0ZmJ0oDRIl9YkyCDTJ--egJtAkA';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

export function usePushNotifications() {
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js').then(registration => {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            registration.pushManager.getSubscription().then(async sub => {
              if (!sub) {
                const newSub = await registration.pushManager.subscribe({
                  userVisibleOnly: true,
                  applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
                });
                setSubscription(newSub);
                // Send newSub to your backend to save
              } else {
                setSubscription(sub);
              }
            });
          }
        });
      });
    }
  }, []);

  return subscription;
}
