import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { insertSettingsSchema, type InsertSettings, type Settings } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, Mail, Loader2, Save } from "lucide-react";

export default function Settings() {
  const { toast } = useToast();

  const { data: settings, isLoading } = useQuery<Settings>({
    queryKey: ["/api/settings"],
  });

  const form = useForm<InsertSettings>({
    resolver: zodResolver(insertSettingsSchema),
    defaultValues: {
      resendApiKey: "",
      notificationEmail: "",
    },
    values: settings ? {
      resendApiKey: settings.resendApiKey || "",
      notificationEmail: settings.notificationEmail || "",
    } : undefined,
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertSettings) => {
      return await apiRequest("POST", "/api/settings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Settings Saved",
        description: "Your Resend email configuration has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertSettings) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl" data-testid="text-title">Email Settings</CardTitle>
            <CardDescription data-testid="text-description">
              Configure your Resend API credentials for email notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="resendApiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resend API Key</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
                            <Input
                              type="password"
                              placeholder="re_••••••••••••••••••••"
                              className="pl-10"
                              data-testid="input-api-key"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Get your API key from{" "}
                          <a 
                            href="https://resend.com/api-keys" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            resend.com/api-keys
                          </a>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notificationEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notification Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
                            <Input
                              type="email"
                              placeholder="your.email@example.com"
                              className="pl-10"
                              data-testid="input-notification-email"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Contact form submissions will be sent to this email address
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={mutation.isPending}
                    data-testid="button-save"
                  >
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Settings
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
