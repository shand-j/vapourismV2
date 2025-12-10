import {type ActionFunctionArgs, json} from '@shopify/remix-oxygen';
import {validateWebhook, verifyToken, persistVerificationEvidence, findOrderByName, parseShopifyNumericId} from '~/lib/ageverif.server';

export async function action({request, context}: ActionFunctionArgs) {
  const raw = await request.text();
  const headers: Record<string,string|undefined> = {};
  for (const [k, v] of request.headers) headers[k] = v;

  // Ensure admin API configured (no dev fallbacks)
  const tokenAvailable = context?.env?.SHOPIFY_ADMIN_TOKEN || context?.env?.PRIVATE_SHOPIFY_ADMIN_TOKEN || process.env.SHOPIFY_ADMIN_TOKEN || process.env.PRIVATE_SHOPIFY_ADMIN_TOKEN;
  const storeAvailable = context?.env?.PUBLIC_STORE_DOMAIN || process.env.PUBLIC_STORE_DOMAIN;
  if (!tokenAvailable || !storeAvailable) {
    return json({ error: 'Server Admin API not configured - SHOPIFY_ADMIN_TOKEN and PUBLIC_STORE_DOMAIN are required' }, { status: 500 });
  }

  // Validate signature if possible (guard against unexpected parse errors)
  let validation: {ok: boolean; event?: any; reason?: string} = { ok: false };
  try {
    validation = await validateWebhook(raw, headers, context?.env);
  } catch (err: any) {
    console.error('validateWebhook threw an exception', err);
    return json({ error: 'invalid webhook payload' }, { status: 400 });
  }
  let event: any = null;

  if (validation.ok) {
    event = validation.event;
  } else {
    // No HMAC signature provided or signature invalid — require a verifiable token inside the payload
    try {
      event = JSON.parse(raw);
    } catch (err) {
      return json({ error: 'invalid payload and missing signature' }, { status: 400 });
    }

    // If there's a verification token present, attempt to verify it server-side
    const token = event?.verification?.token ?? null;
    if (token) {
      const verified = await verifyToken(token, context?.env);
      if (!verified) return json({ error: 'invalid verification token' }, { status: 400 });
    } else {
      return json({ error: 'missing signature and no verification token' }, { status: 400 });
    }
  }

  // Attempt to find orderNumber or customerId in payload
  const orderNumber = event?.orderNumber || event?.metadata?.orderNumber || event?.data?.order_number || null;
  const customerId = event?.customerId || event?.data?.customer_id || null;

  if (!orderNumber && !customerId) {
    return json({ error: 'payload must include orderNumber or customerId' }, { status: 400 });
  }

  try {
    // persist the evidence (idempotent)
    const evidence = event?.verification ?? event;
    const resolvedOrder = orderNumber;

    const orderNode = resolvedOrder ? await findOrderByName(resolvedOrder, context?.env) : null;
    const resolvedCustomer = customerId ?? orderNode?.customer?.id;
    const customerNumericId = resolvedCustomer ? parseShopifyNumericId(resolvedCustomer) : undefined;

    await persistVerificationEvidence({ orderNumber: resolvedOrder ?? '', customerId: resolvedCustomer, customerNumericId, verification: evidence, source: 'webhook' }, context?.env);

    return json({ ok: true });
  } catch (err: any) {
    console.error('age-verif.webhook handler failed', err);
    return json({ error: 'failed to persist verification' }, { status: 500 });
  }
}
