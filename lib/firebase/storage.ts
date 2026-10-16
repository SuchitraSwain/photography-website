import { randomUUID } from "crypto";

import { getFirebaseBucket } from "@/lib/firebase/admin";

export type UploadedObject = {
  url: string;
  pathname: string;
};

function publicDownloadUrl(bucketName: string, pathname: string): string {
  const encoded = encodeURIComponent(pathname);
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encoded}?alt=media`;
}

export async function uploadPublicImage(
  pathname: string,
  data: Buffer | Uint8Array,
  contentType: string,
): Promise<UploadedObject> {
  const bucket = getFirebaseBucket();
  const uniquePath = pathname.includes(".")
    ? pathname.replace(
        /(\.[^.]+)$/,
        `-${randomUUID().slice(0, 8)}$1`,
      )
    : `${pathname}-${randomUUID().slice(0, 8)}`;

  const file = bucket.file(uniquePath);
  await file.save(Buffer.from(data), {
    contentType,
    resumable: false,
    metadata: {
      cacheControl: "public, max-age=31536000, immutable",
    },
  });
  // Public URLs work when Storage rules allow read (or object is made public).
  try {
    await file.makePublic();
  } catch {
    // Rules-only public read still works via tokenless alt=media on many buckets;
    // download URL below is the stable path we store in Prisma.
  }

  return {
    url: publicDownloadUrl(bucket.name, uniquePath),
    pathname: uniquePath,
  };
}

export async function deleteStorageObject(pathnameOrUrl: string): Promise<void> {
  const bucket = getFirebaseBucket();
  let pathname = pathnameOrUrl;

  if (pathnameOrUrl.startsWith("http")) {
    try {
      const url = new URL(pathnameOrUrl);
      // /v0/b/<bucket>/o/<encodedPath>
      const match = url.pathname.match(/\/o\/(.+)$/);
      if (match?.[1]) {
        pathname = decodeURIComponent(match[1]);
      }
    } catch {
      return;
    }
  }

  if (!pathname || pathname.startsWith("/")) {
    // Local public paths like /gallery/... are not Firebase objects.
    return;
  }

  try {
    await bucket.file(pathname).delete({ ignoreNotFound: true });
  } catch (error) {
    console.error("[firebase/storage] delete failed", error);
  }
}
