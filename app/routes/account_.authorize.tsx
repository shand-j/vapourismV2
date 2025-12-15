import type {LoaderFunctionArgs, MetaFunction} from '@shopify/remix-oxygen';

export const meta: MetaFunction = () => [
  {title: 'Authorize Account | Vapourism'},
  {
    name: 'description',
    content: 'Secure account authorization for Vapourism customer login. Access your account to view orders and manage preferences.',
  },
];

export async function loader({context}: LoaderFunctionArgs) {
  return context.customerAccount.authorize();
}
