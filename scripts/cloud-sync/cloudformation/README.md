# CloudFormation Template for SEO Cloudstack Blog Syndication

This CloudFormation template automates the complete AWS infrastructure setup for the blog syndication system in the **eu-west-1** (Ireland) region.

## What This Template Creates

- **S3 Bucket**: Static website hosting bucket with public read access
- **IAM User**: Deployment user with S3 write permissions
- **Access Keys**: Credentials for automated deployment
- **Bucket Policy**: Public read access for blog content
- **Optional CloudFront**: CDN distribution (can be enabled via parameter)

## Quick Deploy

### Prerequisites
- AWS CLI installed and configured
- Appropriate AWS permissions to create S3 buckets, IAM users, and policies

### Deploy Stack

```bash
# From repository root
aws cloudformation create-stack \
  --stack-name vapourism-blog-syndication \
  --template-body file://scripts/cloud-sync/cloudformation/blog-syndication-stack.yaml \
  --capabilities CAPABILITY_NAMED_IAM \
  --region eu-west-1

# Monitor stack creation
aws cloudformation wait stack-create-complete \
  --stack-name vapourism-blog-syndication \
  --region eu-west-1

# Get stack outputs (including access keys)
aws cloudformation describe-stacks \
  --stack-name vapourism-blog-syndication \
  --region eu-west-1 \
  --query 'Stacks[0].Outputs'
```

### Deploy with Custom Parameters

```bash
aws cloudformation create-stack \
  --stack-name vapourism-blog-syndication \
  --template-body file://scripts/cloud-sync/cloudformation/blog-syndication-stack.yaml \
  --capabilities CAPABILITY_NAMED_IAM \
  --region eu-west-1 \
  --parameters \
    ParameterKey=BucketName,ParameterValue=vapourism-blog-aws \
    ParameterKey=DeploymentUserName,ParameterValue=blog-deployer \
    ParameterKey=EnableVersioning,ParameterValue=false \
    ParameterKey=EnableCloudFront,ParameterValue=false
```

## Parameters

- **BucketName** (default: `vapourism-blog-aws`)
  - Name for the S3 bucket (must be globally unique)
  - Must be lowercase, start/end with alphanumeric, can contain hyphens

- **DeploymentUserName** (default: `blog-deployer`)
  - Name for the IAM user that will deploy blog content

- **EnableVersioning** (default: `false`)
  - Enable S3 versioning for rollback capability
  - Options: `true` | `false`

- **EnableCloudFront** (default: `false`)
  - Enable CloudFront CDN distribution
  - Recommended for production, adds ~$1-5/month
  - Options: `true` | `false`

## Outputs

After deployment, the stack outputs:

1. **BucketName**: Name of the created S3 bucket
2. **WebsiteURL**: Public URL for accessing syndicated blog
3. **BucketArn**: ARN of the S3 bucket
4. **DeploymentUserArn**: ARN of the IAM deployment user
5. **AccessKeyId**: AWS Access Key ID ⚠️ Store securely!
6. **SecretAccessKey**: AWS Secret Access Key ⚠️ Store securely! (only shown once)
7. **Region**: AWS region (eu-west-1)
8. **CloudFrontDistributionId**: (if enabled) Distribution ID for cache invalidation
9. **CloudFrontDomainName**: (if enabled) CloudFront domain name
10. **StackInfo**: Quick setup commands for .env file

## Post-Deployment Steps

### 1. Retrieve and Store Credentials

```bash
# Get all outputs
aws cloudformation describe-stacks \
  --stack-name vapourism-blog-syndication \
  --region eu-west-1 \
  --query 'Stacks[0].Outputs' \
  --output table

# Get specific values
AWS_KEY=$(aws cloudformation describe-stacks \
  --stack-name vapourism-blog-syndication \
  --region eu-west-1 \
  --query 'Stacks[0].Outputs[?OutputKey==`AccessKeyId`].OutputValue' \
  --output text)

AWS_SECRET=$(aws cloudformation describe-stacks \
  --stack-name vapourism-blog-syndication \
  --region eu-west-1 \
  --query 'Stacks[0].Outputs[?OutputKey==`SecretAccessKey`].OutputValue' \
  --output text)

WEBSITE_URL=$(aws cloudformation describe-stacks \
  --stack-name vapourism-blog-syndication \
  --region eu-west-1 \
  --query 'Stacks[0].Outputs[?OutputKey==`WebsiteURL`].OutputValue' \
  --output text)

# Add to .env file (from repository root)
cat >> .env << EOF

# AWS CloudFormation Stack Outputs
AWS_ACCESS_KEY_ID=${AWS_KEY}
AWS_SECRET_ACCESS_KEY=${AWS_SECRET}
AWS_REGION=eu-west-1
AWS_BUCKET_NAME=vapourism-blog-aws
EOF

echo "✅ Credentials added to .env"
echo "🌐 Website URL: ${WEBSITE_URL}"
```

