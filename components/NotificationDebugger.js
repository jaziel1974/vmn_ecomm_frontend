import { useState, useEffect } from 'react';
import Button from './Button';

export default function NotificationDebugger() {
  const [permissions, setPermissions] = useState({});
  const [swStatus, setSWStatus] = useState('checking');
  const [testResult, setTestResult] = useState('');

  useEffect(() => {
    checkNotificationSupport();
  }, []);

  const checkNotificationSupport = () => {
    const support = {
      notificationAPI: 'Notification' in window,
      serviceWorker: 'serviceWorker' in navigator,
      pushManager: 'PushManager' in window,
      permission: Notification.permission
    };

    setPermissions(support);

    // Check service worker status
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration('/sw.js')
        .then(registration => {
          if (registration) {
            setSWStatus('registered');
            console.log('✅ Service Worker is registered:', registration);
          } else {
            setSWStatus('not-registered');
            console.log('❌ Service Worker is NOT registered');
          }
        })
        .catch(error => {
          setSWStatus('error');
          console.error('❌ Service Worker check failed:', error);
        });
    }
  };

  const testBrowserNotification = () => {
    if (Notification.permission === 'granted') {
      new Notification('🧪 Test Browser Notification', {
        body: 'This is a direct browser notification test',
        icon: '/logo.png'
      });
      setTestResult('✅ Direct browser notification sent');
    } else {
      setTestResult('❌ Notification permission not granted');
    }
  };

  const requestPermission = async () => {
    const permission = await Notification.requestPermission();
    setPermissions(prev => ({ ...prev, permission }));
    setTestResult(`Permission result: ${permission}`);
  };
  const testServiceWorkerNotification = async () => {
    try {
      const registration = await navigator.serviceWorker.getRegistration('/sw.js');
      if (registration) {
        // Send a test message to the service worker
        registration.active.postMessage({
          type: 'TEST_NOTIFICATION'
        });
        setTestResult('✅ Service Worker test notification sent');
      } else {
        setTestResult('❌ Service Worker not found');
      }
    } catch (error) {
      setTestResult(`❌ SW test failed: ${error.message}`);
    }
  };  const forceRegisterSW = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      setSWStatus('registered');
      setTestResult('✅ Service Worker force registered');
      console.log('✅ Service Worker registered:', registration);
    } catch (error) {
      setSWStatus('error');
      setTestResult(`❌ SW registration failed: ${error.message}`);
      console.error('❌ Service Worker registration failed:', error);
    }
  };

  const checkConsoleErrors = () => {
    setTestResult('🔍 Check browser console (F12) for detailed logs and errors');
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid #007bff', 
      borderRadius: '8px',
      margin: '20px 0',
      backgroundColor: '#f8f9fa'
    }}>
      <h3>🔍 Notification Debugger</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <h4>📋 Browser Support:</h4>
        <ul>
          <li>Notification API: {permissions.notificationAPI ? '✅' : '❌'}</li>
          <li>Service Worker: {permissions.serviceWorker ? '✅' : '❌'}</li>
          <li>Push Manager: {permissions.pushManager ? '✅' : '❌'}</li>
          <li>Permission: <strong>{permissions.permission}</strong></li>
          <li>Service Worker Status: <strong>{swStatus}</strong></li>
        </ul>
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
        {permissions.permission !== 'granted' && (
          <Button onClick={requestPermission}>
            Request Permission
          </Button>
        )}
        
        <Button onClick={testBrowserNotification}>
          Test Direct Notification
        </Button>
          <Button onClick={testServiceWorkerNotification}>
          Test SW Notification
        </Button>
        
        <Button onClick={forceRegisterSW}>
          Force Register Service Worker
        </Button>
        
        <Button onClick={checkNotificationSupport}>
          Refresh Status
        </Button>

        <Button onClick={checkConsoleErrors}>
          Check Console
        </Button>
      </div>

      {testResult && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: testResult.includes('✅') ? '#d4edda' : '#f8d7da',
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          {testResult}
        </div>
      )}

      <div style={{ fontSize: '12px', color: '#666' }}>
        <h4>🛠️ Troubleshooting Tips:</h4>
        <ul>
          <li>Check browser console (F12) for errors</li>
          <li>Make sure you're on HTTPS or localhost</li>
          <li>Check if notifications are blocked in browser settings</li>
          <li>Try in a different browser/incognito mode</li>
          <li>Clear browser cache and reload</li>
        </ul>
      </div>
    </div>
  );
}
