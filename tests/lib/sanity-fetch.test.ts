import { afterEach, describe, expect, it, vi } from "vitest";

const sanityFetchMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/sanity/client", () => ({
  sanityClient: { fetch: sanityFetchMock },
}));

describe("Sanity content fetchers", () => {
  afterEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    sanityFetchMock.mockReset();
  });

  it("returns mock content when Sanity is not configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", "");

    const {
      getCategories,
      getEvents,
      getFeaturedGalleryImages,
      getGalleryImages,
      getPageAbout,
      getServicePackages,
      getSiteSettings,
    } = await import("@/lib/sanity/fetch");

    const [
      settings,
      categories,
      galleryImages,
      featuredImages,
      events,
      packages,
      about,
    ] = await Promise.all([
      getSiteSettings(),
      getCategories(),
      getGalleryImages(),
      getFeaturedGalleryImages(),
      getEvents(),
      getServicePackages(),
      getPageAbout(),
    ]);

    expect(settings.brandName).toBe("ATELIER");
    expect(categories[0]?.slug).toBe("weddings");
    expect(galleryImages.length).toBeGreaterThan(0);
    expect(featuredImages).toEqual(
      galleryImages.filter((image) => image.featured),
    );
    expect(events[0]?.slug).toBe("open-studio-evening");
    expect(packages[0]?.name).toBe("Essential Portrait");
    expect(about.headline).toContain("Light");
  });

  it("falls back to mock content when a configured Sanity request fails", async () => {
    vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", "test-project");
    sanityFetchMock.mockRejectedValue(new Error("Sanity unavailable"));

    const { getSiteSettings } = await import("@/lib/sanity/fetch");

    await expect(getSiteSettings()).resolves.toMatchObject({
      brandName: "ATELIER",
    });
    expect(sanityFetchMock).toHaveBeenCalledOnce();
  });
});
