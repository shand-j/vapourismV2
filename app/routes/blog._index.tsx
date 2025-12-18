import type {MetaFunction, LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Link, useLoaderData, useSearchParams} from '@remix-run/react';
import {
  getBlogArticles,
  generateMetaDescription,
  getCategoryFromArticle,
  DEFAULT_BLOG_HANDLE,
  type ShopifyArticle,
} from '~/lib/shopify-blog';

export const meta: MetaFunction<typeof loader> = ({data, location}) => {
  const title = 'Blog | Vapourism - Vaping Guides & Education';
  const description = 'Expert guides and educational content about vaping, nicotine products, and harm reduction. Stay informed with the latest insights from Vapourism.';
  
  // Build canonical URL for this specific page
  const baseUrl = 'https://www.vapourism.co.uk';
  const canonicalUrl = `${baseUrl}${location.pathname}${location.search}`;
  
  const metaTags: Array<any> = [
    {title},
    {
      name: 'description',
      content: description,
    },
    {
      name: 'keywords',
      content: 'vaping, e-liquids, nicotine products, vaping guides, harm reduction, vape reviews, vaping trends, UK vaping, vape safety, vaping education',
    },
    {property: 'og:title', content: 'Blog | Vapourism'},
    {property: 'og:description', content: description},
    {property: 'og:type', content: 'website'},
    {property: 'og:url', content: canonicalUrl},
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:site', content: '@vapourismuk'},
    {name: 'twitter:title', content: title},
    {name: 'twitter:description', content: description},
  ];
  
  // Add self-referencing canonical tag for SEO
  metaTags.push({tagName: 'link', rel: 'canonical', href: canonicalUrl});
  
  // Add pagination link tags for better crawlability
  if (data?.pageInfo) {
    // Add rel="next" if there's a next page
    if (data.pageInfo.hasNextPage && data.pageInfo.endCursor) {
      const nextUrl = `${baseUrl}/blog?after=${encodeURIComponent(data.pageInfo.endCursor)}`;
      metaTags.push({tagName: 'link', rel: 'next', href: nextUrl});
    }
    
    // Add rel="prev" if we're not on the first page
    if (data.pageInfo.hasPreviousPage) {
      const prevUrl = `${baseUrl}/blog`;
      metaTags.push({tagName: 'link', rel: 'prev', href: prevUrl});
    }
  }
  
  return metaTags;
};

export async function loader({context, request}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const after = url.searchParams.get('after') || undefined;
  
  // Fetch articles from Shopify
  const {articles, pageInfo} = await getBlogArticles(context.storefront, {
    blogHandle: DEFAULT_BLOG_HANDLE,
    after,
  });
  
  // Return data with pageInfo for meta function to access
  return {
    articles,
    pageInfo: {
      hasNextPage: pageInfo.hasNextPage,
      hasPreviousPage: pageInfo.hasPreviousPage,
      startCursor: pageInfo.startCursor,
      endCursor: pageInfo.endCursor,
    },
  };
}

export default function BlogIndex() {
  const {articles, pageInfo} = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Vapourism Blog: Expert UK Vaping, Nicotine & Harm Reduction Guides
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Expert guides, educational content, and insights about vaping,
          nicotine products, and harm reduction.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {articles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-600">No articles available yet. Check back soon!</p>
        </div>
      )}

      {/* Pagination */}
      {(pageInfo.hasNextPage || pageInfo.hasPreviousPage) && (
        <div className="mt-12 flex justify-center gap-4">
          {pageInfo.hasPreviousPage && (
            <Link
              to={`/blog`}
              className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
            >
              ← First Page
            </Link>
          )}
          {pageInfo.hasNextPage && pageInfo.endCursor && (
            <Link
              to={`/blog?after=${encodeURIComponent(pageInfo.endCursor)}`}
              className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
            >
              Next Page →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

function ArticleCard({article}: {article: ShopifyArticle}) {
  const category = getCategoryFromArticle(article);
  const metaDescription = generateMetaDescription(article);

  return (
    <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <Link to={`/blog/${article.handle}`} className="block">
        {article.image && (
          <div className="aspect-video bg-slate-200">
            <img
              src={article.image.url}
              alt={article.image.altText || article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
            <span className="bg-violet-100 text-violet-700 px-2 py-1 rounded">
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
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2 hover:text-violet-600 transition-colors">
            {article.title}
          </h2>
          <p className="text-slate-600 overflow-hidden" style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            maxHeight: '4.5rem'
          }}>
            {metaDescription}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </article>
  );
}
