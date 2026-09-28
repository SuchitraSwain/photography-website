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

  it("falls back to mock content and logs when a configured Sanity request fails", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", "test-project");
    sanityFetchMock.mockRejectedValue(new Error("Sanity unavailable"));

    const { getSiteSettings } = await import("@/lib/sanity/fetch");

    await expect(getSiteSettings()).resolves.toMatchObject({
      brandName: "ATELIER",
    });
    expect(sanityFetchMock).toHaveBeenCalledOnce();
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining("[sanity]"),
      expect.anything(),
      expect.any(Error),
    );
  });

  it("requests content with a revalidation window", async () => {
    vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", "test-project");
    sanityFetchMock.mockResolvedValue([]);

    const { CONTENT_REVALIDATE_SECONDS, getCategories } = await import(
      "@/lib/sanity/fetch"
    );

    await getCategories();

    expect(sanityFetchMock).toHaveBeenCalledWith(
      expect.any(String),
      {},
      { next: { revalidate: CONTENT_REVALIDATE_SECONDS } },
    );
  });

  it("normalizes null site settings fields so the UI never receives null", async () => {
    vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", "test-project");
    sanityFetchMock.mockResolvedValue({
      brandName: "Studio",
      tagline: null,
      heroImages: null,
      socialLinks: null,
      location: null,
      contactEmail: null,
      seoDefaults: null,
    });

    const { getSiteSettings } = await import("@/lib/sanity/fetch");
    const settings = await getSiteSettings();

    expect(settings).toMatchObject({
      brandName: "Studio",
      tagline: "",
      heroImages: [],
      socialLinks: [],
      location: "",
    });
    expect(settings.contactEmail).toBeTruthy();
    expect(settings.seo.titleTemplate).toBeTruthy();
    expect(settings.seo.description).toBeTruthy();
  });

  it("drops social links and hero images that have no usable data", async () => {
    vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", "test-project");
    sanityFetchMock.mockResolvedValue({
      brandName: "Studio",
      tagline: "Quiet photographs",
      heroImages: [
        { alt: null, image: null, lqip: null },
        { alt: null, image: { asset: { _ref: "image-hero-100x100-jpg" } } },
      ],
      socialLinks: [{ label: "Broken", url: null }, { label: null, url: "https://x.example" }],
      location: "Worldwide",
      contactEmail: "hello@example.com",
      seoDefaults: { titleTemplate: null, description: null, ogImage: null },
    });

    const { getSiteSettings } = await import("@/lib/sanity/fetch");
    const settings = await getSiteSettings();

    expect(settings.heroImages).toEqual([
      { src: "mapped:image-hero-100x100-jpg", alt: "" },
    ]);
    expect(settings.socialLinks).toEqual([
      { label: "https://x.example", url: "https://x.example" },
    ]);
    expect(settings.seo.ogImage).toBeUndefined();
  });

  it("skips gallery images and events that are missing required fields", async () => {
    vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", "test-project");
    sanityFetchMock.mockResolvedValue([
      { _id: "no-image", title: "Missing asset", categorySlug: "portraits" },
      {
        _id: "ok",
        title: null,
        alt: null,
        image: { asset: { _ref: "image-gallery-100x100-jpg" } },
        width: null,
        height: null,
        categorySlug: "portraits",
        featured: null,
        order: null,
      },
    ]);

    const { getGalleryImages } = await import("@/lib/sanity/fetch");

    await expect(getGalleryImages()).resolves.toEqual([
      {
        _id: "ok",
        title: "",
        alt: "",
        src: "mapped:image-gallery-100x100-jpg",
        width: 1600,
        height: 1200,
        categorySlug: "portraits",
        featured: false,
        order: 1,
      },
    ]);
  });

  it("drops events without a start instant and defaults the end to the start", async () => {
    vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", "test-project");
    sanityFetchMock.mockResolvedValue([
      { _id: "undated", title: "No date", start: null },
      {
        _id: "evt-1",
        title: "Open Studio",
        slug: null,
        start: "2026-11-14T18:00:00.000Z",
        end: null,
        location: null,
        description: null,
        addToCalendar: null,
      },
    ]);

    const { getEvents } = await import("@/lib/sanity/fetch");

    await expect(getEvents()).resolves.toEqual([
      {
        _id: "evt-1",
        title: "Open Studio",
        slug: "",
        start: "2026-11-14T18:00:00.000Z",
        end: "2026-11-14T18:00:00.000Z",
        location: "",
        description: "",
        addToCalendar: false,
      },
    ]);
  });

  it("normalizes a partial about document", async () => {
    vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", "test-project");
    sanityFetchMock.mockResolvedValue({
      headline: null,
      bio: null,
      philosophy: null,
      portrait: null,
      portraitAlt: null,
      press: null,
    });

    const { getPageAbout } = await import("@/lib/sanity/fetch");
    const about = await getPageAbout();

    expect(about.bio).toBe("");
    expect(about.philosophy).toBe("");
    expect(about.press).toEqual([]);
    expect(about.portraitSrc).toBeTruthy();
    expect(about.headline).toBeTruthy();
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
