import React from 'react';
import { usePushNotifications } from './usePushNotifications';

export default function PushSetup() {
  const subscription = usePushNotifications();
  const [subscriptionStatus, setSubscriptionStatus] = React.useState('checking');

  React.useEffect(() => {
    if (subscription) {
      fetch('/api/save-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription),
      })
      .then(response => response.json())
      .then(() => {
        setSubscriptionStatus('subscribed');
        console.log('✅ Successfully subscribed to push notifications');
      })
      .catch((error) => {
        setSubscriptionStatus('error');
        console.error('❌ Failed to save subscription:', error);
      });
    } else {
      // Check if notifications are supported and permission status
      if ('Notification' in window) {
        if (Notification.permission === 'denied') {
          setSubscriptionStatus('denied');
        } else if (Notification.permission === 'default') {
          setSubscriptionStatus('pending');
        }
      } else {
        setSubscriptionStatus('unsupported');
      }
    }
  }, [subscription]);

  const getStatusMessage = () => {
    switch (subscriptionStatus) {
      case 'checking':
        return '🔄 Checking notification support...';
      case 'pending':
        return '🔔 Click "Allow" to enable notifications';
      case 'subscribed':
        return '✅ Push notifications enabled';
      case 'denied':
        return '❌ Notifications blocked. Enable in browser settings.';
      case 'error':
        return '⚠️ Error setting up notifications';
      case 'unsupported':
        return '❌ Browser doesn\'t support notifications';
      default:
        return '';
    }
  };

  return (
    <div style={{ 
      padding: '10px', 
      backgroundColor: '#f0f8ff', 
      border: '1px solid #ddd', 
      borderRadius: '5px',
      margin: '10px 0'
    }}>
      <strong>Push Notifications:</strong> {getStatusMessage()}
    </div>
  );
}
