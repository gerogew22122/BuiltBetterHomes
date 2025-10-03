import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import express from "express";
import { Resend } from "resend";
import { storage } from "./storage";
import { insertContactSubmissionSchema, insertSettingsSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route to get settings
  app.get('/api/settings', async (req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings || { resendApiKey: '', notificationEmail: '' });
    } catch (error) {
      console.error('Error fetching settings:', error);
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  });

  // API route to save settings
  app.post('/api/settings', async (req, res) => {
    try {
      const validatedData = insertSettingsSchema.parse(req.body);
      const settings = await storage.upsertSettings(validatedData);
      res.json(settings);
    } catch (error) {
      console.error('Error saving settings:', error);
      res.status(400).json({ error: 'Failed to save settings' });
    }
  });

  // API route to handle contact form submissions
  app.post('/api/contact', async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);

      const settings = await storage.getSettings();
      if (settings?.resendApiKey && settings?.notificationEmail) {
        try {
          const resend = new Resend(settings.resendApiKey);
          await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: settings.notificationEmail,
            subject: `New Contact Form Submission from ${validatedData.name}`,
            html: `
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${validatedData.name}</p>
              <p><strong>Email:</strong> ${validatedData.email}</p>
              <p><strong>Phone:</strong> ${validatedData.phone}</p>
              <p><strong>Message:</strong></p>
              <p>${validatedData.message}</p>
            `,
          });
          console.log('Email notification sent successfully');
        } catch (emailError) {
          console.error('Failed to send email notification:', emailError);
        }
      } else {
        console.log('Email notification skipped - Resend not configured in settings');
      }

      res.json({ success: true, message: "Thank you! We'll be in touch soon." });
    } catch (error) {
      console.error('Contact form error:', error);
      res.status(400).json({ success: false, message: "Please fill out all fields correctly." });
    }
  });

  // Serve the extracted WordPress site from attached_assets/extracted_site/Mjol4GohOxlM.au/
  const sitePath = path.join(process.cwd(), 'attached_assets', 'extracted_site', 'Mjol4GohOxlM.au');
  
  // Serve static files (CSS, JS, images, etc.) for WordPress assets
  app.use(express.static(sitePath));
  
  // Only serve WordPress index.html for the root route
  // Other routes like /contact will be handled by Vite/React
  app.get('/', (req, res) => {
    res.sendFile(path.join(sitePath, 'index.html'));
  });

  const httpServer = createServer(app);

  return httpServer;
}
