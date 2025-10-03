import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MessageSquare, User } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen w-full bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl" data-testid="text-title">Get In Touch</CardTitle>
            <CardDescription data-testid="text-description">
              Fill out the form below and we'll get back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action="https://formsubmit.co/austencentellas@gmail.com" method="POST" className="space-y-6">
              <input type="hidden" name="_captcha" value="true" />
              <input type="hidden" name="_subject" value="New Contact Form Submission!" />
              
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Your full name"
                    className="pl-10"
                    data-testid="input-name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="your.email@example.com"
                    className="pl-10"
                    data-testid="input-email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
                  <Input
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="Your phone number"
                    className="pl-10"
                    data-testid="input-phone"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us about your project..."
                    className="pl-10 min-h-[150px] resize-none"
                    data-testid="input-message"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                data-testid="button-submit"
              >
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