### 2. Verify Setup

```bash
# Test AWS credentials
aws s3 ls s3://vapourism-blog-aws --region eu-west-1

# Should return empty (no error) - bucket exists and is accessible
```

### 3. Test Deployment

```bash
# Install AWS SDK if not already installed
npm install @aws-sdk/client-s3 @aws-sdk/client-cloudfront

# Deploy 5 test posts
tsx scripts/cloud-sync/sync-blog-to-cloud.ts --provider aws --limit 5

# Check website (use URL from stack outputs)
echo "Visit: ${WEBSITE_URL}/best-vapes-2025.html"
```

### 4. Full Deployment

```bash
# Deploy all blog posts
tsx scripts/cloud-sync/sync-blog-to-cloud.ts --provider aws

# Verify deployment
aws s3 ls s3://vapourism-blog-aws --region eu-west-1 --recursive | wc -l
# Should show number of files deployed
```

## Stack Management

### View Stack Status

```bash
aws cloudformation describe-stacks \
  --stack-name vapourism-blog-syndication \
  --region eu-west-1 \
  --query 'Stacks[0].StackStatus'
```

### Update Stack

```bash
# Enable CloudFront after initial deployment
aws cloudformation update-stack \
  --stack-name vapourism-blog-syndication \
  --template-body file://scripts/cloud-sync/cloudformation/blog-syndication-stack.yaml \
  --capabilities CAPABILITY_NAMED_IAM \
  --region eu-west-1 \
  --parameters \
    ParameterKey=BucketName,UsePreviousValue=true \
    ParameterKey=DeploymentUserName,UsePreviousValue=true \
    ParameterKey=EnableVersioning,UsePreviousValue=true \
    ParameterKey=EnableCloudFront,ParameterValue=true

# Wait for update
aws cloudformation wait stack-update-complete \
  --stack-name vapourism-blog-syndication \
  --region eu-west-1
```

### Delete Stack

⚠️ **Warning**: This will delete all blog content in S3!

```bash
# Step 1: Empty the bucket (required before deletion)
aws s3 rm s3://vapourism-blog-aws --recursive --region eu-west-1

# Step 2: Delete the stack
aws cloudformation delete-stack \
  --stack-name vapourism-blog-syndication \
  --region eu-west-1

# Step 3: Wait for deletion to complete
aws cloudformation wait stack-delete-complete \
  --stack-name vapourism-blog-syndication \
  --region eu-west-1

echo "✅ Stack deleted"
```

### View Stack Events

```bash
# See all events
aws cloudformation describe-stack-events \
  --stack-name vapourism-blog-syndication \
  --region eu-west-1 \
  --max-items 20

# See only failed events
aws cloudformation describe-stack-events \
  --stack-name vapourism-blog-syndication \
  --region eu-west-1 \
  --query 'StackEvents[?ResourceStatus==`CREATE_FAILED`]'
```

## Security Best Practices

### 1. Secure Credential Storage

```bash
# NEVER commit credentials to git
# Verify .env is in .gitignore
grep -q "^/.env$" .gitignore && echo "✅ .env excluded" || echo "⚠️  Add /.env to .gitignore"

# For GitHub Actions, use repository secrets:
# Settings → Secrets and variables → Actions → New repository secret
```

### 2. Access Key Rotation (Every 90 Days)

```bash
# Create new access key
aws iam create-access-key \
  --user-name blog-deployer \
  --region eu-west-1

# Update .env with new credentials
# Test deployment with new credentials
# Delete old access key
aws iam delete-access-key \
  --user-name blog-deployer \
  --access-key-id <OLD_KEY_ID> \
  --region eu-west-1
```

### 3. Enable CloudTrail Logging

```bash
# Enable CloudTrail for API audit logging
aws cloudtrail create-trail \
  --name vapourism-blog-audit \
  --s3-bucket-name <your-cloudtrail-bucket> \
  --region eu-west-1

aws cloudtrail start-logging \
  --name vapourism-blog-audit \
  --region eu-west-1
```

