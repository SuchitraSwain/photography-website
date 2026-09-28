export function bookingClientConfirmation(input: {
  name: string;
  eventType: string;
  dateLabel: string;
}): { subject: string; text: string } {
  return {
    subject: `We received your ${input.eventType} booking request`,
    text: [
      `Hi ${input.name},`,
      "",
      `Thanks for requesting a ${input.eventType} session with ATELIER.`,
      `Requested time: ${input.dateLabel}`,
      "",
      "This is held tentatively until we confirm. We'll email you soon.",
      "",
      "— ATELIER",
    ].join("\n"),
  };
}

export function bookingPhotographerNotify(input: {
  name: string;
  email: string;
  eventType: string;
  dateLabel: string;
  location: string;
  budget?: string;
  message: string;
}): { subject: string; text: string } {
  return {
    subject: `New booking request: ${input.eventType} — ${input.name}`,
    text: [
      "New booking request",
      "",
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      `Type: ${input.eventType}`,
      `When: ${input.dateLabel}`,
      `Location: ${input.location}`,
      `Budget: ${input.budget || "—"}`,
      "",
      input.message,
      "",
      "Review in /admin/bookings",
    ].join("\n"),
  };
}

export function inquiryClientConfirmation(input: {
  name: string;
  subject: string;
}): { subject: string; text: string } {
  return {
    subject: `We received your message: ${input.subject}`,
    text: [
      `Hi ${input.name},`,
      "",
      "Thanks for writing to ATELIER. We received your inquiry and will reply soon.",
      "",
      "— ATELIER",
    ].join("\n"),
  };
}

export function inquiryPhotographerNotify(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): { subject: string; text: string } {
  return {
    subject: `New inquiry: ${input.subject}`,
    text: [
      "New contact inquiry",
      "",
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      `Subject: ${input.subject}`,
      "",
      input.message,
    ].join("\n"),
  };
}

export function bookingStatusUpdate(input: {
  name: string;
  status: string;
  dateLabel: string;
}): { subject: string; text: string } {
  return {
    subject: `Booking ${input.status.toLowerCase()}: ${input.dateLabel}`,
    text: [
      `Hi ${input.name},`,
      "",
      `Your booking request for ${input.dateLabel} is now ${input.status.toLowerCase()}.`,
      "",
      "— ATELIER",
    ].join("\n"),
  };
}
