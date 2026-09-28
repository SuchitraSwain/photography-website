"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getFormspreeEndpoint, siteConfig } from "@/lib/site-config";
import type { SocialLink } from "@/lib/types/content";
import { cn } from "@/lib/utils";

type ContactFormProps = {
  contactEmail?: string;
  location: string;
  socialLinks: SocialLink[];
};

export function ContactForm({
  contactEmail = siteConfig.contactEmail,
  location,
  socialLinks,
}: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const endpoint = getFormspreeEndpoint();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

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
            name: String(formData.get("name") ?? ""),
            email: String(formData.get("email") ?? ""),
            subject: String(formData.get("subject") ?? ""),
            message: String(formData.get("message") ?? ""),
            _replyto: String(formData.get("email") ?? ""),
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
      <form className="space-y-6" onSubmit={onSubmit} noValidate>
        <div className="space-y-2">
          <Label htmlFor="contact-name">Name</Label>
          <Input id="contact-name" name="name" autoComplete="name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email">Email</Label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" name="subject" autoComplete="off" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-message">Message</Label>
          <Textarea id="contact-message" name="message" rows={6} required />
        </div>

        <div className="space-y-3 border-t border-border pt-6">
          <Button type="submit" disabled={pending} className="w-full sm:w-auto">
            {pending ? "Sending…" : "Send message"}
          </Button>
          {message ? (
            <p
              className={cn(
                "text-sm",
                status === "error"
                  ? "text-destructive"
                  : status === "success"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-muted-foreground",
              )}
              role="status"
            >
              {message}
            </p>
          ) : null}
        </div>
      </form>

      <aside className="space-y-8">
        <div className="space-y-2">
          <h2 className="font-[family-name:var(--font-display)] text-2xl">
            Studio
          </h2>
          {location ? (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {location}
            </p>
          ) : null}
          <p className="text-sm">
            <a
              className="underline underline-offset-4 hover:text-brass"
              href={
                contactEmail.includes("@") && !contactEmail.startsWith("[")
                  ? `mailto:${contactEmail}`
                  : undefined
              }
            >
              {contactEmail}
            </a>
          </p>
        </div>

        {socialLinks.length > 0 ? (
          <div className="space-y-3">
            <h2 className="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
              Connect
            </h2>
            <ul className="space-y-2">
              {socialLinks.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    className="text-sm underline-offset-4 hover:underline"
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

        {location ? (
          <figure className="border border-border bg-secondary/30 p-6">
            <figcaption className="text-sm text-muted-foreground">
              Service area: {location}
            </figcaption>
          </figure>
        ) : null}
      </aside>
    </div>
  );
}
