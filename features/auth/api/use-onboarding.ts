import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import {client} from "@/lib/rcp";

type ResponseType = InferResponseType<typeof client.api.auth.onboarding['$post']>
type RequestType = InferRequestType<typeof client.api.auth.onboarding['$post']>

export const useOnboarding = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({json}) => {
                const response = await client.api.auth.onboarding['$post']({json});
                if (!response.ok) {
                    const error = (await response
                        .json()
                        .catch(() => null)) as { error?: string; message?: string } | null;
                    throw new Error(error?.error ?? error?.message ?? "Onboarding failed");
                }
                return await response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["dashboard"]});
        },
        onError: (error) => {
            console.error("Onboarding error:", error);
        }
    })
    return mutation;
}

