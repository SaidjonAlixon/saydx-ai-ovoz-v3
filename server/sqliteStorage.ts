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
import { db } from "./database";
import { leads, services, portfolio, articles } from "@shared/schema";
import { eq } from "drizzle-orm";

export class SQLiteStorage {
  // Lead management
  async createLead(lead: InsertLead): Promise<Lead> {
    const newLead = {
      ...lead,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      status: 'new' as const
    };
    
    await db.insert(leads).values(newLead);
    return newLead as Lead;
  }

  async getLead(id: string): Promise<Lead | undefined> {
    const result = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
    return result[0] as Lead | undefined;
  }

  async getLeads(): Promise<Lead[]> {
    const result = await db.select().from(leads).orderBy(leads.createdAt);
    return result as Lead[];
  }

  async updateLeadStatus(id: string, status: string): Promise<Lead | undefined> {
    await db.update(leads).set({ status }).where(eq(leads.id, id));
    return this.getLead(id);
  }

  // Service management
  async createService(service: InsertService): Promise<Service> {
    const newService = {
      ...service,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      features: JSON.stringify(service.features),
      calculatorParams: service.calculatorParams ? JSON.stringify(service.calculatorParams) : null
    };
    
    await db.insert(services).values(newService);
    return {
      ...newService,
      features: service.features,
      calculatorParams: service.calculatorParams
    } as Service;
  }

  async getService(slug: string): Promise<Service | undefined> {
    const result = await db.select().from(services).where(eq(services.slug, slug)).limit(1);
    if (result[0]) {
      return {
        ...result[0],
        features: JSON.parse(result[0].features),
        calculatorParams: result[0].calculatorParams ? JSON.parse(result[0].calculatorParams) : null
      } as Service;
    }
    return undefined;
  }

  async getServices(): Promise<Service[]> {
    const result = await db.select().from(services).orderBy(services.createdAt);
    return result.map(service => ({
      ...service,
      features: JSON.parse(service.features),
      calculatorParams: service.calculatorParams ? JSON.parse(service.calculatorParams) : null
    })) as Service[];
  }

  async getActiveServices(): Promise<Service[]> {
    const result = await db.select().from(services)
      .where(eq(services.isActive, 'true'))
      .orderBy(services.createdAt);
    return result.map(service => ({
      ...service,
      features: JSON.parse(service.features),
      calculatorParams: service.calculatorParams ? JSON.parse(service.calculatorParams) : null
    })) as Service[];
  }

  // Portfolio management
  async createPortfolio(portfolioData: InsertPortfolio): Promise<Portfolio> {
    const newPortfolio = {
      ...portfolioData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      technologies: JSON.stringify(portfolioData.technologies),
      results: portfolioData.results ? JSON.stringify(portfolioData.results) : null,
      images: portfolioData.images ? JSON.stringify(portfolioData.images) : null
    };
    
    await db.insert(portfolio).values(newPortfolio);
    return {
      ...newPortfolio,
      technologies: portfolioData.technologies,
      results: portfolioData.results,
      images: portfolioData.images
    } as Portfolio;
  }

  async getPortfolio(id: string): Promise<Portfolio | undefined> {
    const result = await db.select().from(portfolio).where(eq(portfolio.id, id)).limit(1);
    if (result[0]) {
      return {
        ...result[0],
        technologies: JSON.parse(result[0].technologies),
        results: result[0].results ? JSON.parse(result[0].results) : null,
        images: result[0].images ? JSON.parse(result[0].images) : null
      } as Portfolio;
    }
    return undefined;
  }

  async getPortfolios(): Promise<Portfolio[]> {
    const result = await db.select().from(portfolio).orderBy(portfolio.createdAt);
    return result.map(portfolio => ({
      ...portfolio,
      technologies: JSON.parse(portfolio.technologies),
      results: portfolio.results ? JSON.parse(portfolio.results) : null,
      images: portfolio.images ? JSON.parse(portfolio.images) : null
    })) as Portfolio[];
  }

  async getPublicPortfolios(): Promise<Portfolio[]> {
    const result = await db.select().from(portfolio)
      .where(eq(portfolio.isPublic, 'true'))
      .orderBy(portfolio.createdAt);
    return result.map(portfolio => ({
      ...portfolio,
      technologies: JSON.parse(portfolio.technologies),
      results: portfolio.results ? JSON.parse(portfolio.results) : null,
      images: portfolio.images ? JSON.parse(portfolio.images) : null
    })) as Portfolio[];
  }

  // Article management
  async createArticle(article: InsertArticle): Promise<Article> {
    const newArticle = {
      ...article,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: article.tags ? JSON.stringify(article.tags) : null
    };
    
    await db.insert(articles).values(newArticle);
    return {
      ...newArticle,
      tags: article.tags
    } as Article;
  }

  async getArticle(slug: string): Promise<Article | undefined> {
    const result = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
    if (result[0]) {
      return {
        ...result[0],
        tags: result[0].tags ? JSON.parse(result[0].tags) : null
      } as Article;
    }
    return undefined;
  }

  async getArticles(): Promise<Article[]> {
    const result = await db.select().from(articles).orderBy(articles.createdAt);
    return result.map(article => ({
      ...article,
      tags: article.tags ? JSON.parse(article.tags) : null
    })) as Article[];
  }

  async getPublishedArticles(): Promise<Article[]> {
    const result = await db.select().from(articles)
      .where(eq(articles.isPublished, 'true'))
      .orderBy(articles.createdAt);
    return result.map(article => ({
      ...article,
      tags: article.tags ? JSON.parse(article.tags) : null
    })) as Article[];
  }

  async incrementArticleViews(slug: string): Promise<void> {
    const article = await this.getArticle(slug);
    if (article) {
      await db.update(articles)
        .set({ views: (article.views || 0) + 1 })
        .where(eq(articles.slug, slug));
    }
  }
}
