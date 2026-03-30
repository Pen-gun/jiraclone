import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rcp";

type ResponseType = InferResponseType<typeof client.api.workspaces[":workspaceId"]['$delete'], 200>;
type RequestType = InferRequestType<typeof client.api.workspaces[":workspaceId"]['$delete']>;

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();
  return useMutation<
  ResponseType, 
  Error, 
  RequestType>
  ({
    mutationFn: async ({ param }) => {
      const response = await client.api.workspaces[":workspaceId"]['$delete']({ param });
      if (!response.ok) {
        const errorBody = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(errorBody?.message ?? "Failed to delete workspace");
      }

      return (await response.json()) as ResponseType;
    },
    onSuccess: ({data}) => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.id] });
    },
    onError: (error) => {
      console.error("Failed to delete workspace:", error);
    }

  });
};