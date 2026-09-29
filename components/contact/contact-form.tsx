"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getFormspreeEndpoint, siteConfig } from "@/lib/site-config";
import type { SocialLink } from "@/lib/types/content";
import { cn } from "@/lib/utils";

type ContactFormProps = {
  contactEmail?: string;
  location: string;
  socialLinks: SocialLink[];
};

const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name."),
  email: z.string().trim().email("Enter a valid email."),
  subject: z.string().trim().min(2, "Add a subject."),
  message: z.string().trim().min(10, "Message should be at least 10 characters."),
});

type ContactValues = z.infer<typeof contactSchema>;

export function ContactForm({
  contactEmail = siteConfig.contactEmail,
  location,
  socialLinks,
}: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const endpoint = getFormspreeEndpoint();

  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(values: ContactValues) {
    startTransition(async () => {
      setStatus("idle");
      setMessage(null);

      if (!endpoint) {
        setStatus("error");
        setMessage(
          `Add your Formspree form ID (NEXT_PUBLIC_FORMSPREE_ID) to enable submissions, or email ${contactEmail} directly.`,
        );
        return;
      }

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            subject: values.subject,
            message: values.message,
            _replyto: values.email,
          }),
        });

        if (!res.ok) {
          const data = (await res.json().catch(() => ({}))) as {
            error?: string;
          };
          setStatus("error");
          setMessage(data.error ?? "Could not send message. Please try again.");
          return;
        }

        setStatus("success");
        setMessage("Message sent. We’ll get back to you soon.");
        form.reset();
      } catch {
        setStatus("error");
        setMessage("Could not send message. Please try again.");
      }
    });
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start lg:gap-16">
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-xl tracking-tight">
            Send a message
          </CardTitle>
          <CardDescription>
            We’ll reply by email — usually within a couple of days.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="name"
                        placeholder="Your name"
                        disabled={pending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        autoComplete="email"
                        placeholder="you@email.com"
                        disabled={pending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        placeholder="What’s this about?"
                        disabled={pending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={6}
                        placeholder="Tell us a bit about the shoot or collaboration."
                        disabled={pending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3 border-t border-[rgba(148,176,224,0.08)] pt-6">
                <Button
                  type="submit"
                  disabled={pending}
                  className="rounded-full bg-accent px-6 text-[#06101f] hover:bg-[#86adf7] hover:text-[#06101f]"
                >
                  {pending ? "Sending…" : "Send message"}
                </Button>
                {message ? (
                  <p
                    className={cn(
                      "text-sm",
                      status === "error"
                        ? "text-destructive"
                        : status === "success"
                          ? "text-accent"
                          : "text-muted-foreground",
                    )}
                    role="status"
                  >
                    {message}
                  </p>
                ) : null}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <aside className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-xl tracking-tight">
              Studio
            </CardTitle>
            <CardDescription>
              {location || "Available worldwide"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              <a
                className="underline underline-offset-4 hover:text-accent"
                href={
                  contactEmail.includes("@") && !contactEmail.startsWith("[")
                    ? `mailto:${contactEmail}`
                    : undefined
                }
              >
                {contactEmail}
              </a>
            </p>

            {socialLinks.length > 0 ? (
              <div className="space-y-3 border-t border-[rgba(148,176,224,0.08)] pt-4">
                <p className="type-label">Connect</p>
                <ul className="space-y-2">
                  {socialLinks.map((link) => (
                    <li key={link.url}>
                      <a
                        href={link.url}
                        className="type-link hover:text-accent"
                        {...(link.url.startsWith("http")
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {location ? (
          <Card className="py-4">
            <CardContent className="text-sm text-muted-foreground">
              Service area: {location}
            </CardContent>
          </Card>
        ) : null}
      </aside>
    </div>
  );
}
