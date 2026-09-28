import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type BookingFormProps = {
  contactEmail: string;
};

const fieldClassName =
  "h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm dark:bg-input/30 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

export function BookingForm({ contactEmail }: BookingFormProps) {
  return (
    <form className="space-y-6" noValidate>
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
          >
            <option value="" disabled>
              Select a type
            </option>
            <option value="wedding">Wedding</option>
            <option value="portrait">Portrait</option>
            <option value="event">Event</option>
            <option value="editorial">Editorial</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="space-y-2 sm:col-span-1">
          <Label htmlFor="date">Date</Label>
          <Input id="date" name="date" type="date" />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            autoComplete="address-level2"
            placeholder="City, region, or venue"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="budget">Budget</Label>
          <Input
            id="budget"
            name="budget"
            placeholder="e.g. $5,000–8,000"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            name="message"
            rows={5}
            placeholder="Tell us about your plans, timeline, and anything we should know."
          />
        </div>
      </div>

      <div className="space-y-3 border-t border-border pt-6">
        <Button type="submit" disabled className="w-full sm:w-auto">
          Request booking
        </Button>
        <p className="text-sm text-muted-foreground">
          Online booking launches soon — meanwhile email{" "}
          <a
            href={`mailto:${contactEmail}`}
            className="text-foreground underline-offset-4 hover:underline"
          >
            {contactEmail}
          </a>
          .
        </p>
      </div>
    </form>
  );
}
