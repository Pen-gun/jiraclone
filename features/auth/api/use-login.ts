import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rcp";
import { showJsonToast } from "@/components/toaster";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<typeof client.api.auth.login['$post']>;
type RequestType = InferRequestType<typeof client.api.auth.login['$post']>;

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth.login['$post']({ json });
      const data = await response.json().catch(() => null);

      if (response.status === 401) {
        throw new Error("Invalid email or password");
      }

      if (!response.ok) {
        throw new Error("Login failed");
      }
      return data as ResponseType;
    },
   onSuccess: (data: any) => {
                queryClient.invalidateQueries({ queryKey: ["dashboard"] });
                showJsonToast("Login successful", { email: data.email });
                router.refresh();
            },
            onError: (error: any) => {
                const message = error instanceof Error ? error.message : "An unknown error occurred";
                showJsonToast("Login failed", { message: message });
            }
  });
};