import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rcp";

type ResponseType = InferResponseType<typeof client.api.members[":memberId"]['$patch'], 200>;
type RequestType = InferRequestType<typeof client.api.members[":memberId"]['$patch']>;

export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ResponseType,
    Error,
    RequestType>
    ({
      mutationFn: async ({ param, query, json }) => {
        const response = await client.api.members[":memberId"]['$patch']({ param, query, json });
        if (!response.ok) {
          const errorBody = (await response.json().catch(() => null)) as
            | { error?: string; message?: string }
            | null;
          throw new Error(errorBody?.error ?? errorBody?.message ?? "Failed to update member");
        }

        return (await response.json()) as ResponseType;
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ["members", variables.query.workspaceId] });
        queryClient.invalidateQueries({ queryKey: ["members"] });
      },
      onError: (error) => {
        console.error("Failed to update member:", error);
      }
    });
};