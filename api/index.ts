import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from "resend";
import { insertContactSubmissionSchema } from "../shared/schema";

const RESEND_API_KEY = "re_ZNUP6pdA_FMkRDQ4Q5LGbhKWG41yTwVDP";
const NOTIFICATION_EMAIL = "austencentellas@gmail.com";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const validatedData = insertContactSubmissionSchema.parse(req.body);

    // Check if Resend credentials are configured
    if (!RESEND_API_KEY || !NOTIFICATION_EMAIL) {
      console.error('Missing Resend configuration');
      return res.status(500).json({ 
        success: false, 
        message: "Email service not configured. Please contact support." 
      });
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
      return res.status(500).json({ 
        success: false, 
        message: `Failed to send email: ${errorMessage}` 
      });
    }

    return res.status(200).json({ success: true, message: "Thank you! We'll be in touch soon." });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(400).json({ success: false, message: "Please fill out all fields correctly." });
  }
}
