import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rcp";

export const useGetWorkspaces = () => {
    return useQuery({
        queryKey: ["workspaces"],
        queryFn: async () => {
            const response = await client.api.workspaces.$get();
            if (response.status === 401) {
                return null;
            }
            if (!response.ok) {
                throw new Error("Failed to fetch workspaces");
            }
            return await response.json();
        },
    });
};