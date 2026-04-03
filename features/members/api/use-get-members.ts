import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rcp";

interface UseGetMembersProps {
    workspaceId: string;
}

type ResponseType = InferResponseType<typeof client.api.members.$get, 200>;

export const useGetMembers = ({ workspaceId }: UseGetMembersProps) => {
    return useQuery({
        queryKey: ["members", workspaceId],
        queryFn: async () => {
            const response = await client.api.members.$get({ query: { workspaceId } });
            if (response.status === 401) {
                return null;
            }
            if (!response.ok) {
                const errorBody = (await response.json().catch(() => null)) as { error?: string; message?: string } | null;
                throw new Error(errorBody?.error ?? errorBody?.message ?? "Failed to fetch members");
            }
            return (await response.json()) as ResponseType;
        },
    });
};