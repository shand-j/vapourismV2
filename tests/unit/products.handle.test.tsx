import {describe, it, expect, vi} from 'vitest';
import {sanitizeProductDescription} from '~/lib/html-sanitizer';

/**
 * Integration tests to verify product description sanitization
 * works correctly in the context of the product detail page
 */
describe('Product Description Sanitization Integration', () => {
  it('should sanitize product description with external manufacturer link', () => {
    // Simulate a real Shopify product description that might have an external link
    const rawDescription = `
      <div>
        <h3>Premium E-Liquid</h3>
        <p>This product is made by our manufacturing partner. 
        Visit <a href="https://manufacturer-site.com/about">their website</a> for more info.</p>
        <p>Check out our <a href="/collections/e-liquids">full e-liquid collection</a>.</p>
        <ul>
          <li>100ml bottle</li>
          <li>70/30 VG/PG</li>
        </ul>
      </div>
    `;

    const sanitized = sanitizeProductDescription(rawDescription);

    // Internal link should remain
    expect(sanitized).toContain('href="/collections/e-liquids"');
    expect(sanitized).toContain('full e-liquid collection');

    // External link should be removed but text preserved
    expect(sanitized).toContain('their website');
    expect(sanitized).not.toContain('manufacturer-site.com');
    expect(sanitized).not.toContain('href="https://manufacturer-site.com');

    // Other HTML should be preserved
    expect(sanitized).toContain('<h3>Premium E-Liquid</h3>');
    expect(sanitized).toContain('<ul>');
    expect(sanitized).toContain('<li>100ml bottle</li>');
  });

  it('should handle product descriptions with competitor comparison links', () => {
    const rawDescription = `
      <p>Better than <a href="https://competitor.com">Brand X</a>!</p>
      <p>Also superior to <a href="https://another-competitor.com/products">Brand Y</a>.</p>
      <p>See our <a href="/products">full catalog</a> for more options.</p>
    `;

    const sanitized = sanitizeProductDescription(rawDescription);

    // Competitor links removed but text preserved
    expect(sanitized).toContain('Brand X');
    expect(sanitized).toContain('Brand Y');
    expect(sanitized).not.toContain('competitor.com');
    expect(sanitized).not.toContain('another-competitor.com');

    // Internal link preserved
    expect(sanitized).toContain('href="/products"');
  });

  it('should preserve product descriptions without any links', () => {
    const rawDescription = `
      <div class="product-info">
        <p><strong>Features:</strong></p>
        <ul>
          <li>Rechargeable battery</li>
          <li>Adjustable airflow</li>
          <li>LED indicator</li>
        </ul>
        <p>Available in multiple colors.</p>
      </div>
    `;

    const sanitized = sanitizeProductDescription(rawDescription);

    // Should be unchanged
    expect(sanitized).toBe(rawDescription);
  });

  it('should handle descriptions with internal Vapourism domain links', () => {
    const rawDescription = `
      <p>This device is compatible with our 
      <a href="https://vapourism.co.uk/collections/coils">replacement coils</a>.</p>
      <p>Learn more about <a href="https://www.vapourism.co.uk/pages/warranty">our warranty</a>.</p>
    `;

    const sanitized = sanitizeProductDescription(rawDescription);

    // Both internal domain links should be preserved
    expect(sanitized).toContain('href="https://vapourism.co.uk/collections/coils"');
    expect(sanitized).toContain('href="https://www.vapourism.co.uk/pages/warranty"');
    expect(sanitized).toBe(rawDescription); // Should be unchanged
  });

  it('should handle mixed content with various link types', () => {
    const rawDescription = `
      <div>
        <h2>Product Details</h2>
        <p>Premium quality device from <a href="https://external-brand.com">External Brand</a>.</p>
        <p>Compatible with <a href="/collections/accessories">our accessories</a>.</p>
        <p>Visit <a href="https://vapourism.co.uk/support">our support page</a> for help.</p>
        <p>Learn more at <a href="https://another-external.com/info">external info</a>.</p>
        <p>Jump to <a href="#specifications">specifications</a> below.</p>
      </div>
    `;

    const sanitized = sanitizeProductDescription(rawDescription);

    // External links removed
    expect(sanitized).not.toContain('external-brand.com');
    expect(sanitized).not.toContain('another-external.com');
    expect(sanitized).toContain('External Brand'); // Text preserved
    expect(sanitized).toContain('external info'); // Text preserved

    // Internal links preserved
    expect(sanitized).toContain('href="/collections/accessories"');
    expect(sanitized).toContain('href="https://vapourism.co.uk/support"');
    expect(sanitized).toContain('href="#specifications"');

    // HTML structure preserved
    expect(sanitized).toContain('<h2>Product Details</h2>');
  });

  it('should handle empty or null descriptions gracefully', () => {
    expect(sanitizeProductDescription(null)).toBe('');
    expect(sanitizeProductDescription(undefined)).toBe('');
    expect(sanitizeProductDescription('')).toBe('');
  });

  it('should preserve complex HTML formatting in real product descriptions', () => {
    const rawDescription = `
      <div class="description">
        <h3 style="color: #333;">Key Features</h3>
        <table>
          <tr><td>Capacity</td><td>100ml</td></tr>
          <tr><td>VG/PG</td><td>70/30</td></tr>
        </table>
        <p>Made by <a href="https://brand-website.com" target="_blank">Brand Name</a>.</p>
        <p><em>Note:</em> Age verification required at checkout.</p>
        <img src="/images/product-badge.png" alt="Quality Badge" />
      </div>
    `;

    const sanitized = sanitizeProductDescription(rawDescription);

    // HTML structure preserved
    expect(sanitized).toContain('<h3 style="color: #333;">Key Features</h3>');
    expect(sanitized).toContain('<table>');
    expect(sanitized).toContain('<tr><td>Capacity</td><td>100ml</td></tr>');
    expect(sanitized).toContain('<em>Note:</em>');
    expect(sanitized).toContain('<img src="/images/product-badge.png"');

    // External link removed
    expect(sanitized).toContain('Brand Name');
    expect(sanitized).not.toContain('brand-website.com');
  });
});
