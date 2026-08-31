import React, { useEffect } from 'react';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'video.movie' | 'video.episode' | 'video.tv_show' | 'article';
  schema?: Record<string, any> | Record<string, any>[];
  robots?: string;
}

const DEFAULT_TITLE = 'PhimHD - Xem Phim Vietsub HD Miễn Phí';
const DEFAULT_DESCRIPTION =
  'PhimHD - Trang web xem phim vietsub, thuyết minh online chuẩn HD, Full HD miễn phí. Kho phim phong phú gồm phim bộ, phim lẻ, phim chiếu rạp, anime hoạt hình cập nhật liên tục.';
const DEFAULT_KEYWORDS =
  'xem phim, phim vietsub, phim hd, phim bo, phim le, phim chieu rap, anime, hoat hinh, phim hay 2024, phimhd, cinestream';
const DEFAULT_IMAGE = 'https://phimimg.com/upload/poster.jpg';
export const SITE_NAME = 'PhimHD';
export const SITE_URL = 'https://film-self.vercel.app';

/**
 * Helper to strip HTML tags for clean meta descriptions
 */
export function stripHtml(html?: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').trim();
}

/**
 * Helper to update or create a meta tag
 */
function setMetaTag(selector: string, attribute: string, attrValue: string, content: string) {
  let element = document.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

/**
 * Helper to update or create canonical link tag
 */
function setCanonical(url: string) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  schema,
  robots = 'index, follow',
}) => {
  const fullTitle = title
    ? title.includes(SITE_NAME)
      ? title
      : `${title} | ${SITE_NAME}`
    : DEFAULT_TITLE;

  const cleanDescription = stripHtml(description) || DEFAULT_DESCRIPTION;
  const metaKeywords = keywords || DEFAULT_KEYWORDS;
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const metaImage = image || DEFAULT_IMAGE;

  useEffect(() => {
    // 1. Page Title
    document.title = fullTitle;

    // 2. Standard Meta Tags
    setMetaTag('meta[name="description"]', 'name', 'description', cleanDescription);
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', metaKeywords);
    setMetaTag('meta[name="robots"]', 'name', 'robots', robots);

    // 3. Open Graph Tags
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', SITE_NAME);
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', cleanDescription);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', type);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', currentUrl);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', metaImage);
    setMetaTag('meta[property="og:locale"]', 'property', 'og:locale', 'vi_VN');

    // 4. Twitter Card Tags
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', cleanDescription);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', metaImage);

    // 5. Canonical URL
    if (currentUrl) {
      setCanonical(currentUrl);
    }

    // 6. JSON-LD Schema
    const existingSchemaScript = document.getElementById('json-ld-schema');
    if (existingSchemaScript) {
      existingSchemaScript.remove();
    }

    if (schema) {
      const script = document.createElement('script');
      script.id = 'json-ld-schema';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(
        Array.isArray(schema)
          ? { '@context': 'https://schema.org', '@graph': schema }
          : { '@context': 'https://schema.org', ...schema }
      );
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup schema script on unmount
      const scriptToRemove = document.getElementById('json-ld-schema');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [fullTitle, cleanDescription, metaKeywords, currentUrl, metaImage, type, robots, schema]);

  return null;
};

export default SEO;
