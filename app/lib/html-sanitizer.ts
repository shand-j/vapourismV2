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

  // Relative URLs are not external
  if (url.startsWith('/') || url.startsWith('#') || url.startsWith('?')) {
    return false;
  }

  // Check if it's an absolute URL
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

  // Simple regex-based approach for link removal
  // This handles most common cases without requiring a full HTML parser
  return html.replace(
    /<a\s+([^>]*?)href=["']([^"']+)["']([^>]*?)>(.*?)<\/a>/gi,
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
