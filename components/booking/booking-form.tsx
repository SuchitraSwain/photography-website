"use client";

import { useState, useTransition } from "react";

import { AvailabilityCalendar } from "@/components/booking/availability-calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type BookingFormProps = {
  contactEmail: string;
  bookingEnabled: boolean;
};

const fieldClassName =
  "h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm dark:bg-input/30 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

export function BookingForm({ contactEmail, bookingEnabled }: BookingFormProps) {
  const [selectedStart, setSelectedStart] = useState<string | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!bookingEnabled) return;

    const form = event.currentTarget;
    const formData = new FormData(form);

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
            name: String(formData.get("name") ?? ""),
            email: String(formData.get("email") ?? ""),
            eventType: String(formData.get("eventType") ?? ""),
            date: selectedStart,
            endDate: selectedEnd ?? undefined,
            location: String(formData.get("location") ?? ""),
            budget: String(formData.get("budget") ?? "") || undefined,
            message: String(formData.get("message") ?? ""),
          }),
        });
        const data = (await res.json()) as { error?: string };
        if (!res.ok) {
          setStatus("error");
          setMessage(data.error ?? "Could not submit booking");
          return;
        }
        setStatus("success");
        setMessage("Request received. Check your email for confirmation.");
        form.reset();
        setSelectedStart(null);
        setSelectedEnd(null);
      } catch {
        setStatus("error");
        setMessage("Could not submit booking");
      }
    });
  }

  return (
    <form className="space-y-8" onSubmit={onSubmit} noValidate>
      <div className="space-y-3">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">
          Availability
        </h2>
        <AvailabilityCalendar
          enabled={bookingEnabled}
          selectedStart={selectedStart}
          onSelect={(slot) => {
            setSelectedStart(slot.start);
            setSelectedEnd(slot.end);
          }}
        />
        <input type="hidden" name="date" value={selectedStart ?? ""} readOnly />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-1">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" autoComplete="name" required />
        </div>
        <div className="space-y-2 sm:col-span-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </div>
        <div className="space-y-2 sm:col-span-1">
          <Label htmlFor="eventType">Event type</Label>
          <select
            id="eventType"
            name="eventType"
            className={cn(fieldClassName, "cursor-pointer")}
            defaultValue=""
            required
          >
            <option value="" disabled>
              Select type
            </option>
            <option value="Wedding">Wedding</option>
            <option value="Portrait">Portrait</option>
            <option value="Event">Event</option>
            <option value="Editorial">Editorial</option>
          </select>
        </div>
        <div className="space-y-2 sm:col-span-1">
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" autoComplete="off" required />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="budget">Budget (optional)</Label>
          <Input id="budget" name="budget" autoComplete="off" />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" name="message" rows={5} required />
        </div>
      </div>

      <div className="space-y-3 border-t border-border pt-6">
        <Button
          type="submit"
          disabled={!bookingEnabled || pending}
          className="w-full sm:w-auto"
        >
          {pending ? "Sending…" : "Request booking"}
        </Button>
        {!bookingEnabled ? (
          <p className="text-sm text-muted-foreground">
            Online booking unlocks after Google Calendar is connected — meanwhile
            email{" "}
            <a
              className="underline underline-offset-4 hover:text-accent"
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
  );
}
