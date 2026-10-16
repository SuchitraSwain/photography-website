"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AvailabilityCalendar } from "@/components/booking/availability-calendar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type BookingFormProps = {
  contactEmail: string;
  bookingEnabled: boolean;
};

type BookingValues = {
  name: string;
  email: string;
  eventType: string;
  location: string;
  budget?: string;
  message: string;
};

export function BookingForm({ contactEmail, bookingEnabled }: BookingFormProps) {
  const t = useTranslations("booking");
  const bookingSchema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(2, t("errorName")),
        email: z.string().trim().email(t("errorEmail")),
        eventType: z.string().min(1, t("errorEventType")),
        location: z.string().trim().min(2, t("errorLocation")),
        budget: z.string().trim().optional(),
        message: z.string().trim().min(10, t("errorMessage")),
      }),
    [t],
  );
  const [selectedStart, setSelectedStart] = useState<string | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const form = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      email: "",
      eventType: "",
      location: "",
      budget: "",
      message: "",
    },
  });

  const emailReady =
    contactEmail.includes("@") && !contactEmail.startsWith("[");

  function onSubmit(values: BookingValues) {
    if (!bookingEnabled) return;

    if (!selectedStart) {
      setStatus("error");
      setMessage("Please select an available time slot.");
      return;
    }

    startTransition(async () => {
      setStatus("idle");
      setMessage(null);
      try {
        const res = await fetch("/api/booking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            eventType: values.eventType,
            date: selectedStart,
            endDate: selectedEnd ?? undefined,
            location: values.location,
            budget: values.budget || undefined,
            message: values.message,
          }),
        });
        const data = (await res.json()) as { error?: string };
        if (!res.ok) {
          setStatus("error");
          setMessage(data.error ?? t("errorGeneric"));
          return;
        }
        setStatus("success");
        setMessage(t("success"));
        form.reset();
        setSelectedStart(null);
        setSelectedEnd(null);
      } catch {
        setStatus("error");
        setMessage(t("errorGeneric"));
      }
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-xl tracking-tight">
            Availability
          </CardTitle>
          <CardDescription>
            Select an open time in the next two weeks, then send your request.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AvailabilityCalendar
            enabled={bookingEnabled}
            selectedStart={selectedStart}
            onSelect={(slot) => {
              setSelectedStart(slot.start);
              setSelectedEnd(slot.end);
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-xl tracking-tight">
            Booking details
          </CardTitle>
          <CardDescription>
            We’ll follow up by email to confirm the session.
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="name"
                        disabled={!bookingEnabled || pending}
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
                        disabled={!bookingEnabled || pending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="eventType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!bookingEnabled || pending}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t("selectType")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Wedding">{t("wedding")}</SelectItem>
                        <SelectItem value="Portrait">{t("portrait")}</SelectItem>
                        <SelectItem value="Event">{t("event")}</SelectItem>
                        <SelectItem value="Editorial">{t("editorial")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        disabled={!bookingEnabled || pending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Budget (optional)</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        disabled={!bookingEnabled || pending}
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
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        disabled={!bookingEnabled || pending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter className="flex flex-col items-start gap-3 border-t border-[rgba(134,150,160,0.08)] pt-6">
              <Button
                type="submit"
                disabled={!bookingEnabled || pending}
                className="rounded-full bg-accent px-6 text-[#0b141a] hover:bg-[#3fe07a] hover:text-[#0b141a]"
              >
                {pending ? t("sending") : t("submit")}
              </Button>

              {!bookingEnabled ? (
                <p className="text-sm text-muted-foreground">
                  Online slots unlock after Google Calendar is connected in
                  admin
                  {emailReady ? (
                    <>
                      {" "}
                      — meanwhile email{" "}
                      <a
                        className="text-foreground underline underline-offset-4 hover:text-accent"
                        href={`mailto:${contactEmail}`}
                      >
                        {contactEmail}
                      </a>
                    </>
                  ) : null}
                  .
                </p>
              ) : null}

              {message ? (
                <p
                  className={cn(
                    "text-sm",
                    status === "error" ? "text-destructive" : "text-accent",
                  )}
                  role="status"
                >
                  {message}
                </p>
              ) : null}
            </CardFooter>
          </form>
        </Form>
      </Card>

      {emailReady ? (
        <p className="text-sm text-muted-foreground">
          Prefer email? Reach out at{" "}
          <a
            className="text-foreground underline underline-offset-4 hover:text-accent"
            href={`mailto:${contactEmail}`}
          >
            {contactEmail}
          </a>{" "}
          and we’ll confirm availability within 24–48 hours.
        </p>
      ) : null}
    </div>
  );
}
