import { z } from 'zod';

export const uploadTypeSchema = z.enum(['profile', 'project']);

export const presignedUrlRequestSchema = z.object({
  type: uploadTypeSchema,
  filename: z.string(),
  contentType: z.string(),
  entityId: z.string().optional(),
});

export const confirmUploadSchema = z.object({
  key: z.string(),
  type: uploadTypeSchema,
  entityId: z.string().optional(),
});

export const deleteUploadSchema = z.object({
  type: uploadTypeSchema,
  entityId: z.string(),
});

export type PresignedUrlRequest = z.infer<typeof presignedUrlRequestSchema>;
export type ConfirmUpload = z.infer<typeof confirmUploadSchema>;
export type DeleteUpload = z.infer<typeof deleteUploadSchema>;