### 4. Set Up Billing Alerts

```bash
# Create SNS topic for alerts
aws sns create-topic \
  --name billing-alerts \
  --region us-east-1  # Billing metrics are only in us-east-1

# Subscribe to email notifications
aws sns subscribe \
  --topic-arn <topic-arn> \
  --protocol email \
  --notification-endpoint your-email@example.com \
  --region us-east-1

# Create billing alarm (when charges exceed $10)
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
  --alarm-actions <sns-topic-arn> \
  --region us-east-1
```

## Troubleshooting

### Stack Creation Failed

```bash
# View error details
aws cloudformation describe-stack-events \
  --stack-name vapourism-blog-syndication \
  --region eu-west-1 \
  --query 'StackEvents[?ResourceStatus==`CREATE_FAILED`]' \
  --output table

# Common issues:
# 1. Bucket name already exists globally
#    → Choose a different bucket name
# 2. Insufficient permissions
#    → Ensure IAM user can create S3 buckets and IAM resources
# 3. Invalid parameter values
#    → Check parameter constraints in template
```

### Access Denied During Deployment

```bash
# Verify IAM user exists
aws iam get-user --user-name blog-deployer --region eu-west-1

# Check user policies
aws iam list-attached-user-policies --user-name blog-deployer --region eu-west-1
aws iam list-user-policies --user-name blog-deployer --region eu-west-1

# Verify bucket policy
aws s3api get-bucket-policy \
  --bucket vapourism-blog-aws \
  --region eu-west-1 \
  --query Policy \
  --output text | jq
```

### Website Not Accessible (403/404)

```bash
# Check bucket website configuration
aws s3api get-bucket-website \
  --bucket vapourism-blog-aws \
  --region eu-west-1

# Verify public access is not blocked
aws s3api get-public-access-block \
  --bucket vapourism-blog-aws \
  --region eu-west-1

# Test with a sample file
echo "test" > test.html
aws s3 cp test.html s3://vapourism-blog-aws/test.html --region eu-west-1
curl http://vapourism-blog-aws.s3-website.eu-west-1.amazonaws.com/test.html
```

### Retrieve Lost Credentials

⚠️ **Note**: Secret keys cannot be retrieved after initial creation. You must create new keys.

```bash
# List existing access keys
aws iam list-access-keys --user-name blog-deployer --region eu-west-1

# Create new access key
aws iam create-access-key --user-name blog-deployer --region eu-west-1

# Delete old access key
aws iam delete-access-key \
  --user-name blog-deployer \
  --access-key-id <OLD_KEY_ID> \
  --region eu-west-1
```

## Cost Breakdown

### Infrastructure Costs (eu-west-1 Region)

**S3 Storage**:
- First 50 TB: $0.023/GB/month
- Free tier: 5GB storage for 12 months
- Expected: 100 blog posts × ~100KB = ~10MB = **$0.00/month** (within free tier)

**S3 Requests**:
- PUT/POST: $0.005 per 1,000 requests
- GET: $0.0004 per 1,000 requests
- Expected: Daily sync + 1000 page views = **$0.01/month**

**Data Transfer Out**:
- First 1GB: Free
- Next 9.999TB: $0.09/GB
- Free tier: 15GB for 12 months
- Expected: 1000 page views × 100KB = ~100MB = **$0.00/month** (within free tier)

**CloudFront** (if enabled):
- Data transfer: $0.085/GB (first 10TB)
- Requests: $0.0075 per 10,000 HTTPS requests
- Expected: **$1-5/month** (after free tier)

**Total Monthly Cost**:
- Year 1: **$0-2/month** (mostly free tier)
- Year 2+: **$2-5/month** (after free tier expires)
- With CloudFront: **+$1-5/month**

## Integration with GitHub Actions

After deploying the CloudFormation stack, integrate with GitHub Actions:

### 1. Add GitHub Secrets

Go to: Repository → Settings → Secrets and variables → Actions

Add these secrets:
- `AWS_ACCESS_KEY_ID`: From stack output
- `AWS_SECRET_ACCESS_KEY`: From stack output
- `AWS_REGION`: `eu-west-1`
- `AWS_BUCKET_NAME`: `vapourism-blog-aws`
- `AWS_CLOUDFRONT_DISTRIBUTION_ID`: (if CloudFront enabled)

### 2. GitHub Actions Workflow

