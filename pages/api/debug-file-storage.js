import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const STORAGE_FILE = path.join(process.cwd(), 'data', 'subscriptions.json');
      
      // Check if file exists
      const fileExists = fs.existsSync(STORAGE_FILE);
      
      let fileContent = null;
      let subscriptionCount = 0;
      
      if (fileExists) {
        const rawData = fs.readFileSync(STORAGE_FILE, 'utf8');
        fileContent = rawData;
        const subscriptions = JSON.parse(rawData);
        subscriptionCount = subscriptions.length;
      }
      
      res.json({
        debug: 'File system debug info',
        storageFile: STORAGE_FILE,
        fileExists,
        subscriptionCount,
        fileContent: fileContent ? JSON.parse(fileContent) : null,
        timestamp: new Date().toISOString(),
        processWorkingDirectory: process.cwd()
      });
    } catch (error) {
      res.status(500).json({
        error: 'Debug failed',
        message: error.message,
        stack: error.stack
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
