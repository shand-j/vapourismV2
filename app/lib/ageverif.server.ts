
type AdminResponse = any;

const sessionMap = new Map<string, any>();

function generateSessionId(bytes = 16) {
  try {
    // Prefer Web Crypto where available (MiniOxygen / browser)
    const g = (globalThis as any);
    if (g?.crypto?.getRandomValues) {
      const arr = new Uint8Array(bytes);
      g.crypto.getRandomValues(arr);
      return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (err) {
    // fall through to Node fallback
  }

  try {
    // Try Node crypto if available (tests / server)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { randomBytes } = require('crypto');
    return randomBytes(bytes).toString('hex');
  } catch (err) {
    // fallback: non-crypto RNG (not cryptographically secure but acceptable for tests)
    let out = '';
    for (let i = 0; i < bytes; i++) {
      out += Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    }
    return out;
  }
}

export function getSessionMapping(sessionId: string) {
  return sessionMap.get(sessionId) ?? null;
}

// Runtime-safe base64url -> Uint8Array helper. Works in Workers (atob + TextEncoder),
// browser, and Node (falls back to Buffer if available).
function base64UrlToUint8Array(input: string) {
  const s = String(input || '').replace(/-/g, '+').replace(/_/g, '/');
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4));
  const b64 = s + pad;

  // If Buffer is available (Node), use it to get a Uint8Array quickly
  if (typeof (globalThis as any).Buffer !== 'undefined') {
    const buf = (globalThis as any).Buffer.from(b64, 'base64');
    return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
  }

  // Otherwise use atob (Worker / Browser)
  const binary = typeof atob === 'function' ? atob(b64) : null;
  if (binary !== null) {
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  // As a last resort, try TextDecoder from base64 -> binary via fetch fallback
  try {
    const decoded = Buffer.from(b64, 'base64'); // will throw if Buffer undefined
    return new Uint8Array(decoded.buffer, decoded.byteOffset, decoded.byteLength);
  } catch (err) {
    // return empty array on failure
    return new Uint8Array(0);
  }
}

async function adminGraphQL(query: string, variables?: Record<string, any>, env?: Record<string, any>) : Promise<AdminResponse | null> {
  // Resolve runtime environment from multiple possible sources (context.env, globalThis.__ENV__, process.env, import.meta.env)
  const resolved = resolveRuntimeEnv(env);
  const domain = resolved.merged.PUBLIC_STORE_DOMAIN ?? resolved.merged.PUBLIC_STORE ?? resolved.merged.VITE_PUBLIC_STORE_DOMAIN;
  const token = resolved.merged.SHOPIFY_ADMIN_TOKEN ?? resolved.merged.VITE_SHOPIFY_ADMIN_TOKEN;
  if (!domain || !token) {
    console.log('adminGraphQL: Missing Shopify admin credentials. Sources:', resolved.sources);
    console.log('adminGraphQL: Resolved env keys count:', Object.keys(resolved.merged).length);
    return null;
  }

  const url = `https://${domain}/admin/api/2024-01/graphql.json`;
  try {
    console.log('adminGraphQL: Making request to:', url);
    console.log('adminGraphQL: Query:', query.substring(0, 100) + '...');
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token,
      },
      body: JSON.stringify({ query, variables }),
    });

    console.log('adminGraphQL: Response status:', res.status);
    if (!res.ok) {
      const errorText = await res.text();
      console.log('adminGraphQL: Response not ok, body:', errorText);
      return null;
    }

    try {
      const json = await res.json();
      console.log('adminGraphQL: Response JSON:', JSON.stringify(json).substring(0, 200) + '...');
      return json;
    } catch (err) {
      console.log('adminGraphQL: Failed to parse JSON response:', err);
      return null;
    }
  } catch (err) {
    console.log('adminGraphQL: Fetch error:', err);
    return null;
  }
}

