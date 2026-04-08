import {
  type Lead,
  type InsertLead,
  type Service,
  type InsertService,
  type Portfolio,
  type InsertPortfolio,
  type Article,
  type InsertArticle,
  type Faq,
  type InsertFaq,
  type User,
  type InsertUser,
  type Question,
  type InsertQuestion,
  type TeamMember,
  type InsertTeamMember,
} from "@shared/schema";
import { randomUUID } from "crypto";
// import { SQLiteStorage } from "./sqliteStorage";
// import { initializeDatabase } from "./database";

import session from "express-session";
import MemoryStoreFactory from "memorystore";

import fs from "fs";
import path from "path";

const MemoryStore = MemoryStoreFactory(session);
const DATA_FILE = path.resolve(process.cwd(), "data.json");

export interface IStorage {
  sessionStore: session.Store;
  // Lead management
  createLead(lead: InsertLead): Promise<Lead>;
  getLead(id: string): Promise<Lead | undefined>;
  getLeads(): Promise<Lead[]>;
  getLeadsByIds(ids: string[]): Promise<Lead[]>;
  updateLeadStatus(id: string, status: string): Promise<Lead | undefined>;
  updateLeadReply(id: string, reply: string): Promise<Lead | undefined>;
  deleteLead(id: string): Promise<boolean>;

  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Service management
  createService(service: InsertService): Promise<Service>;
  getService(slug: string): Promise<Service | undefined>;
  getServices(): Promise<Service[]>;
  getActiveServices(): Promise<Service[]>;
  updateService(slug: string, service: Partial<Service>): Promise<Service | undefined>;

  // Portfolio management
  createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio>;
  getPortfolio(id: string): Promise<Portfolio | undefined>;
  getPortfolios(): Promise<Portfolio[]>;
  getPublicPortfolios(): Promise<Portfolio[]>;
  updatePortfolio(id: string, portfolio: Partial<Portfolio>): Promise<Portfolio | undefined>;

  // Article management
  createArticle(article: InsertArticle): Promise<Article>;
  getArticle(slug: string): Promise<Article | undefined>;
  getArticles(): Promise<Article[]>;
  getPublishedArticles(): Promise<Article[]>;
  updateArticle(slug: string, article: Partial<Article>): Promise<Article | undefined>;
  deleteArticle(slug: string): Promise<boolean>;
  incrementArticleViews(slug: string): Promise<void>;

  // FAQ management
  getFaqs(): Promise<Faq[]>;
  getActiveFaqs(): Promise<Faq[]>;
  createFaq(faq: InsertFaq): Promise<Faq>;
  updateFaq(id: string, faq: Partial<Faq>): Promise<Faq | undefined>;
  deleteFaq(id: string): Promise<boolean>;

  // Questions management
  getQuestions(): Promise<Question[]>;
  getPublicQuestions(): Promise<Question[]>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  updateQuestionReply(id: string, reply: string): Promise<Question | undefined>;
  getQuestionsByIds(ids: string[]): Promise<Question[]>;
  deleteQuestion(id: string): Promise<boolean>;

