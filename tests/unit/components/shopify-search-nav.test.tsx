import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';

// Mock useNavigate from remix so we can assert navigation calls
const navigateMock = vi.fn();
vi.mock('@remix-run/react', async () => {
  const actual = await vi.importActual<any>('@remix-run/react');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

import {ShopifySearch} from '~/components/search/ShopifySearch';

describe('ShopifySearch navigation behavior', () => {
  beforeEach(() => {
    // ensure React is available globally for older JSX runtime in tests
    // @ts-ignore
    globalThis.React = React;
    navigateMock.mockReset();
  });

  afterEach(() => {
    // @ts-ignore
    delete globalThis.React;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does not navigate when pressing Go with a short/empty query', () => {
    render(<ShopifySearch debounceMs={0} minCharacters={3} />);

    const goButton = screen.getByRole('button', {name: 'Go'});

    fireEvent.click(goButton);

    expect(navigateMock).not.toHaveBeenCalled();
  });

  it('navigates to search when the query meets the minCharacters requirement', () => {
    render(<ShopifySearch debounceMs={0} minCharacters={3} />);

    const input = screen.getByRole('searchbox');
    fireEvent.change(input, {target: {value: 'menthol'}});

    const goButton = screen.getByRole('button', {name: 'Go'});
    fireEvent.click(goButton);

    expect(navigateMock).toHaveBeenCalledWith('/search?q=menthol');
  });
});
