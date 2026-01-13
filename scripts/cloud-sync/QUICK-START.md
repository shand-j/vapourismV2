# Quick Start Guide: SEO Cloudstack Backlink Strategy

This is a 5-minute quick start guide to get the system running.

## Prerequisites Checklist

- [ ] Node.js >= 18 installed
- [ ] Shopify store with blog posts
- [ ] AWS or GCP account (for actual deployment)

## Step 1: Run the Proof of Concept (2 minutes)

No cloud credentials needed - just test the system locally:

```bash
# Ensure you have Shopify credentials in .env
echo "PUBLIC_STORE_DOMAIN=your-store.myshopify.com" >> .env
echo "PUBLIC_STOREFRONT_API_TOKEN=your_token" >> .env

# Run the PoC
tsx scripts/cloud-sync/poc-demo.ts
```

**Output**:
- 5 example HTML pages in `./tmp/poc-demo/`
- Comprehensive analysis report
- No deployment - just HTML generation

**Review**:
```bash
# Read the report
cat ./tmp/poc-demo/POC-REPORT.md

# Open a sample page in browser
open ./tmp/poc-demo/best-vapes-2025.html
```

## Step 2: AWS Setup (10 minutes)

### A. Create S3 Bucket

```bash
# Install AWS CLI if needed: https://aws.amazon.com/cli/

# Create bucket (replace region if needed)
aws s3 mb s3://vapourism-blog-aws --region eu-west-2

# Enable website hosting
aws s3 website s3://vapourism-blog-aws \
  --index-document index.html \
  --error-document 404.html
```

### B. Configure Public Access

Create `bucket-policy.json`:
```json
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
```

Apply policy:
```bash
aws s3api put-bucket-policy \
  --bucket vapourism-blog-aws \
  --policy file://bucket-policy.json
```

### C. Create IAM User

```bash
# Create user
aws iam create-user --user-name blog-deployer

# Create and attach policy
aws iam put-user-policy --user-name blog-deployer \
  --policy-name S3BlogAccess \
  --policy-document file://iam-policy.json

# Generate access keys
aws iam create-access-key --user-name blog-deployer
```

`iam-policy.json`:
```json
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
```

### D. Configure .env

Add to `.env`:
```env
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=eu-west-2
AWS_BUCKET_NAME=vapourism-blog-aws
```

### E. Install AWS SDK

```bash
npm install @aws-sdk/client-s3 @aws-sdk/client-cloudfront
```

## Step 3: Test Deployment (2 minutes)

```bash
# Dry run (no actual upload)
tsx scripts/cloud-sync/sync-blog-to-cloud.ts --provider aws --dry-run

# Deploy 5 test posts
tsx scripts/cloud-sync/sync-blog-to-cloud.ts --provider aws --limit 5
```

**View your site**:
- Open: `https://vapourism-blog-aws.s3-website.eu-west-2.amazonaws.com/best-vapes-2025.html`
- Check sitemap: `https://vapourism-blog-aws.s3-website.eu-west-2.amazonaws.com/sitemap.xml`

## Step 4: Deploy All Content (5 minutes)

```bash
# Deploy all blog posts
tsx scripts/cloud-sync/sync-blog-to-cloud.ts --provider aws

# Verify first 5 pages
tsx scripts/cloud-sync/sync-blog-to-cloud.ts --provider aws --verify
```

## GCP Alternative (Optional)

If you prefer Google Cloud Storage:

### Quick GCP Setup

```bash
# Install gcloud CLI: https://cloud.google.com/sdk/docs/install

# Create bucket
gsutil mb -l EU gs://vapourism-blog-gcp

# Make public
gsutil iam ch allUsers:objectViewer gs://vapourism-blog-gcp

# Create service account
gcloud iam service-accounts create blog-deployer

# Grant permissions
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:blog-deployer@YOUR_PROJECT.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

# Create key
gcloud iam service-accounts keys create service-account-key.json \
  --iam-account=blog-deployer@YOUR_PROJECT.iam.gserviceaccount.com
```

### Deploy to GCP

```bash
# Install SDK
npm install @google-cloud/storage

# Configure .env
echo "GCP_PROJECT_ID=your-project" >> .env
echo "GCP_BUCKET_NAME=vapourism-blog-gcp" >> .env
echo "GCP_KEY_FILENAME=./service-account-key.json" >> .env

# Deploy
tsx scripts/cloud-sync/sync-blog-to-cloud.ts --provider gcp
```

