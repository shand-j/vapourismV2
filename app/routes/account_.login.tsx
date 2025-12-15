import type {LoaderFunctionArgs, MetaFunction} from '@shopify/remix-oxygen';

export const meta: MetaFunction = () => [
  {title: 'Login | Vapourism Customer Account'},
  {
    name: 'description',
    content: 'Login to your Vapourism account to manage orders, track deliveries, and access your verified customer profile.',
  },
];

export async function loader({context}: LoaderFunctionArgs) {
  return context.customerAccount.login({
    countryCode: context.storefront.i18n.country,
  });
}
