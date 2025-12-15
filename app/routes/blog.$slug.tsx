import type {MetaFunction, LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';
import {getArticleBySlug} from '~/data/blog';
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
    {property: 'og:title', content: article.title},
    {property: 'og:description', content: article.metaDescription},
    {property: 'og:type', content: 'article'},
    {property: 'article:published_time', content: article.publishedDate},
    {property: 'article:modified_time', content: article.lastModified},
    {property: 'article:author', content: article.author},
    {property: 'article:section', content: article.category},
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:title', content: article.title},
    {name: 'twitter:description', content: article.metaDescription},
  ];
};

export async function loader({params}: LoaderFunctionArgs) {
  const {slug} = params;

  if (!slug) {
    throw new Response('Not Found', {status: 404});
  }

  const article = getArticleBySlug(slug);

  if (!article) {
    throw new Response('Not Found', {status: 404});
  }

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
        url: 'https://vapourism.co.uk/logo.png',
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

export default function BlogArticle() {
  const {article, structuredData} = useLoaderData<typeof loader>();

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
        <article className="prose prose-slate prose-lg max-w-4xl mx-auto">
          <div
            dangerouslySetInnerHTML={{
              __html: article.content
                .split('\n')
                .map((line) => {
                  // Convert markdown to HTML (basic implementation)
                  // Handle headers
                  if (line.startsWith('# ')) {
                    return `<h1>${line.substring(2)}</h1>`;
                  }
                  if (line.startsWith('## ')) {
                    return `<h2>${line.substring(3)}</h2>`;
                  }
                  if (line.startsWith('### ')) {
                    return `<h3>${line.substring(4)}</h3>`;
                  }
                  // Handle bold
                  line = line.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
                  // Handle italic
                  line = line.replace(/\*([^*]+)\*/g, '<em>$1</em>');
                  // Handle lists
                  if (line.startsWith('* ')) {
                    return `<li>${line.substring(2)}</li>`;
                  }
                  // Handle horizontal rule
                  if (line === '---') {
                    return '<hr />';
                  }
                  // Regular paragraph
                  if (line.trim()) {
                    return `<p>${line}</p>`;
                  }
                  return '';
                })
                .join('\n'),
            }}
          />
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
