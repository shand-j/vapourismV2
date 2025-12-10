import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {findOrderByName, getCustomerVerificationEvidence} from '~/lib/ageverif.server';

export async function loader({request, context}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const order = url.searchParams.get('order');
  if (!order) return json({ verified: false, message: 'order query param required' }, { status: 400 });

  try {
    // If SHOPIFY_ADMIN_TOKEN or PUBLIC_STORE_DOMAIN is missing we cannot confirm
    // verification from server-side order metafields. Return a clear message
    // for dev/testing.
    const tokenAvailable = context?.env?.SHOPIFY_ADMIN_TOKEN || context?.env?.PRIVATE_SHOPIFY_ADMIN_TOKEN || process.env.SHOPIFY_ADMIN_TOKEN || process.env.PRIVATE_SHOPIFY_ADMIN_TOKEN;
    const storeAvailable = context?.env?.PUBLIC_STORE_DOMAIN || process.env.PUBLIC_STORE_DOMAIN;
    if (!tokenAvailable || !storeAvailable) {
      return json({ verified: false, message: 'Server Admin API not configured - SHOPIFY_ADMIN_TOKEN and PUBLIC_STORE_DOMAIN are required' }, { status: 500 });
    }

    const orderNode = await findOrderByName(order, context?.env);
    if (!orderNode) return json({ verified: false, message: 'order not found' }, { status: 404 });

    // First, check customer-level evidence (preferred). This handles the new
    // customer-id based persistence path where the server persists evidence on
    // the Customer resource instead of the Order.
    const customerGid = orderNode?.customer?.id;
    if (customerGid) {
      const customerEvidence = await getCustomerVerificationEvidence(customerGid, context?.env);
      if (customerEvidence) {
        return json({ verified: true, evidence: customerEvidence });
      }
    }

    const existing = orderNode?.metafields?.edges?.find((e: any) => e.node?.key === (context?.env?.AGE_VERIF_METAFIELD_KEY || process.env.AGE_VERIF_METAFIELD_KEY || 'age_verif'))?.node;
    if (existing) {
      return json({ verified: true, evidence: JSON.parse(existing.value) });
    }

    return json({ verified: false });
  } catch (err: any) {
    console.error('api.age-verif.status loader error', err);
    return json({ verified: false, error: 'server error' }, { status: 500 });
  }
}
