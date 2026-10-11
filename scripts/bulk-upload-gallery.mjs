/**
 * Bulk-upload local photos into Vercel Blob + Prisma GalleryImage.
 *
 * Usage (from worktree root):
 *   node scripts/bulk-upload-gallery.mjs "/Users/.../WEbsite photos/extracted"
 */
import fs from "fs";
import os from "os";
import path from "path";
import { execFileSync } from "child_process";
import { fileURLToPath } from "url";
import { put } from "@vercel/blob";
import { PrismaClient } from "@prisma/client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WORKTREE = path.resolve(__dirname, "..");

const MAX_BYTES = 12 * 1024 * 1024;
const ROOT = process.argv[2];

if (!ROOT || !fs.existsSync(ROOT)) {
  console.error(
    "Usage: node scripts/bulk-upload-gallery.mjs <extracted-photos-dir>",
  );
  process.exit(1);
}

function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    const full = path.join(WORKTREE, file);
    if (!fs.existsSync(full)) continue;
    for (const line of fs.readFileSync(full, "utf8").split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
      const i = trimmed.indexOf("=");
      const key = trimmed.slice(0, i).trim();
      let value = trimmed.slice(i + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    }
  }
}

loadEnv();

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error("BLOB_READ_WRITE_TOKEN missing");
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL missing");
  process.exit(1);
}

const FOLDER_TO_SLUG = {
  "baby shower": "baby-shower",
  djs: "djs",
  events: "events",
  parties: "parties",
  portraits: "portraits",
};

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

function mimeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  return "image/jpeg";
}

function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 120) || "image.jpg";
}

function compressIfNeeded(filePath, tmpDir) {
  const stat = fs.statSync(filePath);
  if (stat.size <= MAX_BYTES) {
    return { path: filePath, cleanup: false };
  }

  const out = path.join(
    tmpDir,
    `${path.basename(filePath, path.extname(filePath))}-${Date.now()}.jpg`,
  );

  for (const maxEdge of [2400, 2000, 1600, 1200]) {
    try {
      execFileSync(
        "sips",
        ["-s", "format", "jpeg", "-Z", String(maxEdge), filePath, "--out", out],
        { stdio: "ignore" },
      );
      if (fs.existsSync(out) && fs.statSync(out).size <= MAX_BYTES) {
        console.log(
          `  compressed ${path.basename(filePath)} → ${(fs.statSync(out).size / 1024 / 1024).toFixed(1)}MB @${maxEdge}px`,
        );
        return { path: out, cleanup: true };
      }
    } catch {
      // try next size
    }
  }

  if (fs.existsSync(out) && fs.statSync(out).size <= MAX_BYTES) {
    return { path: out, cleanup: true };
  }

  throw new Error(`Could not compress under 12MB: ${filePath}`);
}

function walkImages(dir) {
  /** @type {Array<{ filePath: string, categorySlug: string }>} */
  const items = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const folderKey = entry.name.trim().toLowerCase();
    const slug = FOLDER_TO_SLUG[folderKey];
    if (!slug) {
      console.warn(`Skipping unknown folder: ${entry.name}`);
      continue;
    }

    const folderPath = path.join(dir, entry.name);
    const stack = [folderPath];
    while (stack.length) {
      const current = stack.pop();
      for (const child of fs.readdirSync(current, { withFileTypes: true })) {
        const full = path.join(current, child.name);
        if (child.isDirectory()) {
          stack.push(full);
          continue;
        }
        const ext = path.extname(child.name).toLowerCase();
        if (!IMAGE_EXT.has(ext)) continue;
        items.push({ filePath: full, categorySlug: slug });
      }
    }
  }

  return items;
}

async function main() {
  const prisma = new PrismaClient();
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "kp-upload-"));
  const items = walkImages(ROOT);
  console.log(`Found ${items.length} images under ${ROOT}`);

  let uploaded = 0;
  let failed = 0;
  const featuredBudget = { portraits: 3, events: 2, parties: 1 };

  for (const [index, item] of items.entries()) {
    const base = path.basename(item.filePath);
    process.stdout.write(
      `[${index + 1}/${items.length}] ${item.categorySlug}/${base} ... `,
    );
    let prepared = null;
    try {
      prepared = compressIfNeeded(item.filePath, tmpDir);
      const buffer = fs.readFileSync(prepared.path);
      const contentType = mimeFor(prepared.path);
      const pathname = `gallery/${item.categorySlug}/${Date.now()}-${sanitizeFilename(base)}`;
      const blob = await put(pathname, buffer, {
        access: "public",
        addRandomSuffix: true,
        contentType,
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });

      const title = base.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ").trim();
      const featuredLeft = featuredBudget[item.categorySlug] ?? 0;
      const featured = featuredLeft > 0;
      if (featured) featuredBudget[item.categorySlug] -= 1;

      await prisma.galleryImage.create({
        data: {
          title: title || item.categorySlug,
          alt: title || item.categorySlug,
          url: blob.url,
          pathname: blob.pathname,
          categorySlug: item.categorySlug,
          featured,
          published: true,
          sortOrder: index,
        },
      });

      uploaded += 1;
      console.log("ok");
    } catch (error) {
      failed += 1;
      console.log("FAIL");
      console.error(" ", error instanceof Error ? error.message : error);
    } finally {
      if (prepared?.cleanup) {
        try {
          fs.unlinkSync(prepared.path);
        } catch {
          // ignore
        }
      }
    }
  }

  await prisma.$disconnect();
  try {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  } catch {
    // ignore
  }

  console.log(`\nDone. uploaded=${uploaded} failed=${failed}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
