import type {LoaderFunctionArgs, MetaFunction} from '@shopify/remix-oxygen';

export const meta: MetaFunction = () => [
  {title: 'Login | Vapourism'},
  {name: 'robots', content: 'noindex, nofollow'},
];

export async function loader({context}: LoaderFunctionArgs) {
  return context.customerAccount.login({
    countryCode: context.storefront.i18n.country,
  });
}
