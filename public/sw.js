// Service Worker for Push Notifications
// This runs independently of any webpage and handles notifications globally

console.log('🔧 Service Worker loaded');

self.addEventListener('install', function(event) {
  console.log('🔧 Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  console.log('🔧 Service Worker activated');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', function(event) {
  console.log('📥 Push notification received:', event);
  
  let data = {};
  
  try {
    data = event.data ? event.data.json() : {};
    console.log('📦 Push data:', data);
  } catch (error) {
    console.error('❌ Error parsing push data:', error);
    data = { title: 'New Notification', body: 'You have a new notification!' };
  }
  
  const title = data.title || 'Web Push';
  const options = {
    body: data.body || 'You have a new notification!',
    icon: '/logo.png',
    badge: '/logo.png',
    data: data.url || '/',
    tag: data.tag || 'general',
    requireInteraction: data.requireInteraction || false,
    vibrate: [200, 100, 200],
    actions: [
      {
        action: 'open',
        title: 'Open'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };
  
  console.log('🔔 Showing notification with options:', options);
  
  event.waitUntil(
    self.registration.showNotification(title, options)
      .then(() => {
        console.log('✅ Notification shown successfully');
      })
      .catch(error => {
        console.error('❌ Error showing notification:', error);
      })
  );
});

self.addEventListener('notificationclick', function(event) {
  console.log('🖱️ Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'close') {
    console.log('❌ User chose to close notification');
    return;
  }
  
  const urlToOpen = event.notification.data || '/';
  console.log('🌐 Opening URL:', urlToOpen);
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(function(clientList) {
        // Check if app is already open
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url.includes(self.location.origin)) {
            console.log('🎯 Focusing existing window');
            return client.focus().then(() => {
              return client.navigate(urlToOpen);
            });
          }
        }
        
        // Open new window if app is not open
        console.log('🆕 Opening new window');
        return clients.openWindow(urlToOpen);
      })
      .catch(error => {
        console.error('❌ Error handling notification click:', error);
      })
  );
});

self.addEventListener('notificationclose', function(event) {
  console.log('❌ Notification closed:', event.notification.tag);
});

self.addEventListener('pushsubscriptionchange', function(event) {
  console.log('🔄 Push subscription changed');
  // Handle subscription change - you might want to update the server
});

// Handle any errors
self.addEventListener('error', function(event) {
  console.error('❌ Service Worker error:', event.error);
});

// Keep service worker alive
self.addEventListener('message', function(event) {
  console.log('📬 Message received in service worker:', event.data);
  
  if (event.data && event.data.type === 'TEST_NOTIFICATION') {
    // Test notification from the webpage
    self.registration.showNotification('🧪 Test Notification', {
      body: 'This is a test notification from the service worker',
      icon: '/logo.png',
      tag: 'test'
    });
  }
});
