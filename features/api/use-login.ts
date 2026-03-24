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
        mutationFn: async (data) => {
            const response = await client.api.auth.login['$post'](data);
            return await response.json();
        }
    })
    return mutation;
}