The workflow is already created at `.github/workflows/blog-sync.yml` (needs to be created). It will automatically use the secrets above.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│         CloudFormation Stack (eu-west-1)                    │
│         vapourism-blog-syndication                          │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  S3 Bucket: vapourism-blog-aws                       │ │
│  │  ├─ Static website hosting enabled                   │ │
│  │  ├─ Public read access policy                        │ │
│  │  ├─ CORS configuration                               │ │
│  │  └─ Website endpoint:                                │ │
│  │     http://vapourism-blog-aws.s3-website.           │ │
│  │           eu-west-1.amazonaws.com                    │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  IAM User: blog-deployer                             │ │
│  │  ├─ S3 PutObject permission                          │ │
│  │  ├─ S3 DeleteObject permission                       │ │
│  │  ├─ S3 ListBucket permission                         │ │
│  │  └─ CloudFront invalidation permission               │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  Access Keys (Outputs)                               │ │
│  │  ├─ AccessKeyId                                      │ │
│  │  └─ SecretAccessKey (shown once)                     │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  Optional: CloudFront Distribution                   │ │
│  │  ├─ HTTPS endpoint                                   │ │
│  │  ├─ Global CDN                                       │ │
│  │  ├─ Cache optimization                               │ │
│  │  └─ Custom domain support (manual setup)             │ │
│  └──────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                 Blog Syndication Script
                 (tsx scripts/cloud-sync/sync-blog-to-cloud.ts)
```

## Complete Setup Example

```bash
#!/bin/bash
# Complete setup script for blog syndication

set -e  # Exit on error

STACK_NAME="vapourism-blog-syndication"
REGION="eu-west-1"
TEMPLATE_FILE="scripts/cloud-sync/cloudformation/blog-syndication-stack.yaml"

echo "🚀 Deploying CloudFormation stack..."
aws cloudformation create-stack \
  --stack-name $STACK_NAME \
  --template-body file://$TEMPLATE_FILE \
  --capabilities CAPABILITY_NAMED_IAM \
  --region $REGION

echo "⏳ Waiting for stack creation to complete..."
aws cloudformation wait stack-create-complete \
  --stack-name $STACK_NAME \
  --region $REGION

echo "✅ Stack created successfully!"

echo "📋 Retrieving outputs..."
AWS_KEY=$(aws cloudformation describe-stacks \
  --stack-name $STACK_NAME \
  --region $REGION \
  --query 'Stacks[0].Outputs[?OutputKey==`AccessKeyId`].OutputValue' \
  --output text)

AWS_SECRET=$(aws cloudformation describe-stacks \
  --stack-name $STACK_NAME \
  --region $REGION \
  --query 'Stacks[0].Outputs[?OutputKey==`SecretAccessKey`].OutputValue' \
  --output text)

WEBSITE_URL=$(aws cloudformation describe-stacks \
  --stack-name $STACK_NAME \
  --region $REGION \
  --query 'Stacks[0].Outputs[?OutputKey==`WebsiteURL`].OutputValue' \
  --output text)

echo "💾 Adding credentials to .env..."
cat >> .env << EOF

# AWS CloudFormation Stack Outputs (Generated on $(date))
AWS_ACCESS_KEY_ID=$AWS_KEY
AWS_SECRET_ACCESS_KEY=$AWS_SECRET
AWS_REGION=$REGION
AWS_BUCKET_NAME=vapourism-blog-aws
EOF

echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Test deployment: tsx scripts/cloud-sync/sync-blog-to-cloud.ts --provider aws --limit 5"
echo "2. View website: $WEBSITE_URL"
echo "3. Full deployment: tsx scripts/cloud-sync/sync-blog-to-cloud.ts --provider aws"
echo ""
echo "🔐 Security reminder:"
echo "   - Never commit .env to git"
echo "   - Rotate access keys every 90 days"
echo "   - Monitor AWS billing for unexpected charges"
```

## Support

**CloudFormation Issues**:
- AWS CloudFormation Console: https://console.aws.amazon.com/cloudformation
- AWS Support: https://aws.amazon.com/support

**Blog Syndication Issues**:
- Documentation: `scripts/cloud-sync/README.md`
- Production checklist: `docs/seo/PRODUCTION_READINESS_CHECKLIST.md`

---

**Template Version**: 1.0  
**Region**: eu-west-1 (Ireland)  
**Last Updated**: January 2026  
**Maintained By**: Vapourism SEO Team
