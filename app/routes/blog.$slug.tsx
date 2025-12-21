import type {MetaFunction, LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';
import {useEffect, useRef} from 'react';
import {
  getArticle,
  generateMetaDescription,
  getCategoryFromArticle,
  DEFAULT_BLOG_HANDLE,
  type ShopifyArticle,
} from '~/lib/shopify-blog';
import {SEOAutomationService} from '~/preserved/seo-automation';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  if (!data?.article) {
    return [
      {title: 'Article Not Found | Vapourism'},
      {name: 'description', content: 'The article you are looking for could not be found.'},
    ];
  }

  const {article, category, metaDescription} = data;
  const fullTitle = `${article.title} | Vapourism Blog`;

  const metaTags = [
    {title: SEOAutomationService.truncateTitle(fullTitle)},
    {name: 'description', content: metaDescription},
    {property: 'og:title', content: article.title},
    {property: 'og:description', content: metaDescription},
    {property: 'og:type', content: 'article'},
    {property: 'og:url', content: `https://www.vapourism.co.uk/blog/${article.handle}`},
    {property: 'article:published_time', content: article.publishedAt},
    {property: 'article:author', content: article.authorV2?.name || 'Vapourism'},
    {property: 'article:section', content: category},
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:title', content: article.title},
    {name: 'twitter:description', content: metaDescription},
  ];

  // Add keywords if available
  if (article.tags.length > 0) {
    metaTags.push({name: 'keywords', content: article.tags.join(', ')});
  }

  // Add featured image if available
  if (article.image?.url) {
    metaTags.push(
      {property: 'og:image', content: article.image.url},
      {name: 'twitter:image', content: article.image.url},
    );
  }

  return metaTags;
};

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {slug} = params;

  if (!slug) {
    throw new Response('Not Found', {status: 404});
  }

  // Fetch article from Shopify
  const article = await getArticle(context.storefront, slug, DEFAULT_BLOG_HANDLE);

  if (!article) {
    throw new Response('Not Found', {status: 404});
  }

  // Get the current origin for the logo URL
  const url = new URL(request.url);
  const origin = url.origin;

  // Generate category and meta description
  const category = getCategoryFromArticle(article);
  const metaDescription = generateMetaDescription(article);

  // Generate JSON-LD structured data for the article
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: metaDescription,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: {
      '@type': 'Organization',
      name: article.authorV2?.name || 'Vapourism',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Vapourism',
      logo: {
        '@type': 'ImageObject',
        url: `${origin}/favicon.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${origin}/blog/${article.handle}`,
    },
    articleSection: category,
    keywords: article.tags.join(', '),
    ...(article.image?.url && {
      image: {
        '@type': 'ImageObject',
        url: article.image.url,
        ...(article.image.width && {width: article.image.width}),
        ...(article.image.height && {height: article.image.height}),
      },
    }),
  };

  return {
    article,
    category,
    metaDescription,
    structuredData,
  };
}

/**
 * ArticleContent component
 * Renders HTML content from Shopify with proper styling and error handling
 * 
 * SECURITY NOTE: This component uses dangerouslySetInnerHTML.
 * This is SAFE because:
 * 1. Content comes from Shopify's CMS (trusted source)
 * 2. Shopify sanitizes all HTML content before storing
 * 3. Content is managed by authorized store admins only
 * 4. No user-generated content from untrusted sources
 * 
 * Shopify's HTML is pre-sanitized and safe to render.
 */
