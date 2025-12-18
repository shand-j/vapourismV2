import type {MetaFunction, LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';
import {useEffect, useRef} from 'react';
import {getArticleBySlug, type BlogArticle} from '~/data/blog';
import {SEOAutomationService} from '~/preserved/seo-automation';
import {
  createWordPressClient,
  isWordPressEnabled,
  transformWordPressPost,
} from '~/lib/wordpress-client';

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

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {slug} = params;
  const {env} = context;

  if (!slug) {
    throw new Response('Not Found', {status: 404});
  }

  let article: BlogArticle | null = null;
  let source: 'wordpress' | 'static' = 'static';

  // Try WordPress first if enabled
  if (isWordPressEnabled(env)) {
    try {
      const wpClient = createWordPressClient(env);
      if (wpClient) {
        const post = await wpClient.getPostBySlug(slug);
        if (post) {
          article = transformWordPressPost(post);
          source = 'wordpress';
        }
      }
    } catch (error) {
      console.error('WordPress fetch error, falling back to static:', error);
    }
  }

  // Fall back to static content
  if (!article) {
    article = getArticleBySlug(slug) ?? null;
  }

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
    source,
  };
}

/**
 * ArticleContent component
 * Renders both markdown (static) and HTML (WordPress) content with proper styling
 * 
 * SECURITY NOTE: This component uses dangerouslySetInnerHTML for performance and simplicity.
 * This is SAFE because:
 * 1. Content comes from TypeScript files in our codebase OR trusted WordPress CMS
 * 2. Content is version-controlled (static) or managed by authenticated editors (WordPress)
 * 3. WordPress content is sanitized by WordPress before output
 * 4. Only basic markdown formatting is processed for static content
 * 
 * For WordPress content, we trust the CMS has already sanitized the HTML.
 * If you need additional sanitization, consider using DOMPurify.
 */

// Tailwind prose classes for WordPress HTML content
const wordpressProseClasses = [
  'article-content',
  'prose',
  'prose-slate',
  'max-w-none',
  // Headings
  'prose-headings:text-slate-900',
  'prose-headings:font-bold',
  'prose-h1:text-3xl',
  'prose-h1:mb-4',
  'prose-h1:mt-8',
  'prose-h2:text-2xl',
  'prose-h2:mb-3',
  'prose-h2:mt-6',
  'prose-h3:text-xl',
  'prose-h3:mb-2',
  'prose-h3:mt-4',
  // Paragraphs
  'prose-p:text-slate-700',
  'prose-p:leading-relaxed',
  'prose-p:mb-4',
  // Lists
  'prose-ul:list-disc',
  'prose-ul:list-inside',
  'prose-ul:mb-4',
  'prose-ul:space-y-1',
  'prose-ol:list-decimal',
  'prose-ol:list-inside',
  'prose-ol:mb-4',
  'prose-ol:space-y-1',
  'prose-li:text-slate-700',
  // Links
  'prose-a:text-violet-600',
  'prose-a:hover:text-violet-700',
  'prose-a:underline',
  // Other elements
  'prose-strong:text-slate-900',
  'prose-img:rounded-lg',
  'prose-img:shadow-md',
  'prose-img:my-6',
  'prose-blockquote:border-l-4',
  'prose-blockquote:border-violet-300',
  'prose-blockquote:pl-4',
  'prose-blockquote:italic',
].join(' ');

function ArticleContent({content, isHtml = false}: {content: string; isHtml?: boolean}) {
  // Detect if content is HTML (WordPress) or markdown (static)
  // WordPress content typically starts with HTML tags
  const isHtmlContent = isHtml || content.trim().startsWith('<');
  
  if (isHtmlContent) {
    // WordPress HTML content - render with prose styling
    return (
      <div 
        className={wordpressProseClasses}
        dangerouslySetInnerHTML={{__html: content}}
      />
    );
  }
  
  // Markdown (static) content - process line by line
  const lines = content.split('\n');
  const elements: JSX.Element[] = [];
  let listItems: string[] = [];

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
    // Only process bold and italic - content is from trusted source
    // Use non-greedy patterns to prevent catastrophic backtracking
    return text
      .replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+?)\*/g, '<em>$1</em>');
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    
    if (!trimmed) {
      flushList();
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
  const {article, structuredData, source} = useLoaderData<typeof loader>();
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
          <ArticleContent content={article.content} isHtml={source === 'wordpress'} />
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
