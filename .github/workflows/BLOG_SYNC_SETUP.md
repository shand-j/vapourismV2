# GitHub Actions Blog Syndication Workflow

This document explains the automated blog syndication workflow and how to configure the required secrets.

## Overview

The `blog-sync.yml` workflow automatically syndicates Shopify blog content to AWS S3 and GCP Cloud Storage on a daily schedule. It can also be triggered manually with custom options.

## Workflow Features

- **Scheduled Execution**: Runs daily at 2 AM UTC
- **Manual Trigger**: Run on-demand via GitHub Actions UI
- **Multi-Provider**: Deploy to AWS, GCP, or both
- **Configurable**: Limit posts, dry-run mode
- **Error Handling**: Detailed logging and failure notifications
- **Artifact Upload**: Saves logs on failure for debugging

## Required Secrets

To use this workflow, you must configure the following secrets in your GitHub repository:

### Navigate to Repository Settings

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** for each secret below

### Shopify Secrets (Required)

These authenticate with your Shopify store:

| Secret Name | Description | Example | How to Get |
|-------------|-------------|---------|------------|
| `PUBLIC_STORE_DOMAIN` | Your Shopify store domain | `your-store.myshopify.com` | Shopify Admin → Settings → Domains |
| `PUBLIC_STOREFRONT_API_TOKEN` | Storefront API access token | `shpat_xxxxx...` | Shopify Admin → Apps → Create custom app → Storefront API |

**Getting Storefront API Token**:
1. Shopify Admin → **Apps** → **Develop apps**
2. Click **Create an app** (e.g., "Blog Syndication")
3. Go to **Configuration** → **Storefront API**
4. Enable **Read access** for:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_content` (for blog access)
5. Click **Install app**
6. Copy the **Storefront access token**

### AWS Secrets (Required for AWS deployment)

These authenticate with AWS S3:

| Secret Name | Description | Example | How to Get |
|-------------|-------------|---------|------------|
| `AWS_ACCESS_KEY_ID` | AWS access key ID | `AKIA...` | From CloudFormation stack outputs OR IAM console |
| `AWS_SECRET_ACCESS_KEY` | AWS secret access key | `wJalr...` | From CloudFormation stack outputs OR IAM console |
| `AWS_REGION` | AWS region | `eu-west-1` | The region where your S3 bucket is located |
| `AWS_BUCKET_NAME` | S3 bucket name | `vapourism-blog-aws` | From CloudFormation stack outputs |
| `AWS_CLOUDFRONT_DISTRIBUTION_ID` | CloudFront distribution ID (optional) | `E1234567890ABC` | From CloudFormation stack outputs (if CloudFront enabled) |

**Getting AWS Credentials**:

**Option 1: From CloudFormation Stack** (Recommended)
```bash
# Get Access Key ID
aws cloudformation describe-stacks \
  --stack-name vapourism-blog-syndication \
  --region eu-west-1 \
  --query 'Stacks[0].Outputs[?OutputKey==`AccessKeyId`].OutputValue' \
  --output text

# Get Secret Access Key (shown only once during stack creation)
aws cloudformation describe-stacks \
  --stack-name vapourism-blog-syndication \
  --region eu-west-1 \
  --query 'Stacks[0].Outputs[?OutputKey==`SecretAccessKey`].OutputValue' \
  --output text
```

**Option 2: Create New Access Key**
```bash
# Create new access key for existing IAM user
aws iam create-access-key --user-name blog-deployer

# Output shows AccessKeyId and SecretAccessKey
```

### GCP Secrets (Required for GCP deployment)

These authenticate with Google Cloud Storage:

| Secret Name | Description | Example | How to Get |
|-------------|-------------|---------|------------|
| `GCP_PROJECT_ID` | GCP project ID | `vapourism-blog` | GCP Console → Project selector |
| `GCP_BUCKET_NAME` | Cloud Storage bucket name | `vapourism-blog-gcp` | GCS Console → Buckets |
| `GCP_SERVICE_ACCOUNT_KEY` | Service account JSON key (entire file) | `{"type":"service_account",...}` | See below |

**Getting GCP Service Account Key**:

```bash
# 1. Create service account (if not exists)
gcloud iam service-accounts create blog-deployer \
  --description="Blog content deployer" \
  --display-name="Blog Deployer"

# 2. Grant Storage Admin role
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:blog-deployer@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

# 3. Create and download key
gcloud iam service-accounts keys create service-account-key.json \
  --iam-account=blog-deployer@YOUR_PROJECT_ID.iam.gserviceaccount.com

# 4. Copy the ENTIRE contents of service-account-key.json
cat service-account-key.json

