import type {MetaFunction, LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Link, useLoaderData} from '@remix-run/react';
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
  
  const metaTags = [
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <header className="mb-16 lg:mb-20 text-center max-w-4xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400 mb-4">
            Insights & Guides
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-slate-900 mb-6 leading-[1.1] tracking-tight">
            Vapourism Blog
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
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
            <div className="inline-block p-10 bg-white rounded-3xl shadow-sm border border-slate-100">
              <p className="text-xl text-slate-600 mb-2">No articles available yet</p>
              <p className="text-slate-400">Check back soon for expert vaping guides and insights!</p>
            </div>
          </div>
        )}

        {/* Pagination */}
        {(pageInfo.hasNextPage || pageInfo.hasPreviousPage) && (
          <div className="mt-16 lg:mt-20 flex justify-center gap-4">
            {pageInfo.hasPreviousPage && (
              <Link
                to={`/blog`}
                className="px-8 py-4 bg-gradient-to-r from-[#5b2be0] to-[#1fb2ff] text-white rounded-full hover:shadow-lg hover:shadow-[#5b2be0]/25 transition-all duration-300 font-semibold"
              >
                ← First Page
              </Link>
            )}
            {pageInfo.hasNextPage && pageInfo.endCursor && (
              <Link
                to={`/blog?after=${encodeURIComponent(pageInfo.endCursor)}`}
                className="px-8 py-4 bg-gradient-to-r from-[#5b2be0] to-[#1fb2ff] text-white rounded-full hover:shadow-lg hover:shadow-[#5b2be0]/25 transition-all duration-300 font-semibold"
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
    <article className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 hover:border-slate-200">
      <Link to={`/blog/${article.handle}`} className="block">
        {article.image?.url && (
          <div className="aspect-[16/10] bg-slate-100 overflow-hidden">
            <img
              src={article.image.url}
              alt={article.image.altText || article.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                // Hide parent container if image fails to load
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  parent.style.display = 'none';
                }
              }}
            />
          </div>
        )}
        <div className="p-6 lg:p-8">
          <div className="flex items-center gap-3 text-sm text-slate-500 mb-4">
            <span className="inline-flex items-center bg-gradient-to-r from-[#5b2be0]/10 to-[#1fb2ff]/10 text-[#5b2be0] px-3 py-1.5 rounded-full font-medium text-xs">
              {category}
            </span>
            <span className="text-slate-300">•</span>
            <time dateTime={article.publishedAt} className="font-medium">
              {new Date(article.publishedAt).toLocaleDateString('en-GB', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </time>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-[#5b2be0] transition-colors leading-tight line-clamp-2 tracking-tight">
            {article.title}
          </h2>
          <p className="text-slate-500 leading-relaxed mb-5 line-clamp-3 text-[0.9375rem]">
            {metaDescription}
          </p>
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {article.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full"
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
