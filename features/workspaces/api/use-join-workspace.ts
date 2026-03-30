import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rcp";

type ResponseType = InferResponseType<typeof client.api.workspaces[":workspaceId"]['join']['$post'], 200>;
type RequestType = InferRequestType<typeof client.api.workspaces[":workspaceId"]['join']['$post']>;

export const useJoinWorkspace = () => {
  const queryClient = useQueryClient();
  return useMutation<
  ResponseType, 
  Error, 
  RequestType>
  ({
    mutationFn: async ({json, param}) => {
      const response = await client.api.workspaces[":workspaceId"]['join']['$post']({ json, param });
      if (!response.ok) {
        const errorBody = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(errorBody?.message ?? "Failed to join workspace");
      }

      return (await response.json()) as ResponseType;
    },
    onSuccess: ({data}) => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.id] });
    },
    onError: (error) => {
      console.error("Failed to join workspace:", error);
    }

  });
};