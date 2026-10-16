"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMemo, useState, useTransition } from "react";
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

type ContactValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export function ContactForm({
  contactEmail = siteConfig.contactEmail,
  location,
  socialLinks,
}: ContactFormProps) {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const endpoint = getFormspreeEndpoint();

  const contactSchema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(2, t("errorName")),
        email: z.string().trim().email(t("errorEmail")),
        subject: z.string().trim().min(2, t("errorSubject")),
        message: z.string().trim().min(10, t("errorMessage")),
      }),
    [t],
  );

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
          setMessage(data.error ?? t("errorGeneric"));
          return;
        }

        setStatus("success");
        setMessage(t("success"));
        form.reset();
      } catch {
        setStatus("error");
        setMessage(t("errorGeneric"));
      }
    });
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start lg:gap-16">
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-xl tracking-tight">
            {t("title")}
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
                    <FormLabel>{t("name")}</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="name"
                        placeholder={t("namePlaceholder")}
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
                    <FormLabel>{t("email")}</FormLabel>
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
                    <FormLabel>{t("subject")}</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        placeholder={t("subjectPlaceholder")}
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
                    <FormLabel>{t("message")}</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={6}
                        placeholder={t("messagePlaceholder")}
                        disabled={pending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3 border-t border-[rgba(134,150,160,0.08)] pt-6">
                <Button
                  type="submit"
                  disabled={pending}
                  className="rounded-full bg-accent px-6 text-[#0b141a] hover:bg-[#3fe07a] hover:text-[#0b141a]"
                >
                  {pending ? t("sending") : t("send")}
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
              {location || t("serviceArea")}
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
              <div className="space-y-3 border-t border-[rgba(134,150,160,0.08)] pt-4">
                <p className="type-label">{t("connect")}</p>
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
              {t("serviceArea")} {location}
            </CardContent>
          </Card>
        ) : null}
      </aside>
    </div>
  );
}
