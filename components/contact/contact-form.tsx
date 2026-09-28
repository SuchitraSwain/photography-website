"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { SocialLink } from "@/lib/types/content";
import { cn } from "@/lib/utils";

type ContactFormProps = {
  contactEmail: string;
  location: string;
  socialLinks: SocialLink[];
  contactEnabled: boolean;
};

export function ContactForm({
  contactEmail,
  location,
  socialLinks,
  contactEnabled,
}: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!contactEnabled) return;

    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      setStatus("idle");
      setMessage(null);
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: String(formData.get("name") ?? ""),
            email: String(formData.get("email") ?? ""),
            subject: String(formData.get("subject") ?? ""),
            message: String(formData.get("message") ?? ""),
          }),
        });
        const data = (await res.json()) as { error?: string };
        if (!res.ok) {
          setStatus("error");
          setMessage(data.error ?? "Could not send message");
          return;
        }
        setStatus("success");
        setMessage("Message sent. We'll get back to you soon.");
        form.reset();
      } catch {
        setStatus("error");
        setMessage("Could not send message");
      }
    });
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16 lg:items-start">
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
          <Button
            type="submit"
            disabled={!contactEnabled || pending}
            className="w-full sm:w-auto"
          >
            {pending ? "Sending…" : "Send message"}
          </Button>
          {!contactEnabled ? (
            <p className="text-sm text-muted-foreground">
              Online messaging unlocks after Google is connected — meanwhile email{" "}
              <a
                className="underline underline-offset-4 hover:text-foreground"
                href={`mailto:${contactEmail}`}
              >
                {contactEmail}
              </a>
              .
            </p>
          ) : null}
          {message ? (
            <p
              className={cn(
                "text-sm",
                status === "error" ? "text-destructive" : "text-muted-foreground",
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
              className="underline underline-offset-4 hover:text-foreground"
              href={`mailto:${contactEmail}`}
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
