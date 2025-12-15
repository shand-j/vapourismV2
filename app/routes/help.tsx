import {redirect, type MetaFunction} from '@shopify/remix-oxygen';

export const meta: MetaFunction = () => [
  {title: 'Help Centre | Vapourism Customer Support'},
  {
    name: 'description',
    content: 'Access Vapourism help centre for instant answers to your questions about vaping products, orders, delivery, and account management.',
  },
];

/**
 * Help Redirect
 * 
 * Redirects to the FAQ page which serves as the main help resource.
 */
export async function loader() {
  return redirect('/faq', {
    status: 301,
  });
}

export default function Help() {
  // This component won't render as loader always redirects
  return null;
}
