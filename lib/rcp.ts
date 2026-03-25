import { hc } from "hono/client";
import type { AppType } from "@/app/api/[...route]/route";

const fetchWithCredentials: typeof fetch = (input, init) => {
  return fetch(input, {
    ...init,
    credentials: "include",
  });
};

export const client = hc<AppType>(process.env.NEXT_PUBLIC_API_URL!, {
  fetch: fetchWithCredentials,
});