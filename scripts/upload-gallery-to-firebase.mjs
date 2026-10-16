/**
 * Upload compressed images from public/gallery to Firebase Storage
 * and rewrite Prisma GalleryImage URLs.
 *
 * Requires in .env.local:
 *   FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY,
 *   FIREBASE_STORAGE_BUCKET, DATABASE_URL
 *
 * Usage:
 *   node scripts/upload-gallery-to-firebase.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { PrismaClient } from "@prisma/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WORKTREE = path.resolve(__dirname, "..");
const LOCAL_GALLERY = path.join(WORKTREE, "public", "gallery");

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

const required = [
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
  "FIREBASE_STORAGE_BUCKET",
  "DATABASE_URL",
];
for (const key of required) {
  if (!process.env[key]?.trim()) {
    console.error(`Missing ${key}`);
    process.exit(1);
  }
}

if (!fs.existsSync(LOCAL_GALLERY)) {
  console.error(`Missing local gallery folder: ${LOCAL_GALLERY}`);
  process.exit(1);
}

function publicDownloadUrl(bucketName, pathname) {
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(pathname)}?alt=media`;
}

function walk(dir, base = "") {
  /** @type {string[]} */
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.join(base, entry.name);
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full, rel));
    else if (/\.(jpe?g|png|webp|gif)$/i.test(entry.name)) files.push(rel);
  }
  return files;
}

async function main() {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID.trim(),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL.trim(),
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET.trim(),
    });
  }

  const bucket = getStorage().bucket();
  const prisma = new PrismaClient();
  const files = walk(LOCAL_GALLERY);
  console.log(`Uploading ${files.length} files from public/gallery …`);

  // Clear and rebuild rows from local files so URLs stay in sync.
  await prisma.galleryImage.deleteMany({});

  const featuredBudget = { portraits: 3, events: 2, parties: 1 };
  let uploaded = 0;

  for (const [index, rel] of files.entries()) {
    const categorySlug = rel.split(path.sep)[0];
    const base = path.basename(rel);
    const pathname = `gallery/${categorySlug}/${Date.now()}-${randomUUID().slice(0, 8)}-${base}`;
    const buffer = fs.readFileSync(path.join(LOCAL_GALLERY, rel));
    const file = bucket.file(pathname);
    await file.save(buffer, {
      contentType: "image/jpeg",
      resumable: false,
      metadata: { cacheControl: "public, max-age=31536000, immutable" },
    });
    try {
      await file.makePublic();
    } catch {
      // ignore — rules may allow public read without ACL
    }

    const url = publicDownloadUrl(bucket.name, pathname);
    const title = base.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ").trim();
    const featuredLeft = featuredBudget[categorySlug] ?? 0;
    const featured = featuredLeft > 0;
    if (featured) featuredBudget[categorySlug] -= 1;

    await prisma.galleryImage.create({
      data: {
        title: title || categorySlug,
        alt: title || categorySlug,
        url,
        pathname,
        width: 1400,
        height: 1050,
        categorySlug,
        featured,
        published: true,
        sortOrder: index,
      },
    });

    uploaded += 1;
    if (uploaded % 20 === 0 || uploaded === 1) {
      console.log(`[${uploaded}/${files.length}] ${pathname}`);
    }
  }

  await prisma.$disconnect();
  console.log(`\nDone. uploaded=${uploaded}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
