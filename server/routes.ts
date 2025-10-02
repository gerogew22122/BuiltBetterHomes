import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import express from "express";

export async function registerRoutes(app: Express): Promise<Server> {
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
