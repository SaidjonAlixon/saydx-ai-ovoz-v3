import { storage } from '../../server/storage.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { slug } = req.query;
      if (!slug || typeof slug !== 'string') {
        return res.status(400).json({ success: false, message: "Slug parametri kerak" });
      }
      
      const service = await storage.getService(slug);
      if (!service) {
        return res.status(404).json({ success: false, message: "Xizmat topilmadi" });
      }
      res.json({ success: true, data: service });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Xizmatni olishda xatolik", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
