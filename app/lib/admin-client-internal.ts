export function getAdminGraphQLEndpoint(env?: Record<string, any>) {
  const store = env?.PUBLIC_STORE_DOMAIN ?? process.env.PUBLIC_STORE_DOMAIN;
  if (!store) throw new Error('PUBLIC_STORE_DOMAIN not configured');
  return `https://${store}/admin/api/2025-07/graphql.json`;
}

export default { getAdminGraphQLEndpoint };
