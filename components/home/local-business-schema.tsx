import { siteConfig } from "@/lib/site";

export function LocalBusinessSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.name,
    description: siteConfig.description,
    image: `${siteConfig.url}/og-image.jpg`,
    url: siteConfig.url,
    email: "hola@dblueart.com",
    telephone: "+34 600 000 000",
    address: {
      "@type": "PostalAddress",
      addressCountry: "ES",
      addressLocality: "Madrid"
    },
    sameAs: [siteConfig.social.instagram, siteConfig.social.tiktok]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
