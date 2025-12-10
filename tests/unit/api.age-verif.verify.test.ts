import {describe, it, expect, vi, beforeEach} from 'vitest';
import * as route from '~/routes/api.age-verif.verify';
import * as helper from '~/lib/ageverif.server';

describe('api.age-verif.verify route', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('returns 401 when token invalid', async () => {
    vi.spyOn(helper, 'verifyToken').mockResolvedValue(null as any);
    const req = { json: async () => ({ token: 'bad' }) } as any;
    const res: any = await route.action({ request: req } as any);
    expect(res.status).toBe(401);
  });

  it('accepts valid token, persists evidence and returns ok', async () => {
    vi.spyOn(helper, 'verifyToken').mockResolvedValue({ uid: 'ver-1', token: 'tok' } as any);
    vi.spyOn(helper, 'findOrderByName').mockResolvedValue({ id: 'gid', customer: { id: 'gid://shopify/Customer/2001' } } as any);
    vi.spyOn(helper, 'persistVerificationEvidence').mockResolvedValue({ created: true, target: 'customer' } as any);

    const req = { json: async () => ({ token: 'tok', orderNumber: '#1001' }) } as any;
    const res: any = await route.action({ request: req } as any);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.result.target).toBe('customer');
  });
});
