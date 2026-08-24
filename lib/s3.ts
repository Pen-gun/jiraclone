import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;
const REGION = process.env.AWS_REGION!;

export const uploadToS3 = async (
  file: Buffer,
  key: string,
  contentType: string
) => {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
  });

  await s3Client.send(command);

  return {
    url: `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${key}`,
    key,
  };
};

export const deleteFromS3 = async (key: string) => {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
};

export const getPresignedUploadUrl = async (
  key: string,
  contentType: string,
  expiresIn = 900 // 15 minutes
) => {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
};

export const getPresignedDownloadUrl = async (
  key: string,
  expiresIn = 3600 // 1 hour
) => {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
};

export const generateS3Key = (
  type: 'profile' | 'project',
  userId: string,
  filename: string
): string => {
  const timestamp = Date.now();
  const extension = filename.split('.').pop();
  return `${type}/${userId}/${timestamp}.${extension}`;
};
