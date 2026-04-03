import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rcp";

type ResponseType = InferResponseType<typeof client.api.projects['$post'], 200>;
type RequestType = InferRequestType<typeof client.api.projects['$post']>;

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async ({ form }) => {
      const response = await client.api.projects['$post']({ form });
      if (!response.ok) {
        const errorBody = (await response.json().catch(() => null)) as { error?: string; message?: string } | null;
        throw new Error(errorBody?.error ?? errorBody?.message ?? "Failed to create project");
      }

      return (await response.json()) as ResponseType;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    }
  });
};