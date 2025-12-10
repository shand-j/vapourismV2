import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {MemoryRouter} from 'react-router';

// Mock the debounce function before importing the component
vi.mock('../../../app/lib/shopify-search', async () => {
  const actual = await vi.importActual<any>('../../../app/lib/shopify-search');
  return {
    ...actual,
    debounce: (fn: Function) => fn, // Make debounce synchronous for testing
  };
});

let ShopifySearch: any;

describe('ShopifySearch fetch behavior', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(async () => {
    // JSDOM requires React to be available globally for some transpiled JSX runtimes
    // @ts-ignore
    globalThis.React = React;
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    globalThis.fetch = originalFetch;
    // @ts-ignore
    delete globalThis.React;
    vi.restoreAllMocks();
  });

  it.skip('calls predictive API as user types and sends q param', async () => {
    // make sure location has a base path too
    // JSDOM exposes window; ensure globalThis.window exists and location.href is set
    // @ts-ignore
    globalThis.window ??= globalThis as any;
    // @ts-ignore
    globalThis.window.location = new URL('https://example.com/base/path/');

    // Import the component after the global React is set so JSX runtime can find it
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    ShopifySearch = (await import('../../../app/components/search/ShopifySearch')).ShopifySearch;

    const mockResp = {
      products: [],
      collections: [],
      queries: [],
    };

    const fetchMock = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(mockResp) } as any));
    // @ts-ignore
    globalThis.fetch = fetchMock;

    render(
      <MemoryRouter>
        <ShopifySearch debounceMs={0} minCharacters={2} />
      </MemoryRouter>
    );

    const input = screen.getByRole('searchbox');

    // type a query that's >= minCharacters
    fireEvent.change(input, { target: { value: 'dis' } });

    // Since debounce is mocked to be synchronous, we don't need to advance timers
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());

    const calledWith = fetchMock.mock.calls[0][0];
    expect(String(calledWith)).toContain('/base/path/api/search/predictive');
    expect(String(calledWith)).toContain('q=dis');
  });
});