# 5. Paste into GitHub secret GCP_SERVICE_ACCOUNT_KEY
# 6. Delete local copy for security
rm service-account-key.json
```

## Setting Up Secrets - Complete Example

### Step 1: Shopify Secrets

```bash
# In GitHub UI: Settings → Secrets → Actions → New repository secret

Name: PUBLIC_STORE_DOMAIN
Value: vapourism.myshopify.com

Name: PUBLIC_STOREFRONT_API_TOKEN
Value: shpat_EXAMPLE1234567890abcdefXXXXXXXX
# Replace with your actual Storefront API token from Shopify Admin
```

### Step 2: AWS Secrets

```bash
# In GitHub UI: Settings → Secrets → Actions → New repository secret

Name: AWS_ACCESS_KEY_ID
Value: AKIAIOSFODNN7EXAMPLE

Name: AWS_SECRET_ACCESS_KEY
Value: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

Name: AWS_REGION
Value: eu-west-1

Name: AWS_BUCKET_NAME
Value: vapourism-blog-aws

Name: AWS_CLOUDFRONT_DISTRIBUTION_ID  (optional)
Value: E1234567890ABC
```

### Step 3: GCP Secrets

```bash
# In GitHub UI: Settings → Secrets → Actions → New repository secret

Name: GCP_PROJECT_ID
Value: vapourism-blog

Name: GCP_BUCKET_NAME
Value: vapourism-blog-gcp

Name: GCP_SERVICE_ACCOUNT_KEY
Value: {
  "type": "service_account",
  "project_id": "vapourism-blog",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "blog-deployer@vapourism-blog.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/blog-deployer%40vapourism-blog.iam.gserviceaccount.com"
}
# ⚠️ IMPORTANT: Paste the ENTIRE JSON contents as a single line or with newlines preserved
```

## Usage

### Automatic (Scheduled) Execution

The workflow runs automatically every day at 2 AM UTC. It will:
- Deploy to both AWS and GCP
- Sync all blog posts
- No manual intervention needed

### Manual Execution

#### Via GitHub UI

1. Go to **Actions** tab
2. Click **Blog Syndication to Cloud Providers**
3. Click **Run workflow** button
4. Configure options:
   - **Provider**: Choose `all`, `aws`, or `gcp`
   - **Limit**: Number of posts (0 = all)
   - **Dry Run**: Test without deploying
5. Click **Run workflow**

#### Via GitHub CLI

```bash
# Deploy all posts to all providers
gh workflow run blog-sync.yml

# Deploy 10 posts to AWS only
gh workflow run blog-sync.yml \
  -f provider=aws \
  -f limit=10

# Dry run to test (no actual deployment)
gh workflow run blog-sync.yml \
  -f provider=all \
  -f dry_run=true

# Deploy to GCP only
gh workflow run blog-sync.yml \
  -f provider=gcp
```

## Monitoring

### View Workflow Runs

1. Go to **Actions** tab
2. Click on **Blog Syndication to Cloud Providers**
3. View recent runs and their status

### Check Logs

1. Click on a specific workflow run
2. Click on the **sync-blog** job
3. Expand steps to view detailed logs

### Download Failure Artifacts

If a deployment fails:
1. Go to the failed workflow run
2. Scroll to **Artifacts** section
3. Download **deployment-logs**
4. Extract and review logs for troubleshooting

## Troubleshooting

### Workflow Fails with "Invalid Credentials"

**AWS**:
```bash
# Test AWS credentials locally
aws s3 ls s3://vapourism-blog-aws --region eu-west-1

# If fails, regenerate access keys
aws iam create-access-key --user-name blog-deployer

# Update GitHub secrets with new keys
```

**GCP**:
```bash
# Test GCP credentials locally
gcloud auth activate-service-account --key-file=service-account-key.json
gsutil ls gs://vapourism-blog-gcp

# If fails, create new service account key
gcloud iam service-accounts keys create new-key.json \
  --iam-account=blog-deployer@YOUR_PROJECT_ID.iam.gserviceaccount.com

# Update GitHub secret with new key contents
```

**Shopify**:
```bash
# Test Storefront API token
curl -X POST \
  https://YOUR_STORE.myshopify.com/api/2024-10/graphql.json \
  -H "X-Shopify-Storefront-Access-Token: YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query":"{ shop { name } }"}'

