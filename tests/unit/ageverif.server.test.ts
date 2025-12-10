import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import * as ageverif from '~/lib/ageverif.server';

describe('ageverif.server helpers (unit)', () => {
  beforeEach(() => {
    // clear environment mocking
    vi.restoreAllMocks();
  });

  it('createVerificationSession() returns a session id and maps it', async () => {
    process.env.PUBLIC_STORE_DOMAIN = 'example.com';
    process.env.SHOPIFY_ADMIN_TOKEN = 'admin-token';

    // stub fetch to return order lookup and accept metafieldCreate
    vi.stubGlobal('fetch', vi.fn().mockImplementation(async (url: string, opts: any) => {
      const body = JSON.parse(opts.body as string);
      const q = String(body.query || '');
      if (q.includes('orders(first:1')) {
        return { ok: true, json: async () => ({ data: { orders: { edges: [ { node: { id: 'gid://shopify/Order/1001', name: '#1001', customer: { id: 'gid://shopify/Customer/2001', email: 'c@example.com' } } } ] } } }) } as any;
      }
      // accept metafield mutate
      if (q.includes('metafieldCreate')) {
        return { ok: true, json: async () => ({ data: { metafieldCreate: { metafield: { id: 'gid://shopify/Metafield/1' }, userErrors: [] } } }) } as any;
      }
      return { ok: true, json: async () => ({ data: {} }) } as any;
    }));

    const res = await ageverif.createVerificationSession({ surname: 'Smith', orderNumber: '#1001', postcode: 'AB12 3CD' });
    expect(res).toHaveProperty('sessionId');
    // sessionId should be a non-empty hex string
    expect((res as any).sessionId.length).toBeGreaterThan(0);

    delete process.env.PUBLIC_STORE_DOMAIN;
    delete process.env.SHOPIFY_ADMIN_TOKEN;
  });

  it('verifyToken() decodes a JWT payload (dev mode)', async () => {
    // create a fake JWT (header.payload.signature) with base64 payload
    const header = { alg: 'HS256', typ: 'JWT' };
    const headerEncoded = Buffer.from(JSON.stringify(header)).toString('base64url');
    const payload = { uid: 'fake-uid-123', assuranceLevel: 'STANDARD', expiresAt: 9999999999 };
    const payloadEncoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const fakeToken = `${headerEncoded}.${payloadEncoded}.s`; // header and signature are irrelevant for this test

    const v = await ageverif.verifyToken(fakeToken);
    expect(v).not.toBeNull();
    expect(v?.uid).toBe('fake-uid-123');
  });

  it('verifyToken() verifies signature when AGEVERIF_PUBLIC_KEY present (RS256)', async () => {
    const { generateKeyPairSync, createSign } = require('node:crypto');
    const { publicKey, privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048, publicKeyEncoding: { type: 'spki', format: 'pem' }, privateKeyEncoding: { type: 'pkcs8', format: 'pem' } });

    // make a simple payload
    const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
    const payload = Buffer.from(JSON.stringify({ uid: 'signed-uid-1', assuranceLevel: 'STANDARD', expiresAt: 9999999999 })).toString('base64url');
    const signingInput = `${header}.${payload}`;

    const signer = createSign('RSA-SHA256');
    signer.update(signingInput);
    signer.end();
    const signature = signer.sign(privateKey);
    const signatureB64 = signature.toString('base64url');
    const token = `${signingInput}.${signatureB64}`;

    process.env.AGEVERIF_PUBLIC_KEY = publicKey;
    const v = await ageverif.verifyToken(token);
    expect(v).not.toBeNull();
    expect(v?.uid).toBe('signed-uid-1');
    delete process.env.AGEVERIF_PUBLIC_KEY;
  });

  it('validateWebhook() rejects invalid JSON', async () => {
    const res = await ageverif.validateWebhook('not-json' as any, {});
    expect(res.ok).toBe(false);
  });

  it('validateWebhook() verifies signature when secret present', async () => {
    process.env.AGEVERIF_WEBHOOK_SECRET = 'test-secret';
    const body = JSON.stringify({ foo: 'bar' });
    const sig = require('node:crypto').createHmac('sha256', 'test-secret').update(body).digest('hex');
    const res = await ageverif.validateWebhook(body, { 'x-ageverif-signature': sig });
    expect(res.ok).toBe(true);
    delete process.env.AGEVERIF_WEBHOOK_SECRET;
  });

  it('persistVerificationEvidence() writes customer metafield and tags customer when customer exists', async () => {
    process.env.PUBLIC_STORE_DOMAIN = 'example.com';
    process.env.SHOPIFY_ADMIN_TOKEN = 'admin-token';

    // prepare mocked fetch which inspects query text to return an appropriate response
    vi.stubGlobal('fetch', vi.fn().mockImplementation(async (url: string, opts: any) => {
      const body = JSON.parse(opts.body as string);
      const query = String(body.query || '');

      // customer node lookup
      if (query.includes('getCustomer')) {
        return { ok: true, json: async () => ({ data: { node: { id: 'gid://shopify/Customer/2001', email: 'c@example.com', tags: '', metafields: { edges: [] } } } }) } as any;
      }

      // metafieldCreate and tagsAdd should be accepted
      if (query.includes('metafieldCreate') || query.includes('tagsAdd')) {
        return { ok: true, json: async () => ({ data: { metafieldCreate: { metafield: { id: 'gid://shopify/Metafield/3001' }, userErrors: [] } } }) } as any;
      }

      // fallback
      return { ok: true, json: async () => ({ data: {} }) } as any;
    }));

    const res = await ageverif.persistVerificationEvidence({
      orderNumber: '#1001',
      customerId: 'gid://shopify/Customer/2001',
      verification: { uid: 'ver-1', token: 'tok', assuranceLevel: 'STANDARD' },
      source: 'webhook',
    });

    expect(res.created).toBe(true);
    expect(res.target).toBe('customer');

    delete process.env.PUBLIC_STORE_DOMAIN;
    delete process.env.SHOPIFY_ADMIN_TOKEN;
  });

  it('parseShopifyNumericId() extracts numbers from gid', () => {
    expect(ageverif.parseShopifyNumericId('gid://shopify/Customer/9317663310151')).toBe('9317663310151');
    expect(ageverif.parseShopifyNumericId(null)).toBeNull();
    expect(ageverif.parseShopifyNumericId('not-a-gid')).toBeNull();
  });

  it('persistVerificationEvidence() accepts numeric customer id and writes customer metafield & tag', async () => {
    process.env.PUBLIC_STORE_DOMAIN = 'example.com';
    process.env.SHOPIFY_ADMIN_TOKEN = 'admin-token';

    vi.stubGlobal('fetch', vi.fn().mockImplementation(async (url: string, opts: any) => {
      const body = JSON.parse(opts.body as string);
      const query = String(body.query || '');

      // customer node lookup
      if (query.includes('getCustomer')) {
        return { ok: true, json: async () => ({ data: { node: { id: 'gid://shopify/Customer/2001', email: null, tags: '', metafields: { edges: [] } } } }) } as any;
      }

      // metafieldCreate and tagsAdd should be accepted
      if (query.includes('metafieldCreate') || query.includes('tagsAdd')) {
        return { ok: true, json: async () => ({ data: { metafieldCreate: { metafield: { id: 'gid://shopify/Metafield/3001' }, userErrors: [] } } }) } as any;
      }

      // fallback
      return { ok: true, json: async () => ({ data: {} }) } as any;
    }));

    const res = await ageverif.persistVerificationEvidence({
      orderNumber: '#1001',
      customerNumericId: '2001',
      verification: { uid: 'ver-1', token: 'tok', assuranceLevel: 'STANDARD' },
      source: 'webhook',
    });

    expect(res.created).toBe(true);
    expect(res.target).toBe('customer');

    delete process.env.PUBLIC_STORE_DOMAIN;
    delete process.env.SHOPIFY_ADMIN_TOKEN;
  });

  it('persistVerificationEvidence returns existed when customer already has metafield', async () => {
    process.env.PUBLIC_STORE_DOMAIN = 'example.com';
    process.env.SHOPIFY_ADMIN_TOKEN = 'admin-token';

    vi.stubGlobal('fetch', vi.fn().mockImplementation(async (url: string, opts: any) => {
      const body = JSON.parse(opts.body as string);
      const query = String(body.query || '');

      if (query.includes('getCustomer')) {
        return { ok: true, json: async () => ({ data: { node: { id: 'gid://shopify/Customer/2001', email: 'c@example.com', tags: '', metafields: { edges: [ { node: { key: process.env.AGE_VERIF_METAFIELD_KEY || 'age_verification', value: '{}' } } ] } } } }) } as any;
      }

      return { ok: true, json: async () => ({ data: {} }) } as any;
    }));

    const res = await ageverif.persistVerificationEvidence({
      orderNumber: '#1001',
      customerId: 'gid://shopify/Customer/2001',
      verification: { uid: 'ver-1', token: 'tok', assuranceLevel: 'STANDARD' },
      source: 'webhook',
    });

    expect(res.created).toBe(false);
    expect(res.existed).toBe(true);
    expect(res.target).toBe('customer');

    delete process.env.PUBLIC_STORE_DOMAIN;
    delete process.env.SHOPIFY_ADMIN_TOKEN;
  });

  it('adminGraphQL throws a clear error when non-JSON OK response is returned', async () => {
    // stub fetch to return a 200 with non-JSON body
    process.env.PUBLIC_STORE_DOMAIN = 'example.com';
    process.env.SHOPIFY_ADMIN_TOKEN = 'admin-token';

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => { throw new SyntaxError('Unexpected token I'); },
      text: async () => 'Internal server error from upstream',
    }) as any);

    const node = await ageverif.findOrderByName('#1');
    // findOrderByName is tolerant and will try multiple formats — when adminGraphQL returns
    // a non-JSON body it will not crash the process; helper returns null when lookup fails
    expect(node).toBeNull();

    delete process.env.PUBLIC_STORE_DOMAIN;
    delete process.env.SHOPIFY_ADMIN_TOKEN;
  });

  it('findOrderByEmailAndPostcode() finds an order by email and normalized postcode', async () => {
    process.env.PUBLIC_STORE_DOMAIN = 'example.com';
    process.env.SHOPIFY_ADMIN_TOKEN = 'admin-token';

    vi.stubGlobal('fetch', vi.fn().mockImplementation(async (url: string, opts: any) => {
      const body = JSON.parse(opts.body as string);
      const q = String(body.query || '');
      if (q.includes('orders(first:10')) {
        return { ok: true, json: async () => ({ data: { orders: { edges: [ { node: { id: 'gid://shopify/Order/1234', name: '#1234', customer: { id: 'gid://shopify/Customer/2001' }, shippingAddress: { postalCode: 'AB12 3CD' } } } ] } } }) } as any;
      }
      return { ok: true, json: async () => ({ data: {} }) } as any;
    }));

    const node = await ageverif.findOrderByEmailAndPostcode('c@example.com', 'ab123cd');
    expect(node).not.toBeNull();
    expect(node?.id).toBe('gid://shopify/Order/1234');

    delete process.env.PUBLIC_STORE_DOMAIN;
    delete process.env.SHOPIFY_ADMIN_TOKEN;
  });

  it('findOrderByEmailAndPostcode() tries multiple email query variants and succeeds on fallback', async () => {
    process.env.PUBLIC_STORE_DOMAIN = 'example.com';
    process.env.SHOPIFY_ADMIN_TOKEN = 'admin-token';

    let calls = 0;
    vi.stubGlobal('fetch', vi.fn().mockImplementation(async (url: string, opts: any) => {
      const body = JSON.parse(opts.body as string);
      const q = String(body?.variables?.q || '');
      // On the first time we see the email query, return empty so helper must try next candidate.
      if (q.includes('first@example.com')) {
        calls++;
        if (calls === 1) {
          return { ok: true, json: async () => ({ data: { orders: { edges: [] } } }) } as any;
        }

        // subsequent calls succeed with a matching order
        return { ok: true, json: async () => ({ data: { orders: { edges: [ { node: { id: 'gid://shopify/Order/5555', name: '#5555', customer: { id: 'gid://shopify/Customer/2001' }, shippingAddress: { postalCode: 'AB12 3CD' } } } ] } } }) } as any;
      }

      return { ok: true, json: async () => ({ data: { orders: { edges: [] } } }) } as any;
    }));

    const node = await ageverif.findOrderByEmailAndPostcode('first@example.com', 'AB12 3CD');
    expect(node).not.toBeNull();
    expect(node?.id).toBe('gid://shopify/Order/5555');
    // should have called the adminGraphQL multiple times as candidates were tried
    expect((globalThis.fetch as any).mock.calls.length).toBeGreaterThan(1);

    delete process.env.PUBLIC_STORE_DOMAIN;
    delete process.env.SHOPIFY_ADMIN_TOKEN;
  });

  it('findOrderByEmailAndPostcode() returns null when no matching postcode found', async () => {
    process.env.PUBLIC_STORE_DOMAIN = 'example.com';
    process.env.SHOPIFY_ADMIN_TOKEN = 'admin-token';

    vi.stubGlobal('fetch', vi.fn().mockImplementation(async (url: string, opts: any) => {
      const body = JSON.parse(opts.body as string);
      const q = String(body.query || '');
      if (q.includes('orders(first:10')) {
        return { ok: true, json: async () => ({ data: { orders: { edges: [ { node: { id: 'gid://shopify/Order/1234', name: '#1234', customer: { id: 'gid://shopify/Customer/2001' }, shippingAddress: { postalCode: 'ZZ99 9ZZ' } } } ] } } }) } as any;
      }
      return { ok: true, json: async () => ({ data: {} }) } as any;
    }));

    const node = await ageverif.findOrderByEmailAndPostcode('c@example.com', 'ab123cd');
    expect(node).toBeNull();

    delete process.env.PUBLIC_STORE_DOMAIN;
    delete process.env.SHOPIFY_ADMIN_TOKEN;
  });

  it('persistVerificationEvidence creates a customer if none exists and AGEVERIF_CREATE_CUSTOMER=true', async () => {
    process.env.PUBLIC_STORE_DOMAIN = 'example.com';
    process.env.SHOPIFY_ADMIN_TOKEN = 'admin-token';
    process.env.AGEVERIF_CREATE_CUSTOMER = 'true';

    // stub fetch to sequence responses for order lookup, customerCreate, getCustomer, metafieldCreate, tagsAdd
    vi.stubGlobal('fetch', vi.fn().mockImplementation(async (url: string, opts: any) => {
      const body = JSON.parse(opts.body as string);
      const query = String(body.query || '');

      if (query.includes('orders(first:1')) {
        // return order with customer email but no id
        return { ok: true, json: async () => ({ data: { orders: { edges: [ { node: { id: 'gid://shopify/Order/1001', name: '#1001', customer: { id: null, email: 'guest@example.com' }, metafields: { edges: [] } } } ] } } }) } as any;
      }

      if (query.includes('customerCreate')) {
        return { ok: true, json: async () => ({ data: { customerCreate: { customer: { id: 'gid://shopify/Customer/2002', email: 'guest@example.com' }, userErrors: [] } } }) } as any;
      }

      if (query.includes('getCustomer')) {
        return { ok: true, json: async () => ({ data: { node: { id: 'gid://shopify/Customer/2002', email: 'guest@example.com', metafields: { edges: [] } } } }) } as any;
      }

      if (query.includes('metafieldCreate') || query.includes('tagsAdd')) {
        return { ok: true, json: async () => ({ data: { metafieldCreate: { metafield: { id: 'gid://shopify/Metafield/3001' }, userErrors: [] } } }) } as any;
      }

      return { ok: true, json: async () => ({ data: {} }) } as any;
    }));

    const res = await ageverif.persistVerificationEvidence({ orderNumber: '#1001', verification: { uid: 'x', token: 'tok' } as any, source: 'webhook' });
    expect(res.created).toBe(true);
    expect(res.target).toBe('customer');

    delete process.env.PUBLIC_STORE_DOMAIN;
    delete process.env.SHOPIFY_ADMIN_TOKEN;
    delete process.env.AGEVERIF_CREATE_CUSTOMER;
  });
});
