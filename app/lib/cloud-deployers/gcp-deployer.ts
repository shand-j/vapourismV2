/**
 * GCP Cloud Storage Deployer for Content Syndication
 * 
 * Deploys syndicated blog content to Google Cloud Storage bucket configured for static website hosting.
 * 
 * Prerequisites:
 * - GCP account with Cloud Storage access
 * - Service account with Storage Admin role
 * - Service account key JSON file
 * 
 * Installation:
 * ```bash
 * npm install @google-cloud/storage
 * ```
 * 
 * Usage:
 * ```typescript
 * const deployer = new GCPDeployer({
 *   bucketName: 'vapourism-blog-gcp',
 *   projectId: 'your-project-id',
 *   keyFilename: './service-account-key.json'
 * });
 * 
 * await deployer.deploy(syndicatedPages);
 * ```
 */

import type {SyndicatedPage} from '../content-syndicator';
import type {DeploymentResult} from './aws-deployer';

/**
 * GCP Cloud Storage Deployer Configuration
 */
export interface GCPDeployerConfig {
  /** Cloud Storage bucket name */
  bucketName: string;
  /** GCP project ID */
  projectId: string;
  /** Path to service account key JSON file */
  keyFilename?: string;
  /** Service account credentials (alternative to keyFilename) */
  credentials?: object;
  /** Base URL for the deployed site */
  baseUrl?: string;
}

/**
 * GCP Cloud Storage Deployer
 * 
 * Note: This class provides the interface and deployment logic.
 * GCP SDK dependencies are loaded dynamically to avoid bundling them
 * in the Oxygen edge runtime where they're not needed.
 */
export class GCPDeployer {
  private config: GCPDeployerConfig;
  private storage: any;
  private bucket: any;

  constructor(config: GCPDeployerConfig) {
    this.config = {
      ...config,
      baseUrl:
        config.baseUrl ||
        `https://storage.googleapis.com/${config.bucketName}`,
    };
  }

  /**
   * Initialize GCP Storage client (lazy loading)
   */
  private async initializeClient() {
    if (this.storage) return;

    try {
      // Dynamic import to avoid bundling GCP SDK in edge runtime
      const {Storage} = await import('@google-cloud/storage');

      this.storage = new Storage({
        projectId: this.config.projectId,
        keyFilename: this.config.keyFilename,
        credentials: this.config.credentials,
      });

      this.bucket = this.storage.bucket(this.config.bucketName);
    } catch (error) {
      throw new Error(
        'GCP Storage SDK not installed. Run: npm install @google-cloud/storage'
      );
    }
  }

  /**
   * Deploy syndicated pages to Cloud Storage
   */
  async deploy(pages: SyndicatedPage[]): Promise<DeploymentResult> {
    const startTime = Date.now();
    await this.initializeClient();

    const errors: Array<{page: string; error: string}> = [];
    let deployedPages = 0;

    console.log(
      `🚀 Starting deployment of ${pages.length} pages to GCP Cloud Storage...`
    );

    // Deploy each page
    for (const page of pages) {
      try {
        await this.uploadPage(page);
        deployedPages++;
        console.log(`✅ Deployed: ${page.slug}.html`);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        errors.push({page: page.slug, error: errorMessage});
        console.error(`❌ Failed to deploy ${page.slug}:`, errorMessage);
      }
    }

    // Deploy sitemap
    try {
      const sitemap = this.generateSitemap(pages);
      await this.uploadFile('sitemap.xml', sitemap, 'application/xml');
      console.log('✅ Deployed: sitemap.xml');
    } catch (error) {
      console.error('❌ Failed to deploy sitemap:', error);
    }

    // Deploy robots.txt
    try {
      const robotsTxt = this.generateRobotsTxt();
      await this.uploadFile('robots.txt', robotsTxt, 'text/plain');
      console.log('✅ Deployed: robots.txt');
    } catch (error) {
      console.error('❌ Failed to deploy robots.txt:', error);
    }

    const deploymentTime = Date.now() - startTime;

    const result: DeploymentResult = {
      success: errors.length === 0,
      deployedPages,
      errors,
      siteUrl: this.config.baseUrl!,
      deploymentTime,
    };

    console.log(`\n🎉 Deployment complete in ${deploymentTime}ms`);
    console.log(`📊 Deployed: ${deployedPages}/${pages.length} pages`);
    console.log(`🌐 Site URL: ${result.siteUrl}`);

    if (errors.length > 0) {
      console.log(`⚠️  Errors: ${errors.length}`);
    }

    return result;
  }

  /**
   * Upload a single page to Cloud Storage
   */
  private async uploadPage(page: SyndicatedPage): Promise<void> {
    const file = this.bucket.file(`${page.slug}.html`);

    await file.save(page.html, {
      contentType: 'text/html; charset=utf-8',
      metadata: {
        cacheControl: 'public, max-age=3600', // Cache for 1 hour
        metadata: {
          originalUrl: page.seo.canonical,
          generatedAt: page.generatedAt,
        },
      },
      public: true, // Make publicly accessible
    });
  }

