import { google } from "googleapis";

import { getPhotographerGoogleAuth } from "@/lib/google/tokens";

function toBase64Url(raw: string): string {
  return Buffer.from(raw)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function sendGmail(input: {
  to: string;
  subject: string;
  text: string;
  html?: string;
  fromName?: string;
}): Promise<void> {
  const auth = await getPhotographerGoogleAuth();
  const gmail = google.gmail({ version: "v1", auth });

  const fromName = input.fromName ?? "ATELIER";
  const boundary = `boundary_${Date.now()}`;
  const lines = [
    `From: ${fromName}`,
    `To: ${input.to}`,
    `Subject: ${input.subject}`,
    "MIME-Version: 1.0",
  ];

  if (input.html) {
    lines.push(
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      "",
      `--${boundary}`,
      'Content-Type: text/plain; charset="UTF-8"',
      "",
      input.text,
      `--${boundary}`,
      'Content-Type: text/html; charset="UTF-8"',
      "",
      input.html,
      `--${boundary}--`,
    );
  } else {
    lines.push('Content-Type: text/plain; charset="UTF-8"', "", input.text);
  }

  const raw = toBase64Url(lines.join("\r\n"));

  await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw },
  });
}
