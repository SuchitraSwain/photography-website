export function getSanityProjectId(): string | undefined {
  return process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || undefined;
}

export function getSanityDataset(): string {
  return process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
}

export function getSanityApiVersion(): string {
  return process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";
}

export function isSanityConfigured(): boolean {
  return Boolean(getSanityProjectId() && getSanityDataset());
}
