import type { ActionFunctionArgs } from '@shopify/remix-oxygen';
import {persistVerificationEvidence} from '~/lib/ageverif.server';

export async function action({request, context}: ActionFunctionArgs) {
  console.log('=== AgeVerif Set Metafield API Action Started ===');

  try {
    const body = await request.json();
    const customerId = body?.customerId ?? null;
    const verificationData = body?.verification ?? {
      uid: 'test-verification',
      assuranceLevel: 'NONE',
      timestamp: new Date().toISOString(),
      source: 'manual-test'
    };

    console.log('Request body parsed:', { customerId, verification: verificationData });

    if (!customerId) {
      console.log('ERROR: Missing customerId in request');
      return Response.json({ error: 'missing customerId' }, { status: 400 });
    }

    console.log('Setting metafield on customer:', customerId);
    const result = await persistVerificationEvidence({
      customerId,
      verification: verificationData,
      source: 'manual-test'
    }, context?.env ?? undefined);

    console.log('Metafield set successfully:', result);

    console.log('=== AgeVerif Set Metafield API Action Completed Successfully ===');
    return Response.json({
      ok: true,
      result,
      customerId,
      message: 'Metafield set successfully'
    }, { status: 200 });

  } catch (err) {
    console.error('ERROR: Failed to set metafield:', err);
    console.log('=== AgeVerif Set Metafield API Action Failed ===');
    return Response.json({ error: 'failed to set metafield' }, { status: 500 });
  }
}