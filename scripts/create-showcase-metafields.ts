#!/usr/bin/env npx tsx
/**
 * Script to create showcase boolean metafield definitions on Products
 * via the Shopify Admin API.
 *
 * Usage:
 *   npx tsx scripts/create-showcase-metafields.ts
 *
 * Required environment variables:
 *   PUBLIC_STORE_DOMAIN - Your Shopify store domain (e.g., your-store.myshopify.com)
 *   SHOPIFY_ADMIN_TOKEN - Admin API access token with write_products scope
 */

import * as dotenv from 'dotenv';
dotenv.config();

const STORE_DOMAIN = process.env.PUBLIC_STORE_DOMAIN;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN ?? process.env.PRIVATE_SHOPIFY_ADMIN_TOKEN;

if (!STORE_DOMAIN || !ADMIN_TOKEN) {
  console.error('❌ Missing required environment variables:');
  console.error('   PUBLIC_STORE_DOMAIN and SHOPIFY_ADMIN_TOKEN are required');
  process.exit(1);
}

// Shopify Admin API endpoint
const ADMIN_API_VERSION = '2024-10';
const ADMIN_GRAPHQL_URL = `https://${STORE_DOMAIN}/admin/api/${ADMIN_API_VERSION}/graphql.json`;

// Metafield definitions to create
const SHOWCASE_METAFIELDS = [
  {
    name: 'Showcase - Featured',
    key: 'showcase_featured',
    description: 'Show this product in the homepage Featured Products section',
  },
  {
    name: 'Showcase - New Arrival',
    key: 'showcase_new_arrival',
    description: 'Show this product in the New Arrivals section',
  },
  {
    name: 'Showcase - Best Seller',
    key: 'showcase_best_seller',
    description: 'Show this product in the Best Sellers section',
  },
  {
    name: 'Showcase - Hero Disposables',
    key: 'showcase_hero_disposables',
    description: 'Show this product in the Disposables category hero section',
  },
  {
    name: 'Showcase - Hero E-Liquids',
    key: 'showcase_hero_eliquids',
    description: 'Show this product in the E-Liquids category hero section',
  },
  {
    name: 'Showcase - Hero Devices',
    key: 'showcase_hero_devices',
    description: 'Show this product in the Devices category hero section',
  },
  {
    name: 'Showcase - Hero Pods/Coils',
    key: 'showcase_hero_pods_coils',
    description: 'Show this product in the Pods & Coils category hero section',
  },
  {
    name: 'Showcase - Hero Nicotine Pouches',
    key: 'showcase_hero_nicotine_pouches',
    description: 'Show this product in the Nicotine Pouches category hero section',
  },
  {
    name: 'Showcase - Hero CBD',
    key: 'showcase_hero_cbd',
    description: 'Show this product in the CBD category hero section',
  },
  {
    name: 'Showcase - Hero Accessories',
    key: 'showcase_hero_accessories',
    description: 'Show this product in the Accessories category hero section',
  },
];

// GraphQL mutation to create a metafield definition
// Note: Using 'app--' prefix namespace which apps have automatic access to
const CREATE_METAFIELD_DEFINITION_MUTATION = `
  mutation CreateMetafieldDefinition($definition: MetafieldDefinitionInput!) {
    metafieldDefinitionCreate(definition: $definition) {
      createdDefinition {
        id
        name
        namespace
        key
        type {
          name
        }
        ownerType
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

// Alternative: Check access scopes first
const ACCESS_SCOPES_QUERY = `
  query {
    app {
      installation {
        accessScopes {
          handle
        }
      }
    }
  }
`;

async function adminGraphQL<T = any>(query: string, variables?: Record<string, any>): Promise<T> {
  const response = await fetch(ADMIN_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ADMIN_TOKEN!,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Admin API error ${response.status}: ${text.slice(0, 500)}`);
  }

  return response.json();
}