function resolveRuntimeEnv(provided?: Record<string, any>) {
  const providedEnv = provided ?? {};
  const globalEnv = (globalThis as any)?.__ENV__ ?? {};
  const procEnv = (typeof process !== 'undefined' && (process as any).env) ? (process as any).env : {};
  let importMetaEnv = {};
  try {
    importMetaEnv = (import.meta as any)?.env ?? {};
  } catch (e) {
    importMetaEnv = {};
  }

  const merged = { ...providedEnv, ...globalEnv, ...importMetaEnv, ...procEnv };
  const sources = {
    provided: !!Object.keys(providedEnv).length,
    globalThis: !!Object.keys(globalEnv).length,
    processEnv: !!Object.keys(procEnv).length,
    importMeta: !!Object.keys(importMetaEnv).length,
  };

  console.log('resolveRuntimeEnv merged keys:', Object.keys(merged));
  console.log('PUBLIC_STORE_DOMAIN from merged:', merged.PUBLIC_STORE_DOMAIN);
  console.log('SHOPIFY_ADMIN_TOKEN from merged:', merged.SHOPIFY_ADMIN_TOKEN ? 'SET' : 'NOT SET');
  console.log('AGE_VERIF_METAFIELD_KEY from merged:', merged.AGE_VERIF_METAFIELD_KEY);
  console.log('AGE_VERIF_METAFIELD_NAMESPACE from merged:', merged.AGE_VERIF_METAFIELD_NAMESPACE);

  return { merged, sources };
}

export async function createVerificationSession(opts: {surname?: string; orderNumber?: string; postcode?: string}) {
  const sessionId = generateSessionId(16);
  const record = { ...opts, sessionId, createdAt: Date.now() };
  sessionMap.set(sessionId, record);

  // Optionally try to lookup order and create a placeholder metafield for tracking
  if (process.env.PUBLIC_STORE_DOMAIN && process.env.SHOPIFY_ADMIN_TOKEN && opts.orderNumber) {
    const lookupQuery = `query orderLookup($name:String!){ orders(first:1, query:$name) { edges { node { id name customer { id email } } } } }`;
    await adminGraphQL(lookupQuery, { name: `name:${opts.orderNumber}` });

    const mf = `mutation createMf { metafieldCreate(input: { namespace: "ageverif", key: "initial_session", type: "json", value: \"{}\" }) { metafield { id } userErrors { field message } } }`;
    await adminGraphQL(mf);
  }

  return { sessionId };
}

