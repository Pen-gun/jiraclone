import { NextRequest, NextResponse } from 'next/server';
import { getPresignedDownloadUrl } from '@/lib/s3';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  try {
    const { key: keyArray } = await params;
    const key = keyArray.join('/');

    // Generate presigned URL that works for 1 hour
    const signedUrl = await getPresignedDownloadUrl(key, 3600);

    // Redirect to the presigned URL
    return NextResponse.redirect(signedUrl);
  } catch (error) {
    console.error('Failed to generate presigned URL:', error);
    return new NextResponse('Image not found', { status: 404 });
  }
}
