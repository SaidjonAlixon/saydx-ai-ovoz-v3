import { 
  type Lead, 
  type InsertLead, 
  type Service, 
  type InsertService,
  type Portfolio, 
  type InsertPortfolio,
  type Article, 
  type InsertArticle 
} from "@shared/schema";
import { randomUUID } from "crypto";
// import { SQLiteStorage } from "./sqliteStorage";
// import { initializeDatabase } from "./database";

export interface IStorage {
  // Lead management
  createLead(lead: InsertLead): Promise<Lead>;
  getLead(id: string): Promise<Lead | undefined>;
  getLeads(): Promise<Lead[]>;
  updateLeadStatus(id: string, status: string): Promise<Lead | undefined>;

  // Service management
  createService(service: InsertService): Promise<Service>;
  getService(slug: string): Promise<Service | undefined>;
  getServices(): Promise<Service[]>;
  getActiveServices(): Promise<Service[]>;

  // Portfolio management
  createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio>;
  getPortfolio(id: string): Promise<Portfolio | undefined>;
  getPortfolios(): Promise<Portfolio[]>;
  getPublicPortfolios(): Promise<Portfolio[]>;

  // Article management
  createArticle(article: InsertArticle): Promise<Article>;
  getArticle(slug: string): Promise<Article | undefined>;
  getArticles(): Promise<Article[]>;
  getPublishedArticles(): Promise<Article[]>;
  incrementArticleViews(slug: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private leads: Map<string, Lead> = new Map();
  private services: Map<string, Service> = new Map();
  private portfolios: Map<string, Portfolio> = new Map();
  private articles: Map<string, Article> = new Map();

  constructor() {
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Initialize with sample services
    const defaultServices: Service[] = [
      {
        id: randomUUID(),
        name: "Telegram Bot",
        slug: "telegram-bot", 
        shortDescription: "Biznesingiz uchun maxsus Telegram bot yaratamiz",
        fullDescription: "Biznesingizni avtomatlashtirish va mijozlar bilan samarali muloqot qilish uchun professional Telegram bot yaratamiz. Bot orqali buyurtmalar qabul qilish, to'lovlarni amalga oshirish, mijozlar bazasini boshqarish va 24/7 mijozlarga xizmat ko'rsatish mumkin. Botda admin panel, statistika, avtomatik javoblar, fayl yuklash, geolokatsiya va boshqa zamonaviy imkoniyatlar mavjud. Restoran, do'kon, xizmat ko'rsatish, ta'lim va boshqa sohalar uchun moslashtirilgan yechimlar.",
        category: "Avtomatlashtirish",
        basePrice: 100,
        duration: "5-7 kun",
        rating: "4.8",
        features: ["Buyurtma qabul qilish", "To'lov integratsiyasi", "Admin panel", "Mijozlar bazasi", "Avtomatik javoblar", "Statistika va hisobotlar", "Fayl yuklash", "Geolokatsiya", "24/7 ishlash"],
        calculatorParams: null,
        isActive: "true",
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        name: "Veb-sayt",
        slug: "veb-sayt",
        shortDescription: "Zamonaviy, tezkor va SEO optimallashtirilgan veb-sayt",
        fullDescription: "Biznesingiz uchun professional veb-sayt yaratamiz. Zamonaviy texnologiyalar (React, Next.js, Node.js) yordamida tezkor, xavfsiz va SEO optimallashtirilgan saytlar. Mobil qurilmalarga to'liq moslashgan responsive dizayn, admin panel, ma'lumotlar bazasi, to'lov tizimi integratsiyasi va Google Analytics bilan kengaytirilgan funksionallik. Korporativ saytlar, onlayn do'konlar, bloglar, portfolio saytlar va boshqa turdagi loyihalar uchun maxsus yechimlar.",
        category: "Veb-dasturlash",
        basePrice: 300,
        duration: "7-14 kun", 
        rating: "4.9",
        features: ["Responsive dizayn", "SEO optimizatsiya", "CMS tizimi", "Analitika", "Admin panel", "Ma'lumotlar bazasi", "To'lov integratsiyasi", "SSL sertifikat", "Tezkor yuklanish", "Mobil optimizatsiya"],
        calculatorParams: null,
        isActive: "true",
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        name: "Sheets Avtomatlashtirish",
        slug: "sheets-avtomatlashtirish",
        shortDescription: "Google Sheets integratsiyasi va avtomatlashtirish",
        fullDescription: "Google Sheets asosida biznes jarayonlaringizni avtomatlashtirish va hisobotlarni tizimlashtirish. Ma'lumotlarni avtomatik to'ldirish, hisobotlar yaratish, ma'lumotlar bazasi bilan sinxronizatsiya qilish va API orqali boshqa tizimlar bilan bog'lash. Moliyaviy hisobotlar, inventarizatsiya, mijozlar bazasi, sotish statistikasi va boshqa biznes jarayonlarni avtomatlashtirish. Excel va Google Sheets orasida ma'lumotlar almashinuvi, avtomatik hisoblash formulalari va vizualizatsiya yaratish.",
        category: "Avtomatlashtirish",
        basePrice: 100,
        duration: "3-5 kun",
        rating: "4.7",
        features: ["Google Sheets integratsiyasi", "Avtomatik hisobotlar", "Ma'lumotlar sinxronizatsiyasi", "API integratsiya", "Excel bilan bog'lanish", "Avtomatik hisoblash", "Vizualizatsiya", "Ma'lumotlar filtratsiyasi", "E-mail hisobotlar", "Real-time yangilanish"],
        calculatorParams: null,
        isActive: "true",
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        name: "UI/UX Dizayn",
        slug: "ui-ux-dizayn",
        shortDescription: "Zamonaviy va foydalanuvchiga qulay dizayn",
        fullDescription: "Mobil ilova, veb-sayt va boshqa digital mahsulotlar uchun professional UI/UX dizayn xizmatlari. Foydalanuvchi tajribasini (UX) tadqiq qilish, interfeys dizayni (UI) yaratish, prototiplashtirish va brending. Figma, Adobe XD, Sketch kabi professional vositalar yordamida zamonaviy, intuitiv va estetik jihatdan jozibali dizaynlar. Mobil ilovalar, veb-saytlar, admin panellar, dashboardlar va boshqa interfeyslar uchun maxsus yechimlar. Foydalanuvchi testlari, A/B testing va dizayn optimizatsiyasi ham kiritilgan.",
        category: "Dizayn",
        basePrice: 250,
        duration: "5-7 kun",
        rating: "4.9",
        features: ["UI/UX dizayn", "Prototiplashtirish", "Brending", "Mobil va veb dizayn", "Foydalanuvchi tadqiqi", "Wireframing", "Visual design", "Design system", "Figma/Adobe XD", "A/B testing"],
        calculatorParams: null,
        isActive: "true",
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        name: "Mini-ilova",
        slug: "mini-ilova",
        shortDescription: "Telegram va boshqa platformalar uchun mini-ilovalar",
        fullDescription: "Telegram Mini Apps, WeChat mini programs va boshqa platformalar uchun interaktiv mini-ilovalar yaratish. Telegram bot bilan integratsiya qilingan, to'liq funksional mini-ilovalar. Onlayn do'konlar, o'yinlar, kalkulyatorlar, hisobotlar va boshqa biznes yechimlari uchun maxsus ilovalar. React, Vue.js yoki vanilla JavaScript texnologiyalari yordamida tezkor va optimallashtirilgan ilovalar. To'lov tizimi, geolokatsiya, kamera, fayl yuklash va boshqa mobil imkoniyatlar bilan kengaytirilgan funksionallik.",
        category: "Mobil dasturlash",
        basePrice: 400,
        duration: "7-10 kun",
        rating: "4.8",
        features: ["Telegram Mini App", "Web App", "Payment integratsiya", "Backend tizim", "Bot integratsiyasi", "Geolokatsiya", "Kamera va fayllar", "Push notifications", "Offline rejim", "Analitika"],
        calculatorParams: null,
        isActive: "true",
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        name: "Telegram Target",
        slug: "telegram-target",
        shortDescription: "Telegram kanallarida samarali target reklama kampaniyalari",
        fullDescription: "Telegram kanallarida professional target reklama xizmatlari. Maqsadli auditoriyani aniqlash, reklama postlarini yaratish va optimallashtirish, kanallar orasida reklama tarqatish va natijalarni tahlil qilish. Kreativ postlar, video reklamalar, carousel postlar va boshqa formatlarda samarali reklamalar. Doimiy monitoring, hisobotlar va kampaniyalarni optimallashtirish. Mahalliy va global auditoriyalar uchun maxsus strategiyalar va yondashuvlar. Telegram kanallar ro'yxati, reklama joylashtirish va natijalarni kuzatish.",
        category: "Marketing",
        basePrice: 200,
        duration: "Doimiy",
        rating: "4.7",
        features: ["Maqsadli auditoriya tahlili", "Reklama kampaniyasi", "A/B testing", "Hisobotlar va tahlil", "Kreativ postlar", "Video reklamalar", "ROI optimizatsiya", "Doimiy monitoring", "Telegram kanallar ro'yxati", "Reklama joylashtirish", "Natijalarni kuzatish"],
        calculatorParams: null,
        isActive: "true",
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        name: "Mobil ilovalar",
        slug: "mobil-ilovalar",
        shortDescription: "Android va iOS uchun native mobil ilovalar",
        fullDescription: "React Native, Flutter yoki native texnologiyalar (Swift, Kotlin) yordamida professional mobil ilovalar yaratish. Android va iOS platformalarida to'liq funksional, tezkor va optimallashtirilgan ilovalar. Onlayn do'konlar, biznes ilovalari, o'yinlar, ijtimoiy tarmoqlar va boshqa turdagi loyihalar uchun maxsus yechimlar. Push notifications, geolokatsiya, kamera, fayl yuklash, to'lov tizimi va boshqa mobil imkoniyatlar bilan kengaytirilgan funksionallik. App Store va Google Play do'konlarida joylashtirish ham kiritilgan.",
        category: "Mobil dasturlash",
        basePrice: 1500,
        duration: "21-30 kun",
        rating: "4.9",
        features: ["Android va iOS", "Native performance", "Push notifications", "Offline rejim", "Geolokatsiya", "Kamera va fayllar", "To'lov integratsiyasi", "Biometrik autentifikatsiya", "Real-time chat", "Cloud sync", "App Store joylashtirish"],
        calculatorParams: null,
        isActive: "true",
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        name: "Avtomatlashtirilgan AyTi xizmatlar",
        slug: "avtomatlashtirilgan-it-xizmatlar",
        shortDescription: "Biznes jarayonlarini to'liq avtomatlashtirish",
        fullDescription: "CRM, ERP, HRM va boshqa biznes tizimlarini integratsiya qilish, avtomatlashtirilgan hisobotlar va monitoring tizimlari yaratish. Mijozlar bilan muloqot, buyurtmalar boshqaruvi, inventarizatsiya, moliyaviy hisobotlar va boshqa biznes jarayonlarni to'liq avtomatlashtirish. API integratsiyasi, ma'lumotlar sinxronizatsiyasi, avtomatik bildirishnomalar va real-time monitoring. Salesforce, HubSpot, 1C, SAP va boshqa tizimlar bilan ishlash. Workflow automation va business process optimization.",
        category: "Avtomatlashtirish",
        basePrice: 800,
        duration: "14-21 kun",
        rating: "4.8",
        features: ["Jarayonlarni avtomatlashtirish", "Tizimlarni integratsiya", "Hisobotlar", "Monitoring", "CRM/ERP integratsiya", "API development", "Workflow automation", "Real-time notifications", "Data synchronization", "Business intelligence", "Custom dashboards"],
        calculatorParams: null,
        isActive: "true",
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        name: "Mijoz talabi asosida",
        slug: "mijoz-talabi-asosida",
        shortDescription: "Sizning individual talabingiz bo'yicha xizmat",
        fullDescription: "Maxsus loyihalar uchun individual yechimlar va texnik yechimlar. Talablaringizni batafsil muhokama qilib, eng mos va samarali yechimni topamiz. Mavjud bo'lmagan xizmatlar, noyob loyihalar, murakkab texnik yechimlar va boshqa maxsus talablar uchun professional xizmat. Loyiha boshidan oxirigacha to'liq qo'llab-quvvatlash, texnik konsultatsiya, dizayn va dasturlash. Blockchain, AI/ML, IoT, AR/VR va boshqa zamonaviy texnologiyalar bilan ishlash. Startap loyihalar, enterprise yechimlar va boshqa murakkab tizimlar uchun maxsus yondashuv.",
        category: "Maxsus xizmatlar",
        basePrice: 300,
        duration: "Kelishilgan holda",
        rating: "4.9",
        features: ["Individual yondashuv", "Konsultatsiya", "Texnik tahlil", "Kengaytirilgan qo'llab-quvvatlash", "Maxsus loyihalar", "Blockchain/AI/ML", "IoT va AR/VR", "Startap yechimlar", "Enterprise tizimlar", "To'liq loyiha boshqaruvi", "Texnik hujjatlar"],
        calculatorParams: null,
        isActive: "true",
        createdAt: new Date()
      }
    ];

    defaultServices.forEach(service => {
      this.services.set(service.slug, service);
    });
  }

  // Lead methods
  async createLead(insertLead: InsertLead): Promise<Lead> {
    const id = randomUUID();
    const lead: Lead = { 
      ...insertLead,
      telegram: insertLead.telegram || null,
      email: insertLead.email || null,
      budget: insertLead.budget || null,
      timeline: insertLead.timeline || null,
      description: insertLead.description || null,
      fileUrl: insertLead.fileUrl || null,
      source: insertLead.source || "website",
      id, 
      createdAt: new Date(),
      status: "new"
    };
    this.leads.set(id, lead);
    return lead;
  }

  async getLead(id: string): Promise<Lead | undefined> {
    return this.leads.get(id);
  }

  async getLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values());
  }

  async updateLeadStatus(id: string, status: string): Promise<Lead | undefined> {
    const lead = this.leads.get(id);
    if (lead) {
      lead.status = status;
      this.leads.set(id, lead);
    }
    return lead;
  }

  // Service methods
  async createService(insertService: InsertService): Promise<Service> {
    const id = randomUUID();
    const service: Service = { 
      ...insertService,
      rating: insertService.rating || "4.8",
      calculatorParams: insertService.calculatorParams || null,
      isActive: insertService.isActive || "true",
      id, 
      createdAt: new Date()
    };
    this.services.set(service.slug, service);
    return service;
  }

  async getService(slug: string): Promise<Service | undefined> {
    return this.services.get(slug);
  }

  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }

  async getActiveServices(): Promise<Service[]> {
    const allServices = Array.from(this.services.values());
    return allServices.filter(s => s.isActive === "true");
  }

  // Portfolio methods
  async createPortfolio(insertPortfolio: InsertPortfolio): Promise<Portfolio> {
    const id = randomUUID();
    const portfolio: Portfolio = { 
      ...insertPortfolio,
      problemStatement: insertPortfolio.problemStatement || null,
      solution: insertPortfolio.solution || null,
      results: insertPortfolio.results || null,
      images: insertPortfolio.images || null,
      duration: insertPortfolio.duration || null,
      clientName: insertPortfolio.clientName || null,
      isPublic: insertPortfolio.isPublic || "true",
      id, 
      createdAt: new Date()
    };
    this.portfolios.set(id, portfolio);
    return portfolio;
  }

  async getPortfolio(id: string): Promise<Portfolio | undefined> {
    return this.portfolios.get(id);
  }

  async getPortfolios(): Promise<Portfolio[]> {
    return Array.from(this.portfolios.values());
  }

  async getPublicPortfolios(): Promise<Portfolio[]> {
    return Array.from(this.portfolios.values()).filter(p => p.isPublic === "true");
  }

  // Article methods
  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = randomUUID();
    const article: Article = { 
      ...insertArticle,
      author: insertArticle.author || "SAYD.X Team",
      readTime: insertArticle.readTime || null,
      tags: insertArticle.tags || null,
      imageUrl: insertArticle.imageUrl || null,
      isPublished: insertArticle.isPublished || "true",
      id, 
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.articles.set(article.slug, article);
    return article;
  }

  async getArticle(slug: string): Promise<Article | undefined> {
    return this.articles.get(slug);
  }

  async getArticles(): Promise<Article[]> {
    return Array.from(this.articles.values());
  }

  async getPublishedArticles(): Promise<Article[]> {
    return Array.from(this.articles.values()).filter(a => a.isPublished === "true");
  }

  async incrementArticleViews(slug: string): Promise<void> {
    const article = this.articles.get(slug);
    if (article) {
      article.views = (article.views || 0) + 1;
      this.articles.set(slug, article);
    }
  }
}

// Hozircha faqat MemStorage ishlatamiz - Vercel'da SQLite muammosi bor
let storage: IStorage;

// Hozircha barcha joyda MemStorage ishlatamiz
storage = new MemStorage();

export { storage };
