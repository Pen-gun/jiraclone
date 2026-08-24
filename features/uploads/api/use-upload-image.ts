import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rcp';
import { toast } from 'sonner';

type UploadImageParams = {
  file: File;
  type: 'profile' | 'project';
  entityId?: string;
};

export const useUploadImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, type, entityId }: UploadImageParams) => {
      // Step 1: Get presigned URL
      const presignedResponse = await client.api.uploads['presigned-url'].$post({
        json: {
          type,
          filename: file.name,
          contentType: file.type,
          entityId,
        },
      });

      if (!presignedResponse.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { presignedUrl, key, uploadUrl } = await presignedResponse.json();

      // Step 2: Upload to S3
      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }

      // Step 3: Confirm upload
      const confirmResponse = await client.api.uploads.confirm.$post({
        json: {
          key,
          type,
          entityId,
        },
      });

      if (!confirmResponse.ok) {
        throw new Error('Failed to confirm upload');
      }

      return await confirmResponse.json();
    },
    onSuccess: (data) => {
      toast.success('Image uploaded successfully');
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error) => {
      toast.error('Failed to upload image');
      console.error('Upload error:', error);
    },
  });
};
