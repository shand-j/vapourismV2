import type {MetaFunction, LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Link, useLoaderData} from '@remix-run/react';
import {getAllArticles, type BlogArticle} from '~/data/blog';

export const meta: MetaFunction = () => {
  const title = 'Blog | Vapourism - Vaping Guides & Education';
  const description = 'Expert guides and educational content about vaping, nicotine products, and harm reduction. Stay informed with the latest insights from Vapourism.';
  
  return [
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
    {property: 'og:url', content: 'https://www.vapourism.co.uk/blog'},
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:site', content: '@vapourismuk'},
    {name: 'twitter:title', content: title},
    {name: 'twitter:description', content: description},
  ];
};

export async function loader({}: LoaderFunctionArgs) {
  const articles = getAllArticles();
  
  return {
    articles,
  };
}

export default function BlogIndex() {
  const {articles} = useLoaderData<typeof loader>();

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
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>

      {articles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-600">No articles available yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}

function ArticleCard({article}: {article: BlogArticle}) {
  return (
    <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <Link to={`/blog/${article.slug}`} className="block">
        {article.featuredImage && (
          <div className="aspect-video bg-slate-200">
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
            <span className="bg-violet-100 text-violet-700 px-2 py-1 rounded">
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
            {article.metaDescription}
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
