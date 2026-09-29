import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", () => ({
  isDatabaseConfigured: vi.fn(() => false),
  prisma: {
    galleryImage: {
      findMany: vi.fn(),
    },
  },
}));

describe("content fetch", () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("returns mock content when database is not configured", async () => {
    const {
      getCategories,
      getEvents,
      getGalleryImages,
      getPageAbout,
      getServicePackages,
      getSiteSettings,
    } = await import("@/lib/content/fetch");
    const { mockContent } = await import("@/lib/mock/content");

    await expect(getSiteSettings()).resolves.toEqual(mockContent.siteSettings);
    await expect(getCategories()).resolves.toEqual(mockContent.categories);
    await expect(getGalleryImages()).resolves.toEqual(mockContent.galleryImages);
    await expect(getEvents()).resolves.toEqual(mockContent.events);
    await expect(getServicePackages()).resolves.toEqual(mockContent.packages);
    await expect(getPageAbout()).resolves.toEqual(mockContent.about);
  });

  it("returns database gallery images when published rows exist", async () => {
    const { isDatabaseConfigured, prisma } = await import("@/lib/db");
    vi.mocked(isDatabaseConfigured).mockReturnValue(true);
    vi.mocked(prisma.galleryImage.findMany).mockResolvedValue([
      {
        id: "db-1",
        title: "Lake",
        alt: "Lake portrait",
        url: "https://example.public.blob.vercel-storage.com/lake.jpg",
        pathname: "gallery/portraits/lake.jpg",
        width: 1600,
        height: 1200,
        categorySlug: "portraits",
        featured: true,
        sortOrder: 1,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ] as never);

    const { getFeaturedGalleryImages, getGalleryImages } = await import(
      "@/lib/content/fetch"
    );

    await expect(getGalleryImages()).resolves.toEqual([
      {
        _id: "db-1",
        title: "Lake",
        alt: "Lake portrait",
        src: "https://example.public.blob.vercel-storage.com/lake.jpg",
        width: 1600,
        height: 1200,
        categorySlug: "portraits",
        featured: true,
        order: 1,
      },
    ]);

    await expect(getFeaturedGalleryImages()).resolves.toHaveLength(1);
  });
});
