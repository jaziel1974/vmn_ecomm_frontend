const webpush = require('web-push');
import { addSubscription, getSubscriptions } from '../../lib/subscriptionStorage';

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
    const sub = req.body;
    const totalSubscriptions = addSubscription(sub);
    res.status(201).json({ 
      message: 'Subscription saved.',
      totalSubscriptions
    });
  } else if (req.method === 'GET') {
    // For testing: send a push notification to all subscriptions
    const subscriptions = getSubscriptions();
    const payload = JSON.stringify({
      title: 'Test Notification',
      body: 'This is a test push notification!',
      url: '/',
    });
    
    const results = await Promise.all(subscriptions.map(sub =>
      webpush.sendNotification(sub, payload).catch(err => err)
    ));
    
    res.json({ 
      results,
      sentTo: subscriptions.length,
      message: `Test notification sent to ${subscriptions.length} subscriber(s)`
    });
  } else {
    res.status(405).end();
  }
}
