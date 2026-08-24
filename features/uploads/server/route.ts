import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { sessionMiddleware } from '@/lib/session-middelware';
import {
  presignedUrlRequestSchema,
  confirmUploadSchema,
  deleteUploadSchema,
} from '../schemas';
import {
  getPresignedUploadUrl,
  generateS3Key,
  deleteFromS3,
} from '@/lib/s3';
import { prisma } from '@/lib/prismaHelper';

const app = new Hono()
  .post(
    '/presigned-url',
    sessionMiddleware,
    zValidator('json', presignedUrlRequestSchema),
    async (c) => {
      const user = c.get('user');
      const { type, filename, contentType } = c.req.valid('json');

      // Validate file type
      if (!contentType.startsWith('image/')) {
        return c.json({ error: 'Only image files are allowed' }, 400);
      }

      // Generate unique S3 key
      const key = generateS3Key(type, user.id, filename);

      // Get presigned URL for upload
      const presignedUrl = await getPresignedUploadUrl(key, contentType);

      return c.json({
        presignedUrl,
        key,
        uploadUrl: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
      });
    }
  )
  .post(
    '/confirm',
    sessionMiddleware,
    zValidator('json', confirmUploadSchema),
    async (c) => {
      const user = c.get('user');
      const { key, type, entityId } = c.req.valid('json');

      // Use our proxy API instead of direct S3 URL
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/images/${key}`;

      if (type === 'profile') {
        // Delete old profile image if exists
        const existingUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { profileImageKey: true },
        });

        if (existingUser?.profileImageKey) {
          try {
            await deleteFromS3(existingUser.profileImageKey);
          } catch (error) {
            console.error('Failed to delete old image:', error);
          }
        }

        // Update user with new image
        await prisma.user.update({
          where: { id: user.id },
          data: {
            profileImageUrl: url,
            profileImageKey: key,
          },
        });
      } else if (type === 'project' && entityId) {
        // Verify user has access to the project
        const project = await prisma.project.findFirst({
          where: {
            id: entityId,
            OR: [
              { ownerId: user.id },
              {
                workspace: {
                  members: {
                    some: {
                      userId: user.id,
                      role: 'ADMIN',
                    },
                  },
                },
              },
            ],
          },
          select: { imageKey: true },
        });

        if (!project) {
          return c.json({ error: 'Project not found or access denied' }, 404);
        }

        // Delete old project image if exists
        if (project.imageKey) {
          try {
            await deleteFromS3(project.imageKey);
          } catch (error) {
            console.error('Failed to delete old image:', error);
          }
        }

        // Update project with new image
        await prisma.project.update({
          where: { id: entityId },
          data: {
            imageUrl: url,
            imageKey: key,
          },
        });
      }

      return c.json({ url, key });
    }
  )
  .delete(
    '/:type/:id',
    sessionMiddleware,
    async (c) => {
      const user = c.get('user');
      const type = c.req.param('type');
      const id = c.req.param('id');

      if (type === 'profile') {
        const existingUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { profileImageKey: true },
        });

        if (existingUser?.profileImageKey) {
          await deleteFromS3(existingUser.profileImageKey);
          await prisma.user.update({
            where: { id: user.id },
            data: {
              profileImageUrl: null,
              profileImageKey: null,
            },
          });
        }
      } else if (type === 'project') {
        // Verify user has access
        const project = await prisma.project.findFirst({
          where: {
            id,
            OR: [
              { ownerId: user.id },
              {
                workspace: {
                  members: {
                    some: {
                      userId: user.id,
                      role: 'ADMIN',
                    },
                  },
                },
              },
            ],
          },
          select: { imageKey: true },
        });

        if (!project) {
          return c.json({ error: 'Project not found or access denied' }, 404);
        }

        if (project.imageKey) {
          await deleteFromS3(project.imageKey);
          await prisma.project.update({
            where: { id },
            data: {
              imageUrl: null,
              imageKey: null,
            },
          });
        }
      }

      return c.json({ message: 'Deleted successfully' });
    }
  );

export default app;
