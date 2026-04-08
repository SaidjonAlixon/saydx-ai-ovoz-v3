import 'dotenv/config';
import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema, insertServiceSchema, insertPortfolioSchema, insertArticleSchema, insertFaqSchema, insertQuestionSchema, insertTeamMemberSchema } from "@shared/schema";
// @ts-ignore
import { sendLeadToTelegram, setupTelegramBot, sendQuestionToTelegram } from "./telegram.js";
import multer from "multer";
import path from "path";
import { randomUUID } from "crypto";
import { setupAuth } from "./auth";

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
    features: JSON.stringify(["Responsive dizayn", "SEO optimizatsiya", "Tez yuklanish", "Mobil optimizatsiya"]),
    calculatorParams: null,
    isActive: "true",
    createdAt: new Date()
  },
  {
    id: "2",
    name: "Telegram bot",
    slug: "telegram-bot",
    shortDescription: "Telegram botlar yaratish",
    fullDescription: "Biznesingiz uchun professional Telegram bot yaratamiz. Avtomatlashtirish, xabarlar yuborish va mijozlar bilan aloqa.",
    category: "Bot",
    basePrice: 300,
    duration: "1-2 hafta",
    rating: "4.8",
    features: JSON.stringify(["Avtomatik javoblar", "Fayl yuklash", "Ma'lumotlar bazasi", "Admin panel"]),
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
    features: JSON.stringify(["Cross-platform", "Native performance", "Push notifications", "Offline mode"]),
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
    features: JSON.stringify(["Audience targeting", "A/B testing", "Analytics", "ROI optimization"]),
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
    features: JSON.stringify(["Macro yozish", "Formula optimizatsiya", "Data integration", "Automation"]),
    calculatorParams: null,
    isActive: "true",
    createdAt: new Date()
  }
];

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Initialize Telegram Bot for callback queries
  // setupTelegramBot();

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
        data: lead,
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

  app.get("/api/leads/my", async (req, res) => {
    try {
      const idsQuery = req.query.ids as string;
      if (!idsQuery) {
        return res.json({ success: true, data: [] });
      }
      const ids = idsQuery.split(",");
      const leads = await storage.getLeadsByIds(ids);
      res.json({ success: true, data: leads });
    } catch (error) {
      res.status(500).json({ success: false, message: "Arizalarni olishda xatolik" });
    }
  });

  app.patch("/api/leads/:id", async (req, res) => {
    try {
      const { status, adminReply } = req.body;
      let lead = await storage.getLead(req.params.id);
      if (!lead) {
        return res.status(404).json({ success: false, message: "Ariza topilmadi" });
      }

      if (status) {
        lead = await storage.updateLeadStatus(req.params.id, status);
      }
      if (adminReply !== undefined) {
        lead = await storage.updateLeadReply(req.params.id, adminReply);
      }

      res.json({ success: true, data: lead });
    } catch (error) {
      res.status(500).json({ success: false, message: "Yangilashda xatolik" });
    }
  });

  app.delete("/api/leads/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteLead(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Ariza topilmadi" });
      }
      res.json({ success: true, message: "Ariza o'chirildi" });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "O'chirishda xatolik",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Questions routes
  app.get("/api/questions", async (req, res) => {
    try {
      const questions = await storage.getPublicQuestions();
      res.json({ success: true, data: questions });
    } catch (error) {
      res.status(500).json({ success: false, message: "Savollarni olishda xatolik" });
    }
  });

  app.post("/api/questions", async (req, res) => {
    try {
      const parsed = insertQuestionSchema.safeParse(req.body);
      if (!parsed.success) {
        console.error("Q&A Validation Error:", parsed.error);
        return res.status(400).json({ success: false, message: "Noto'g'ri ma'lumotlar", errors: parsed.error.errors });
      }

      const question = await storage.createQuestion(parsed.data);

      // Telegram bot orqali adminga yuborish
      await sendQuestionToTelegram(question);

      res.status(201).json({ success: true, data: question });
    } catch (error) {
      res.status(500).json({ success: false, message: "Savol yuborishda xatolik" });
    }
  });

  app.get("/api/questions/my", async (req, res) => {
    try {
      const idsQuery = req.query.ids as string;
      if (!idsQuery) {
        return res.json({ success: true, data: [] });
      }
      const ids = idsQuery.split(",");
      const questions = await storage.getQuestionsByIds(ids);
      res.json({ success: true, data: questions });
    } catch (error) {
      res.status(500).json({ success: false, message: "Savollarni olishda xatolik" });
    }
  });

  // Admin question routes
  app.get("/api/admin/questions", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      const questions = await storage.getQuestions();
      res.json({ success: true, data: questions });
    } catch (error) {
      res.status(500).json({ success: false, message: "Barcha savollarni olishda xatolik" });
    }
  });

  app.patch("/api/questions/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      const { reply } = req.body;
      const question = await storage.updateQuestionReply(req.params.id, reply || "");
      if (!question) {
        return res.status(404).json({ success: false, message: "Savol topilmadi" });
      }
      res.json({ success: true, data: question });
    } catch (error) {
      res.status(500).json({ success: false, message: "Savolga javob yozishda xatolik" });
    }
  });

  app.delete("/api/questions/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      const deleted = await storage.deleteQuestion(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Savol topilmadi" });
      }
      res.json({ success: true, message: "Savol o'chirildi" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Savolni o'chirishda xatolik" });
    }
  });


  // Service management routes
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getActiveServices();

      // Agar xizmatlar bo'sh bo'lsa, default xizmatlarni qaytaramiz
      if (services.length === 0) {
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
      let dataToReturn = service;

      if (!service) {
        // Fallback to default services if not found in db
        const defaultService = defaultServices.find(s => s.slug === req.params.slug);
        if (defaultService) {
          dataToReturn = defaultService;
        } else {
          return res.status(404).json({ success: false, message: "Xizmat topilmadi" });
        }
      }
      res.json({ success: true, data: dataToReturn });
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
      if (!req.isAuthenticated() || !req.user?.isAdmin) {
        return res.status(403).json({ success: false, message: "Kirish taqiqlangan" });
      }
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

  app.patch("/api/services/:slug", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.isAdmin) {
        return res.status(403).json({ success: false, message: "Kirish taqiqlangan" });
      }
      const service = await storage.updateService(req.params.slug, req.body);
      if (!service) {
        return res.status(404).json({ success: false, message: "Xizmat topilmadi" });
      }
      res.json({ success: true, data: service });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Xizmatni yangilashda xatolik",
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
      if (!req.isAuthenticated() || !req.user?.isAdmin) {
        return res.status(403).json({ success: false, message: "Kirish taqiqlangan" });
      }
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

  app.patch("/api/portfolio/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.isAdmin) {
        return res.status(403).json({ success: false, message: "Kirish taqiqlangan" });
      }
      const portfolio = await storage.updatePortfolio(req.params.id, req.body);
      if (!portfolio) {
        return res.status(404).json({ success: false, message: "Portfolio topilmadi" });
      }
      res.json({ success: true, data: portfolio });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Portfolioni yangilashda xatolik",
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
      if (!req.isAuthenticated() || !req.user?.isAdmin) {
        return res.status(403).json({ success: false, message: "Kirish taqiqlangan" });
      }
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

  app.patch("/api/articles/:slug", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.isAdmin) {
        return res.status(403).json({ success: false, message: "Kirish taqiqlangan" });
      }
      const article = await storage.updateArticle(req.params.slug, req.body);
      if (!article) {
        return res.status(404).json({ success: false, message: "Maqola topilmadi" });
      }
      res.json({ success: true, data: article });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Maqolani yangilashda xatolik",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.delete("/api/articles/:slug", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.isAdmin) {
        return res.status(403).json({ success: false, message: "Kirish taqiqlangan" });
      }
      const deleted = await storage.deleteArticle(req.params.slug);
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Maqola topilmadi" });
      }
      res.json({ success: true, message: "Maqola ochirildi" });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Maqolani ochirishda xatolik",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // FAQ routes
  app.get("/api/faqs", async (req, res) => {
    try {
      const faqs = await storage.getActiveFaqs();
      res.json({ success: true, data: faqs });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Savollarni olishda xatolik",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/admin/faqs", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.isAdmin) {
        return res.status(403).json({ success: false, message: "Kirish taqiqlangan" });
      }
      const faqs = await storage.getFaqs();
      res.json({ success: true, data: faqs });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Savollarni olishda xatolik",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/faqs", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.isAdmin) {
        return res.status(403).json({ success: false, message: "Kirish taqiqlangan" });
      }
      const validatedData = insertFaqSchema.parse(req.body);
      const faq = await storage.createFaq(validatedData);
      res.status(201).json({ success: true, data: faq });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Savol yaratishda xatolik",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.patch("/api/faqs/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.isAdmin) {
        return res.status(403).json({ success: false, message: "Kirish taqiqlangan" });
      }
      const faq = await storage.updateFaq(req.params.id, req.body);
      if (!faq) {
        return res.status(404).json({ success: false, message: "Savol topilmadi" });
      }
      res.json({ success: true, data: faq });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Savolni yangilashda xatolik",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.delete("/api/faqs/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.isAdmin) {
        return res.status(403).json({ success: false, message: "Kirish taqiqlangan" });
      }
      const deleted = await storage.deleteFaq(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Savol topilmadi" });
      }
      res.json({ success: true, message: "Savol ochirildi" });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Savolni ochirishda xatolik",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });



  // Team routes
  app.get("/api/team", async (req, res) => {
    try {
      const team = await storage.getActiveTeamMembers();
      res.json({ success: true, data: team });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Jamoa ma'lumotlarini olishda xatolik",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/team/main", async (req, res) => {
    try {
      const mainMember = await storage.getMainTeamMember();
      res.json({ success: true, data: mainMember });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Asosiy jamoa a'zosini olishda xatolik",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/team", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.isAdmin) {
        return res.status(403).json({ success: false, message: "Kirish taqiqlangan" });
      }
      const validatedData = insertTeamMemberSchema.parse(req.body);
      const member = await storage.createTeamMember(validatedData);
      res.status(201).json({ success: true, data: member });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Jamoa a'zosini qo'shishda xatolik",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.patch("/api/team/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.isAdmin) {
        return res.status(403).json({ success: false, message: "Kirish taqiqlangan" });
      }
      const member = await storage.updateTeamMember(req.params.id, req.body);
      if (!member) {
        return res.status(404).json({ success: false, message: "Jamoa a'zosi topilmadi" });
      }
      res.json({ success: true, data: member });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Jamoa a'zosini yangilashda xatolik",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.delete("/api/team/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.isAdmin) {
        return res.status(403).json({ success: false, message: "Kirish taqiqlangan" });
      }
      const deleted = await storage.deleteTeamMember(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Jamoa a'zosi topilmadi" });
      }
      res.json({ success: true, message: "Jamoa a'zosi o'chirildi" });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Jamoa a'zosini o'chirishda xatolik",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Serve uploaded files natively from public folder
  app.use('/uploads', express.static(path.resolve(process.cwd(), 'client/public/uploads')));

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
