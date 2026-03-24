import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import {client} from "@/lib/rcp";

type ResponseType = InferResponseType<typeof client.api.auth.logout['$post']>

export const useLogout = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation<ResponseType, Error, void>({
        mutationFn: async () => {
            const response = await client.api.auth.logout['$post']();
            if (!response.ok) {
                const error = (await response
                    .json()
                    .catch(() => null)) as { error?: string; message?: string } | null;
                throw new Error(error?.error ?? error?.message ?? "Logout failed");
            }
            return await response.json();
        },
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ["dashboard"] });
        }
    })
    return mutation;
}
