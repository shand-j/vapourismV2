// Lightweight admin GraphQL adapter.
// Prefer using `@shopify/shopify-api` when available (Node) for ergonomics.
// Fallback to a fetch-based implementation so the code remains compatible with
// edge runtimes (Oxygen / MiniOxygen) where the full library may not work.

import {getAdminGraphQLEndpoint as _getAdminGraphQLEndpoint} from './admin-client-internal';

// Public API: run a GraphQL query using either shopify-api-js or fetch
export async function adminGraphQL(query: string, variables?: any, env?: Record<string, any>) {
  const store = env?.PUBLIC_STORE_DOMAIN ?? process.env.PUBLIC_STORE_DOMAIN;
  const token = env?.SHOPIFY_ADMIN_TOKEN ?? env?.PRIVATE_SHOPIFY_ADMIN_TOKEN ?? process.env.SHOPIFY_ADMIN_TOKEN ?? process.env.PRIVATE_SHOPIFY_ADMIN_TOKEN;

  if (!store || !token) throw new Error('PUBLIC_STORE_DOMAIN and SHOPIFY_ADMIN_TOKEN are required');

  // Try to dynamically import the official Shopify JS library. This will succeed
  // in Node environments where @shopify/shopify-api is available. If it fails or
  // is not present, fall back to fetch.
  try {
    // Dynamic import so bundlers don't statically resolve the package when it's
    // not installed in the environment (tests / edge). We prefer a variable indirection
    // so Vite/esbuild won't try to resolve it during static analysis.
    const pkg = '@shopify/shopify-api';
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
    const { Shopify } = await import(pkg as any);
    // Create a GraphQL client instance
    const client = new Shopify.Clients.Graphql(store, token);
    // The client.query API accepted { data: string | object }
    const resp = await client.query({ data: { query, variables } });
    // Some versions return { body } others return raw shape — normalize
    return (resp && (resp as any).body) ? (resp as any).body : resp;
  } catch (err) {
    // If the library isn't available or failed to run, use fetch as a lightweight substitute
    const url = _getAdminGraphQLEndpoint(env);

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Admin GraphQL error ${res.status}: ${text.substring(0, 1024)}`);
    }

    try {
      return await res.json();
    } catch (e) {
      const text = await res.text();
      throw new Error(`Admin GraphQL returned non-JSON response ${res.status}: ${text?.substring?.(0, 1024) ?? String(text)}`);
    }
  }
}

export default { adminGraphQL };