function ArticleContent({contentHtml}: {contentHtml: string}) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !contentRef.current) return;

    // Add error handling to all images in the article content
    const images = contentRef.current.querySelectorAll('img');
    const retryAttempts = new WeakMap<HTMLImageElement, boolean>();
    const errorHandlers = new WeakMap<HTMLImageElement, EventListener>();
    
    images.forEach((img) => {
      // Add loading attribute if not present
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }

      // Create error handler for this specific image
      const handleError = (event: Event) => {
        const target = event.currentTarget as HTMLImageElement;
        
        // Only log in development
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to load image in article:', target.src);
        }
        
        // Try to fix common Shopify CDN URL issues (only once per image)
        const originalSrc = target.src;
        
        // If the image is from Shopify CDN and using a size parameter, try without it
        if (!retryAttempts.has(target) && 
            originalSrc.includes('cdn.shopify.com') && 
            originalSrc.includes('?')) {
          retryAttempts.set(target, true);
          const baseUrl = originalSrc.split('?')[0];
          if (process.env.NODE_ENV === 'development') {
            console.log('Retrying image without query params:', baseUrl);
          }
          target.src = baseUrl;
        } else {
          // Hide the broken image with a placeholder
          target.style.display = 'none';
          
          // Create a placeholder message
          const placeholder = document.createElement('div');
          placeholder.className = 'bg-slate-100 rounded-xl p-8 text-center text-slate-500 my-8';
          placeholder.setAttribute('role', 'img');
          placeholder.setAttribute('aria-label', 'Image could not be loaded');
          placeholder.innerHTML = `
            <svg class="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <p>Image could not be loaded</p>
          `;
          
          // Insert placeholder after the broken image safely
          const parent = target.parentNode;
          if (parent && target.nextSibling) {
            parent.insertBefore(placeholder, target.nextSibling);
          } else if (parent) {
            parent.appendChild(placeholder);
          }
        }
      };

      // Store the handler so we can remove it later
      errorHandlers.set(img, handleError);
      img.addEventListener('error', handleError);

      // Log image URLs for debugging (development only)
      if (process.env.NODE_ENV === 'development') {
        console.log('Article image found:', img.src);
      }
    });

    return () => {
      // Cleanup event listeners properly
      images.forEach((img) => {
        const handler = errorHandlers.get(img);
        if (handler) {
          img.removeEventListener('error', handler);
        }
      });
    };
  }, [contentHtml]);

  return (
    <div 
      ref={contentRef}
      className="article-content prose prose-lg prose-slate max-w-none
        prose-headings:font-semibold prose-headings:text-slate-900 prose-headings:tracking-tight
        prose-h1:text-3xl prose-h1:md:text-4xl prose-h1:mb-8 prose-h1:mt-16 first:prose-h1:mt-0 prose-h1:leading-[1.1]
        prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mb-6 prose-h2:mt-14 prose-h2:leading-[1.2]
        prose-h3:text-xl prose-h3:md:text-2xl prose-h3:mb-5 prose-h3:mt-12 prose-h3:leading-[1.3]
        prose-h4:text-lg prose-h4:md:text-xl prose-h4:mb-4 prose-h4:mt-10
        prose-p:text-slate-600 prose-p:leading-[1.85] prose-p:mb-7 prose-p:text-[1.0625rem] prose-p:md:text-[1.125rem]
        prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-8 prose-ul:space-y-3 prose-ul:text-slate-600
        prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-8 prose-ol:space-y-3 prose-ol:text-slate-600
        prose-li:text-slate-600 prose-li:leading-[1.85] prose-li:text-[1.0625rem] prose-li:md:text-[1.125rem]
        prose-a:text-[#5b2be0] prose-a:hover:text-[#1fb2ff] prose-a:no-underline prose-a:font-medium prose-a:transition-colors prose-a:duration-200
        prose-strong:text-slate-900 prose-strong:font-semibold
        prose-em:italic prose-em:text-slate-500
        prose-code:bg-slate-100 prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-code:text-sm prose-code:text-slate-800 prose-code:font-mono prose-code:before:content-[''] prose-code:after:content-['']
        prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-2xl prose-pre:p-6 prose-pre:overflow-x-auto prose-pre:my-10
        prose-img:rounded-2xl prose-img:shadow-xl prose-img:my-10 prose-img:w-full prose-img:h-auto prose-img:max-w-full
        prose-blockquote:border-l-4 prose-blockquote:border-[#5b2be0] prose-blockquote:pl-8 prose-blockquote:pr-6 prose-blockquote:py-4 prose-blockquote:not-italic prose-blockquote:text-slate-700 prose-blockquote:bg-gradient-to-r prose-blockquote:from-slate-50 prose-blockquote:to-white prose-blockquote:rounded-r-2xl prose-blockquote:my-10
        prose-hr:border-slate-200 prose-hr:my-14
        prose-table:border-collapse prose-table:w-full prose-table:my-10 prose-table:rounded-xl prose-table:overflow-hidden
        prose-th:bg-slate-100 prose-th:p-4 prose-th:text-left prose-th:font-semibold prose-th:text-slate-900 prose-th:border prose-th:border-slate-200
        prose-td:p-4 prose-td:border prose-td:border-slate-200 prose-td:text-slate-600
        prose-video:rounded-2xl prose-video:shadow-xl prose-video:my-10 prose-video:w-full"
      dangerouslySetInnerHTML={{__html: contentHtml}}
    />
  );
}

export default function BlogArticle() {
  const {article, category, structuredData} = useLoaderData<typeof loader>();
  const engagementTracked = useRef(false);
  const startTime = useRef<number>(0);
  const scrollDepthTracked = useRef<Set<number>>(new Set());

  // Track blog article engagement
  useEffect(() => {
    startTime.current = Date.now();

    // Track article view as a custom event
    if (typeof window !== 'undefined' && window.gtag && !engagementTracked.current) {
      window.gtag('event', 'view_blog_article', {
        article_title: article.title,
        article_category: category,
        article_slug: article.handle,
        article_author: article.authorV2?.name || 'Vapourism',
        article_tags: article.tags.join(','),
      });
      engagementTracked.current = true;
    }

    // Track engagement time when user leaves
    return () => {
      if (typeof window !== 'undefined' && window.gtag && startTime.current > 0) {
        const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
        
        // Only track if spent more than 5 seconds (actual engagement)
        if (timeSpent > 5) {
          window.gtag('event', 'blog_engagement', {
            article_title: article.title,
            article_slug: article.handle,
            engagement_time_seconds: timeSpent,
            value: timeSpent, // Use time as value for GA4
          });
        }
      }
    };
  }, [article.title, category, article.handle, article.authorV2?.name, article.tags]);

  // Track scroll depth
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const trackScrollDepth = () => {
      const scrollPercentage = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );

      // Track milestones: 25%, 50%, 75%, 100%
      const milestones = [25, 50, 75, 100];
      
      for (const milestone of milestones) {
        if (scrollPercentage >= milestone && !scrollDepthTracked.current.has(milestone)) {
          scrollDepthTracked.current.add(milestone);
          
          if (window.gtag) {
            window.gtag('event', 'scroll_depth', {
              article_title: article.title,
              article_slug: article.handle,
              scroll_depth_percentage: milestone,
              value: milestone,
            });
          }
        }
      }
    };

    window.addEventListener('scroll', trackScrollDepth, {passive: true});
    
    return () => {
      window.removeEventListener('scroll', trackScrollDepth);
    };
  }, [article.title, article.handle]);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(structuredData)}}
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Breadcrumb */}
        <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-sm sticky top-[var(--header-height,72px)] z-40">
          <div className="container mx-auto px-4 py-4">
            <ol className="flex items-center space-x-2 text-sm text-slate-500 max-w-4xl mx-auto">
              <li>
                <Link to="/" className="hover:text-[#5b2be0] transition-colors">
                  Home
                </Link>
              </li>
              <li className="text-slate-300">/</li>
              <li>
                <Link to="/blog" className="hover:text-[#5b2be0] transition-colors">
                  Blog
                </Link>
              </li>
              <li className="text-slate-300">/</li>
              <li className="text-slate-700 font-medium truncate max-w-48 md:max-w-none">{article.title}</li>
            </ol>
          </div>
        </nav>

        <div className="container mx-auto px-4">
          {/* Article Header */}
          <header className="py-12 md:py-16 lg:py-20 max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 text-sm text-slate-500 mb-8">
              <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#5b2be0]/10 to-[#1fb2ff]/10 text-[#5b2be0] px-4 py-2 rounded-full font-medium">
                {category}
              </span>
              <span className="text-slate-300">•</span>
              <time dateTime={article.publishedAt} className="font-medium">
                {new Date(article.publishedAt).toLocaleDateString('en-GB', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              {article.authorV2?.name && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="font-medium">By {article.authorV2.name}</span>
                </>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-slate-900 mb-8 leading-[1.15] tracking-tight">
              {article.title}
            </h1>
            {article.excerpt && (
              <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-3xl mx-auto">{article.excerpt}</p>
            )}
          </header>

          {/* Featured Image */}
          {article.image?.url && (
            <div className="mb-12 md:mb-16 max-w-5xl mx-auto">
              <img
                src={article.image.url}
                alt={article.image.altText || article.title}
                className="w-full rounded-3xl shadow-2xl"
                loading="eager"
                onError={(e) => {
                  // Hide image if it fails to load
                  e.currentTarget.style.display = 'none';
                  console.error('Failed to load featured image:', article.image?.url);
                }}
              />
            </div>
          )}

          {/* Article Content */}
          <article className="max-w-3xl mx-auto pb-16">
            <ArticleContent contentHtml={article.contentHtml} />
          </article>

          {/* Article Tags */}
          {article.tags.length > 0 && (
            <div className="max-w-3xl mx-auto pb-12 border-t border-slate-100 pt-10">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-semibold text-slate-900">Tags:</span>
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm bg-slate-100 text-slate-600 px-4 py-2 rounded-full hover:bg-slate-200 transition-colors cursor-default"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Back to Blog Link */}
          <div className="max-w-3xl mx-auto pb-20">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-[#5b2be0] hover:text-[#1fb2ff] font-semibold transition-colors group"
            >
              <span className="transition-transform group-hover:-translate-x-1">←</span>
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
