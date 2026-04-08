import 'dotenv/config';
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema, insertServiceSchema, insertPortfolioSchema, insertArticleSchema } from "@shared/schema";
// @ts-ignore
import { sendLeadToTelegram } from "./telegram.js";
import multer from "multer";
import path from "path";
import { randomUUID } from "crypto";

// File upload configuration
const upload = multer({
  dest: '/tmp/uploads/', // Vercel uchun /tmp/ papkasini ishlatamiz
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Faqat PDF, DOC, DOCX, JPG, JPEG, PNG formatdagi fayllar ruxsat etilgan'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Lead management routes
  app.post("/api/leads", upload.single('file'), async (req, res) => {
    try {
      const leadData = {
        ...req.body,
        fileUrl: req.file ? `/tmp/uploads/${req.file.filename}` : null
      };
      
      const validatedData = insertLeadSchema.parse(leadData);
      
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
      
      const telegramResult = await sendLeadToTelegram(lead);
      console.log('Telegram yuborish natijasi:', telegramResult);
      
      res.status(201).json({
        success: true,
        message: "Ariza muvaffaqiyatli yuborildi",
        leadId: lead.id,
        telegramSent: telegramResult.success
      });
    } catch (error) {
      console.error("Lead creation error:", error);
      res.status(400).json({
        success: false,
        message: "Ma'lumotlarda xatolik bor",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/leads", async (req, res) => {
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
  });

  app.get("/api/leads/:id", async (req, res) => {
    try {
      const lead = await storage.getLead(req.params.id);
      if (!lead) {
        return res.status(404).json({ success: false, message: "Ariza topilmadi" });
      }
      res.json({ success: true, data: lead });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Ma'lumotni olishda xatolik", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  app.patch("/api/leads/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const lead = await storage.updateLeadStatus(req.params.id, status);
      if (!lead) {
        return res.status(404).json({ success: false, message: "Ariza topilmadi" });
      }
      res.json({ success: true, data: lead });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Statusni yangilashda xatolik", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Service management routes
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getActiveServices();
      
      // Agar xizmatlar bo'sh bo'lsa, default xizmatlarni qaytaramiz
      if (services.length === 0) {
        const defaultServices = [
          {
            id: "1",
            name: "Veb-sayt yaratish",
            slug: "veb-sayt",
            shortDescription: "Zamonaviy va responsive veb-saytlar",
            fullDescription: "Biznesingiz uchun professional veb-sayt yaratamiz. Responsive dizayn, tez yuklanish va SEO optimizatsiya bilan.",
            category: "Veb-sayt",
            basePrice: 500,
            duration: "2-4 hafta",
            rating: "4.9",
            features: ["Responsive dizayn", "SEO optimizatsiya", "Tez yuklanish", "Mobil optimizatsiya"],
            calculatorParams: null,
            isActive: "true",
            createdAt: new Date()
          },
          {
            id: "2",
            name: "Telegram bot",
            slug: "telegram-bot",
            shortDescription: "Telegram botlar yaratish va sozlash",
            fullDescription: "Biznesingiz uchun professional Telegram bot yaratamiz. Avtomatlashtirish, xabarlar yuborish va mijozlar bilan aloqa.",
            category: "Bot",
            basePrice: 300,
            duration: "1-2 hafta",
            rating: "4.8",
            features: ["Avtomatik javoblar", "Fayl yuklash", "Ma'lumotlar bazasi", "Admin panel"],
            calculatorParams: null,
            isActive: "true",
            createdAt: new Date()
          },
          {
            id: "3",
            name: "Mobil ilova",
            slug: "mobil-ilova",
            shortDescription: "iOS va Android ilovalar",
            fullDescription: "Cross-platform mobil ilovalar yaratamiz. React Native va Flutter texnologiyalari bilan.",
            category: "Mobil",
            basePrice: 1000,
            duration: "6-8 hafta",
            rating: "4.7",
            features: ["Cross-platform", "Native performance", "Push notifications", "Offline mode"],
            calculatorParams: null,
            isActive: "true",
            createdAt: new Date()
          },
          {
            id: "4",
            name: "Target Reklama",
            slug: "target-reklama",
            shortDescription: "Facebook, Instagram, Google reklama",
            fullDescription: "Sosial tarmoqlarda professional reklama kampaniyalari. ROI optimizatsiya va natijaviy reklama.",
            category: "Marketing",
            basePrice: 200,
            duration: "1 hafta",
            rating: "4.6",
            features: ["Audience targeting", "A/B testing", "Analytics", "ROI optimization"],
            calculatorParams: null,
            isActive: "true",
            createdAt: new Date()
          },
          {
            id: "5",
            name: "Sheets Avtomatlashtirish",
            slug: "sheets-avtomatlashtirish",
            shortDescription: "Google Sheets va Excel avtomatlashtirish",
            fullDescription: "Google Sheets va Excel fayllarini avtomatlashtirish. Makrolar, formulalar va integratsiyalar.",
            category: "Avtomatlashtirish",
            basePrice: 150,
            duration: "1-2 hafta",
            rating: "4.5",
            features: ["Macro yozish", "Formula optimizatsiya", "Data integration", "Automation"],
            calculatorParams: null,
            isActive: "true",
            createdAt: new Date()
          }
        ];
        res.json({ success: true, data: defaultServices });
        return;
      }
      
      res.json({ success: true, data: services });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Xizmatlarni olishda xatolik", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  app.get("/api/services/:slug", async (req, res) => {
    try {
      const service = await storage.getService(req.params.slug);
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
  });

  app.post("/api/services", async (req, res) => {
    try {
      const validatedData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(validatedData);
      res.status(201).json({ success: true, data: service });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: "Xizmat yaratishda xatolik", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Portfolio routes
  app.get("/api/portfolio", async (req, res) => {
    try {
      const portfolios = await storage.getPublicPortfolios();
      res.json({ success: true, data: portfolios });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Portfolio ma'lumotlarini olishda xatolik", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  app.get("/api/portfolio/:id", async (req, res) => {
    try {
      const portfolio = await storage.getPortfolio(req.params.id);
      if (!portfolio || portfolio.isPublic !== "true") {
        return res.status(404).json({ success: false, message: "Portfolio topilmadi" });
      }
      res.json({ success: true, data: portfolio });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Portfolio ma'lumotini olishda xatolik", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  app.post("/api/portfolio", async (req, res) => {
    try {
      const validatedData = insertPortfolioSchema.parse(req.body);
      const portfolio = await storage.createPortfolio(validatedData);
      res.status(201).json({ success: true, data: portfolio });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: "Portfolio yaratishda xatolik", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Article routes
  app.get("/api/articles", async (req, res) => {
    try {
      const articles = await storage.getPublishedArticles();
      res.json({ success: true, data: articles });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Maqolalarni olishda xatolik", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  app.get("/api/articles/:slug", async (req, res) => {
    try {
      const article = await storage.getArticle(req.params.slug);
      if (!article || article.isPublished !== "true") {
        return res.status(404).json({ success: false, message: "Maqola topilmadi" });
      }
      
      // Increment view count
      await storage.incrementArticleViews(req.params.slug);
      
      res.json({ success: true, data: article });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Maqolani olishda xatolik", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  app.post("/api/articles", async (req, res) => {
    try {
      const validatedData = insertArticleSchema.parse(req.body);
      const article = await storage.createArticle(validatedData);
      res.status(201).json({ success: true, data: article });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: "Maqola yaratishda xatolik", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Serve uploaded files
  app.use('/uploads', (req, res, next) => {
    // Add some basic security
    const filename = req.path.slice(1); // Remove leading slash
    if (!/^[a-zA-Z0-9.-]+$/.test(filename)) {
      return res.status(400).json({ error: "Noto'g'ri fayl nomi" });
    }
    next();
  });

  // Calculator price estimation endpoint
  app.post("/api/calculator/estimate", async (req, res) => {
    try {
      const { serviceType, features = [], timeline = "standard" } = req.body;
      
      // Get service base price
      const service = await storage.getService(serviceType);
      if (!service) {
        return res.status(404).json({ success: false, message: "Xizmat topilmadi" });
      }
      
      let totalPrice = service.basePrice;
      
      // Add feature costs (simplified pricing logic)
      const featurePrices: Record<string, number> = {
        "admin-panel": 150000,
        "payment": 200000,
        "analytics": 100000,
        "api": 180000,
        "seo": 120000
      };
      
      features.forEach((feature: string) => {
        totalPrice += featurePrices[feature] || 0;
      });
      
      // Apply timeline modifier
      const timelineModifiers: Record<string, number> = {
        "standard": 0,
        "fast": 300000,
        "premium": 500000
      };
      
      totalPrice += timelineModifiers[timeline] || 0;
      
      res.json({
        success: true,
        data: {
          basePrice: service.basePrice,
          featuresPrice: features.reduce((sum: number, f: string) => sum + (featurePrices[f] || 0), 0),
          timelinePrice: timelineModifiers[timeline] || 0,
          totalPrice,
          serviceName: service.name,
          duration: service.duration
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Narxni hisoblashda xatolik", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