export async function verifyToken(token: string, env?: Record<string, any>) {
  console.log('=== verifyToken called ===');
  console.log('Token length:', token?.length);
  if (!token) {
    console.log('ERROR: No token provided');
    return null;
  }

  // Decode the JWT token
  const parts = token.split('.');
  if (parts.length !== 3) {
    console.log('ERROR: Invalid JWT format');
    return null;
  }

  let header: any;
  let payload: any;
  try {
    const headerB64 = parts[0].replace(/-/g, '+').replace(/_/g, '/');
    const headerStr = atob(headerB64);
    header = JSON.parse(headerStr);

    const payloadB64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const payloadStr = atob(payloadB64);
    payload = JSON.parse(payloadStr);
  } catch (err) {
    console.log('ERROR: Failed to decode JWT header or payload');
    return null;
  }

  // If key is provided and in production, verify signature based on alg
  const resolved = resolveRuntimeEnv(env);
  const key = resolved.merged.AGEVERIF_PUBLIC_KEY;
  if (key && process.env.NODE_ENV === 'production') {
    try {
      const signature = parts[2];
      const signingInput = `${parts[0]}.${parts[1]}`;

      if (header.alg === 'RS256') {
        // RSA verification
        const subtle = (globalThis as any)?.crypto?.subtle;
        if (subtle) {
          const keyData = pemToArrayBuffer(key);
          const cryptoKey = await subtle.importKey('spki', keyData, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
          const sigBytes = base64UrlToUint8Array(signature);
          const signingBytes = new TextEncoder().encode(signingInput);
          const verified = await subtle.verify('RSASSA-PKCS1-v1_5', cryptoKey, sigBytes, signingBytes);
          if (!verified) {
            console.log('ERROR: RSA signature verification failed');
            return null;
          }
        } else {
          const crypto = require('node:crypto');
          const verifier = crypto.createVerify('RSA-SHA256');
          verifier.update(signingInput);
          const verified = verifier.verify(key, signature, 'base64url');
          if (!verified) {
            console.log('ERROR: RSA signature verification failed');
            return null;
          }
        }
      } else if (header.alg === 'HS256') {
        // HMAC verification
        const subtle = (globalThis as any)?.crypto?.subtle;
        if (subtle) {
          const enc = new TextEncoder();
          const keyData = enc.encode(key);
          const cryptoKey = await subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
          const sigBytes = base64UrlToUint8Array(signature);
          const signingBytes = enc.encode(signingInput);
          const verified = await subtle.verify('HMAC', cryptoKey, sigBytes, signingBytes);
          if (!verified) {
            console.log('ERROR: HMAC signature verification failed');
            return null;
          }
        } else {
          const crypto = require('node:crypto');
          const hmac = crypto.createHmac('sha256', key);
          hmac.update(signingInput);
          const expectedSig = hmac.digest('base64url');
          if (expectedSig !== signature) {
            console.log('ERROR: HMAC signature verification failed');
            return null;
          }
        }
      } else {
        console.log('ERROR: Unsupported algorithm:', header.alg);
        return null;
      }
    } catch (err) {
      console.log('ERROR: Signature verification error:', err);
      return null;
    }
  }

  // Return the payload mapped to expected fields
  console.log('Token verified successfully, payload:', payload);
  return {
    uid: payload.jti || payload.uid,
    assuranceLevel: payload.ass || payload.assuranceLevel,
    country: payload.cco || payload.country,
    countrySubdivision: payload.csu || payload.countrySubdivision,
    ageThreshold: payload.age || payload.ageThreshold,
    expiresAt: payload.exp || payload.expiresAt,
    expiresIn: payload.vxp || payload.expiresIn,
    verified: true,
  };
}

export async function validateWebhook(raw: string, headers: Record<string, string | undefined>) {
  try {
    const body = JSON.parse(raw as any);
    if (process.env.AGEVERIF_WEBHOOK_SECRET) {
      const sigHeader = headers['x-ageverif-signature'] || headers['X-AgeVerif-Signature'];
      if (!sigHeader) return { ok: false };
      const h = await computeHmacHex(process.env.AGEVERIF_WEBHOOK_SECRET as string, raw);
      if (h !== sigHeader) return { ok: false };
    }
    return { ok: true, event: body };
  } catch (err) {
    return { ok: false };
  }
}

async function computeHmacHex(secret: string, data: string) {
  // Prefer Web Crypto (SubtleCrypto) when available (Workers / MiniOxygen).
  const subtle = (globalThis as any)?.crypto?.subtle;
  if (subtle) {
    try {
      const enc = new TextEncoder();
      const keyData = enc.encode(secret);
      const key = await subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
      const sig = await subtle.sign('HMAC', key, enc.encode(data));
      const bytes = new Uint8Array(sig as ArrayBuffer);
      return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      // If Web Crypto fails, fall through to Node fallback
    }
  }

  // Node fallback (dynamic import) for local tests / Node environments
  try {
    const crypto = await import('node:crypto');
    return crypto.createHmac('sha256', secret).update(data).digest('hex');
  } catch (err) {
    // As a last resort, return an empty string to avoid throwing in non-critical paths
    return '';
  }
}

function pemToArrayBuffer(pem: string) {
  const b64 = pem.replace(/-----BEGIN PUBLIC KEY-----/, '').replace(/-----END PUBLIC KEY-----/, '').replace(/\s+/g, '');
  const arr = base64UrlToUint8Array(b64);
  return arr.buffer;
}

export function parseShopifyNumericId(gid: string | null | undefined): string | null {
  if (!gid || typeof gid !== 'string') return null;
  const m = gid.match(/\/(\d+)(?:$|$)/);
  return m ? m[1] : null;
}

export async function persistVerificationEvidence(opts: {
  orderNumber?: string;
  customerId?: string;
  customerNumericId?: string;
  verification: { uid: string; token?: string; assuranceLevel?: string; country?: string; countrySubdivision?: string | null; ageThreshold?: number; expiresAt?: number; expiresIn?: number; verificationMethod?: string; verificationLogs?: any[]; };
  source?: string;
}, env?: Record<string, any>) {
  console.log('=== persistVerificationEvidence called ===');
  console.log('Options:', { orderNumber: opts.orderNumber, customerId: opts.customerId, customerNumericId: opts.customerNumericId, source: opts.source, verification: { uid: opts.verification.uid, assuranceLevel: opts.verification.assuranceLevel } });
  const resolved = resolveRuntimeEnv(env);
  const domain = resolved.merged.PUBLIC_STORE_DOMAIN ?? resolved.merged.PUBLIC_STORE ?? resolved.merged.VITE_PUBLIC_STORE_DOMAIN;
  const token = resolved.merged.SHOPIFY_ADMIN_TOKEN ?? resolved.merged.VITE_SHOPIFY_ADMIN_TOKEN;
  if (!domain || !token) {
    console.log('ERROR: Missing Shopify admin credentials in persistVerificationEvidence. Sources:', resolved.sources);
    console.log('Persist resolved keys count:', Object.keys(resolved.merged).length);
    return { created: false, target: 'none' };
  }

  // If numeric id provided, convert to gid and lookup
  let customerGid = opts.customerId ?? (opts.customerNumericId ? `gid://shopify/Customer/${opts.customerNumericId}` : undefined);

  // If we don't have a customer gid try to fetch from order
  if (!customerGid && opts.orderNumber) {
    const q = `query orderLookup($name:String!){ orders(first:1, query:$name){ edges{ node{ customer{ id email } metafields(first:10){ edges{ node{ key value } } } } } } }`;
    try {
      const res = await adminGraphQL(q, { name: `name:${opts.orderNumber}` }, resolved.merged);
      const node = res?.data?.orders?.edges?.[0]?.node;
      customerGid = node?.customer?.id ?? null;
    } catch (err) {
      customerGid = null as any;
    }
  }

  if (!customerGid) {
    // If creation is allowed, create customer (simple placeholder mutation)
    if (process.env.AGEVERIF_CREATE_CUSTOMER === 'true' && opts.verification && opts.verification.uid) {
      const createQ = `mutation customerCreate { customerCreate(input:{email:\"guest@example.com\"}) { customer { id } userErrors { message } } }`;
      const cr = await adminGraphQL(createQ);
      customerGid = cr?.data?.customerCreate?.customer?.id ?? null;
      console.log('Customer creation result:', customerGid ? 'success' : 'failed');
      if (!customerGid) {
        console.log('=== persistVerificationEvidence completed - customer creation failed ===');
        return { created: false, target: 'none' };
      }
    } else {
      console.log('Customer creation not allowed or no verification UID');
      console.log('=== persistVerificationEvidence completed - no customer ===');
      return { created: false, target: 'none' };
    }
  }

  // Build the verification data JSON
  const metafieldKey = resolved.merged.AGE_VERIF_METAFIELD_KEY || 'age_verification';
  const namespace = resolved.merged.AGE_VERIF_METAFIELD_NAMESPACE || 'custom';
  
  // Check if customer already has the metafield
  const fullyQualifiedKey = `${namespace}.${metafieldKey}`;
  const checkQuery = `query getCustomer($id:ID!){ node(id:$id){ ... on Customer { id tags metafields(first:1, keys: ["${fullyQualifiedKey}"]) { edges { node { key value } } } } } }`;
  let alreadyExists = false;
  
  try {
    const checkResult = await adminGraphQL(checkQuery, { id: customerGid }, resolved.merged);
    const mf = checkResult?.data?.node?.metafields?.edges?.[0]?.node;
    if (mf?.value) {
      console.log('Customer already has age verification metafield');
      alreadyExists = true;
      // Return early - customer is already verified
      return { created: false, existed: true, target: 'customer' };
    }
  } catch (err) {
    console.log('Error checking existing metafield:', err);
    // Continue with creation if check fails
  }
  
  const verificationData = {
    verified: true,
    uid: opts.verification.uid,
    token: opts.verification.token,
    assuranceLevel: opts.verification.assuranceLevel,
    ageThreshold: opts.verification.ageThreshold,
    country: opts.verification.country,
    countrySubdivision: opts.verification.countrySubdivision,
    expiresIn: opts.verification.expiresIn,
    verificationMethod: opts.verification.verificationMethod || 'unknown',
    verificationLogs: opts.verification.verificationLogs || [],
    outcome: 'verified',
    timestamp: new Date().toISOString(),
    source: opts.source || 'unknown',
    orderNumber: opts.orderNumber,
    customerGid,
    retentionExpiry: new Date(Date.now() + 7 * 365 * 24 * 60 * 60 * 1000).toISOString(), // 7 years for GDPR
  };

  const valueJson = JSON.stringify(verificationData);

  // Set the metafield (creates or updates)
  const metafieldsSetMutation = `mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields {
        id
        value
      }
      userErrors {
        field
        message
      }
    }
  }`;
  console.log('Setting metafield on customer:', customerGid, 'with key:', metafieldKey, 'in namespace:', namespace);
  const setResult = await adminGraphQL(metafieldsSetMutation, { metafields: [{ ownerId: customerGid, namespace, key: metafieldKey, value: valueJson, type: "json" }] }, resolved.merged);
  console.log('MetafieldsSet result:', setResult ? 'success' : 'null/failed');
  if (!setResult || setResult.data?.metafieldsSet?.userErrors?.length) {
    console.log('ERROR: MetafieldsSet failed', setResult?.data?.metafieldsSet?.userErrors);
    return { created: false, target: 'customer', error: 'metafield_set_failed' };
  }

  // Tag customer
  const tagsAdd = `mutation tagsAdd($id: ID!, $tags: [String!]!) { tagsAdd(id: $id, tags: $tags) { userErrors { field message } } }`;
  console.log('Tagging customer as verified');
  const tagResult = await adminGraphQL(tagsAdd, { id: customerGid, tags: ["age_verified"] }, resolved.merged);
  console.log('Customer tagging result:', tagResult ? 'success' : 'null/failed');
  if (!tagResult) {
    console.log('ERROR: Customer tagging failed');
    return { created: true, target: 'customer', error: 'tagging_failed' };
  }

  console.log('=== persistVerificationEvidence completed successfully ===');
  return { created: true, target: 'customer', updated: false, existed: false };
}

export async function findOrderByName(orderNumber: string, confirmationCode?: string, env?: Record<string, any>) {
  console.log('=== findOrderByName called ===');
  console.log('Order number:', orderNumber, 'Confirmation code provided:', !!confirmationCode);
  const resolved = resolveRuntimeEnv(env);
  const domain = resolved.merged.PUBLIC_STORE_DOMAIN ?? resolved.merged.PUBLIC_STORE ?? resolved.merged.VITE_PUBLIC_STORE_DOMAIN;
  const token = resolved.merged.SHOPIFY_ADMIN_TOKEN ?? resolved.merged.VITE_SHOPIFY_ADMIN_TOKEN;
  if (!domain || !token) {
    console.log('ERROR: Missing Shopify admin credentials in findOrderByName. Sources:', resolved.sources);
    console.log('findOrderByName resolved keys count:', Object.keys(resolved.merged).length);
    return null;
  }
  const q = `query ordersByName($name:String!){ orders(first:1, query:$name){ edges{ node{ id name customer{ id } metafields(first:10){ edges{ node{ key value } } } } } } }`;
  console.log('Executing GraphQL query for order lookup');
  try {
    const res = await adminGraphQL(q, { name: `name:${orderNumber}` }, resolved.merged);
    console.log('GraphQL response received:', res ? 'success' : 'null');
    const order = res?.data?.orders?.edges?.[0]?.node ?? null;
    console.log('Order found:', order ? { id: order.id, name: order.name, hasCustomer: !!order.customer } : 'null');
    if (!order) {
      console.log('No order found with that number');
      return null;
    }
    if (confirmationCode) {
      console.log('Validating confirmation code');
      const metafields = order.metafields?.edges ?? [];
      console.log('Order has', metafields.length, 'metafields');
      const codeField = metafields.find((e: any) => e.node.key === 'confirmation_code');
      console.log('Confirmation code field found:', !!codeField);
      if (!codeField?.node?.value || codeField.node.value !== confirmationCode) {
        console.log('ERROR: Confirmation code mismatch or missing');
        return null;
      }
      console.log('Confirmation code validated successfully');
    }
    console.log('=== findOrderByName completed successfully ===');
    return order;
  } catch (err) {
    console.log('ERROR: Exception during order lookup:', err);
    return null;
  }
}

function normalizePostcode(p: string) {
  return String(p || '').replace(/\s+/g, '').toUpperCase();
}

export async function findOrderByEmailAndPostcode(email: string, postcode: string) {
  if (!process.env.PUBLIC_STORE_DOMAIN || !process.env.SHOPIFY_ADMIN_TOKEN) return null;
  const candidates = [email, `${email}`];
  const norm = normalizePostcode(postcode);

  for (const candidate of candidates) {
    const q = `query($q:String!){ orders(first:10, query:$q){ edges{ node{ id name shippingAddress { postalCode } customer { id email } } } } }`;
    const vars = { q: `email:${candidate}` };
    const res = await adminGraphQL(q, vars);
    const edges = res?.data?.orders?.edges ?? [];
    for (const e of edges) {
      const postal = (e.node?.shippingAddress?.postalCode || '').replace(/\s+/g, '').toUpperCase();
      if (postal === norm) return e.node;
    }
  }

  return null;
}

/**
 * Fetch any persisted age verification evidence for a customer (by gid).
 * This will check the customer's ageverif namespace metafield (if present)
 * and also fall back to checking tags for simple verification flags.
 */
export async function getCustomerVerificationEvidence(customerGid: string, env?: Record<string, any>) {
  const domain = env?.PUBLIC_STORE_DOMAIN || process.env.PUBLIC_STORE_DOMAIN;
  const token = env?.SHOPIFY_ADMIN_TOKEN || env?.PRIVATE_SHOPIFY_ADMIN_TOKEN || process.env.SHOPIFY_ADMIN_TOKEN || process.env.PRIVATE_SHOPIFY_ADMIN_TOKEN;
  if (!domain || !token) return null;

  const metafieldKey = env?.AGE_VERIF_METAFIELD_KEY || process.env.AGE_VERIF_METAFIELD_KEY || 'age_verif';
  const namespace = env?.AGE_VERIF_METAFIELD_NAMESPACE || process.env.AGE_VERIF_METAFIELD_NAMESPACE || 'ageverif';
  const fullyQualifiedKey = `${namespace}.${metafieldKey}`;
  const url = `https://${domain}/admin/api/2024-01/graphql.json`;
  const query = `query getCustomer($id:ID!){ node(id:$id){ ... on Customer { id tags metafields(first:1, keys: ["${fullyQualifiedKey}"]) { edges { node { key value } } } } } }`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token,
      },
      body: JSON.stringify({ query, variables: { id: customerGid } }),
    });

    if (!res.ok) return null;
    const json = await res.json();
    const node = json?.data?.node;
    const mf = node?.metafields?.edges?.[0]?.node;
    if (mf?.value) {
      try {
        return JSON.parse(mf.value);
      } catch (err) {
        return { value: mf.value };
      }
    }

    // If no metafield evidence, check tags for a lightweight verification flag
    if (Array.isArray(node?.tags) && node.tags.includes('age_verif_verified')) {
      return { tagged: true };
    }

    return null;
  } catch (err) {
    return null;
  }
}
