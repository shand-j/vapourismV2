import { adminGraphQL } from '../app/lib/admin-client';

async function checkCustomerMetafield() {
  const query = `query getCustomer($id: ID!) {
    node(id: $id) {
      ... on Customer {
        id
        metafields(first: 5, namespace: "ageverif") {
          edges {
            node { key value }
          }
        }
      }
    }
  }`;

  try {
    const result = await adminGraphQL(query, { id: 'gid://shopify/Customer/9317663310151' });
    console.log('Customer metafield check result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error checking metafield:', error);
  }
}

checkCustomerMetafield();