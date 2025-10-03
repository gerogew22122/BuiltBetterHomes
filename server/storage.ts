import { type User, type InsertUser, type ContactSubmission, type InsertContactSubmission, type Settings, type InsertSettings, users, contactSubmissions, settings } from "@shared/schema";
import { randomUUID } from "crypto";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getAllContactSubmissions(): Promise<ContactSubmission[]>;
  getSettings(): Promise<Settings | undefined>;
  upsertSettings(settings: InsertSettings): Promise<Settings>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contactSubmissions: Map<string, ContactSubmission>;
  private settings: Settings | undefined;

  constructor() {
    this.users = new Map();
    this.contactSubmissions = new Map();
    this.settings = {
      id: randomUUID(),
      resendApiKey: "re_5apkDg8B_Mp8JHnC6MNmeZpTnu7mTpyoy",
      notificationEmail: "austencentellas@gmail.com",
      updatedAt: new Date(),
    };
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = randomUUID();
    const submission: ContactSubmission = {
      ...insertSubmission,
      id,
      submittedAt: new Date(),
    };
    this.contactSubmissions.set(id, submission);
    return submission;
  }

  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.contactSubmissions.values()).sort(
      (a, b) => b.submittedAt.getTime() - a.submittedAt.getTime()
    );
  }

  async getSettings(): Promise<Settings | undefined> {
    return this.settings;
  }

  async upsertSettings(insertSettings: InsertSettings): Promise<Settings> {
    const settings: Settings = {
      id: this.settings?.id || randomUUID(),
      resendApiKey: insertSettings.resendApiKey || null,
      notificationEmail: insertSettings.notificationEmail || null,
      updatedAt: new Date(),
    };
    this.settings = settings;
    return settings;
  }
}

export class DbStorage implements IStorage {
  private db;

  constructor() {
    const sql = neon(process.env.DATABASE_URL!);
    this.db = drizzle(sql);
  }

  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const result = await this.db.insert(contactSubmissions).values(insertSubmission).returning();
    return result[0];
  }

  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return await this.db.select().from(contactSubmissions).orderBy(contactSubmissions.submittedAt);
  }

  async getSettings(): Promise<Settings | undefined> {
    const result = await this.db.select().from(settings).limit(1);
    if (result.length === 0) {
      const defaultSettings = await this.upsertSettings({
        resendApiKey: "re_5apkDg8B_Mp8JHnC6MNmeZpTnu7mTpyoy",
        notificationEmail: "austencentellas@gmail.com",
      });
      return defaultSettings;
    }
    return result[0];
  }

  async upsertSettings(insertSettings: InsertSettings): Promise<Settings> {
    const existing = await this.db.select().from(settings).limit(1);
    
    if (existing.length > 0) {
      const result = await this.db
        .update(settings)
        .set({
          resendApiKey: insertSettings.resendApiKey || null,
          notificationEmail: insertSettings.notificationEmail || null,
          updatedAt: new Date(),
        })
        .where(eq(settings.id, existing[0].id))
        .returning();
      return result[0];
    } else {
      const result = await this.db.insert(settings).values({
        resendApiKey: insertSettings.resendApiKey || null,
        notificationEmail: insertSettings.notificationEmail || null,
      }).returning();
      return result[0];
    }
  }
}

export const storage = new DbStorage();
