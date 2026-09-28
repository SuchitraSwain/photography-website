import { afterEach, describe, expect, it, vi } from "vitest";

const sanityFetchMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/sanity/client", () => ({
  sanityClient: { fetch: sanityFetchMock },
}));

vi.mock("@/lib/sanity/image", () => ({
  urlFor: vi.fn((image: { asset?: { _ref?: string } }) =>
    image.asset?._ref ? `mapped:${image.asset._ref}` : "mapped:image",
  ),
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

  it("maps seoDefaults to the public seo shape", async () => {
    vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", "test-project");
    sanityFetchMock.mockResolvedValue({
      brandName: "Studio",
      tagline: "Quiet photographs",
      heroImages: [],
      socialLinks: [],
      location: "Worldwide",
      contactEmail: "hello@example.com",
      seoDefaults: {
        titleTemplate: "%s · Studio",
        description: "Editorial photography",
        ogImage: "https://cdn.sanity.io/og.jpg",
      },
    });

    const { getSiteSettings } = await import("@/lib/sanity/fetch");

    await expect(getSiteSettings()).resolves.toMatchObject({
      seo: {
        titleTemplate: "%s · Studio",
        description: "Editorial photography",
        ogImage: "https://cdn.sanity.io/og.jpg",
      },
    });
  });

  it("flattens portable text bio blocks to plain text", async () => {
    vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", "test-project");
    sanityFetchMock.mockResolvedValue({
      headline: "About",
      bio: [
        {
          _type: "block",
          children: [
            { _type: "span", text: "First " },
            { _type: "span", text: "paragraph." },
          ],
        },
        {
          _type: "block",
          children: [{ _type: "span", text: "Second paragraph." }],
        },
      ],
      philosophy: "Carefully observed.",
      portrait: { asset: { _ref: "image-portrait-100x100-jpg" } },
      portraitAlt: "Photographer",
      press: [],
    });

    const { getPageAbout } = await import("@/lib/sanity/fetch");

    await expect(getPageAbout()).resolves.toMatchObject({
      bio: "First paragraph.\n\nSecond paragraph.",
      portraitSrc: "mapped:image-portrait-100x100-jpg",
    });
  });

  it("preserves an optional gallery shoot date", async () => {
    vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", "test-project");
    sanityFetchMock.mockResolvedValue([
      {
        _id: "image-1",
        title: "Portrait",
        alt: "A portrait",
        image: { asset: { _ref: "image-gallery-100x100-jpg" } },
        width: 100,
        height: 100,
        categorySlug: "portraits",
        featured: false,
        order: 1,
        shootDate: "2026-09-28",
      },
    ]);

    const { getGalleryImages } = await import("@/lib/sanity/fetch");

    await expect(getGalleryImages()).resolves.toMatchObject([
      { shootDate: "2026-09-28" },
    ]);
  });
});
