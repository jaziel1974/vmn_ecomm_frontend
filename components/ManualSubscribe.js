import React, { useState } from 'react';
import Button from './Button';

const VAPID_PUBLIC_KEY = 'BKmtDxB_-E1gkfRryAGQFQ3OTTR-JhK3ejFggMC9Km3O_hLY6lK7XwZ9lSAP0ZmJ0oDRIl9YkyCDTJ--egJtAkA';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

export default function ManualSubscribe() {
  const [status, setStatus] = useState('ready');
  const [message, setMessage] = useState('');

  const subscribeToNotifications = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setMessage('❌ Push notifications not supported in this browser');
      return;
    }

    try {
      setStatus('requesting');
      setMessage('🔄 Requesting permission...');

      // Request permission
      const permission = await Notification.requestPermission();
      
      if (permission !== 'granted') {
        setMessage('❌ Permission denied for notifications');
        setStatus('denied');
        return;
      }

      // Register service worker
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      // Send subscription to backend
      const response = await fetch('/api/save-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription),
      });

      if (response.ok) {
        setMessage('✅ Successfully subscribed to notifications!');
        setStatus('subscribed');
      } else {
        setMessage('⚠️ Subscription saved locally but failed to save on server');
        setStatus('error');
      }

    } catch (error) {
      console.error('Subscription failed:', error);
      setMessage(`❌ Failed to subscribe: ${error.message}`);
      setStatus('error');
    }
  };

  const unsubscribe = async () => {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        setMessage('✅ Unsubscribed from notifications');
        setStatus('ready');
      }
    } catch (error) {
      setMessage(`❌ Failed to unsubscribe: ${error.message}`);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      margin: '20px 0'
    }}>
      <h3>🔔 Push Notifications</h3>
      <p>Subscribe to receive notifications about new products, orders, and updates!</p>
      
      {status === 'ready' && (
        <Button onClick={subscribeToNotifications}>
          Subscribe to Notifications
        </Button>
      )}
      
      {status === 'requesting' && (
        <Button disabled>
          Requesting Permission...
        </Button>
      )}
      
      {status === 'subscribed' && (
        <div>
          <Button onClick={unsubscribe}>
            Unsubscribe
          </Button>
        </div>
      )}
      
      {message && (
        <div style={{ 
          marginTop: '10px', 
          padding: '10px', 
          backgroundColor: '#f5f5f5',
          borderRadius: '4px'
        }}>
          {message}
        </div>
      )}
    </div>
  );
}