async function createMetafieldDefinition(metafield: typeof SHOWCASE_METAFIELDS[0]): Promise<boolean> {
  const variables = {
    definition: {
      name: metafield.name,
      namespace: 'custom',
      key: metafield.key,
      description: metafield.description,
      type: 'boolean',
      ownerType: 'PRODUCT',
      pin: true, // Pin to product edit page for easy access
    },
  };

  try {
    const result = await adminGraphQL<{
      data: {
        metafieldDefinitionCreate: {
          createdDefinition: {
            id: string;
            name: string;
            namespace: string;
            key: string;
          } | null;
          userErrors: Array<{
            field: string[];
            message: string;
            code: string;
          }>;
        };
      };
      errors?: Array<{ message: string }>;
    }>(CREATE_METAFIELD_DEFINITION_MUTATION, variables);

    // Check for GraphQL-level errors
    if (result.errors?.length) {
      console.error(`❌ GraphQL error for ${metafield.key}:`, result.errors[0].message);
      return false;
    }

    const { createdDefinition, userErrors } = result.data.metafieldDefinitionCreate;

    if (userErrors?.length) {
      const error = userErrors[0];
      // Check if it's a "already exists" error (which is fine)
      if (error.code === 'TAKEN' || error.message.includes('already exists')) {
        console.log(`⏭️  ${metafield.name} (custom.${metafield.key}) - already exists, skipping`);
        return true;
      }
      console.error(`❌ ${metafield.name}: ${error.message}`);
      return false;
    }

    if (createdDefinition) {
      console.log(`✅ Created: ${createdDefinition.name} (${createdDefinition.namespace}.${createdDefinition.key})`);
      return true;
    }

    console.error(`❌ Unknown error creating ${metafield.key}`);
    return false;
  } catch (error) {
    console.error(`❌ Error creating ${metafield.key}:`, error instanceof Error ? error.message : error);
    return false;
  }
}

async function main() {
  console.log('🚀 Creating showcase metafield definitions on Products...\n');
  console.log(`   Store: ${STORE_DOMAIN}`);
  console.log(`   API Version: ${ADMIN_API_VERSION}\n`);

  // First check access scopes
  console.log('🔍 Checking API access scopes...');
  try {
    const scopesResult = await adminGraphQL<{
      data?: { app?: { installation?: { accessScopes?: Array<{ handle: string }> } } };
      errors?: Array<{ message: string }>;
    }>(ACCESS_SCOPES_QUERY);

    if (scopesResult.data?.app?.installation?.accessScopes) {
      const scopes = scopesResult.data.app.installation.accessScopes.map((s) => s.handle);
      console.log('   Available scopes:', scopes.join(', '));
      
      const hasMetafields = scopes.some(s => 
        s.includes('metafield') || s.includes('products') || s.includes('write_products')
      );
      if (!hasMetafields) {
        console.warn('\n⚠️  Token may not have metafield definition access.');
        console.warn('   Required scopes: write_products or write_metafield_definitions');
      }
    }
  } catch {
    console.log('   Could not query scopes (may not be app token)');
  }

  console.log('\n📝 Creating metafield definitions...\n');

  let successCount = 0;
  let failCount = 0;

  for (const metafield of SHOWCASE_METAFIELDS) {
    const success = await createMetafieldDefinition(metafield);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  console.log('\n📊 Summary:');
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log(`   📦 Total: ${SHOWCASE_METAFIELDS.length}`);

  if (failCount > 0) {
    console.log('\n💡 If you see "Access denied" errors:');
    console.log('   Your Admin API token needs these additional scopes:');
    console.log('      - write_products');
    console.log('      - write_metafield_definitions');
    console.log('\n   To update scopes:');
    console.log('   1. Go to Shopify Admin → Settings → Apps and sales channels');
    console.log('   2. Click "Develop apps" → Your Hydrogen app → "Configuration"');
    console.log('   3. Under "Admin API access scopes", add:');
    console.log('      ✓ write_products');
    console.log('      ✓ write_metafield_definitions');
    console.log('   4. Click "Save" and reinstall the app to get a new token');
    console.log('\n   ── OR create them manually ──');
    console.log('\n   Go to: Settings → Custom data → Products → "Add definition"');
    console.log('   Create each of these boolean metafields:\n');
    
    for (const mf of SHOWCASE_METAFIELDS) {
      console.log(`   📦 Name: "${mf.name}"`);
      console.log(`      Namespace and key: custom.${mf.key}`);
      console.log(`      Type: True or false`);
      console.log(`      Description: ${mf.description}`);
      console.log('');
    }
    process.exit(1);
  }

  console.log('\n🎉 Done! You can now set these metafields on products:');
  console.log('   1. Go to Products in Shopify Admin');
  console.log('   2. Edit any product');
  console.log('   3. Scroll to "Metafields" section');
  console.log('   4. Toggle the showcase booleans to feature products');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
