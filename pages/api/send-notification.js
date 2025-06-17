const webpush = require('web-push');
import { getSubscriptions, cleanupInvalidSubscriptions } from '../../lib/subscriptionStorage';

// VAPID keys for push notifications
const VAPID_PUBLIC_KEY = 'BKmtDxB_-E1gkfRryAGQFQ3OTTR-JhK3ejFggMC9Km3O_hLY6lK7XwZ9lSAP0ZmJ0oDRIl9YkyCDTJ--egJtAkA';
const VAPID_PRIVATE_KEY = 'roBdTuIOus-cf0Y9xSsnmMi0JrpVBUY_2lJOPTfrtsc';

webpush.setVapidDetails(
  'mailto:your@email.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { title, body, url } = req.body;
    
    if (!title || !body) {
      return res.status(400).json({ error: 'Title and body are required' });
    }

    const subscriptions = getSubscriptions();
    console.log(`📤 Attempting to send notification to ${subscriptions.length} subscribers`);

    const payload = JSON.stringify({
      title,
      body,
      url: url || '/',
    });

    try {
      const results = [];
      const invalidEndpoints = [];

      for (const sub of subscriptions) {
        try {
          await webpush.sendNotification(sub, payload);
          results.push({ success: true, endpoint: sub.endpoint });
        } catch (error) {
          console.error('❌ Failed to send to subscription:', error.message);
          results.push({ success: false, error: error.message, endpoint: sub.endpoint });
          
          // If subscription is invalid/expired, mark for cleanup
          if (error.statusCode === 410 || error.statusCode === 404) {
            invalidEndpoints.push(sub.endpoint);
          }
        }
      }

      // Clean up invalid subscriptions
      if (invalidEndpoints.length > 0) {
        cleanupInvalidSubscriptions(invalidEndpoints);
      }

      const successCount = results.filter(r => r.success).length;
      const failureCount = results.filter(r => !r.success).length;

      res.json({ 
        message: 'Notifications processed', 
        sentTo: subscriptions.length,
        successful: successCount,
        failed: failureCount,
        cleanedUp: invalidEndpoints.length,
        results: results.map(r => ({ 
          success: r.success, 
          error: r.error,
          endpoint: r.endpoint ? r.endpoint.substring(0, 50) + '...' : undefined
        }))
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