  // Team management
  getTeamMembers(): Promise<TeamMember[]>;
  getActiveTeamMembers(): Promise<TeamMember[]>;
  getMainTeamMember(): Promise<TeamMember | undefined>;
  createTeamMember(member: InsertTeamMember): Promise<TeamMember>;
  updateTeamMember(id: string, member: Partial<TeamMember>): Promise<TeamMember | undefined>;
  deleteTeamMember(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private leads: Map<string, Lead> = new Map();
  private services: Map<string, Service> = new Map();
  private portfolios: Map<string, Portfolio> = new Map();
  private articles: Map<string, Article> = new Map();
  private faqs: Map<string, Faq> = new Map();
  private questions: Map<string, Question> = new Map();
  private teamMembers: Map<string, TeamMember> = new Map();
  private users: Map<number, User> = new Map();
  private currentUserId: number = 1;
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    this.loadFromDisk();
    // Only initialize if we have no data
    if (this.services.size === 0) {
      this.initializeDefaultData();
      this.saveToDisk();
    }
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));

        if (data.leads) data.leads.forEach(([id, val]: any) => this.leads.set(id, { ...val, createdAt: new Date(val.createdAt) }));
        if (data.services) data.services.forEach(([id, val]: any) => this.services.set(id, { ...val, createdAt: new Date(val.createdAt) }));
        if (data.portfolios) {
          data.portfolios.forEach(([id, val]: any) => {
            this.portfolios.set(id, {
              ...val,
              createdAt: new Date(val.createdAt),
            })
          });
        }
        if (data.articles) data.articles.forEach(([id, val]: any) => this.articles.set(id, { ...val, createdAt: new Date(val.createdAt), updatedAt: new Date(val.updatedAt) }));
        if (data.faqs) data.faqs.forEach(([id, val]: any) => this.faqs.set(id, { ...val, createdAt: new Date(val.createdAt) }));
        if (data.questions) data.questions.forEach(([id, val]: any) => this.questions.set(id, { ...val, createdAt: new Date(val.createdAt) }));
        if (data.teamMembers) data.teamMembers.forEach(([id, val]: any) => this.teamMembers.set(id, { ...val, createdAt: new Date(val.createdAt) }));
        if (data.users) data.users.forEach(([id, val]: any) => this.users.set(id, val));
        if (data.currentUserId) this.currentUserId = data.currentUserId;
      }
    } catch (error) {
      console.error("Error loading from disk:", error);
    }
  }

  private saveToDisk() {
    try {
      const data = {
        leads: Array.from(this.leads.entries()),
        services: Array.from(this.services.entries()),
        portfolios: Array.from(this.portfolios.entries()),
        articles: Array.from(this.articles.entries()),
        faqs: Array.from(this.faqs.entries()),
        questions: Array.from(this.questions.entries()),
        teamMembers: Array.from(this.teamMembers.entries()),
        users: Array.from(this.users.entries()),
        currentUserId: this.currentUserId
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error saving to disk:", error);
    }
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
        features: JSON.stringify(["Buyurtma qabul qilish", "To'lov integratsiyasi", "Admin panel", "Mijozlar bazasi", "Avtomatik javoblar", "Statistika va hisobotlar", "Fayl yuklash", "Geolokatsiya", "24/7 ishlash"]),
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
        features: JSON.stringify(["Responsive dizayn", "SEO optimizatsiya", "CMS tizimi", "Analitika", "Admin panel", "Ma'lumotlar bazasi", "To'lov integratsiyasi", "SSL sertifikat", "Tezkor yuklanish", "Mobil optimizatsiya"]),
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
        features: JSON.stringify(["Google Sheets integratsiyasi", "Avtomatik hisobotlar", "Ma'lumotlar sinxronizatsiyasi", "API integratsiya", "Excel bilan bog'lanish", "Avtomatik hisoblash", "Vizualizatsiya", "Ma'lumotlar filtratsiyasi", "E-mail hisobotlar", "Real-time yangilanish"]),
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
        features: JSON.stringify(["UI/UX dizayn", "Prototiplashtirish", "Brending", "Mobil va veb dizayn", "Foydalanuvchi tadqiqi", "Wireframing", "Visual design", "Design system", "Figma/Adobe XD", "A/B testing"]),
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
        features: JSON.stringify(["Telegram Mini App", "Web App", "Payment integratsiya", "Backend tizim", "Bot integratsiyasi", "Geolokatsiya", "Kamera va fayllar", "Push notifications", "Offline rejim", "Analitika"]),
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
        features: JSON.stringify(["Maqsadli auditoriya tahlili", "Reklama kampaniyasi", "A/B testing", "Hisobotlar va tahlil", "Kreativ postlar", "Video reklamalar", "ROI optimizatsiya", "Doimiy monitoring", "Telegram kanallar ro'yxati", "Reklama joylashtirish", "Natijalarni kuzatish"]),
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
        features: JSON.stringify(["Android va iOS", "Native performance", "Push notifications", "Offline rejim", "Geolokatsiya", "Kamera va fayllar", "To'lov integratsiyasi", "Biometrik autentifikatsiya", "Real-time chat", "Cloud sync", "App Store joylashtirish"]),
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
        features: JSON.stringify(["Jarayonlarni avtomatlashtirish", "Tizimlarni integratsiya", "Hisobotlar", "Monitoring", "CRM/ERP integratsiya", "API development", "Workflow automation", "Real-time notifications", "Data synchronization", "Business intelligence", "Custom dashboards"]),
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
        features: JSON.stringify(["Individual yondashuv", "Konsultatsiya", "Texnik tahlil", "Kengaytirilgan qo'llab-quvvatlash", "Maxsus loyihalar", "Blockchain/AI/ML", "IoT va AR/VR", "Startap yechimlar", "Enterprise tizimlar", "To'liq loyiha boshqaruvi", "Texnik hujjatlar"]),
        calculatorParams: null,
        isActive: "true",
        createdAt: new Date()
      }
    ];

    defaultServices.forEach(service => {
      this.services.set(service.slug, service);
    });

    const defaultPortfolios: Portfolio[] = [
      {
        id: randomUUID(),
        title: "Uzum Nazorat",
        description: "Uzum Nazorat Bot — do'koningizdagi buyurtmalar, mahsulotlar va moliyaviy hisobotlarni Telegram orqali boshqarish imkonini beruvchi qulay vosita. Bot yordamida barcha jarayonlarni real vaqt rejimida kuzatish va nazorat qilish mumkin. FBS buyurtmalar, statistika, moliyaviy hisobot, mahsulotlar boshqaruvi va ko'p til qo'llab-quvvatlash imkoniyatlari bilan.",
        category: "Telegram Bot",
        technologies: JSON.stringify(["Node.js", "Telegram API", "PostgreSQL", "Uzum API", "FBS Integration", "Click/Payme", "Multi-language"]),
        results: JSON.stringify([
          { metric: "Savdo hajmi", value: "+250%", iconType: "TrendingUp" },
          { metric: "Do'konlar", value: "5+", iconType: "Users" }
        ]),
        images: JSON.stringify(["uzum_nazorat_bot.png"]),
        duration: "10 kun",
        clientName: "Uzum Sotuvchilari",
        problemStatement: null,
        solution: null,
        isPublic: "true",
        link: null,
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        title: "Panteleymon sayti",
        description: "Panteleymon — Cherkov uchun xorijdan xayriya va donatlarni qulay qabul qilishga mo'ljallangan zamonaviy onlayn platforma. Sayt barcha mashhur xalqaro to'lov tizimlarini qo'llab-quvvatlaydi, xavfsiz va tezkor ishlaydi.",
        category: "Veb-sayt",
        technologies: JSON.stringify(["React", "Node.js", "MongoDB", "PayPal", "Stripe", "Visa", "Mastercard"]),
        results: JSON.stringify([
          { metric: "Xayriya miqdori", value: "+200%", iconType: "TrendingUp" },
          { metric: "Donorlar", value: "500+", iconType: "Users" }
        ]),
        images: JSON.stringify(["Panteleymon.png"]),
        duration: "14 kun",
        clientName: "Panteleymon Cherkovi",
        problemStatement: null,
        solution: null,
        isPublic: "true",
        link: null,
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        title: "CRM tizimi",
        description: "Mijozlar bilan ishlash va savdoni boshqarish uchun maxsus CRM dasturi.",
        category: "Avtomatlashtirish",
        technologies: JSON.stringify(["Vue.js", "Laravel", "MySQL", "Redis"]),
        results: JSON.stringify([
          { metric: "Samaradorlik", value: "+300%", iconType: "TrendingUp" },
          { metric: "Xodimlar", value: "50+", iconType: "Users" }
        ]),
        images: JSON.stringify(["Mobile_app_interface_mockup_5376ed7a.png"]),
        duration: "21 kun",
        clientName: "Savdo korxonasi",
        problemStatement: null,
        solution: null,
        isPublic: "true",
        link: null,
        createdAt: new Date()
      }
    ];

    defaultPortfolios.forEach(portfolio => {
      this.portfolios.set(portfolio.id, portfolio);
    });

    const defaultArticles: Article[] = [
      {
        id: randomUUID(),
        title: "2025-yilda biznes uchun eng muhim tehnologiya trendlari",
        slug: "2025-tech-trends",
        excerpt: "Yangi yilda biznes jarayonlarini avtomatlashtirish va raqamlashtirish bo'yicha eng so'nggi tendentsiyalar.",
        content: "Matn bu yerda bo'ladi...",
        category: "Tehnologiya",
        readTime: "5",
        views: 142,
        imageUrl: "Modern_tech_workspace_hero_c9c8682e.png",
        tags: JSON.stringify(["Texnologiya", "Trendlar", "2025"]),
        author: "SAYD.X Team",
        isPublished: "true",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        title: "Telegram bot orqali biznesni qanday kengaytirish mumkin",
        slug: "telegram-bot-biznes",
        excerpt: "Real misollar va strategiyalar asosida telegram botlarning biznes uchun afzalliklari.",
        content: "Matn bu yerda bo'ladi...",
        category: "Marketing",
        readTime: "7",
        views: 89,
        imageUrl: "Mobile_app_interface_mockup_5376ed7a.png",
        tags: JSON.stringify(["Telegram", "Bot", "Biznes"]),
        author: "SAYD.X Team",
        isPublished: "true",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        title: "Veb-sayt yaratishda eng ko'p uchraydigan xatolar",
        slug: "veb-sayt-xatolari",
        excerpt: "Professional veb-sayt yaratishda oldini olish kerak bo'lgan asosiy muammolar va yechimlar.",
        content: "Matn bu yerda bo'ladi...",
        category: "Veb-dasturlash",
        readTime: "4",
        views: 234,
        imageUrl: "Modern_tech_workspace_hero_c9c8682e.png",
        tags: JSON.stringify(["Veb", "Xatolar", "Dasturlash"]),
        author: "SAYD.X Team",
        isPublished: "true",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    defaultArticles.forEach(article => {
      this.articles.set(article.slug, article);
    });

    const defaultFaqs: Faq[] = [
      {
        id: randomUUID(),
        question: "Loyiha uchun shartnoma tuziladimi?",
        answer: "Ha, albatta! Har bir loyiha uchun rasmiy shartnoma tuziladi. Shartnomada loyiha hajmi, muddati, to'lov shartlari va javobgarlik masalalari aniq belgilab qo'yiladi. Bu esa har ikki tomon uchun ham ishonch va xavfsizlikni ta'minlaydi.",
        order: 1,
        isActive: "true",
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        question: "To'lov qanday amalga oshiriladi?",
        answer: "Loyiha boshlashdan oldin 50% oldindan to'lov qilinadi. Qolgan 50% loyiha to'liq yakunlangandan va mijoz tomonidan qabul qilingandan keyin to'lanadi. To'lov Click, Payme, bank o'tkazmasi yoki naqd shaklida amalga oshirilishi mumkin.",
        order: 2,
        isActive: "true",
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        question: "Loyiha qancha vaqtda tayyorlanadi?",
        answer: "Boshlang'ich va o'rtacha murakkablikdagi loyihalar odatda 7–12 ish kuni ichida tayyorlanadi. Murakkabroq va keng funksionallikka ega loyihalar esa 3–4 hafta yoki undan ko'proq vaqt talab qilishi mumkin. Aniq muddat texnik topshiriq (TZ) ishlab chiqilib, loyiha hajmi va talablar to'liq belgilab olingandan so'ng belgilanadi.",
        order: 3,
        isActive: "true",
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        question: "Texnik qo'llab-quvvatlash bo'ladimi?",
        answer: "Ha, loyiha topshirilgandan so'ng 1 oy davomida bepul texnik qo'llab-quvvatlash taqdim etiladi. Bu davrda xatolarni tuzatish, kichik o'zgarishlar kiritish va maslahatlar berish bepul amalga oshiriladi. Keyinchalik, istasangiz, oylik texnik qo'llab-quvvatlash xizmatini davom ettirishingiz mumkin.",
        order: 4,
        isActive: "true",
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        question: "Loyihani o'zimning serverimga joylashtirish mumkinmi?",
        answer: "Albatta! Loyihani o'zingizning serveringizga, hosting provayderingizga yoki cloud platformangizga (AWS, Google Cloud, DigitalOcean va h.k.) joylashtirishimiz mumkin. Shuningdek, kerak bo'lsa, hosting tanlash va sozlashda yordam beramiz.",
        order: 5,
        isActive: "true",
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        question: "Loyiha kodlari menga beriladimi?",
        answer: "Ha, loyiha uchun to'lov to'liq amalga oshirilgandan so'ng barcha manba kodlari sizga topshiriladi. Shundan keyin siz kodlarning to'liq huquqiy egasiga aylanasiz va ularni xohlagancha o'zgartirish, kengaytirish yoki boshqa tizimlarga integratsiya qilish imkoniyatiga ega bo'lasiz.",
        order: 6,
        isActive: "true",
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        question: "Dizayn xizmati ham kiritilganmi?",
        answer: "Ha, asosiy paketda UI/UX dizayn xizmati ham kiritilgan. Agar maxsus brending, logo dizayni yoki kengaytirilgan dizayn kerak bo'lsa, alohida UI/UX dizayn xizmatidan foydalanishingiz mumkin.",
        order: 7,
        isActive: "true",
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        question: "Mobil versiya ham bo'ladimi?",
        answer: "Barcha veb-saytlar va ilovalar mobil qurilmalarga to'liq moslashtirilgan (responsive) qilib yaratiladi. Alohida native mobil ilova kerak bo'lsa, 'Mobil ilovalar' xizmatidan foydalaning.",
        order: 8,
        isActive: "true",
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        question: "Qanday texnologiyalardan foydalanasiz?",
        answer: "Biz loyihalarda zamonaviy, ishonchli va tezkor texnologiyalardan foydalanamiz. Frontendda React, Next.js, Vue.js; Backendda Node.js, Python (Django/FastAPI), Go yoki PHP (Laravel); Ma'lumotlar bazasida PostgreSQL, MySQL yoki MongoDB ishlatamiz. Shuningdek, Telegram Bot API, OpenAI va turli to'lov tizimlari (Click, Payme, Stripe) bilan integratsiya qila olamiz.",
        order: 9,
        isActive: "true",
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        question: "Loyihaga keyinchalik o'zgartirish kiritish bepulmi?",
        answer: "Topshirilgan loyihaga kichik tuzatishlar bepul bo'ladi. Biroq, dastlabki texnik topshiriqda bo'lmagan yangi funksiyalar yoki katta o'zgarishlar qo'shimcha kelishuv asosida amalga oshiriladi.",
        order: 10,
        isActive: "true",
        createdAt: new Date()
      }
    ];

    defaultFaqs.forEach(faq => {
      this.faqs.set(faq.id, faq);
    });

    const defaultTeamMembers: TeamMember[] = [
      {
        id: randomUUID(),
        name: "Azizbek",
        role: "Asoschi va Boshqarivchi",
        bio: "Raqamli olam va loyihalar avtomatlashtirish bo'yicha kuchli tajribaga ega rahbar. Barcha mijozlarga eng innovatsion va qulay yechimlarni taqdim etishni maqsad qilgan.",
        imageUrl: "",
        isMain: "true",
        order: 0,
        isActive: "true",
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        name: "Ibrohim",
        role: "Backend Dasturchi",
        bio: "Murakkab API lar va ishonchli tizim arxitekturasini qura oladigan mutaxassis.",
        imageUrl: "",
        isMain: "false",
        order: 1,
        isActive: "true",
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        name: "Samiya",
        role: "UI/UX Dizayner",
        bio: "Foydalanuvchilarni e'tiborini tortuvchi va ishlatishga qulay premium interfeyslar yaratuvchi dizayner.",
        imageUrl: "",
        isMain: "false",
        order: 2,
        isActive: "true",
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        name: "Shohruh",
        role: "Mobil Ilovalar",
        bio: "iOS va Android tizimlariga mos, sifatli mobil ilovalar yaratadigan Flutter/React Native ustasi.",
        imageUrl: "",
        isMain: "false",
        order: 3,
        isActive: "true",
        createdAt: new Date()
      }
    ];

    defaultTeamMembers.forEach(member => {
      this.teamMembers.set(member.id, member);
    });

    // Create a default admin user
    const adminUser: User = {
      id: this.currentUserId++,
      username: "admin",
      password: "password123", // Real projectda hash qilinishi kerak
      isAdmin: true as boolean,
    };
    this.users.set(adminUser.id, adminUser);
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
      telegramChatId: insertLead.telegramChatId || null,
      source: insertLead.source || "website",
      id,
      createdAt: new Date(),
      status: "new",
      adminReply: null
    };
    this.leads.set(id, lead);
    this.saveToDisk();
    return lead;
  }

  async getLead(id: string): Promise<Lead | undefined> {
    return this.leads.get(id);
  }

  async getLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values());
  }

  async getLeadsByIds(ids: string[]): Promise<Lead[]> {
    return Array.from(this.leads.values()).filter(l => ids.includes(l.id));
  }

  async updateLeadStatus(id: string, status: string): Promise<Lead | undefined> {
    const lead = this.leads.get(id);
    if (!lead) return undefined;
    const updated = { ...lead, status };
    this.leads.set(id, updated);
    this.saveToDisk();
    return updated;
  }

  async updateLeadReply(id: string, reply: string): Promise<Lead | undefined> {
    const lead = this.leads.get(id);
    if (!lead) return undefined;
    const updated = { ...lead, adminReply: reply };
    this.leads.set(id, updated);
    this.saveToDisk();
    return updated;
  }

  async deleteLead(id: string): Promise<boolean> {
    const deleted = this.leads.delete(id);
    if (deleted) this.saveToDisk();
    return deleted;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, isAdmin: insertUser.isAdmin ?? false };
    this.users.set(id, user);
    return user;
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
    this.saveToDisk();
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

  async updateService(slug: string, update: Partial<Service>): Promise<Service | undefined> {
    const service = this.services.get(slug);
    if (service) {
      const updated = { ...service, ...update };
      this.services.set(slug, updated);
      this.saveToDisk();
      return updated;
    }
    return undefined;
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
      link: insertPortfolio.link || null,
      id,
      createdAt: new Date()
    };
    this.portfolios.set(id, portfolio);
    this.saveToDisk();
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

  async updatePortfolio(id: string, update: Partial<Portfolio>): Promise<Portfolio | undefined> {
    const item = this.portfolios.get(id);
    if (item) {
      const updated = { ...item, ...update };
      this.portfolios.set(id, updated);
      this.saveToDisk();
      return updated;
    }
    return undefined;
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
    this.saveToDisk();
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

  async updateArticle(slug: string, update: Partial<Article>): Promise<Article | undefined> {
    const article = this.articles.get(slug);
    if (article) {
      const updated = { ...article, ...update, updatedAt: new Date() };
      this.articles.set(slug, updated);
      this.saveToDisk();
      return updated;
    }
    return undefined;
  }

  async deleteArticle(slug: string): Promise<boolean> {
    const deleted = this.articles.delete(slug);
    if (deleted) this.saveToDisk();
    return deleted;
  }

  async incrementArticleViews(slug: string): Promise<void> {
    const article = this.articles.get(slug);
    if (article) {
      article.views = (article.views || 0) + 1;
      this.articles.set(slug, article);
    }
  }

  // FAQ methods
  async getFaqs(): Promise<Faq[]> {
    return Array.from(this.faqs.values()).sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async getActiveFaqs(): Promise<Faq[]> {
    return Array.from(this.faqs.values())
      .filter(f => f.isActive === "true")
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async createFaq(insertFaq: InsertFaq): Promise<Faq> {
    const id = randomUUID();
    const faq: Faq = {
      ...insertFaq,
      id,
      order: insertFaq.order || 0,
      isActive: insertFaq.isActive || "true",
      createdAt: new Date()
    };
    this.faqs.set(id, faq);
    this.saveToDisk();
    return faq;
  }

  async updateFaq(id: string, update: Partial<Faq>): Promise<Faq | undefined> {
    const faq = this.faqs.get(id);
    if (faq) {
      const updated = { ...faq, ...update };
      this.faqs.set(id, updated);
      this.saveToDisk();
      return updated;
    }
    return undefined;
  }

  async deleteFaq(id: string): Promise<boolean> {
    const deleted = this.faqs.delete(id);
    if (deleted) this.saveToDisk();
    return deleted;
  }

  // Question methods
  async getQuestions(): Promise<Question[]> {
    return Array.from(this.questions.values()).sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getPublicQuestions(): Promise<Question[]> {
    return Array.from(this.questions.values())
      .filter(q => q.status === "answered" && q.reply)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const id = randomUUID();
    const question: Question = {
      ...insertQuestion,
      id,
      telegramChatId: insertQuestion.telegramChatId || null,
      reply: null,
      status: "pending",
      createdAt: new Date()
    } as Question;
    this.questions.set(id, question);
    this.saveToDisk();
    return question;
  }

  async updateQuestionReply(id: string, reply: string): Promise<Question | undefined> {
    const question = this.questions.get(id);
    if (question) {
      question.reply = reply;
      question.status = "answered";
      this.questions.set(id, question);
      this.saveToDisk();
      return question;
    }
    return undefined;
  }

  async getQuestionsByIds(ids: string[]): Promise<Question[]> {
    return Array.from(this.questions.values()).filter(q => ids.includes(q.id));
  }

  async deleteQuestion(id: string): Promise<boolean> {
    const deleted = this.questions.delete(id);
    if (deleted) this.saveToDisk();
    return deleted;
  }

  // Team Member methods
  async getTeamMembers(): Promise<TeamMember[]> {
    return Array.from(this.teamMembers.values()).sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async getActiveTeamMembers(): Promise<TeamMember[]> {
    return Array.from(this.teamMembers.values())
      .filter(m => m.isActive === "true")
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async getMainTeamMember(): Promise<TeamMember | undefined> {
    return Array.from(this.teamMembers.values()).find(m => m.isActive === "true" && m.isMain === "true");
  }

  async createTeamMember(insertTeamMember: InsertTeamMember): Promise<TeamMember> {
    const id = randomUUID();
    const member: TeamMember = {
      ...insertTeamMember,
      id,
      order: insertTeamMember.order || 0,
      isActive: insertTeamMember.isActive || "true",
      isMain: insertTeamMember.isMain || "false",
      imageUrl: insertTeamMember.imageUrl || null,
      createdAt: new Date()
    };
    this.teamMembers.set(id, member);
    this.saveToDisk();
    return member;
  }

  async updateTeamMember(id: string, update: Partial<TeamMember>): Promise<TeamMember | undefined> {
    const member = this.teamMembers.get(id);
    if (member) {
      const updated = { ...member, ...update };
      this.teamMembers.set(id, updated);
      this.saveToDisk();
      return updated;
    }
    return undefined;
  }

  async deleteTeamMember(id: string): Promise<boolean> {
    const deleted = this.teamMembers.delete(id);
    if (deleted) this.saveToDisk();
    return deleted;
  }
}

// Hozircha faqat MemStorage ishlatamiz - Vercel'da SQLite muammosi bor
let storage: IStorage;

// Hozircha barcha joyda MemStorage ishlatamiz
storage = new MemStorage();

export { storage };
