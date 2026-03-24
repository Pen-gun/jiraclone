import {useQuery} from "@tanstack/react-query";
import { InferResponseType } from "hono";

import {client} from "@/lib/rcp";

type ResponseType = InferResponseType<typeof client.api.auth.me['$get'], 200>

export const useDashboard = () => {
	return useQuery<ResponseType>({
		queryKey: ["dashboard"],
		queryFn: async () => {
			const response = await client.api.auth.me['$get']();
			if (!response.ok) {
				throw new Error("Failed to fetch current user");
			}
			return await response.json();
		},
	});
};