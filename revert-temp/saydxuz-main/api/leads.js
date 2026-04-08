import 'dotenv/config';
import { storage } from '../server/storage.js';
import { insertLeadSchema } from '../shared/schema.js';
import { sendLeadToTelegram } from '../server/telegram.js';
import { randomUUID } from 'crypto';

export default async function handler(req, res) {
  console.log('Leads API chaqirildi:', req.method, req.url);
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      console.log('Kelgan ma\'lumotlar:', req.body);
      console.log('Body type:', typeof req.body);
      console.log('Body keys:', Object.keys(req.body || {}));
      
      // FormData'ni parse qilish uchun
      if (req.body && typeof req.body === 'object') {
        console.log('Parsed body values:', {
          name: req.body.name,
          phone: req.body.phone,
          serviceType: req.body.serviceType,
          telegram: req.body.telegram,
          budget: req.body.budget,
          timeline: req.body.timeline,
          description: req.body.description
        });
      }
      
      // Agar req.body bo'sh bo'lsa, FormData parse qilinmagan
      if (!req.body || Object.keys(req.body).length === 0) {
        console.log('FormData parse qilinmagan, req.body bo\'sh');
        return res.status(400).json({
          success: false,
          message: "Ma'lumotlar to'g'ri yuborilmagan"
        });
      }
      
      // Required field'larni tekshiramiz
      if (!req.body.name || !req.body.phone || !req.body.serviceType) {
        console.log('Missing required fields:', {
          name: req.body.name,
          phone: req.body.phone,
          serviceType: req.body.serviceType
        });
        return res.status(400).json({
          success: false,
          message: "Ism, telefon va xizmat turi majburiy maydonlar"
        });
      }
      
      const leadData = {
        name: req.body.name,
        phone: req.body.phone,
        serviceType: req.body.serviceType,
        telegram: req.body.telegram || null,
        email: req.body.email || null,
        budget: req.body.budget || null,
        timeline: req.body.timeline || null,
        description: req.body.description || null,
        fileUrl: req.body.fileUrl || null, // Fayl URL'ini olamiz
        fileName: req.body.fileName || null, // Fayl nomini olamiz
        source: req.body.source || "website"
      };
      
      console.log('Lead data prepared:', leadData);
      console.log('File URL mavjudmi:', !!leadData.fileUrl);
      console.log('File URL qiymati:', leadData.fileUrl);
      console.log('File name mavjudmi:', !!leadData.fileName);
      console.log('File name qiymati:', leadData.fileName);
      
      let validatedData;
      try {
        validatedData = insertLeadSchema.parse(leadData);
        console.log('Validated data:', validatedData);
      } catch (validationError) {
        console.log('Validation error:', validationError.errors);
        return res.status(400).json({
          success: false,
          message: "Ma'lumotlarda xatolik bor",
          errors: validationError.errors
        });
      }
      
      // Vercel'da database muammosi bo'lsa ham Telegram'ga yuborish
      let lead;
      try {
        lead = await storage.createLead(validatedData);
        console.log(`New lead received: ${lead.name} - ${lead.serviceType}`);
      } catch (dbError) {
        console.log('Database error, but continuing with Telegram:', dbError);
        // Database muammosi bo'lsa ham Telegram'ga yuboramiz
        lead = {
          ...validatedData,
          id: randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
      }
      
      // Telegram kanalga yuborish
      console.log('Telegram yuborishga harakat qilinmoqda...');
      console.log('Bot token mavjudmi:', !!process.env.TELEGRAM_BOT_TOKEN);
      console.log('Kanal ID mavjudmi:', !!process.env.TELEGRAM_CHANNEL_ID);
      console.log('Bot token:', process.env.TELEGRAM_BOT_TOKEN ? 'mavjud' : 'yo\'q');
      console.log('Kanal ID:', process.env.TELEGRAM_CHANNEL_ID ? 'mavjud' : 'yo\'q');
      
      const telegramResult = await sendLeadToTelegram(lead);
      console.log('Telegram yuborish natijasi:', telegramResult);
      
      res.status(201).json({ 
        success: true, 
        message: "Ariza muvaffaqiyatli yuborildi",
        leadId: lead.id,
        telegramSent: telegramResult.success
      });
    } catch (error) {
      console.error('Lead creation error:', error);
      res.status(400).json({ 
        success: false, 
        message: "Ma'lumotlarda xatolik bor", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  } else if (req.method === 'GET') {
    try {
      const leads = await storage.getLeads();
      res.json({ success: true, data: leads });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Ma'lumotlarni olishda xatolik", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
