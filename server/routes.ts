import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import express from "express";
import { Resend } from "resend";
import { insertContactSubmissionSchema } from "@shared/schema";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL;

export async function registerRoutes(app: Express): Promise<Server> {
  // API route to handle contact form submissions
  app.post('/api/contact', async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);

      // Check if Resend credentials are configured
      if (!RESEND_API_KEY || !NOTIFICATION_EMAIL) {
        console.error('Missing Resend configuration: RESEND_API_KEY or NOTIFICATION_EMAIL not set');
        res.status(500).json({ 
          success: false, 
          message: "Email service not configured. Please contact support." 
        });
        return;
      }

      // Send email notification via Resend
      try {
        const resend = new Resend(RESEND_API_KEY);
        const result = await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: NOTIFICATION_EMAIL,
          subject: `New Contact Form Submission from ${validatedData.name}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${validatedData.name}</p>
            <p><strong>Email:</strong> ${validatedData.email}</p>
            <p><strong>Phone:</strong> ${validatedData.phone}</p>
            <p><strong>Budget:</strong> ${validatedData.budget}</p>
            <p><strong>Location:</strong> ${validatedData.area}</p>
            <p><strong>Message:</strong></p>
            <p>${validatedData.message}</p>
          `,
        });
        console.log('Email notification sent successfully:', result);
      } catch (emailError: any) {
        console.error('Failed to send email notification:', emailError);
        const errorMessage = emailError?.message || 'Unknown email error';
        res.status(500).json({ 
          success: false, 
          message: `Failed to send email: ${errorMessage}` 
        });
        return;
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
