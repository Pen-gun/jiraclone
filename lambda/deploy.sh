#!/bin/bash

# AWS Lambda Deployment Script
# This script packages and deploys the image-processor Lambda function

set -e

FUNCTION_NAME="image-processor"
REGION="us-east-1"
RUNTIME="nodejs20.x"
HANDLER="index.handler"
MEMORY_SIZE=512
TIMEOUT=30

echo "🚀 Starting Lambda deployment process..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    echo "Visit: https://aws.amazon.com/cli/"
    exit 1
fi

# Check AWS credentials
echo "🔍 Checking AWS credentials..."
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials not configured. Run 'aws configure' first."
    exit 1
fi

echo "✅ AWS credentials verified"

# Navigate to Lambda directory
cd image-processor

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Create deployment package
echo "📦 Creating deployment package..."
if command -v zip &> /dev/null; then
    zip -r function.zip . -x "*.git*" "*.md" "deploy.sh"
else
    echo "❌ zip command not found. Please install zip."
    exit 1
fi

echo "✅ Deployment package created: function.zip"

# Check if function exists
echo "🔍 Checking if Lambda function exists..."
if aws lambda get-function --function-name $FUNCTION_NAME --region $REGION &> /dev/null; then
    echo "📝 Function exists. Updating code..."
    aws lambda update-function-code \
        --function-name $FUNCTION_NAME \
        --zip-file fileb://function.zip \
        --region $REGION \
        --no-cli-pager

    echo "✅ Function code updated successfully"
else
    echo "❌ Function does not exist. Please create it first via AWS Console."
    echo "Follow the instructions in AWS_SETUP_GUIDE.md"
    exit 1
fi

# Update function configuration
echo "⚙️  Updating function configuration..."
aws lambda update-function-configuration \
    --function-name $FUNCTION_NAME \
    --runtime $RUNTIME \
    --handler $HANDLER \
    --memory-size $MEMORY_SIZE \
    --timeout $TIMEOUT \
    --region $REGION \
    --environment "Variables={AWS_REGION=$REGION}" \
    --no-cli-pager

echo "✅ Function configuration updated"

# Wait for update to complete
echo "⏳ Waiting for function to be ready..."
aws lambda wait function-updated \
    --function-name $FUNCTION_NAME \
    --region $REGION

# Clean up
echo "🧹 Cleaning up..."
rm -f function.zip

echo "✅ Deployment completed successfully!"
echo ""
echo "🔗 View your function:"
echo "   https://console.aws.amazon.com/lambda/home?region=$REGION#/functions/$FUNCTION_NAME"
echo ""
echo "📊 View logs:"
echo "   aws logs tail /aws/lambda/$FUNCTION_NAME --follow --region $REGION"