  /**
   * Upload a file to Cloud Storage
   */
  private async uploadFile(
    filename: string,
    content: string,
    contentType: string
  ): Promise<void> {
    const file = this.bucket.file(filename);

    await file.save(content, {
      contentType,
      metadata: {
        cacheControl: 'public, max-age=86400', // Cache for 24 hours
      },
      public: true,
    });
  }

  /**
   * Generate sitemap.xml
   */
  private generateSitemap(pages: SyndicatedPage[]): string {
    const urls = pages
      .map(
        (page) => `  <url>
    <loc>${this.config.baseUrl}/${page.slug}.html</loc>
    <lastmod>${page.article.publishedAt}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
      )
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
  }

  /**
   * Generate robots.txt
   */
  private generateRobotsTxt(): string {
    return `User-agent: *
Allow: /

Sitemap: ${this.config.baseUrl}/sitemap.xml

# Canonical source: https://www.vapourism.co.uk
# This is a syndicated copy of Vapourism blog content
`;
  }

  /**
   * Verify deployment by checking if pages are accessible
   */
  async verify(pages: SyndicatedPage[]): Promise<{
    accessible: number;
    failed: string[];
  }> {
    console.log('\n🔍 Verifying deployment...');

    const failed: string[] = [];
    let accessible = 0;

    for (const page of pages.slice(0, 5)) {
      // Check first 5 pages
      try {
        const url = `${this.config.baseUrl}/${page.slug}.html`;
        const response = await fetch(url, {method: 'HEAD'});

        if (response.ok) {
          accessible++;
          console.log(`✅ Accessible: ${page.slug}.html`);
        } else {
          failed.push(`${page.slug} (${response.status})`);
          console.log(
            `❌ Not accessible: ${page.slug}.html (${response.status})`
          );
        }
      } catch (error) {
        failed.push(`${page.slug} (network error)`);
        console.log(`❌ Network error: ${page.slug}.html`);
      }
    }

    console.log(
      `\n📊 Verification: ${accessible}/${Math.min(5, pages.length)} pages accessible`
    );

    return {accessible, failed};
  }

  /**
   * Delete all content from the bucket (use with caution!)
   */
  async clean(): Promise<void> {
    console.log('🧹 Cleaning Cloud Storage bucket...');
    await this.initializeClient();

    const [files] = await this.bucket.getFiles();

    if (files.length === 0) {
      console.log('✅ Bucket is already empty');
      return;
    }

    await Promise.all(files.map((file: any) => file.delete()));
    console.log(`✅ Deleted ${files.length} objects`);
  }
}

/**
 * Setup guide for GCP Cloud Storage static website hosting
 */
export const GCP_SETUP_GUIDE = `
# GCP Cloud Storage Setup Guide for Blog Syndication

## Prerequisites
- GCP account
- gcloud CLI installed (optional but recommended)

## Step 1: Create GCP Project (if needed)
\`\`\`bash
gcloud projects create vapourism-blog --name="Vapourism Blog"
gcloud config set project vapourism-blog
\`\`\`

## Step 2: Enable Cloud Storage API
\`\`\`bash
gcloud services enable storage-api.googleapis.com
\`\`\`

## Step 3: Create Cloud Storage Bucket
\`\`\`bash
gsutil mb -l EU gs://vapourism-blog-gcp
\`\`\`

## Step 4: Configure Bucket for Public Access
\`\`\`bash
# Make bucket publicly readable
gsutil iam ch allUsers:objectViewer gs://vapourism-blog-gcp

# Set default ACL
gsutil defacl set public-read gs://vapourism-blog-gcp
\`\`\`

## Step 5: Create Service Account
\`\`\`bash
# Create service account
gcloud iam service-accounts create blog-deployer \\
  --description="Blog content deployer" \\
  --display-name="Blog Deployer"

# Grant Storage Admin role
gcloud projects add-iam-policy-binding vapourism-blog \\
  --member="serviceAccount:blog-deployer@vapourism-blog.iam.gserviceaccount.com" \\
  --role="roles/storage.admin"

# Create and download key
gcloud iam service-accounts keys create service-account-key.json \\
  --iam-account=blog-deployer@vapourism-blog.iam.gserviceaccount.com
\`\`\`

## Step 6: Test Deployment
\`\`\`bash
node scripts/sync-blog-to-cloud.ts --provider gcp --dry-run
\`\`\`

## Website URL
Your blog will be available at:
https://storage.googleapis.com/vapourism-blog-gcp/index.html

## Optional: Custom Domain
For custom domain with HTTPS:
1. Verify domain ownership in Google Search Console
2. Create CNAME record pointing to c.storage.googleapis.com
3. Configure bucket website hosting with custom domain

## Environment Variables
Add to \`.env\`:
\`\`\`
GCP_PROJECT_ID=vapourism-blog
GCP_BUCKET_NAME=vapourism-blog-gcp
GCP_KEY_FILENAME=./service-account-key.json
\`\`\`

## Security Note
- Never commit \`service-account-key.json\` to version control
- Add it to \`.gitignore\`
- Store securely in CI/CD secrets for automated deployment
`;
