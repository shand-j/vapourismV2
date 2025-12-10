// Test collections and tags
console.log("Testing collection tags system...");

const query = `
  query GetCollections {
    collections(first: 5) {
      edges {
        node {
          id
          title
          handle
          products(first: 3) {
            edges {
              node {
                id
                title
                tags
              }
            }
          }
        }
      }
    }
  }
`;

console.log(query);
