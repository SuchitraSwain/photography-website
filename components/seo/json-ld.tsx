export function LocalBusinessJsonLd({
  name,
  description,
  email,
  location,
}: {
  name: string;
  description: string;
  email: string;
  location: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name,
    description,
    email,
    areaServed: location,
    priceRange: "$$",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
