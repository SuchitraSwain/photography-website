import { revalidatePath } from "next/cache";

import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/booking/require-admin";
import { prisma } from "@/lib/db";
import { formatEventDateRange } from "@/lib/datetime";
import { bookingStatusUpdate } from "@/lib/email/templates";
import {
  rescheduleEvent,
  updateEventStatus,
} from "@/lib/google/calendar";
import { sendGmail } from "@/lib/google/gmail";

async function updateBookingAction(formData: FormData) {
  "use server";

  const { error } = await requireAdmin();
  if (error) return;

  const id = String(formData.get("id") ?? "");
  const action = String(formData.get("action") ?? "");
  if (!id || !action) return;

  const booking = await prisma.bookingRequest.findUnique({ where: { id } });
  if (!booking) return;

  if (action === "approve") {
    await prisma.bookingRequest.update({
      where: { id },
      data: { status: "APPROVED" },
    });
    if (booking.googleEventId) {
      await updateEventStatus(booking.googleEventId, "confirmed");
    }
  } else if (action === "decline") {
    await prisma.bookingRequest.update({
      where: { id },
      data: { status: "DECLINED" },
    });
    if (booking.googleEventId) {
      await updateEventStatus(booking.googleEventId, "cancelled");
    }
  } else if (action === "reschedule") {
    const newStart = String(formData.get("newStart") ?? "");
    if (!newStart) return;
    const start = new Date(newStart);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    await prisma.bookingRequest.update({
      where: { id },
      data: { status: "RESCHEDULED", date: start, endDate: end },
    });
    if (booking.googleEventId) {
      await rescheduleEvent(booking.googleEventId, start, end);
    }
  }

  const updated = await prisma.bookingRequest.findUniqueOrThrow({
    where: { id },
  });
  const mail = bookingStatusUpdate({
    name: updated.name,
    status: updated.status,
    dateLabel: formatEventDateRange(
      updated.date.toISOString(),
      (updated.endDate ?? updated.date).toISOString(),
    ),
  });
  try {
    await sendGmail({
      to: updated.email,
      subject: mail.subject,
      text: mail.text,
    });
  } catch (err) {
    console.error("[admin booking mail]", err);
  }

  revalidatePath("/admin/bookings");
}

export default async function AdminBookingsPage() {
  const { error } = await requireAdmin();
  if (error) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-16">
        <p>Unauthorized</p>
      </main>
    );
  }

  const bookings = await prisma.bookingRequest.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="font-[family-name:var(--font-display)] text-4xl">
        Bookings
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Approve, decline, or reschedule pending requests.
      </p>

      <ul className="mt-10 space-y-6">
        {bookings.length === 0 ? (
          <li className="text-sm text-muted-foreground">No bookings yet.</li>
        ) : (
          bookings.map((booking) => (
            <li
              key={booking.id}
              className="space-y-4 border border-border p-5"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-lg font-medium">
                  {booking.eventType} — {booking.name}
                </h2>
                <span className="text-xs tracking-wide text-muted-foreground uppercase">
                  {booking.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {formatEventDateRange(
                  booking.date.toISOString(),
                  (booking.endDate ?? booking.date).toISOString(),
                )}{" "}
                · {booking.location}
              </p>
              <p className="text-sm">
                <a
                  className="underline underline-offset-4"
                  href={`mailto:${booking.email}`}
                >
                  {booking.email}
                </a>
                {booking.budget ? ` · Budget: ${booking.budget}` : null}
              </p>
              <p className="whitespace-pre-wrap text-sm">{booking.message}</p>

              {booking.status === "PENDING" ? (
                <div className="flex flex-wrap gap-3 pt-2">
                  <form action={updateBookingAction}>
                    <input type="hidden" name="id" value={booking.id} />
                    <input type="hidden" name="action" value="approve" />
                    <Button type="submit" size="sm">
                      Approve
                    </Button>
                  </form>
                  <form action={updateBookingAction}>
                    <input type="hidden" name="id" value={booking.id} />
                    <input type="hidden" name="action" value="decline" />
                    <Button type="submit" size="sm" variant="outline">
                      Decline
                    </Button>
                  </form>
                  <form
                    action={updateBookingAction}
                    className="flex flex-wrap items-end gap-2"
                  >
                    <input type="hidden" name="id" value={booking.id} />
                    <input type="hidden" name="action" value="reschedule" />
                    <label className="text-xs text-muted-foreground">
                      New start (ISO)
                      <input
                        name="newStart"
                        type="datetime-local"
                        required
                        className="mt-1 block rounded-md border border-input bg-transparent px-2 py-1 text-sm"
                      />
                    </label>
                    <Button type="submit" size="sm" variant="secondary">
                      Reschedule
                    </Button>
                  </form>
                </div>
              ) : null}
            </li>
          ))
        )}
      </ul>
    </main>
  );
}
