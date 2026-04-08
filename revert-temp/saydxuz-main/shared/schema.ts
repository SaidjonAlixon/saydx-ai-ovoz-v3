import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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
  source: text("source").notNull().default("website"), // website, calculator
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
  status: text("status").notNull().default("new"), // new, contacted, in_progress, completed
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

// Zod schemas
export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
  status: true,
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

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  views: true,
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;
export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;
export type Portfolio = typeof portfolio.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;
