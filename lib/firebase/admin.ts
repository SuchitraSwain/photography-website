import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

function readPrivateKey(): string | undefined {
  const raw = process.env.FIREBASE_PRIVATE_KEY?.trim();
  if (!raw) return undefined;
  return raw.replace(/\\n/g, "\n");
}

export function isFirebaseStorageConfigured(): boolean {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID?.trim() &&
      process.env.FIREBASE_CLIENT_EMAIL?.trim() &&
      process.env.FIREBASE_PRIVATE_KEY?.trim() &&
      process.env.FIREBASE_STORAGE_BUCKET?.trim(),
  );
}

export function getFirebaseAdminApp(): App {
  const existing = getApps()[0];
  if (existing) return existing;

  if (!isFirebaseStorageConfigured()) {
    throw new Error(
      "Firebase Storage is not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, FIREBASE_STORAGE_BUCKET.",
    );
  }

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID!.trim(),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!.trim(),
      privateKey: readPrivateKey()!,
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET!.trim(),
  });
}

export function getFirebaseBucket() {
  return getStorage(getFirebaseAdminApp()).bucket();
}
