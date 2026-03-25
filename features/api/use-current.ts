import {useQuery} from "@tanstack/react-query";

import {client} from "@/lib/rcp";

export const useCurrent = () => {
	return useQuery({
		queryKey: ["dashboard"],
		queryFn: async () => {
			const response = await client.api.auth.me.$get();
			if (response.status === 401) {
				return null;
			}

			if (!response.ok) {
				throw new Error("Failed to fetch current user");
			}
			return await response.json();
		},
		retry: false,
		refetchOnMount: "always",
	});
};