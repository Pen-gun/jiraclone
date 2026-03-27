import { useMutation, useQueryClient } from "@tanstack/react-query";

import {client} from "@/lib/rcp";


export const useLogout = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async () => {
            const response = await client.api.auth.logout["$post"]();
            return await response.json();
        },
        onSuccess: () => {
            ["dashboard", "workspaces"].forEach(key => {
                queryClient.removeQueries({ queryKey: [key] });
            });
        }
    })
    return mutation;
}
