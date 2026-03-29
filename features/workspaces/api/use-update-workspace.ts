import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rcp";

type ResponseType = InferResponseType<typeof client.api.workspaces[":workspaceId"]['$patch'], 200>;
type RequestType = InferRequestType<typeof client.api.workspaces[":workspaceId"]['$patch']>;

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();
  return useMutation<
  ResponseType, 
  Error, 
  RequestType>
  ({
    mutationFn: async ({ form, param }) => {
      const response = await client.api.workspaces[":workspaceId"]['$patch']({ form, param });
      if (!response.ok) {
        const errorBody = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(errorBody?.message ?? "Failed to update workspace");
      }

      return (await response.json()) as ResponseType;
    },
    onSuccess: ({data}) => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.id] });
    },
    onError: (error) => {
      console.error("Failed to update workspace:", error);
    }

  });
};