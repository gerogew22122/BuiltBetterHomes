import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import express from "express";
import { storage } from "./storage";
import { insertContactSubmissionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route to handle contact form submissions
  app.post('/api/contact', async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
      res.json({ success: true, message: "Thank you! We'll be in touch soon." });
    } catch (error) {
      console.error('Contact form error:', error);
      res.status(400).json({ success: false, message: "Please fill out all fields correctly." });
    }
  });

  // Serve the extracted WordPress site from attached_assets/extracted_site/Mjol4GohOxlM.au/
  const sitePath = path.join(process.cwd(), 'attached_assets', 'extracted_site', 'Mjol4GohOxlM.au');
  
  // Serve static files (CSS, JS, images, etc.)
  app.use(express.static(sitePath));
  
  // Serve index.html for all routes (SPA-like behavior)
  app.get('*', (req, res) => {
    res.sendFile(path.join(sitePath, 'index.html'));
  });

  const httpServer = createServer(app);

  return httpServer;
}
