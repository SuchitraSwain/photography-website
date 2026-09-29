import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "ATELIER — Photography for moments that deserve stillness";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const bytes = await readFile(
    join(process.cwd(), "public/images/hero-1.jpg"),
  );
  const heroSrc = `data:image/jpeg;base64,${Buffer.from(bytes).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#0a0a0a",
        }}
      >
        <img
          src={heroSrc}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.35) 100%)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "flex-start",
            padding: "64px 72px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div
              style={{
                fontSize: 92,
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontWeight: 500,
                letterSpacing: "0.22em",
                color: "#f5f5f0",
                textTransform: "uppercase",
                lineHeight: 0.9,
              }}
            >
              ATELIER
            </div>
            <div
              style={{
                fontSize: 22,
                letterSpacing: "0.28em",
                color: "#6c9bf2",
                textTransform: "uppercase",
              }}
            >
              Photography for moments that deserve stillness
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
