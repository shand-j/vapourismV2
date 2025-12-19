import type {MetaFunction, LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';
import {useEffect, useRef} from 'react';
import {getArticleBySlug, type BlogArticle} from '~/data/blog';
import {SEOAutomationService} from '~/preserved/seo-automation';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  if (!data?.article) {
    return [
      {title: 'Article Not Found | Vapourism'},
      {name: 'description', content: 'The article you are looking for could not be found.'},
    ];
  }

  const {article} = data;
  const fullTitle = `${article.title} | Vapourism Blog`;

  return [
    {title: SEOAutomationService.truncateTitle(fullTitle)},
    {name: 'description', content: article.metaDescription},
    ...(article.metaKeywords ? [{name: 'keywords', content: article.metaKeywords}] : []),
    {property: 'og:title', content: article.title},
    {property: 'og:description', content: article.metaDescription},
    {property: 'og:type', content: 'article'},
    {property: 'og:url', content: `https://www.vapourism.co.uk/blog/${article.slug}`},
    {property: 'article:published_time', content: article.publishedDate},
    {property: 'article:modified_time', content: article.lastModified},
    {property: 'article:author', content: article.author},
    {property: 'article:section', content: article.category},
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:title', content: article.title},
    {name: 'twitter:description', content: article.metaDescription},
  ];
};

export async function loader({params, request}: LoaderFunctionArgs) {
  const {slug} = params;

  if (!slug) {
    throw new Response('Not Found', {status: 404});
  }

  const article = getArticleBySlug(slug);

  if (!article) {
    throw new Response('Not Found', {status: 404});
  }

  // Get the current origin for the logo URL
  const url = new URL(request.url);
  const origin = url.origin;

  // Generate JSON-LD structured data for the article
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.metaDescription,
    datePublished: article.publishedDate,
    dateModified: article.lastModified,
    author: {
      '@type': 'Organization',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Vapourism',
      logo: {
        '@type': 'ImageObject',
        url: `${origin}/favicon.svg`,
      },
    },
    articleSection: article.category,
    keywords: article.tags.join(', '),
  };

  return {
    article,
    structuredData,
  };
}

/**
 * ArticleContent component
 * Renders markdown content with proper HTML structure and styling
 * 
 * SECURITY NOTE: This component uses dangerouslySetInnerHTML for performance and simplicity.
 * This is SAFE because:
 * 1. Content comes from TypeScript files in our codebase (not user input)
 * 2. Content is version-controlled and code-reviewed
 * 3. Content is known at build time
 * 4. Only basic markdown formatting is processed (bold, italic, links)
 * 5. No user-generated content or external sources
 * 
 * If you need to accept user-generated content in the future, use a proper
 * markdown library with sanitization (e.g., marked + DOMPurify).
 */
function ArticleContent({content, inlineImages}: {content: string; inlineImages?: BlogArticle['inlineImages']}) {
  const lines = content.split('\n');
  const elements: JSX.Element[] = [];
  let listItems: string[] = [];

  // Create a map for quick image lookup
  const imageMap = new Map(inlineImages?.map(img => [img.id, img]) || []);

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="list-disc list-inside mb-4 space-y-1 text-slate-700">
          {listItems.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{__html: item}} />
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  const processInlineFormatting = (text: string): string => {
    // Process markdown formatting - content is from trusted source
    // Use non-greedy patterns to prevent catastrophic backtracking
    return text
      // Links: [text](url) -> <a href="url">text</a>
      .replace(/\[([^\]]+?)\]\(([^)]+?)\)/g, '<a href="$2" class="text-violet-600 hover:text-violet-700 underline">$1</a>')
      // Bold: **text** -> <strong>text</strong> (allow * inside, ensure ** are true delimiters)
      .replace(/(?<!\*)\*\*(.+?)\*\*(?!\*)/g, '<strong>$1</strong>')
      // Italic: *text* -> <em>text</em> (match single-asterisk delimiters only)
      .replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>');
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    
    if (!trimmed) {
      flushList();
      return;
    }

    // Check for inline image marker: {{image:id}}
    const imageMatch = trimmed.match(/^\{\{image:([^}]+)\}\}$/);
    if (imageMatch) {
      flushList();
      const imageId = imageMatch[1];
      const image = imageMap.get(imageId);
      if (image) {
        elements.push(
          <figure key={index} className="my-8">
            <img
              src={image.src}
              alt={image.alt}
              className="w-full rounded-lg shadow-md"
              loading="lazy"
            />
            {image.caption && (
              <figcaption className="mt-2 text-sm text-slate-500 text-center italic">
                {image.caption}
              </figcaption>
            )}
          </figure>
        );
      } else if (process.env.NODE_ENV === 'development') {
        console.warn(
          `[blog.$slug] Inline image reference "${imageId}" not found in imageMap.`,
          {
            imageId,
            availableImageIds: Array.from(imageMap.keys?.() ?? []),
          }
        );
      }
      return;
    }

    // Headers
    if (trimmed.startsWith('# ')) {
      flushList();
      elements.push(
        <h1 key={index} className="text-3xl font-bold text-slate-900 mb-4 mt-8 first:mt-0">
          {trimmed.substring(2)}
        </h1>
      );
    } else if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={index} className="text-2xl font-bold text-slate-900 mb-3 mt-6">
          {trimmed.substring(3)}
        </h2>
      );
    } else if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={index} className="text-xl font-semibold text-slate-900 mb-2 mt-4">
          {trimmed.substring(4)}
        </h3>
      );
    } else if (trimmed === '---') {
      flushList();
      elements.push(
        <hr key={index} className="border-t border-slate-300 my-8" />
      );
    } else if (trimmed.startsWith('* ')) {
      // Collect list items
      listItems.push(processInlineFormatting(trimmed.substring(2)));
    } else {
      // Regular paragraph
      flushList();
      elements.push(
        <p 
          key={index} 
          className="text-slate-700 leading-relaxed mb-4"
          dangerouslySetInnerHTML={{__html: processInlineFormatting(trimmed)}}
        />
      );
    }
  });

  flushList(); // Flush any remaining list items

  return <div className="article-content">{elements}</div>;
}

export default function BlogArticle() {
  const {article, structuredData} = useLoaderData<typeof loader>();
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
        article_category: article.category,
        article_slug: article.slug,
        article_author: article.author,
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
            article_slug: article.slug,
            engagement_time_seconds: timeSpent,
            value: timeSpent, // Use time as value for GA4
          });
        }
      }
    };
  }, [article.title, article.category, article.slug, article.author, article.tags]);

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
              article_slug: article.slug,
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
  }, [article.title, article.slug]);

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
              {article.category}
            </span>
            <span>•</span>
            <time dateTime={article.publishedDate}>
              {new Date(article.publishedDate).toLocaleDateString('en-GB', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span>•</span>
            <span>By {article.author}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {article.title}
          </h1>
          <p className="text-xl text-slate-600">{article.metaDescription}</p>
        </header>

        {/* Featured Image */}
        {article.featuredImage && (
          <div className="mb-8 max-w-4xl mx-auto">
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Article Content */}
        <article className="max-w-4xl mx-auto">
          <ArticleContent content={article.content} inlineImages={article.inlineImages} />
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
