import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for admin authentication
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: integer("is_admin", { mode: 'boolean' }).notNull().default(false),
});

// Lead table for storing client requests
export const leads = sqliteTable("leads", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  telegram: text("telegram"),
  email: text("email"),
  serviceType: text("service_type").notNull(),
  budget: text("budget"),
  timeline: text("timeline"),
  description: text("description"),
  fileUrl: text("file_url"),
  telegramChatId: text("telegram_chat_id"), // Added for reliable bot reply notifications
  source: text("source").notNull().default("website"), // website, calculator
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
  status: text("status").notNull().default("new"), // new, contacted, in_progress, completed
  adminReply: text("admin_reply"),
});

// Services table for dynamic service management
export const services = sqliteTable("services", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  shortDescription: text("short_description").notNull(),
  fullDescription: text("full_description").notNull(),
  category: text("category").notNull(),
  basePrice: integer("base_price").notNull(),
  duration: text("duration").notNull(),
  rating: text("rating").default("4.8"),
  features: text("features").notNull(), // JSON string for SQLite
  calculatorParams: text("calculator_params"), // JSON string for SQLite
  isActive: text("is_active").notNull().default("true"),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Portfolio table for case studies
export const portfolio = sqliteTable("portfolio", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  technologies: text("technologies").notNull(), // JSON string for SQLite
  problemStatement: text("problem_statement"),
  solution: text("solution"),
  results: text("results"), // JSON string for SQLite
  images: text("images"), // JSON string for SQLite
  duration: text("duration"),
  clientName: text("client_name"),
  isPublic: text("is_public").notNull().default("true"),
  link: text("link"), // External project link
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Questions table for the Q&A website integration
export const questions = sqliteTable("questions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  telegramChatId: text("telegram_chat_id"),
  name: text("name").notNull(),
  text: text("text").notNull(),
  reply: text("reply"),
  status: text("status").notNull().default("pending"), // pending, answered
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// News/Blog articles
export const articles = sqliteTable("articles", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  author: text("author").notNull().default("SAYD.X Team"),
  readTime: text("read_time"),
  views: integer("views").default(0),
  tags: text("tags"), // JSON string for SQLite
  imageUrl: text("image_url"),
  isPublished: text("is_published").notNull().default("true"),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// FAQs table for help page
export const faqs = sqliteTable("faqs", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  order: integer("order").default(0),
  isActive: text("is_active").notNull().default("true"),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Team Members table for About Us page
export const teamMembers = sqliteTable("team_members", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  role: text("role").notNull(),
  bio: text("bio").notNull(),
  imageUrl: text("image_url"),
  department: text("department"),
  responsibilities: text("responsibilities"), // JSON string
  isMain: text("is_main").notNull().default("false"), // "true" for CEO/Founder
  order: integer("order").default(0),
  isActive: text("is_active").notNull().default("true"),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Zod schemas
export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
  status: true,
  adminReply: true,
}).extend({
  name: z.string().min(2, "Ism kamida 2 ta harf bo'lishi kerak"),
  phone: z.string().min(10, "To'g'ri telefon raqam kiriting"),
  serviceType: z.string().min(1, "Xizmat turini tanlang"),
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
  createdAt: true,
});

export const insertPortfolioSchema = createInsertSchema(portfolio).omit({
  id: true,
  createdAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  views: true,
});

export const insertFaqSchema = createInsertSchema(faqs).omit({
  id: true,
  createdAt: true,
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({
  id: true,
  createdAt: true,
});

export const insertQuestionSchema = createInsertSchema(questions).omit({
  id: true,
  createdAt: true,
  status: true,
  reply: true,
}).extend({
  name: z.string().min(2, "Ismni kiriting"),
  text: z.string().min(5, "Savolni to'liq yozing"),
  telegramChatId: z.string().optional().nullable(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;
export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;
export type Portfolio = typeof portfolio.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;
export type InsertFaq = z.infer<typeof insertFaqSchema>;
export type Faq = typeof faqs.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type Question = typeof questions.$inferSelect;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type TeamMember = typeof teamMembers.$inferSelect;