# Should return: {"data":{"shop":{"name":"Your Store Name"}}}
```

### Workflow Fails with "Permission Denied"

**AWS S3**:
- Verify IAM user has `s3:PutObject`, `s3:DeleteObject`, `s3:ListBucket` permissions
- Check bucket policy allows public read: `s3:GetObject` for `Principal: "*"`

**GCP Cloud Storage**:
- Verify service account has `roles/storage.admin` or `roles/storage.objectAdmin`
- Check bucket has public access enabled: `allUsers:objectViewer`

### Workflow Doesn't Trigger on Schedule

- Check that the workflow file is on the **default branch** (usually `main`)
- GitHub Actions schedules can have up to 30-minute delays
- Manually trigger the workflow to test

### No Blog Posts Found

- Verify `PUBLIC_STORE_DOMAIN` is correct (should be `store.myshopify.com`)
- Check Storefront API token has `unauthenticated_read_content` scope
- Ensure blog posts are published in Shopify admin

## Security Best Practices

### Rotate Credentials Regularly

**AWS** (Every 90 days):
```bash
# Create new key
aws iam create-access-key --user-name blog-deployer

# Update GitHub secrets
# Test deployment
# Delete old key
aws iam delete-access-key --user-name blog-deployer --access-key-id OLD_KEY_ID
```

**GCP** (Every 90 days):
```bash
# Create new key
gcloud iam service-accounts keys create new-key.json \
  --iam-account=blog-deployer@PROJECT_ID.iam.gserviceaccount.com

# Update GitHub secrets
# Test deployment
# Delete old key
gcloud iam service-accounts keys delete OLD_KEY_ID \
  --iam-account=blog-deployer@PROJECT_ID.iam.gserviceaccount.com
```

### Monitor Secret Usage

- Review workflow runs regularly
- Set up notifications for failed runs
- Monitor AWS/GCP billing for unexpected charges

### Use Least Privilege

- AWS IAM user should only have S3 permissions for the specific bucket
- GCP service account should only have Storage Admin for the specific bucket
- Shopify token should only have Storefront API read access

## Cost Monitoring

### Set Up Billing Alerts

**AWS**:
```bash
# Create billing alarm (if charges exceed $10)
aws cloudwatch put-metric-alarm \
  --alarm-name blog-syndication-billing \
  --alarm-description "Alert when AWS charges exceed $10" \
  --metric-name EstimatedCharges \
  --namespace AWS/Billing \
  --statistic Maximum \
  --period 21600 \
  --evaluation-periods 1 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold \
  --region us-east-1
```

**GCP**:
1. Go to **Billing** → **Budgets & alerts**
2. Click **Create budget**
3. Set amount: $10
4. Add email alerts at 50%, 90%, 100%

### Expected Costs

With daily syncs:
- **AWS S3**: $0-5/month (within free tier)
- **GCP Storage**: $0-3/month (within free tier)
- **Total**: $0-8/month

If costs exceed expectations:
- Reduce sync frequency (weekly instead of daily)
- Enable versioning = false in CloudFormation
- Check for unexpected data transfer

## Advanced Configuration

### Change Sync Schedule

Edit `.github/workflows/blog-sync.yml`:

```yaml
# Run every 6 hours
schedule:
  - cron: '0 */6 * * *'

# Run weekly on Sundays at 3 AM
schedule:
  - cron: '0 3 * * 0'

# Run on 1st and 15th of month at 2 AM
schedule:
  - cron: '0 2 1,15 * *'
```

### Add Slack Notifications

Add this step at the end:

```yaml
- name: Notify Slack
  if: always()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
    payload: |
      {
        "text": "Blog Syndication ${{ job.status }}",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "Blog syndication completed with status: *${{ job.status }}*"
            }
          }
        ]
      }
```

Add secret:
- `SLACK_WEBHOOK_URL`: Incoming webhook URL from Slack

### Add Email Notifications

GitHub sends email notifications by default for failed workflows. To customize:

1. Go to **Settings** → **Notifications**
2. Under **Actions**, choose notification preferences
3. Can receive emails for:
   - All workflow runs
   - Only failed runs
   - No notifications

## Summary Checklist

Before first run, ensure:

- [ ] All Shopify secrets configured
- [ ] AWS secrets configured (if using AWS)
- [ ] GCP secrets configured (if using GCP)
- [ ] Workflow file is on default branch
- [ ] Test manual trigger with dry-run
- [ ] Verify first deployment successful
- [ ] Set up billing alerts
- [ ] Schedule credential rotation (90 days)

## Support

**Workflow Issues**:
- Check workflow logs in Actions tab
- Review this documentation
- Test credentials locally before updating secrets

**Deployment Issues**:
- See main documentation: `scripts/cloud-sync/README.md`
- Check production checklist: `docs/seo/PRODUCTION_READINESS_CHECKLIST.md`

---

**Workflow Version**: 1.0  
**Last Updated**: January 2026  
**Maintained By**: Vapourism SEO Team
