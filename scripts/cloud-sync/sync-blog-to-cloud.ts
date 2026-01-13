#!/usr/bin/env tsx
/**
 * Blog Content Syndication CLI
 * 
 * Syndicates Shopify blog content to cloud provider static hosting platforms.
 * 
 * Usage:
 * ```bash
 * # Sync to AWS S3
 * tsx scripts/cloud-sync/sync-blog-to-cloud.ts --provider aws
 * 
 * # Sync to GCP Cloud Storage
 * tsx scripts/cloud-sync/sync-blog-to-cloud.ts --provider gcp
 * 
 * # Sync to all providers
 * tsx scripts/cloud-sync/sync-blog-to-cloud.ts --provider all
 * 
 * # Dry run (generate HTML without deploying)
 * tsx scripts/cloud-sync/sync-blog-to-cloud.ts --provider aws --dry-run
 * 
 * # Sync specific number of posts
 * tsx scripts/cloud-sync/sync-blog-to-cloud.ts --provider aws --limit 10
 * ```
 */

import {createStorefrontClient} from '@shopify/hydrogen';
import {createContentSyndicator} from '../../app/lib/content-syndicator';
import {AWSDeployer} from '../../app/lib/cloud-deployers/aws-deployer';
import {GCPDeployer} from '../../app/lib/cloud-deployers/gcp-deployer';
import * as fs from 'fs';
import * as path from 'path';

// Parse command line arguments
const args = process.argv.slice(2);
const getArg = (name: string): string | undefined => {
  const index = args.indexOf(`--${name}`);
  return index !== -1 && args[index + 1] ? args[index + 1] : undefined;
};
const hasFlag = (name: string): boolean => args.includes(`--${name}`);

const provider = getArg('provider') || 'aws';
const dryRun = hasFlag('dry-run');
const limit = parseInt(getArg('limit') || '50', 10);
const outputDir = getArg('output-dir') || './tmp/syndicated-content';

// Configuration from environment variables
const config = {
  aws: {
    bucketName: process.env.AWS_BUCKET_NAME || 'vapourism-blog-aws',
    region: process.env.AWS_REGION || 'eu-west-2',
    credentials: process.env.AWS_ACCESS_KEY_ID
      ? {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        }
      : undefined,
    cloudFrontDistributionId: process.env.AWS_CLOUDFRONT_DISTRIBUTION_ID,
  },
  gcp: {
    bucketName: process.env.GCP_BUCKET_NAME || 'vapourism-blog-gcp',
    projectId: process.env.GCP_PROJECT_ID || '',
    keyFilename: process.env.GCP_KEY_FILENAME,
  },
  shopify: {
    storeDomain: process.env.PUBLIC_STORE_DOMAIN || '',
    storefrontApiVersion: '2024-10',
    publicStorefrontToken: process.env.PUBLIC_STOREFRONT_API_TOKEN || '',
  },
};

async function main() {
  console.log('🚀 Vapourism Blog Syndication Tool\n');
  console.log(`Provider: ${provider}`);
  console.log(`Dry Run: ${dryRun ? 'Yes' : 'No'}`);
  console.log(`Post Limit: ${limit}\n`);

  // Validate configuration
  if (!config.shopify.storeDomain || !config.shopify.publicStorefrontToken) {
    console.error(
      '❌ Missing Shopify configuration. Set PUBLIC_STORE_DOMAIN and PUBLIC_STOREFRONT_API_TOKEN in .env'
    );
    process.exit(1);
  }

  // Create Storefront client
  const storefront = createStorefrontClient({
    storeDomain: config.shopify.storeDomain,
    storefrontApiVersion: config.shopify.storefrontApiVersion,
    publicStorefrontToken: config.shopify.publicStorefrontToken,
  });

  // Create content syndicator
  console.log('📝 Fetching blog posts from Shopify...');
  const syndicator = createContentSyndicator(storefront.storefront);

  // Sync all posts
  const pages = await syndicator.syncAllPosts({limit});
  console.log(`✅ Generated ${pages.length} syndicated pages\n`);

  if (pages.length === 0) {
    console.log('⚠️  No blog posts found. Exiting.');
    process.exit(0);
  }

  // Save to output directory if dry run or for inspection
  if (dryRun || hasFlag('save-html')) {
    console.log(`💾 Saving HTML to ${outputDir}...`);
    fs.mkdirSync(outputDir, {recursive: true});

    for (const page of pages) {
      const filePath = path.join(outputDir, `${page.slug}.html`);
      fs.writeFileSync(filePath, page.html, 'utf-8');
    }

    // Save sitemap
    const sitemap = syndicator.generateSitemap(
      pages,
      'https://example.com' // Placeholder URL
    );
    fs.writeFileSync(path.join(outputDir, 'sitemap.xml'), sitemap, 'utf-8');

    // Save robots.txt
    const robotsTxt = syndicator.generateRobotsTxt(
      'https://example.com/sitemap.xml'
    );
    fs.writeFileSync(path.join(outputDir, 'robots.txt'), robotsTxt, 'utf-8');

    console.log(`✅ Saved ${pages.length} pages to ${outputDir}\n`);
  }

  if (dryRun) {
    console.log('🎉 Dry run complete. Files saved but not deployed.');
    console.log(`\n📂 View generated files in: ${outputDir}`);
    process.exit(0);
  }

  // Deploy to cloud provider(s)
  const providers = provider === 'all' ? ['aws', 'gcp'] : [provider];

  for (const prov of providers) {
    console.log(`\n📤 Deploying to ${prov.toUpperCase()}...`);

    try {
      if (prov === 'aws') {
        if (!config.aws.credentials && !process.env.AWS_ACCESS_KEY_ID) {
          console.error(
            '❌ Missing AWS credentials. Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in .env'
          );
          continue;
        }

        const deployer = new AWSDeployer(config.aws);
        const result = await deployer.deploy(pages);

        if (result.success) {
          console.log('\n✅ AWS deployment successful!');
          await deployer.verify(pages);
        } else {
          console.error('\n❌ AWS deployment had errors:');
          result.errors.forEach((err) =>
            console.error(`  - ${err.page}: ${err.error}`)
          );
        }
      } else if (prov === 'gcp') {
        if (!config.gcp.projectId) {
          console.error(
            '❌ Missing GCP configuration. Set GCP_PROJECT_ID and GCP_KEY_FILENAME in .env'
          );
          continue;
        }

        const deployer = new GCPDeployer(config.gcp);
        const result = await deployer.deploy(pages);

        if (result.success) {
          console.log('\n✅ GCP deployment successful!');
          await deployer.verify(pages);
        } else {
          console.error('\n❌ GCP deployment had errors:');
          result.errors.forEach((err) =>
            console.error(`  - ${err.page}: ${err.error}`)
          );
        }
      } else {
        console.error(`❌ Unknown provider: ${prov}`);
      }
    } catch (error) {
      console.error(`\n❌ Deployment to ${prov} failed:`, error);
    }
  }

  console.log('\n🎉 Blog syndication complete!');
}

// Run the script
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
