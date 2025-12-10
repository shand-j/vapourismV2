import {json, type ActionFunctionArgs} from '@shopify/remix-oxygen';
import {verifyToken, findOrderByName, persistVerificationEvidence, parseShopifyNumericId} from '~/lib/ageverif.server';

export async function action({request, context}: ActionFunctionArgs) {
  console.log('=== AgeVerif Verify API Action Started ===');
  const body = await request.json();
  const token = body?.token ?? null;
  const orderNumber = body?.orderNumber ?? null;
  const confirmationCode = body?.confirmationCode ?? null;

  console.log('Request body parsed:', { token: token ? `${token.substring(0, 20)}...` : null, orderNumber, confirmationCode });
  try {
  console.log('globalThis.__ENV__ keys:', Object.keys((globalThis as any)?.__ENV__ ?? {}));
  console.log('PUBLIC_STORE_DOMAIN in globalThis.__ENV__:', (globalThis as any)?.__ENV__?.PUBLIC_STORE_DOMAIN);
  } catch (e) {
    console.log('Context log failed', e);
  }

  if (!token) {
    console.log('ERROR: Missing token in request');
    return json({ error: 'missing token' }, { status: 400 });
  }

  let verified = null;
  if (token === 'dev-mock-token') {
    console.log('Using dev mock token for testing');
    verified = { uid: 'dev-mock', assuranceLevel: 'NONE' };
  } else if (token === 'test-token') {
    console.log('Using test token for development - bypassing JWT verification');
    verified = { uid: 'test-user', assuranceLevel: 'NONE' };
  } else {
    console.log('Calling verifyToken with real token');
    verified = await verifyToken(token, context?.env ?? undefined);
    console.log('verifyToken result:', verified ? { uid: verified.uid, assuranceLevel: verified.assuranceLevel } : 'null');
  }
  if (!verified) {
    console.log('ERROR: Token verification failed - no verified result');
    return json({ error: 'invalid token' }, { status: 401 });
  }

  let order = null;
  if (token === 'dev-mock-token') {
    // For dev testing, mock an order without customer to trigger creation
    console.log('Using dev mock order for testing');
    order = {
      id: 'gid://shopify/Order/1001',
      name: '#1001',
      customer: null, // No customer to trigger creation
      metafields: [],
    };
  } else if (orderNumber) {
    console.log('Looking up order by number:', orderNumber, 'with confirmation code:', confirmationCode ? 'provided' : 'not provided');
    order = await findOrderByName(orderNumber, confirmationCode, context?.env ?? undefined);
    console.log('Order lookup result:', order ? { id: order.id, customerId: order.customer?.id, email: order.customer?.email } : 'not found');
  } else {
    console.log('No order number provided, skipping order lookup');
  }

  try {
    const evidence = verified;
    const customerGid = order?.customer?.id ?? undefined;
    const customerNumericId = parseShopifyNumericId(customerGid) ?? undefined;

    console.log('Preparing to persist verification evidence:', { customerGid, customerNumericId, orderNumber, evidence: { uid: evidence.uid, assuranceLevel: evidence.assuranceLevel } });
    const result = await persistVerificationEvidence({ orderNumber: orderNumber ?? '', customerId: customerGid, customerNumericId, verification: evidence, source: 'verify' }, context?.env ?? undefined);
    console.log('Persistence completed successfully:', result);

    // Surface order and customer details in the API response for debugging/UI display
    const responsePayload: any = { ok: true, result, customerGid, customerNumericId };
    if (order) {
      responsePayload.order = {
        id: order.id,
        name: order.name,
        metafields: order.metafields ?? order.metafields?.edges ?? null,
      };
    }

    console.log('=== AgeVerif Verify API Action Completed Successfully ===');
    return json(responsePayload, { status: 200 });
  } catch (err) {
    console.error('ERROR: Failed to persist verification evidence:', err);
    console.log('=== AgeVerif Verify API Action Failed ===');
    return json({ error: 'failed to persist verification' }, { status: 500 });
  }
}
