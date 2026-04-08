import { storage } from '../server/storage.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const services = await storage.getActiveServices();
      res.json({ success: true, data: services });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Xizmatlarni olishda xatolik", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
