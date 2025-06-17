import fs from 'fs';
import path from 'path';

// Persistent storage for push notification subscriptions
// In production, replace this with a proper database

const STORAGE_FILE = path.join(process.cwd(), 'data', 'subscriptions.json');

// Ensure data directory exists
const ensureDataDirectory = () => {
  const dataDir = path.dirname(STORAGE_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Load subscriptions from file
const loadSubscriptions = () => {
  try {
    ensureDataDirectory();
    if (fs.existsSync(STORAGE_FILE)) {
      const data = fs.readFileSync(STORAGE_FILE, 'utf8');
      const subscriptions = JSON.parse(data);
      console.log(`📖 Loaded ${subscriptions.length} subscriptions from storage`);
      return subscriptions;
    }
  } catch (error) {
    console.error('❌ Error loading subscriptions:', error);
  }
  return [];
};

// Save subscriptions to file
const saveSubscriptions = (subscriptions) => {
  try {
    ensureDataDirectory();
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(subscriptions, null, 2));
    console.log(`💾 Saved ${subscriptions.length} subscriptions to storage`);
  } catch (error) {
    console.error('❌ Error saving subscriptions:', error);
  }
};

// Initialize with persisted data
let subscriptions = loadSubscriptions();

export const addSubscription = (subscription) => {
  // Check if subscription already exists to avoid duplicates
  const existingIndex = subscriptions.findIndex(sub => 
    sub.endpoint === subscription.endpoint
  );
  
  if (existingIndex === -1) {
    subscriptions.push({
      ...subscription,
      subscribedAt: new Date().toISOString(),
      lastSeen: new Date().toISOString()
    });
    console.log(`✅ New subscription added. Total: ${subscriptions.length}`);
  } else {
    subscriptions[existingIndex] = {
      ...subscription,
      subscribedAt: subscriptions[existingIndex].subscribedAt,
      lastSeen: new Date().toISOString()
    };
    console.log(`🔄 Subscription updated. Total: ${subscriptions.length}`);
  }
  
  // Save to persistent storage
  saveSubscriptions(subscriptions);
  
  return subscriptions.length;
};

export const getSubscriptions = () => {
  return subscriptions;
};

export const removeSubscription = (endpoint) => {
  const initialLength = subscriptions.length;
  subscriptions = subscriptions.filter(sub => sub.endpoint !== endpoint);
  const removed = initialLength - subscriptions.length;
  
  if (removed > 0) {
    saveSubscriptions(subscriptions);
    console.log(`🗑️ ${removed} subscription(s) removed. Total: ${subscriptions.length}`);
  }
  
  return removed > 0;
};

export const getSubscriptionCount = () => {
  return subscriptions.length;
};

export const cleanupInvalidSubscriptions = (invalidEndpoints) => {
  const before = subscriptions.length;
  subscriptions = subscriptions.filter(sub => 
    !invalidEndpoints.includes(sub.endpoint)
  );
  const removed = before - subscriptions.length;
  
  if (removed > 0) {
    saveSubscriptions(subscriptions);
    console.log(`🧹 Cleaned up ${removed} invalid subscriptions`);
  }
  
  return removed;
};

// Get subscription statistics
export const getSubscriptionStats = () => {
  return {
    total: subscriptions.length,
    oldest: subscriptions.length > 0 ? 
      Math.min(...subscriptions.map(s => new Date(s.subscribedAt).getTime())) : null,
    newest: subscriptions.length > 0 ? 
      Math.max(...subscriptions.map(s => new Date(s.subscribedAt).getTime())) : null,
    subscriptions: subscriptions.map(sub => ({
      endpoint: sub.endpoint.substring(0, 50) + '...',
      subscribedAt: sub.subscribedAt,
      lastSeen: sub.lastSeen
    }))
  };
};
