import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rcp";

type ResponseType = InferResponseType<typeof client.api.auth.onboarding['$post']>;
type RequestType = InferRequestType<typeof client.api.auth.onboarding['$post']>;

export const useOnboarding = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (req) => {
      const response = await client.api.auth.onboarding['$post'](req);

      // Read JSON once
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error("Onboarding failed");
      }

      return data as ResponseType;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (error) => {
      console.error("Onboarding error:", error);
    },
  });
};