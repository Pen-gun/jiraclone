import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rcp";

type ResponseType = InferResponseType<typeof client.api.members[":memberId"]['$delete'], 200>;
type RequestType = InferRequestType<typeof client.api.members[":memberId"]['$delete']>;

export const useDeleteMember = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async ({ param, query }) => {
      const response = await client.api.members[":memberId"]['$delete']({ param, query });
      if (!response.ok) {
        const errorBody = (await response.json().catch(() => null)) as { error?: string; message?: string } | null;
        if (response.status === 403) {
          throw new Error("You don't have permission to delete this member");
        }

        throw new Error(errorBody?.error ?? errorBody?.message ?? "Failed to delete member");
      }

      return (await response.json()) as ResponseType;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["members", variables.query.workspaceId] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
    }
  });
};