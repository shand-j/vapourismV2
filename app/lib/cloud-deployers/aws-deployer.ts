/**
 * AWS S3 Deployer for Content Syndication
 * 
 * Deploys syndicated blog content to AWS S3 bucket configured for static website hosting.
 * 
 * Prerequisites:
 * - AWS account with S3 access
 * - AWS credentials configured (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
 * - S3 bucket created and configured for static website hosting
 * 
 * Installation:
 * ```bash
 * npm install @aws-sdk/client-s3 @aws-sdk/lib-storage
 * ```
 * 
 * Usage:
 * ```typescript
 * const deployer = new AWSDeployer({
 *   bucketName: 'vapourism-blog-aws',
 *   region: 'eu-west-2'
 * });
 * 
 * await deployer.deploy(syndicatedPages);
 * ```
 */

import type {SyndicatedPage} from '../content-syndicator';

/**
 * AWS S3 Deployer Configuration
 */
export interface AWSDeployerConfig {
  /** S3 bucket name */
  bucketName: string;
  /** AWS region */
  region: string;
  /** AWS credentials (optional - will use env vars if not provided) */
  credentials?: {
    accessKeyId: string;
    secretAccessKey: string;
  };
  /** CloudFront distribution ID (optional - for cache invalidation) */
  cloudFrontDistributionId?: string;
  /** Base URL for the deployed site */
  baseUrl?: string;
}

/**
 * Deployment result
 */
export interface DeploymentResult {
  success: boolean;
  deployedPages: number;
  errors: Array<{page: string; error: string}>;
  siteUrl: string;
  deploymentTime: number;
}

/**
 * AWS S3 Deployer
 * 
 * Note: This class provides the interface and deployment logic.
 * AWS SDK dependencies are loaded dynamically to avoid bundling them
 * in the Oxygen edge runtime where they're not needed.
 */
export class AWSDeployer {
  private config: AWSDeployerConfig;
  private s3Client: any;
  private cloudFrontClient: any;

  constructor(config: AWSDeployerConfig) {
    this.config = {
      ...config,
      baseUrl:
        config.baseUrl ||
        `https://${config.bucketName}.s3-website.${config.region}.amazonaws.com`,
    };
  }

  /**
   * Initialize AWS SDK clients (lazy loading)
   */
  private async initializeClients() {
    if (this.s3Client) return;

    try {
      // Dynamic import to avoid bundling AWS SDK in edge runtime
      const {S3Client} = await import('@aws-sdk/client-s3');
      const {CloudFrontClient} = await import('@aws-sdk/client-cloudfront');

      this.s3Client = new S3Client({
        region: this.config.region,
        credentials: this.config.credentials,
      });

      if (this.config.cloudFrontDistributionId) {
        this.cloudFrontClient = new CloudFrontClient({
          region: 'us-east-1', // CloudFront is global, uses us-east-1
          credentials: this.config.credentials,
        });
      }
    } catch (error) {
      throw new Error(
        'AWS SDK not installed. Run: npm install @aws-sdk/client-s3 @aws-sdk/client-cloudfront @aws-sdk/lib-storage'
      );
    }
  }

  /**
   * Deploy syndicated pages to S3
   */
  async deploy(pages: SyndicatedPage[]): Promise<DeploymentResult> {
    const startTime = Date.now();
    await this.initializeClients();

    const errors: Array<{page: string; error: string}> = [];
    let deployedPages = 0;

    console.log(`🚀 Starting deployment of ${pages.length} pages to S3...`);

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

    // Invalidate CloudFront cache if configured
    if (this.config.cloudFrontDistributionId && deployedPages > 0) {
      try {
        await this.invalidateCloudFront();
        console.log('✅ CloudFront cache invalidated');
      } catch (error) {
        console.error('❌ Failed to invalidate CloudFront cache:', error);
      }
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
   * Upload a single page to S3
   */
  private async uploadPage(page: SyndicatedPage): Promise<void> {
    const {PutObjectCommand} = await import('@aws-sdk/client-s3');

    const key = `${page.slug}.html`;
    const command = new PutObjectCommand({
      Bucket: this.config.bucketName,
      Key: key,
      Body: page.html,
      ContentType: 'text/html; charset=utf-8',
      CacheControl: 'public, max-age=3600', // Cache for 1 hour
      Metadata: {
        'original-url': page.seo.canonical,
        'generated-at': page.generatedAt,
      },
    });

    await this.s3Client.send(command);
  }

  /**
   * Upload a file to S3
   */
  private async uploadFile(
    key: string,
    content: string,
    contentType: string
  ): Promise<void> {
    const {PutObjectCommand} = await import('@aws-sdk/client-s3');

    const command = new PutObjectCommand({
      Bucket: this.config.bucketName,
      Key: key,
      Body: content,
      ContentType: contentType,
      CacheControl: 'public, max-age=86400', // Cache for 24 hours
    });

    await this.s3Client.send(command);
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
   * Invalidate CloudFront distribution cache
   */
  private async invalidateCloudFront(): Promise<void> {
    if (!this.cloudFrontClient || !this.config.cloudFrontDistributionId) {
      return;
    }

    const {CreateInvalidationCommand} = await import(
      '@aws-sdk/client-cloudfront'
    );

    const command = new CreateInvalidationCommand({
      DistributionId: this.config.cloudFrontDistributionId,
      InvalidationBatch: {
        CallerReference: `blog-sync-${Date.now()}`,
        Paths: {
          Quantity: 1,
          Items: ['/*'], // Invalidate all paths
        },
      },
    });

    await this.cloudFrontClient.send(command);
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
          console.log(`❌ Not accessible: ${page.slug}.html (${response.status})`);
        }
      } catch (error) {
        failed.push(`${page.slug} (network error)`);
        console.log(`❌ Network error: ${page.slug}.html`);
      }
    }

    console.log(`\n📊 Verification: ${accessible}/${Math.min(5, pages.length)} pages accessible`);

    return {accessible, failed};
  }

