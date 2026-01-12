// Create Brand Collections for NicPowch
// Run with: node scripts/create-brand-collections.js
// Requires a Shopify Admin API token with write_products scope

const STORE = 'b2xxju-ui.myshopify.com';
const API_VERSION = '2024-01';

// Get token from environment or command line
const ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN || process.argv[2];

if (!ACCESS_TOKEN) {
  console.error('Usage: SHOPIFY_ADMIN_TOKEN=xxx node scripts/create-brand-collections.js');
  console.error('   or: node scripts/create-brand-collections.js YOUR_TOKEN');
  console.error('\nGet a token from: https://admin.shopify.com/store/b2xxju-ui/settings/apps/development');
  console.error('Required scope: write_products');
  process.exit(1);
}

const BRANDS = [
  "4NX",
  "77",
  "Aroma King",
  "Artic7",
  "CLEW",
  "CUBA",
  "Camo",
  "Candys",
  "Crown",
  "EGP",
  "EOS",
  "FEDRS",
  "FUMI",
  "Garant",
  "Ghost",
  "Gilo",
  "Glitch",
  "Greatest",
  "HELWIT",
  "IGNITE",
  "Ice",
  "Iceberg",
  "Kelly White",
  "Kingston",
  "Kurwa",
  "MI3",
  "Mafia",
  "Maggie",
  "Max Kick",
  "Morko",
  "Muse",
  "NOIS",
  "NOR",
  "Nic Nac",
  "Nordic Spirit",
  "On!",
  "Poke",
  "Puff & Pouch",
  "SYKE",
  "Snoose",
  "Stripe",
  "Tick Tock",
  "Übbs",
  "V&YOU",
  "VITO",
  "Vapes Bars",
  "Velo",
  "Wham",
  "Zeus"
];

function generateHandle(brand) {
  return brand
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/&/g, 'and')
    .replace(/!/g, '')
    .replace(/ü/g, 'u')
    .replace(/[^a-z0-9-]/g, '');
}

async function createCollection(brand) {
  const handle = generateHandle(brand);
  
  const mutation = `
    mutation {
      collectionCreate(input: {
        title: "${brand}"
        handle: "${handle}"
        ruleSet: {
          appliedDisjunctively: false
          rules: [{
            column: VENDOR
            relation: EQUALS
            condition: "${brand}"
          }]
        }
      }) {
        collection {
          id
          title
          handle
          productsCount {
            count
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const response = await fetch(`https://${STORE}/admin/api/${API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ACCESS_TOKEN
      },
      body: JSON.stringify({ query: mutation })
    });

    const data = await response.json();
    
    if (data.errors) {
      console.error(`❌ ${brand}: ${data.errors[0].message}`);
      return false;
    }
    
    if (data.data.collectionCreate.userErrors.length > 0) {
      const error = data.data.collectionCreate.userErrors[0];
      console.error(`❌ ${brand}: ${error.message}`);
      return false;
    }
    
    const collection = data.data.collectionCreate.collection;
    console.log(`✅ ${brand} -> /collections/${collection.handle}`);
    return true;
  } catch (error) {
    console.error(`❌ ${brand}: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log(`Creating ${BRANDS.length} brand collections...\n`);
  
  let success = 0;
  let failed = 0;
  
  for (const brand of BRANDS) {
    const result = await createCollection(brand);
    if (result) success++;
    else failed++;
    
    // Rate limiting: 2 requests per second max
    await new Promise(r => setTimeout(r, 500));
  }
  
  console.log(`\n✅ Created: ${success}`);
  console.log(`❌ Failed: ${failed}`);
}

main();
