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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <header className="mb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Vapourism Blog
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
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
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-slate-100 rounded-xl">
              <p className="text-xl text-slate-600 mb-2">No articles available yet</p>
              <p className="text-slate-500">Check back soon for expert vaping guides and insights!</p>
            </div>
          </div>
        )}

        {/* Pagination */}
        {(pageInfo.hasNextPage || pageInfo.hasPreviousPage) && (
          <div className="mt-16 flex justify-center gap-4">
            {pageInfo.hasPreviousPage && (
              <Link
                to={`/blog`}
                className="px-8 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
              >
                ← First Page
              </Link>
            )}
            {pageInfo.hasNextPage && pageInfo.endCursor && (
              <Link
                to={`/blog?after=${encodeURIComponent(pageInfo.endCursor)}`}
                className="px-8 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
              >
                Next Page →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ArticleCard({article}: {article: ShopifyArticle}) {
  const category = getCategoryFromArticle(article);
  const metaDescription = generateMetaDescription(article);

  return (
    <article className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 hover:border-violet-200 group">
      <Link to={`/blog/${article.handle}`} className="block">
        {article.image?.url && (
          <div className="aspect-video bg-slate-200 overflow-hidden">
            <img
              src={article.image.url}
              alt={article.image.altText || article.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                // Hide parent container if image fails to load
                e.currentTarget.parentElement!.style.display = 'none';
              }}
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
            <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full font-medium">
              {category}
            </span>
            <span className="text-slate-400">•</span>
            <time dateTime={article.publishedAt}>
              {new Date(article.publishedAt).toLocaleDateString('en-GB', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-violet-600 transition-colors leading-tight line-clamp-2">
            {article.title}
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4 line-clamp-3">
            {metaDescription}
          </p>
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {article.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full hover:bg-slate-200 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
