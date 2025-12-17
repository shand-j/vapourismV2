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
    articleSection: category,
    keywords: article.tags.join(', '),
    ...(article.image?.url && {
      image: {
        '@type': 'ImageObject',
        url: article.image.url,
        width: article.image.width,
        height: article.image.height,
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
 * Renders HTML content from Shopify with proper styling
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
  return (
    <div 
      className="article-content prose prose-slate max-w-none
        prose-headings:font-bold prose-headings:text-slate-900
        prose-h1:text-3xl prose-h1:mb-4 prose-h1:mt-8 first:prose-h1:mt-0
        prose-h2:text-2xl prose-h2:mb-3 prose-h2:mt-6
        prose-h3:text-xl prose-h3:mb-2 prose-h3:mt-4
        prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-4
        prose-ul:list-disc prose-ul:list-inside prose-ul:mb-4 prose-ul:space-y-1 prose-ul:text-slate-700
        prose-ol:list-decimal prose-ol:list-inside prose-ol:mb-4 prose-ol:space-y-1 prose-ol:text-slate-700
        prose-li:text-slate-700
        prose-a:text-violet-600 prose-a:hover:text-violet-700 prose-a:underline
        prose-strong:text-slate-900 prose-strong:font-semibold
        prose-em:italic
        prose-img:rounded-lg prose-img:shadow-md prose-img:my-6
        prose-blockquote:border-l-4 prose-blockquote:border-violet-600 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-slate-600
        prose-hr:border-slate-300 prose-hr:my-8"
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

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center space-x-2 text-slate-600">
            <li>
              <Link to="/" className="hover:text-violet-600">
                Home
              </Link>
            </li>
            <li>•</li>
            <li>
              <Link to="/blog" className="hover:text-violet-600">
                Blog
              </Link>
            </li>
            <li>•</li>
            <li className="text-slate-900">{article.title}</li>
          </ol>
        </nav>

        {/* Article Header */}
        <header className="mb-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
            <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full">
              {category}
            </span>
            <span>•</span>
            <time dateTime={article.publishedAt}>
              {new Date(article.publishedAt).toLocaleDateString('en-GB', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span>•</span>
            <span>By {article.authorV2?.name || 'Vapourism'}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="text-xl text-slate-600">{article.excerpt}</p>
          )}
        </header>

        {/* Featured Image */}
        {article.image && (
          <div className="mb-8 max-w-4xl mx-auto">
            <img
              src={article.image.url}
              alt={article.image.altText || article.title}
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Article Content */}
        <article className="max-w-4xl mx-auto">
          <ArticleContent contentHtml={article.contentHtml} />
        </article>

        {/* Article Tags */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-semibold text-slate-700">Tags:</span>
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="text-sm bg-slate-100 text-slate-700 px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Back to Blog Link */}
        <div className="mt-12 max-w-4xl mx-auto">
          <Link
            to="/blog"
            className="inline-flex items-center text-violet-600 hover:text-violet-700 font-semibold"
          >
            ← Back to Blog
          </Link>
        </div>
      </div>
    </>
  );
}
