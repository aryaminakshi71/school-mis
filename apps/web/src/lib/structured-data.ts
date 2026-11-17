/**
 * Structured Data (JSON-LD) Utilities
 * Generates JSON-LD structured data for SEO
 */

export interface OrganizationSchema {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  contactPoint?: {
    telephone?: string;
    contactType?: string;
    email?: string;
  };
  sameAs?: string[];
}

export interface WebSiteSchema {
  name: string;
  url: string;
  description?: string;
}

export interface ArticleSchema {
  headline: string;
  description?: string;
  author?: {
    name: string;
  };
  datePublished?: string;
  dateModified?: string;
  image?: string;
  url?: string;
}

/**
 * Generate Organization JSON-LD
 */
export function generateOrganizationSchema(data: OrganizationSchema): object {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: data.name,
    url: data.url,
    ...(data.logo && { logo: data.logo }),
    ...(data.description && { description: data.description }),
    ...(data.contactPoint && {
      contactPoint: {
        "@type": "ContactPoint",
        ...data.contactPoint,
      },
    }),
    ...(data.sameAs && data.sameAs.length > 0 && { sameAs: data.sameAs }),
  };
}

/**
 * Generate WebSite JSON-LD
 */
export function generateWebSiteSchema(data: WebSiteSchema): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: data.name,
    url: data.url,
    ...(data.description && { description: data.description }),
  };
}

/**
 * Get default organization schema for SchoolOS app
 */
export function getSchoolMISOrganizationSchema(): OrganizationSchema {
  return {
    name: "SchoolOS",
    url: import.meta.env.VITE_PUBLIC_SITE_URL || "http://localhost:3000",
    description:
      "Complete school administration solution for managing all school operations.",
  };
}

export function generateArticleSchema(data: ArticleSchema): object {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.headline,
    ...(data.description && { description: data.description }),
    ...(data.author && {
      author: {
        "@type": "Person",
        ...data.author,
      },
    }),
    ...(data.datePublished && { datePublished: data.datePublished }),
    ...(data.dateModified && { dateModified: data.dateModified }),
    ...(data.image && { image: data.image }),
    ...(data.url && { url: data.url }),
  };
}
