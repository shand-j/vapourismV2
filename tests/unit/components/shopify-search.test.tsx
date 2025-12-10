import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {buildPredictiveApiBaseUrl} from '~/components/search/ShopifySearch';

describe('ShopifySearch component', () => {
  

  beforeEach(() => {});

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('builds an absolute predictive API URL relative to a root base href', () => {
    const url = buildPredictiveApiBaseUrl('https://example.com/');
    expect(url).toBe('https://example.com/api/search/predictive');
  });

  it('builds an absolute predictive API URL relative to a nested base href', () => {
    const url = buildPredictiveApiBaseUrl('https://example.com/base/path/');
    expect(url).toBe('https://example.com/base/path/api/search/predictive');
  });
});
