import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const STORAGE_FILE = path.join(process.cwd(), 'data', 'subscriptions.json');
      
      // Check if file exists
      const fileExists = fs.existsSync(STORAGE_FILE);
      
      let fileContent = null;
      let fileStats = null;
      
      if (fileExists) {
        // Read file content
        const rawData = fs.readFileSync(STORAGE_FILE, 'utf8');
        fileContent = JSON.parse(rawData);
        
        // Get file stats
        fileStats = fs.statSync(STORAGE_FILE);
      }
      
      res.json({
        fileExists,
        filePath: STORAGE_FILE,
        fileStats: fileStats ? {
          size: fileStats.size,
          created: fileStats.birthtime.toISOString(),
          modified: fileStats.mtime.toISOString()
        } : null,
        subscriptionCount: fileContent ? fileContent.length : 0,
        subscriptions: fileContent || [],
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        stack: error.stack
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
