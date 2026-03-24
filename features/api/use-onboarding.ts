import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import {client} from "@/lib/rcp";

type ResponseType = InferResponseType<typeof client.api.auth.onboarding['$post']>
type RequestType = InferRequestType<typeof client.api.auth.onboarding['$post']>

export const useOnboarding = () => {

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({json}) => {
            const response = await client.api.auth.onboarding['$post']({json});
            return await response.json();
        }
    })
    return mutation;
}

