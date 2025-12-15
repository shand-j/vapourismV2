import React from 'react';
import type {LoaderFunctionArgs, MetaFunction} from '@shopify/remix-oxygen';
import {redirect, useLoaderData, Link} from '@remix-run/react';
import {Money, Image} from '@shopify/hydrogen';
import {CUSTOMER_ORDER_QUERY} from '~/graphql/customer-account/CustomerOrderQuery';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  const orderName = data?.order?.name ?? '';
  const title = orderName ? `Vapourism | Order ${orderName}` : 'Vapourism | Order Details';
  
  // Build description with shared text to avoid duplication
  const sharedSuffix = 'Check your order status, items, and delivery information.';
  const description = orderName 
    ? `View order details and tracking information for order ${orderName}. ${sharedSuffix}`
    : `View your order details and tracking information. ${sharedSuffix}`;
  
  return [
    {title},
    {
      name: 'description',
      content: description
    },
    {
      name: 'robots',
      content: 'noindex, nofollow' // Order pages should not be indexed
    }
  ];
};

export async function loader({params, context}: LoaderFunctionArgs) {
  const {customerAccount} = context;

  if (!params.id) {
    return redirect('/account/orders');
  }

  // The param comes base64 encoded from links
  const orderId = atob(params.id);
  
  const {data, errors} = await customerAccount.query(CUSTOMER_ORDER_QUERY, {
    variables: {
      orderId,
    },
  });

  if (errors?.length || !data?.order) {
    throw new Response('Order not found', {status: 404});
  }

  const {order} = data;
  const lineItems = order.lineItems.nodes;
  const fulfillmentStatus = order.fulfillments.nodes[0]?.status ?? 'N/A';

  return {
    order,
    lineItems,
    fulfillmentStatus,
  };
}

export default function OrderRoute() {
  const {order, lineItems, fulfillmentStatus} = useLoaderData<typeof loader>();

  return (
    <div className="container-custom py-12">
      <div className="mb-6">
        <Link
          to="/account/orders"
          className="text-sm text-slate-600 hover:text-slate-900"
        >
          ← Back to Orders
        </Link>
      </div>

      <h1 className="mb-2 text-2xl font-bold text-slate-900">
        Order {order.name}
      </h1>
      <p className="mb-1 text-sm text-slate-600">
        Placed on {new Date(order.processedAt).toDateString()}
      </p>
      {order.confirmationNumber && (
        <p className="mb-4 text-sm text-slate-600">
          Confirmation: {order.confirmationNumber}
        </p>
      )}
      <p className="mb-6 text-sm">
        <span className="font-medium">Fulfillment: </span>
        <span className="capitalize">{fulfillmentStatus.toLowerCase()}</span>
      </p>

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {lineItems.map((lineItem: OrderLineItem) => (
              <tr key={lineItem.id}>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center gap-4">
                    {lineItem.image && (
                      <Image
                        data={lineItem.image}
                        width={64}
                        height={64}
                        className="rounded"
                      />
                    )}
                    <div>
                      <p className="font-medium text-slate-900">
                        {lineItem.title}
                      </p>
                      {lineItem.variantTitle && (
                        <p className="text-sm text-slate-500">
                          {lineItem.variantTitle}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">
                  {lineItem.price && (
                    <Money data={lineItem.price as MoneyV2} />
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">
                  {lineItem.quantity}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">
                  {lineItem.totalDiscount && (
                    <Money data={lineItem.totalDiscount as MoneyV2} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex flex-col items-end gap-2 text-sm">
        {order.subtotal && (
          <div className="flex justify-between gap-8">
            <span className="text-slate-600">Subtotal:</span>
            <Money data={order.subtotal as MoneyV2} />
          </div>
        )}
        {order.totalTax && (
          <div className="flex justify-between gap-8">
            <span className="text-slate-600">Tax:</span>
            <Money data={order.totalTax as MoneyV2} />
          </div>
        )}
        <div className="flex justify-between gap-8 text-base font-bold">
          <span>Total:</span>
          <Money data={order.totalPrice as MoneyV2} />
        </div>
      </div>

      {order.statusPageUrl && (
        <div className="mt-8">
          <a
            href={order.statusPageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            View order status page →
          </a>
        </div>
      )}
    </div>
  );
}

// Type for line items from Customer Account API
interface OrderLineItem {
  id: string;
  title: string;
  quantity: number;
  variantTitle?: string | null;
  image?: {
    url: string;
    altText?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;
  price?: {
    amount: string;
    currencyCode: string;
  } | null;
  totalDiscount?: {
    amount: string;
    currencyCode: string;
  } | null;
}

// Type helper for Money component compatibility
interface MoneyV2 {
  amount: string;
  currencyCode: string;
}
