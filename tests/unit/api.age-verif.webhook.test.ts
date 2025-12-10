import {describe, it, expect, vi, beforeEach} from 'vitest';
import * as route from '~/routes/api.age-verif.webhook';
import * as helper from '~/lib/ageverif.server';

describe('api.age-verif.webhook route', () => {
  beforeEach(() => vi.restoreAllMocks());
  beforeEach(() => {
    process.env.SHOPIFY_ADMIN_TOKEN = 'admin-token';
    process.env.PUBLIC_STORE_DOMAIN = 'example.com';
  });

  afterEach(() => {
    delete process.env.SHOPIFY_ADMIN_TOKEN;
    delete process.env.PUBLIC_STORE_DOMAIN;
  });

  it('returns 400 for invalid json', async () => {
    const req = { text: async () => 'not-json', headers: new Map() } as any;
    const res: any = await route.action({ request: req } as any);
    expect(res.status).toBe(400);
  });

  it('persist evidence when event contains orderNumber', async () => {
    const payload = { orderNumber: '#1', verification: { uid: 'abc' } };
    // include signature header using AGEVERIF_WEBHOOK_SECRET
    process.env.AGEVERIF_WEBHOOK_SECRET = 'test-secret';
    const sig = require('crypto').createHmac('sha256', 'test-secret').update(JSON.stringify(payload)).digest('hex');
    const req = { text: async () => JSON.stringify(payload), headers: new Map([['x-ageverif-signature', sig]]) } as any;

    const spyPersist = vi.spyOn(helper, 'persistVerificationEvidence').mockResolvedValue({ created: true } as any);
    vi.spyOn(helper, 'findOrderByName').mockResolvedValue({ id: 'gid' } as any);

    const res: any = await route.action({ request: req } as any);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(spyPersist).toHaveBeenCalled();
  });

  it('accepts token-only payload when token verifies (and an orderNumber is present)', async () => {
    const payload = { orderNumber: '#1', verification: { uid: 'abc', token: 'signed-token' } };
    const req = { text: async () => JSON.stringify(payload), headers: new Map() } as any;

    const spyPersist = vi.spyOn(helper, 'persistVerificationEvidence').mockResolvedValue({ created: true } as any);
    vi.spyOn(helper, 'findOrderByName').mockResolvedValue({ id: 'gid' } as any);
    vi.spyOn(helper, 'verifyToken').mockResolvedValue({ uid: 'abc' } as any);

    const res: any = await route.action({ request: req } as any);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(spyPersist).toHaveBeenCalled();
  });

  it('rejects token-only payload when token is invalid (and orderNumber present)', async () => {
    const payload = { orderNumber: '#1', verification: { uid: 'abc', token: 'bad-token' } };
    const req = { text: async () => JSON.stringify(payload), headers: new Map() } as any;

    vi.spyOn(helper, 'verifyToken').mockResolvedValue(null as any);

    const res: any = await route.action({ request: req } as any);
    expect(res.status).toBe(400);
  });
});
