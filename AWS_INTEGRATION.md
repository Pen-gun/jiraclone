# AWS S3 + Lambda Integration Guide

Complete guide for implementing image uploads with AWS S3 and Lambda in this project.

## 🚀 Quick Setup (5 Minutes)

### Step 1: AWS Configuration

1. **Create AWS Account**: https://aws.amazon.com/
2. **Create S3 Bucket**:
   ```bash
   aws s3 mb s3://jiraclone-uploads --region us-east-1
   ```
   Or via AWS Console: https://console.aws.amazon.com/s3/

3. **Configure S3 CORS**: In S3 bucket → Permissions → CORS:
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
       "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
       "ExposeHeaders": ["ETag"]
     }
   ]
   ```

4. **Create IAM User**:
   - Go to IAM Console
   - Create user: `jiraclone-app`
   - Attach policy: `AmazonS3FullAccess`
   - Generate access keys

5. **Update `.env`**:
   ```env
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_access_key_here
   AWS_SECRET_ACCESS_KEY=your_secret_key_here
   AWS_S3_BUCKET_NAME=jiraclone-uploads
   ```

### Step 2: Database Migration

```bash
# Start database
npm run dev

# Run migration (in another terminal)
npx prisma migrate dev --name add_image_fields
```

### Step 3: Test It

```bash
npm run dev
# Upload a profile picture in user settings
```

✅ **Done!** Lambda setup below is optional.

---

## ⚡ Lambda Setup (Optional - 10 Minutes)

Lambda automatically creates thumbnails and optimized versions.

### Deploy Lambda Function

**Option 1: AWS Console**
1. Go to Lambda Console: https://console.aws.amazon.com/lambda/
2. Create function: `image-processor`
3. Runtime: Node.js 20.x
4. Upload code:
   ```bash
   cd lambda/image-processor
   npm install
   zip -r function.zip .
   ```
5. Upload `function.zip`
6. Set Memory: 512 MB, Timeout: 30 seconds

**Option 2: CLI Script**
```bash
cd lambda
./deploy.sh      # macOS/Linux
.\deploy.ps1     # Windows
```

### Add S3 Trigger
1. In Lambda → Add trigger → S3
2. Bucket: `jiraclone-uploads`
3. Event: All object create events
4. Prefix: `profile/` (repeat for `project/`)

---

## 💻 Usage

### Profile Picture Upload

```tsx
import { ImageUpload } from '@/features/uploads';

<ImageUpload
  type="profile"
  currentImageUrl={user?.profileImageUrl}
  entityId={user?.id}
  shape="circle"
  size="lg"
/>
```

### Project Image Upload

```tsx
import { ImageUpload } from '@/features/uploads';

<ImageUpload
  type="project"
  currentImageUrl={project?.imageUrl}
  entityId={project?.id}
  shape="square"
  size="md"
/>
```

---

## 🧪 Testing

```bash
# Upload images via UI, then verify:

# Check S3
aws s3 ls s3://jiraclone-uploads/profile/ --recursive

# Check Lambda logs (if deployed)
aws logs tail /aws/lambda/image-processor --follow --region us-east-1
```

**Test Checklist:**
- [ ] Profile picture upload works
- [ ] Project image upload works
- [ ] Old images are deleted when replaced
- [ ] Images persist after refresh
- [ ] Files appear in S3 bucket
- [ ] Lambda creates thumbnails (if deployed)

---

## 🐛 Troubleshooting

### "Access Denied" Error
- Check AWS credentials in `.env`
- Verify IAM user has S3 permissions

### CORS Error in Browser
- Update S3 CORS policy with your domain
- Clear browser cache

### Upload Fails
- Check file size (< 5MB)
- Verify file is an image
- Check browser console for errors

### Lambda Not Working
- Verify S3 trigger is configured
- Check execution role has S3 permissions
- Review CloudWatch logs

### Database Migration Fails
```bash
# Ensure database is running
docker-compose up -d  # or npm run dev

# Then retry migration
npx prisma migrate dev
```

---

## 📁 What Was Implemented

### Backend
- `lib/s3.ts` - S3 utility functions
- `features/uploads/server/route.ts` - API routes
- Updated Prisma schema with image fields

### Frontend
- `features/uploads/components/image-upload.tsx` - Main component
- `features/uploads/api/use-upload-image.ts` - Upload hook
- `features/uploads/api/use-delete-image.ts` - Delete hook

### Lambda
- `lambda/image-processor/index.mjs` - Image processing function
- Deployment scripts for easy updates

### API Endpoints
- `POST /api/uploads/presigned-url` - Get upload URL
- `POST /api/uploads/confirm` - Confirm upload
- `DELETE /api/uploads/:type/:id` - Delete image

---

## 🔒 Security

- ✅ Authentication required for all uploads
- ✅ Users can only modify their own data
- ✅ Presigned URLs expire after 15 minutes
- ✅ File type validation (images only)
- ✅ File size limit (5MB max)
- ✅ S3 bucket is private

---

## 💰 Cost

**Free Tier (12 months)**: Covers moderate usage  
**After Free Tier**: Less than $1/month for typical usage

---

## 📚 Additional Resources

- Feature API docs: `features/uploads/README.md`
- AWS S3 Docs: https://docs.aws.amazon.com/s3/
- AWS Lambda Docs: https://docs.aws.amazon.com/lambda/
