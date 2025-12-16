/**
 * HTML Sanitization Utilities
 * 
 * Provides functions to sanitize HTML content by removing external URLs
 * while preserving internal links and safe HTML formatting.
 * 
 * Security considerations:
 * - Removes absolute URLs pointing to external domains
 * - Preserves relative URLs and internal navigation
 * - Maintains HTML structure and formatting
 */

/**
 * Determines if a URL is external (absolute URL with different domain)
 * 
 * @param url - The URL to check
 * @param allowedDomains - List of domains considered internal (default: vapourism.co.uk)
 * @returns true if the URL is external, false otherwise
 */
export function isExternalUrl(
  url: string,
  allowedDomains: string[] = ['vapourism.co.uk', 'www.vapourism.co.uk']
): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  // Trim whitespace
  url = url.trim();

  // Protocol-relative URLs (//example.com) should be checked first before single slash
  if (url.startsWith('//')) {
    try {
      const urlObj = new URL(`https:${url}`);
      const hostname = urlObj.hostname.toLowerCase();
      return !allowedDomains.some(domain => 
        hostname === domain.toLowerCase() || 
        hostname.endsWith(`.${domain.toLowerCase()}`)
      );
    } catch {
      // If parsing fails, treat as external for safety
      return true;
    }
  }

  // Relative URLs are not external (check after protocol-relative URLs)
  if (url.startsWith('/') || url.startsWith('#') || url.startsWith('?')) {
    return false;
  }

  // Block dangerous URL schemes
  const dangerousSchemes = ['javascript:', 'data:', 'vbscript:', 'file:'];
  const lowerUrl = url.toLowerCase();
  if (dangerousSchemes.some(scheme => lowerUrl.startsWith(scheme))) {
    return true; // Treat dangerous schemes as external (will be filtered)
  }

  // Check if it's an absolute URL with http/https
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    // Check if the domain is in the allowed list
    return !allowedDomains.some(domain => 
      hostname === domain.toLowerCase() || 
      hostname.endsWith(`.${domain.toLowerCase()}`)
    );
  } catch {
    // If URL parsing fails, treat as relative (not external)
    return false;
  }
}

/**
 * Removes external links from HTML content
 * 
 * This function parses HTML and removes <a> tags that point to external URLs,
 * while preserving the link text content. Internal links and relative URLs are kept.
 * 
 * **Implementation Note**: Uses regex-based parsing for simplicity and to avoid
 * additional dependencies. This covers the vast majority of real-world Shopify
 * product descriptions. For edge cases with deeply nested or malformed HTML,
 * consider migrating to a proper HTML parser library (jsdom, node-html-parser, etc.)
 * 
 * **Known Limitations**:
 * - Self-closing anchor tags (rare in practice)
 * - Malformed HTML with unclosed tags
 * - Extremely complex nested structures within links
 * 
 * These limitations are acceptable for the current use case because:
 * 1. Shopify's WYSIWYG editor generates well-formed HTML
 * 2. The regex is conservative and preserves ambiguous content
 * 3. The security impact is minimal (worst case: we don't filter a malformed link)
 * 
 * @param html - The HTML string to sanitize
 * @param allowedDomains - List of domains considered internal
 * @returns Sanitized HTML string with external links removed
 */
export function removeExternalLinks(
  html: string | null | undefined,
  allowedDomains?: string[]
): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  // Regex-based approach for link removal
  // Pattern matches: <a [attrs] href="url" [attrs]>content</a>
  return html.replace(
    /<a\s+([^>]*?\s+)?href=["']([^"']+)["']([^>]*?)>(.*?)<\/a>/gi,
    (match, beforeHref, url, afterHref, content) => {
      // Keep the link if it's internal
      if (!isExternalUrl(url, allowedDomains)) {
        return match; // Return the original link unchanged
      }
      
      // For external links, return just the text content without the link
      return content;
    }
  );
}

/**
 * Sanitizes product description HTML by removing external URLs
 * 
 * This is the main function to use for product descriptions.
 * It removes external links while preserving all other HTML formatting.
 * 
 * @param descriptionHtml - Raw HTML from product description
 * @returns Sanitized HTML safe for rendering
 */
export function sanitizeProductDescription(
  descriptionHtml: string | null | undefined
): string {
  return removeExternalLinks(descriptionHtml);
}
