import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rcp";

type ResponseType = InferResponseType<typeof client.api.auth.login['$post'], 200>;
type RequestType = InferRequestType<typeof client.api.auth.login['$post']>;

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, { message: string }, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth.login['$post']({ json });

      let data: unknown = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      // Explicitly handle status codes
      if (response.status === 401) {
        return Promise.reject({ message: "Invalid email or password" });
      }

      if (response.status < 200 || response.status >= 300) {
        return Promise.reject({ message: "Login failed. Please try again later." });
      }

      // Successful login
      return data as ResponseType;
    },

    onSuccess: () => {
      // Invalidate queries that need fresh data after login
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },

    onError: (error) => {
      // Invalid credentials are an expected user-facing state, not an app error.
      if (error.message === "Invalid email or password") {
        return;
      }

      // Keep noisy logging only for unexpected failures.
      console.error("Login error:", error.message || error);
    },
  });
};