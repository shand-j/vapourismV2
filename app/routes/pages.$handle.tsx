import type {LoaderFunctionArgs, MetaFunction} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import React from 'react';
import {SEOAutomationService} from '~/preserved/seo-automation';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  const pageTitle = data?.page.title ?? '';
  const fullTitle = `Vapourism | ${pageTitle}`;
  return [{title: SEOAutomationService.truncateTitle(fullTitle)}];
};

export async function loader({params, context}: LoaderFunctionArgs) {
  if (!params.handle) {
    throw new Error('Missing page handle');
  }

  const {page} = await context.storefront.query(PAGE_QUERY, {
    variables: {
      handle: params.handle,
    },
  });

  if (!page) {
    throw new Response('Not Found', {status: 404});
  }

  return {page};
}

export default function Page() {
  const {page} = useLoaderData<typeof loader>();

  return (
    <div className="container-custom py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">{page.title}</h1>
      </header>
      <main
        className="prose prose-slate max-w-none"
        dangerouslySetInnerHTML={{__html: page.body}}
      />
    </div>
  );
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      handle
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
` as const;
