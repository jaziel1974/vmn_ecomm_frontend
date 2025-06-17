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

// Global cache to prevent constant file reads
let subscriptionsCache = null;
let lastLoadTime = 0;
const CACHE_DURATION = 5000; // 5 seconds cache

// Get subscriptions with caching
const getSubscriptionsFromStorage = () => {
  const now = Date.now();
  
  // If cache is fresh, return it
  if (subscriptionsCache && (now - lastLoadTime) < CACHE_DURATION) {
    return subscriptionsCache;
  }
  
  // Load fresh data from file
  subscriptionsCache = loadSubscriptions();
  lastLoadTime = now;
  return subscriptionsCache;
};

export const addSubscription = (subscription) => {
  // Always load fresh data to avoid conflicts
  const currentSubscriptions = loadSubscriptions();
  
  // Check if subscription already exists to avoid duplicates
  const existingIndex = currentSubscriptions.findIndex(sub => 
    sub.endpoint === subscription.endpoint
  );
  
  if (existingIndex === -1) {
    currentSubscriptions.push({
      ...subscription,
      subscribedAt: new Date().toISOString(),
      lastSeen: new Date().toISOString()
    });
    console.log(`✅ New subscription added. Total: ${currentSubscriptions.length}`);
  } else {
    currentSubscriptions[existingIndex] = {
      ...subscription,
      subscribedAt: currentSubscriptions[existingIndex].subscribedAt,
      lastSeen: new Date().toISOString()
    };
    console.log(`🔄 Subscription updated. Total: ${currentSubscriptions.length}`);
  }
  
  // Save to file and update cache
  saveSubscriptions(currentSubscriptions);
  subscriptionsCache = currentSubscriptions;
  lastLoadTime = Date.now();
  
  return currentSubscriptions.length;
};

export const getSubscriptions = () => {
  return getSubscriptionsFromStorage();
};

export const removeSubscription = (endpoint) => {
  const currentSubscriptions = loadSubscriptions();
  const initialLength = currentSubscriptions.length;
  const updatedSubscriptions = currentSubscriptions.filter(sub => sub.endpoint !== endpoint);
  const removed = initialLength - updatedSubscriptions.length;
  
  if (removed > 0) {
    saveSubscriptions(updatedSubscriptions);
    subscriptionsCache = updatedSubscriptions;
    lastLoadTime = Date.now();
    console.log(`🗑️ ${removed} subscription(s) removed. Total: ${updatedSubscriptions.length}`);
  }
  
  return removed > 0;
};

export const getSubscriptionCount = () => {
  const subscriptions = getSubscriptionsFromStorage();
  return subscriptions.length;
};

export const cleanupInvalidSubscriptions = (invalidEndpoints) => {
  const currentSubscriptions = loadSubscriptions();
  const before = currentSubscriptions.length;
  const cleanedSubscriptions = currentSubscriptions.filter(sub => 
    !invalidEndpoints.includes(sub.endpoint)
  );
  const removed = before - cleanedSubscriptions.length;
  
  if (removed > 0) {
    saveSubscriptions(cleanedSubscriptions);
    subscriptionsCache = cleanedSubscriptions;
    lastLoadTime = Date.now();
    console.log(`🧹 Cleaned up ${removed} invalid subscriptions`);
  }
  
  return removed;
};

// Get subscription statistics
export const getSubscriptionStats = () => {
  const subscriptions = getSubscriptionsFromStorage();
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
