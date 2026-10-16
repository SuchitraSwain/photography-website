import { foundersCredit, siteConfig } from "@/lib/site-config";
import type {
  Category,
  EventItem,
  PageAbout,
  ServicePackage,
  SiteSettings,
} from "@/lib/types/content";

import {
  mockAbout,
  mockCategories,
  mockEvents,
  mockPackages,
  mockSiteSettings,
} from "./content";

export const mockSiteSettingsDe: SiteSettings = {
  ...mockSiteSettings,
  tagline:
    "Wir coden mit Logik. Wir schaffen mit Emotion. Wir halten mit Absicht fest.",
  location: "Weltweit verfügbar",
  socialLinks: [
    { label: "Instagram", url: "https://instagram.com" },
    { label: "E-Mail", url: `mailto:${siteConfig.contactEmail}` },
  ],
  seo: {
    titleTemplate: "%s · Krishyam Production",
    description: `Krishyam Production ist die Praxis von ${foundersCredit()} — zwei Engineers, die Events, Portraits, Fashion und Brand-Stories in visuelle Arbeit verwandeln, die bleibt.`,
  },
};

export const mockCategoriesDe: Category[] = mockCategories.map((category) => {
  const titles: Record<string, string> = {
    portraits: "Portraits",
    events: "Events",
    parties: "Partys",
    djs: "DJs",
    "baby-shower": "Babyparty",
  };
  return {
    ...category,
    title: titles[category.slug] ?? category.title,
  };
});

export const mockEventsDe: EventItem[] = mockEvents.map((event) => ({
  ...event,
  description:
    "Berlins Premium-Navratri-Erlebnis von Taandav Events — Garba, Raas und nonstop Ramzat mit 360°-Dolby-Atmos-Sound bei Tek Dream Event. Familienfreundlich und alkoholfrei, mit authentischem vegetarischem indischem Essen vor Ort. Eine Nacht, ein Rhythmus, eine Shakti. ॥ જય માતાજી ॥",
  imageAlt: "Nav Shakti Navratri 2026 — Taandav Events in Berlin",
  ticketLabel: "Tickets auf Brizz buchen",
}));

export const mockPackagesDe: ServicePackage[] = [
  {
    ...mockPackages[0]!,
    name: "The Essential",
    description:
      "Der ideale Einstieg in dein nächstes kreatives Projekt — fokussiert, intentional und darauf ausgelegt, das Herz des Moments einzufangen.",
    includes: [
      "Kreatives Planungsgespräch",
      "1–2 Stunden Coverage",
      "Ein Hauptort oder Look",
      "Kuratierte, bearbeitete Galerie",
      "Online-Übergabe & persönliche Nutzung",
    ],
    addOns: ["Zusätzliche Stunde", "Weiterer Ort", "Rush Selects"],
  },
  {
    ...mockPackages[1]!,
    name: "The Signature",
    priceLabel: "Beliebteste",
    description:
      "Ein volleres Erlebnis, sorgfältig um deine Geschichte herum gestaltet — ideal, wenn der Tag mehr Coverage und einen raffinierten Edit verdient.",
    includes: [
      "Kreative Beratung",
      "Erweitertes Coverage-Fenster",
      "Zwei Looks oder Orte nach Bedarf",
      "Erweiterte, bearbeitete Galerie",
      "Social-ready Highlight Selects",
      "Nutzungshinweise für Web & Presse",
    ],
    addOns: ["Zweiter Shooter", "Preview in derselben Woche", "Druckfertiges Set"],
  },
  {
    ...mockPackages[2]!,
    name: "The Masterpiece",
    description:
      "Unser umfassendstes kreatives Erlebnis für ambitionierte Visionen — Kampagnen, Feiern und Stories, die Raum zum Atmen brauchen.",
    includes: [
      "Vollständige kreative Direction",
      "Mehrstündige oder mehrteilige Coverage",
      "Zweiter Shooter, wenn das Briefing es braucht",
      "Umfangreiche Galerie mit Priority Edit",
      "Hero Selects für Kampagnen & Decks",
      "Dedizierte Projektleitung",
    ],
    addOns: ["Mehrtägige Coverage", "On-site Previews", "Retuschiertes Hero-Set"],
  },
  {
    ...mockPackages[3]!,
    name: "The Bespoke",
    priceLabel: "Individuell",
    description:
      "Keine Vorlagen. Keine festen Limits. Ein Plan um dich herum — von Null aufgebaut, nachdem wir die Vision verstehen.",
    includes: [
      "Discovery-Workshop",
      "Individueller Scope, Timeline & Deliverables",
      "Dedizierte creative Lead",
      "Flexibles Crew-Setup nach Bedarf",
      "Galerie & Lizenzierung passend zum Briefing",
    ],
    addOns: ["Reise & Destination", "Production Support", "Langfristige Retainers"],
  },
];

export const mockAboutDe: PageAbout = {
  ...mockAbout,
  eyebrow: "Zwei Engineers. Eine kreative Vision.",
  subhead: "Was passiert, wenn Engineering auf Kreativität trifft?",
  bio: `Gegründet von ${foundersCredit()} vereint Krishyam Production technische Präzision, kreatives Denken und eine tiefe Wertschätzung für die Geschichten, die uns menschlich machen.

Wir glauben: Großartige Fotografie ist mehr als ein Bild einzufangen — es geht darum, das Licht zu verstehen, den Moment vorauszuahnen und etwas zu schaffen, das Menschen fühlen lässt.`,
  storyHeadline: "Verschiedene Köpfe. Eine gemeinsame Vision.",
  storyBody: `Engineering hat uns gelehrt, kritisch zu denken, Probleme zu lösen und auf Details zu achten. Fotografie gibt uns einen Weg, diese Qualitäten durch Licht, Komposition, Emotion und Storytelling auszudrücken.

Bei Krishyam planen wir mit Präzision, schaffen mit Neugier und gehen jedes Projekt mit offenem Geist an. Wir halten nicht nur fest, was passiert. Wir halten fest, wie es sich anfühlt.`,
  philosophyHeadline:
    "Engineering gibt uns Präzision. Kreativität gibt uns Purpose.",
  beliefs: [
    {
      title: "Authentizität",
      body: "Echte Ausdrücke und echte Momente bedeuten immer mehr als erzwungene Perfektion.",
    },
    {
      title: "Intention",
      body: "Jeder Frame sollte einen Grund haben zu existieren.",
    },
    {
      title: "Perspektive",
      body: "Manchmal steckt die stärkste Geschichte im Detail, das alle anderen übersehen.",
    },
    {
      title: "Zusammenarbeit",
      body: "Die beste kreative Arbeit entsteht, wenn Ideen, Menschen und Perspektiven zusammenkommen.",
    },
  ],
  whatWeCreate:
    "Von Events und Feiern über Fashion, Portraits, Hospitality bis zu Brand-Kampagnen — unsere Arbeit passt sich der Geschichte an, nicht umgekehrt. Wir verbinden dokumentarisches Storytelling, filmische Ästhetik und editorial Denken zu Bildern, die authentisch und erinnerungswürdig wirken.",
  ctaHeadline: "Lass uns etwas Bedeutungsvolles schaffen.",
  ctaBody:
    "Marke aufbauen, Event planen, Kampagne gestalten oder einen besonderen Moment feiern? Wir freuen uns auf deine Geschichte.",
  portraitAlt: "Vintage-Kamera und Reiseprints — Krishyam Production",
};