## Common Commands

```bash
# Deploy to AWS
tsx scripts/cloud-sync/sync-blog-to-cloud.ts --provider aws

# Deploy to GCP
tsx scripts/cloud-sync/sync-blog-to-cloud.ts --provider gcp

# Deploy to all providers
tsx scripts/cloud-sync/sync-blog-to-cloud.ts --provider all

# Dry run (generate HTML without deploying)
tsx scripts/cloud-sync/sync-blog-to-cloud.ts --provider aws --dry-run

# Deploy limited number of posts
tsx scripts/cloud-sync/sync-blog-to-cloud.ts --provider aws --limit 10

# Save HTML locally for inspection
tsx scripts/cloud-sync/sync-blog-to-cloud.ts --provider aws --save-html --dry-run
```

## Verification Checklist

After deployment, verify:

- [ ] Pages are accessible at cloud URL
- [ ] Canonical URLs point to vapourism.co.uk
- [ ] Backlinks are present (2-3 per page)
- [ ] Sitemap.xml is accessible
- [ ] Robots.txt is accessible
- [ ] Google Search Console shows new backlinks (wait 1-2 weeks)

## Monitoring Setup

### Google Search Console

1. Add cloud domain property:
   - AWS: `vapourism-blog-aws.s3-website.eu-west-2.amazonaws.com`
   - GCP: `storage.googleapis.com/vapourism-blog-gcp`

2. Verify ownership via HTML file upload or DNS

3. Submit sitemap:
   - `https://your-cloud-url/sitemap.xml`

4. Monitor:
   - Links → External links
   - Performance → Referring domains

### Google Analytics

Add referral tracking:
1. Admin → Data Settings → Referral Exclusions
2. Remove cloud domains from exclusions (to track as referrals)
3. Monitor: Acquisition → All Traffic → Referrals

## Automated Deployment (Optional)

For daily syncs, add to crontab:

```bash
# Edit crontab
crontab -e

# Add daily sync at 2 AM
0 2 * * * cd /path/to/vapourismV2 && tsx scripts/cloud-sync/sync-blog-to-cloud.ts --provider all >> /var/log/blog-sync.log 2>&1
```

Or use GitHub Actions (workflow coming soon).

## Troubleshooting

### "AWS SDK not installed"
```bash
npm install @aws-sdk/client-s3 @aws-sdk/client-cloudfront
```

### "GCP SDK not installed"
```bash
npm install @google-cloud/storage
```

### "Missing Shopify configuration"
Add to `.env`:
```env
PUBLIC_STORE_DOMAIN=your-store.myshopify.com
PUBLIC_STOREFRONT_API_TOKEN=your_token
```

### "Access Denied" (AWS)
- Check IAM permissions
- Verify bucket policy allows public read
- Confirm AWS credentials in .env

### "Permission Denied" (GCP)
- Check service account has Storage Admin role
- Verify bucket public access settings
- Confirm key file path in .env

## Cost Estimates

### AWS S3
- **Storage**: $0.023/GB/month
- **Transfer**: $0.09/GB/month
- **Free Tier**: 5GB storage, 15GB transfer (first 12 months)
- **Expected**: $0-5/month

### GCP Cloud Storage
- **Storage**: $0.02/GB/month
- **Transfer**: $0.12/GB/month
- **Always Free**: 5GB storage, 1GB transfer
- **Expected**: $0-3/month

**Total**: ~$5-8/month (well within free tiers for most blogs)

## Expected Results

**Timeline**:
- Week 1: Pages indexed by Google
- Week 2-3: Backlinks appear in Search Console
- Month 1: Domain authority starts increasing
- Month 2-3: Organic traffic improvements visible

**Metrics to Track**:
- Backlinks created: 200+ (for 50 blog posts × 4 platforms)
- Domain authority: +3-5 points (6-month target)
- Referral traffic: ~100 visits/month
- Additional customers: 2-3/month
- Revenue increase: £60-90/month

**ROI**: 10:1 to 15:1

## Support

For issues:
1. Check [main README](./README.md) for detailed troubleshooting
2. Review [strategy document](../../docs/seo/cloudstack-backlink-strategy.md)
3. Open an issue in the repository

---

**Ready to Deploy?** Start with the PoC:
```bash
tsx scripts/cloud-sync/poc-demo.ts
```

Then follow AWS/GCP setup above! 🚀
