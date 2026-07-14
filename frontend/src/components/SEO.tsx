import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'profile' | 'article';
  schema?: object;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords = 'Empower Jhang, Jhang Youth, Digital Skills Jhang, Free Coding Jhang, Freelancing Jhang, Pakistan Digital Skills',
  canonical,
  ogImage = 'https://empowerjhang.org/uploads/empower-jhang-community.webp',
  ogType = 'website',
  schema
}) => {
  useEffect(() => {
    // 1. Update Title
    document.title = `${title} | Empower Jhang`;

    // Helper to get/create meta tag
    const updateMetaTag = (attribute: string, name: string, content: string) => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to get/create link tag
    const updateLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // 2. Standard Meta Tags
    updateMetaTag('name', 'description', description);
    updateMetaTag('name', 'keywords', keywords);
    updateMetaTag('name', 'robots', 'index, follow');

    // 3. Canonical Link
    const currentCanonical = canonical || window.location.href;
    updateLinkTag('canonical', currentCanonical);

    // 4. OpenGraph Tags
    updateMetaTag('property', 'og:title', `${title} | Empower Jhang`);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:url', currentCanonical);
    updateMetaTag('property', 'og:image', ogImage);
    updateMetaTag('property', 'og:type', ogType);

    // 5. Twitter Card Tags
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', `${title} | Empower Jhang`);
    updateMetaTag('name', 'twitter:description', description);
    updateMetaTag('name', 'twitter:image', ogImage);

    // 6. JSON-LD Schema injection
    let scriptTag = document.getElementById('seo-schema-markup') as HTMLScriptElement;
    if (schema) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'seo-schema-markup';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify({
        "@context": "https://schema.org",
        ...schema
      });
    } else {
      if (scriptTag) {
        scriptTag.remove();
      }
    }
  }, [title, description, keywords, canonical, ogImage, ogType, schema]);

  return null;
};
