import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import { Resend } from "resend";
import { insertContactSubmissionSchema } from "../shared/schema";

const RESEND_API_KEY = "re_ZNUP6pdA_FMkRDQ4Q5LGbhKWG41yTwVDP";
const NOTIFICATION_EMAIL = "austencentellas@gmail.com";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

// Export for Vercel serverless
export default app;
