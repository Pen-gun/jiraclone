import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rcp';
import { toast } from 'sonner';

type DeleteImageParams = {
  type: 'profile' | 'project';
  entityId: string;
};

export const useDeleteImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ type, entityId }: DeleteImageParams) => {
      const response = await client.api.uploads[':type'][':id'].$delete({
        param: { type, id: entityId },
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success('Image deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error) => {
      toast.error('Failed to delete image');
      console.error('Delete error:', error);
    },
  });
};
