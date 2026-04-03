import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rcp";

interface useGetProjectsProps{
    workspaceId: string;
}

export const useGetProjects = ({ workspaceId }: useGetProjectsProps) => {
    return useQuery({
        queryKey: ["Projects", workspaceId],
        queryFn: async () => {
            const response = await client.api.projects.$get({query: { workspaceId }});
            if (response.status === 401) {
                return null;
            }
            if (!response.ok) {
                throw new Error("Failed to fetch projects");
            }
            return await response.json();
        },
    });
};