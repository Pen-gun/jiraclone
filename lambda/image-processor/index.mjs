import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';

const s3Client = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });

export const handler = async (event) => {
  console.log('Lambda function triggered', JSON.stringify(event, null, 2));

  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

  // Skip if already a thumbnail or processed image
  if (key.includes('thumbnails/') || key.includes('optimized/')) {
    console.log('Skipping already processed image:', key);
    return { statusCode: 200, body: 'Already processed' };
  }

  try {
    console.log(`Processing image: ${key} from bucket: ${bucket}`);

    // Get original image from S3
    const getCommand = new GetObjectCommand({ Bucket: bucket, Key: key });
    const { Body, ContentType } = await s3Client.send(getCommand);

    const imageBuffer = Buffer.from(await Body.transformToByteArray());
    console.log('Image downloaded, size:', imageBuffer.length);

    // Create thumbnail (200x200)
    const thumbnail = await sharp(imageBuffer)
      .resize(200, 200, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 80 })
      .toBuffer();

    console.log('Thumbnail created, size:', thumbnail.length);

    // Create optimized version (max 1024px width/height)
    const optimized = await sharp(imageBuffer)
      .resize(1024, 1024, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 85 })
      .toBuffer();

    console.log('Optimized version created, size:', optimized.length);

    // Upload thumbnail
    const thumbnailKey = `thumbnails/${key}`;
    const thumbnailCommand = new PutObjectCommand({
      Bucket: bucket,
      Key: thumbnailKey,
      Body: thumbnail,
      ContentType: 'image/jpeg',
      Metadata: {
        'original-key': key,
        'processed-by': 'lambda-image-processor'
      }
    });

    await s3Client.send(thumbnailCommand);
    console.log('Thumbnail uploaded:', thumbnailKey);

    // Upload optimized version
    const optimizedKey = `optimized/${key}`;
    const optimizedCommand = new PutObjectCommand({
      Bucket: bucket,
      Key: optimizedKey,
      Body: optimized,
      ContentType: 'image/jpeg',
      Metadata: {
        'original-key': key,
        'processed-by': 'lambda-image-processor'
      }
    });

    await s3Client.send(optimizedCommand);
    console.log('Optimized version uploaded:', optimizedKey);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Image processed successfully',
        original: key,
        thumbnail: thumbnailKey,
        optimized: optimizedKey
      }),
    };
  } catch (error) {
    console.error('Error processing image:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to process image',
        error: error.message
      }),
    };
  }
};
