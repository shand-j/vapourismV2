import type {LoaderFunctionArgs, MetaFunction} from '@shopify/remix-oxygen';

export const meta: MetaFunction = () => [
  {title: 'Authorizing | Vapourism'},
  {name: 'robots', content: 'noindex, nofollow'},
];

export async function loader({context}: LoaderFunctionArgs) {
  return context.customerAccount.authorize();
}
