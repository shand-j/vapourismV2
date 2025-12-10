/**
 * Brand Section Component for Product Pages
 * 
 * Displays brand marketing materials from media packs
 * Lazy-loaded below the fold for performance
 */

import {Link} from '@remix-run/react';
import {useState} from 'react';
import type {BrandAssets} from '../../lib/brand-assets';
import {
  getBrandPrimaryColor,
  formatSocialMediaUrl,
  hasBrandAssetType,
} from '../../lib/brand-assets';

interface BrandSectionProps {
  brand: BrandAssets;
  productHandle?: string;
}

export function BrandSection({brand, productHandle}: BrandSectionProps) {
  const [imageError, setImageError] = useState<Set<string>>(new Set());

  if (!brand || !brand.hasMediaPack) {
    return null;
  }

  const primaryColor = getBrandPrimaryColor(brand);
  const hasLogo = hasBrandAssetType(brand, 'logo');
  const hasLifestyle = hasBrandAssetType(brand, 'lifestyle');

  const handleImageError = (url: string) => {
    setImageError((prev) => new Set(prev).add(url));
  };

  return (
    <section
      className="bg-gray-50 py-12 my-8 rounded-lg"
      aria-label={`About ${brand.displayName}`}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Brand Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            {hasLogo && brand.logos.primary && !imageError.has(brand.logos.primary) && (
              <img
                src={brand.logos.primary}
                alt={`${brand.displayName} logo`}
                className="h-12 w-auto"
                onError={() => handleImageError(brand.logos.primary!)}
                loading="lazy"
              />
            )}
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {brand.displayName}
              </h2>
              {brand.website && (
                <Link
                  to={brand.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-blue-600 mt-1 inline-flex items-center"
                >
                  Visit website
                  <svg
                    className="ml-1 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </Link>
              )}
            </div>
          </div>

          {/* Social Media Links */}
          {brand.socialMedia && (
            <div className="flex gap-3">
              {brand.socialMedia.instagram && (
                <a
                  href={formatSocialMediaUrl(
                    'instagram',
                    brand.socialMedia.instagram
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 hover:text-pink-600 transition-colors"
                  aria-label={`${brand.displayName} on Instagram`}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              )}
              {brand.socialMedia.facebook && (
                <a
                  href={formatSocialMediaUrl(
                    'facebook',
                    brand.socialMedia.facebook
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                  aria-label={`${brand.displayName} on Facebook`}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              )}
              {brand.socialMedia.twitter && (
                <a
                  href={formatSocialMediaUrl(
                    'twitter',
                    brand.socialMedia.twitter
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 hover:text-blue-400 transition-colors"
                  aria-label={`${brand.displayName} on Twitter`}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Brand Story */}
        {brand.brandStory && (
          <div className="mb-8">
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
              {brand.brandStory}
            </p>
          </div>
        )}

        {/* Lifestyle Imagery */}
        {hasLifestyle && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {brand.lifestyle.map((image) => {
              if (imageError.has(image.url)) return null;

              return (
                <div
                  key={image.url}
                  className="relative aspect-video rounded-lg overflow-hidden group"
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={() => handleImageError(image.url)}
                  />
                  {image.credit && (
                    <span className="absolute bottom-2 right-2 text-xs text-white bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
                      {image.credit}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Brand Guidelines Link */}
        {brand.guidelines && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <a
              href={brand.guidelines}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <svg
                className="mr-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              View Brand Guidelines
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
