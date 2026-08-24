# AWS Lambda Deployment Script (PowerShell)
# This script packages and deploys the image-processor Lambda function

$ErrorActionPreference = "Stop"

$FUNCTION_NAME = "image-processor"
$REGION = "us-east-1"
$RUNTIME = "nodejs20.x"
$HANDLER = "index.handler"
$MEMORY_SIZE = 512
$TIMEOUT = 30

Write-Host "🚀 Starting Lambda deployment process..." -ForegroundColor Cyan

# Check if AWS CLI is installed
try {
    aws --version | Out-Null
    Write-Host "✅ AWS CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ AWS CLI is not installed. Please install it first." -ForegroundColor Red
    Write-Host "Visit: https://aws.amazon.com/cli/" -ForegroundColor Yellow
    exit 1
}

# Check AWS credentials
Write-Host "🔍 Checking AWS credentials..." -ForegroundColor Cyan
try {
    aws sts get-caller-identity --no-cli-pager | Out-Null
    Write-Host "✅ AWS credentials verified" -ForegroundColor Green
} catch {
    Write-Host "❌ AWS credentials not configured. Run 'aws configure' first." -ForegroundColor Red
    exit 1
}

# Navigate to Lambda directory
Set-Location -Path "image-processor"

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
npm install --production

# Create deployment package
Write-Host "📦 Creating deployment package..." -ForegroundColor Cyan
$excludeFiles = @("*.git*", "*.md", "deploy.ps1", "deploy.sh")
Compress-Archive -Path .\* -DestinationPath function.zip -Force -CompressionLevel Optimal

Write-Host "✅ Deployment package created: function.zip" -ForegroundColor Green

# Check if function exists
Write-Host "🔍 Checking if Lambda function exists..." -ForegroundColor Cyan
try {
    aws lambda get-function --function-name $FUNCTION_NAME --region $REGION --no-cli-pager | Out-Null
    Write-Host "📝 Function exists. Updating code..." -ForegroundColor Yellow

    aws lambda update-function-code `
        --function-name $FUNCTION_NAME `
        --zip-file fileb://function.zip `
        --region $REGION `
        --no-cli-pager

    Write-Host "✅ Function code updated successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Function does not exist. Please create it first via AWS Console." -ForegroundColor Red
    Write-Host "Follow the instructions in AWS_SETUP_GUIDE.md" -ForegroundColor Yellow
    Set-Location ..
    exit 1
}

# Update function configuration
Write-Host "⚙️  Updating function configuration..." -ForegroundColor Cyan
aws lambda update-function-configuration `
    --function-name $FUNCTION_NAME `
    --runtime $RUNTIME `
    --handler $HANDLER `
    --memory-size $MEMORY_SIZE `
    --timeout $TIMEOUT `
    --region $REGION `
    --environment "Variables={AWS_REGION=$REGION}" `
    --no-cli-pager

Write-Host "✅ Function configuration updated" -ForegroundColor Green

# Wait for update to complete
Write-Host "⏳ Waiting for function to be ready..." -ForegroundColor Cyan
aws lambda wait function-updated `
    --function-name $FUNCTION_NAME `
    --region $REGION

# Clean up
Write-Host "🧹 Cleaning up..." -ForegroundColor Cyan
Remove-Item -Path function.zip -Force

Set-Location ..

Write-Host ""
Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🔗 View your function:" -ForegroundColor Cyan
Write-Host "   https://console.aws.amazon.com/lambda/home?region=$REGION#/functions/$FUNCTION_NAME" -ForegroundColor White
Write-Host ""
Write-Host "📊 View logs:" -ForegroundColor Cyan
Write-Host "   aws logs tail /aws/lambda/$FUNCTION_NAME --follow --region $REGION" -ForegroundColor White
