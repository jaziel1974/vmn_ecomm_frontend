# Push Notifications - Production Database Setup

For production, replace the JSON file storage with a proper database. Here are examples for popular databases:

## Option 1: MongoDB (Recommended)

```javascript
// lib/subscriptionStorage.js (Production Version)
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db('your-app-name');
const subscriptions = db.collection('push_subscriptions');

export const addSubscription = async (subscription) => {
  await subscriptions.updateOne(
    { endpoint: subscription.endpoint },
    { 
      $set: {
        ...subscription,
        lastSeen: new Date()
      },
      $setOnInsert: {
        subscribedAt: new Date()
      }
    },
    { upsert: true }
  );
};

export const getSubscriptions = async () => {
  return await subscriptions.find({}).toArray();
};
```

## Option 2: PostgreSQL with Prisma

```prisma
// prisma/schema.prisma
model PushSubscription {
  id           String   @id @default(cuid())
  endpoint     String   @unique
  auth         String
  p256dh       String
  subscribedAt DateTime @default(now())
  lastSeen     DateTime @updatedAt
}
```

## Option 3: Supabase

```javascript
// lib/subscriptionStorage.js (Supabase Version)
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export const addSubscription = async (subscription) => {
  const { error } = await supabase
    .from('push_subscriptions')
    .upsert({
      endpoint: subscription.endpoint,
      auth: subscription.keys.auth,
      p256dh: subscription.keys.p256dh,
      last_seen: new Date().toISOString()
    });
  
  if (error) throw error;
};
```

## Environment Variables

Add to your `.env.local`:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/your-app

# PostgreSQL
DATABASE_URL=postgresql://user:pass@localhost:5432/your-app

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

## Current Development Setup

- Uses JSON file storage in `data/subscriptions.json`
- Persists across server restarts
- Automatically cleans up invalid subscriptions
- Perfect for development and testing
