import { getSubscriptions, getSubscriptionCount, getSubscriptionStats } from '../../lib/subscriptionStorage';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const stats = getSubscriptionStats();
    
    res.json({
      totalSubscriptions: stats.total,
      oldestSubscription: stats.oldest ? new Date(stats.oldest).toISOString() : null,
      newestSubscription: stats.newest ? new Date(stats.newest).toISOString() : null,
      subscriptions: stats.subscriptions,
      storageInfo: {
        type: 'JSON file',
        location: 'data/subscriptions.json',
        persistent: true
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