  /**
   * Delete all content from the bucket (use with caution!)
   */
  async clean(): Promise<void> {
    console.log('🧹 Cleaning S3 bucket...');
    await this.initializeClients();

    const {ListObjectsV2Command, DeleteObjectsCommand} = await import(
      '@aws-sdk/client-s3'
    );

    // List all objects
    const listCommand = new ListObjectsV2Command({
      Bucket: this.config.bucketName,
    });

    const response = await this.s3Client.send(listCommand);

    if (!response.Contents || response.Contents.length === 0) {
      console.log('✅ Bucket is already empty');
      return;
    }

    // Delete all objects
    const deleteCommand = new DeleteObjectsCommand({
      Bucket: this.config.bucketName,
      Delete: {
        Objects: response.Contents.map((obj) => ({Key: obj.Key})),
      },
    });

    await this.s3Client.send(deleteCommand);
    console.log(`✅ Deleted ${response.Contents.length} objects`);
  }
}

/**
 * Setup guide for AWS S3 static website hosting
 */
export const AWS_SETUP_GUIDE = `
# AWS S3 Setup Guide for Blog Syndication

## Prerequisites
- AWS account
- AWS CLI installed (optional but recommended)

## Step 1: Create S3 Bucket
\`\`\`bash
aws s3 mb s3://vapourism-blog-aws --region eu-west-2
\`\`\`

## Step 2: Enable Static Website Hosting
\`\`\`bash
aws s3 website s3://vapourism-blog-aws \\
  --index-document index.html \\
  --error-document 404.html
\`\`\`

## Step 3: Configure Bucket Policy
Create a file \`bucket-policy.json\`:
\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::vapourism-blog-aws/*"
    }
  ]
}
\`\`\`

Apply the policy:
\`\`\`bash
aws s3api put-bucket-policy \\
  --bucket vapourism-blog-aws \\
  --policy file://bucket-policy.json
\`\`\`

## Step 4: Create IAM User for Deployment
\`\`\`bash
aws iam create-user --user-name blog-deployer
\`\`\`

Attach S3 write policy:
\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::vapourism-blog-aws/*"
    },
    {
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::vapourism-blog-aws"
    }
  ]
}
\`\`\`

## Step 5: Generate Access Keys
\`\`\`bash
aws iam create-access-key --user-name blog-deployer
\`\`\`

Save the AccessKeyId and SecretAccessKey - you'll need these for deployment.

## Step 6: Test Deployment
\`\`\`bash
node scripts/sync-blog-to-cloud.ts --provider aws --dry-run
\`\`\`

## Website URL
Your blog will be available at:
https://vapourism-blog-aws.s3-website.eu-west-2.amazonaws.com

## Optional: CloudFront CDN
For better performance and custom domain:
1. Create CloudFront distribution pointing to S3 bucket
2. Configure custom domain in Route 53
3. Add distribution ID to deployment config for cache invalidation

## Environment Variables
Add to \`.env\`:
\`\`\`
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=eu-west-2
AWS_BUCKET_NAME=vapourism-blog-aws
AWS_CLOUDFRONT_DISTRIBUTION_ID=optional_distribution_id
\`\`\`
`;
