import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import {client} from "@/lib/rcp";

type ResponseType = InferResponseType<typeof client.api.auth.login['$post']>
type RequestType = InferRequestType<typeof client.api.auth.login['$post']>

export const useLogin = () => {
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({json}) => {
            try {
                const response = await client.api.auth.login['$post']({json});
                if (!response.ok) {
                    const error = (await response
                        .json()
                        .catch(() => null)) as { error?: string; message?: string } | null;
                    throw new Error(error?.error ?? error?.message ?? "Login failed");
                }
                return await response.json();
            } catch (error) {
                throw {error: error instanceof Error ? error.message : "An unknown error occurred"};
            }
        }
    })
    return mutation;
}
