"use server";

import { getSession } from "@/lib/getSessionClient";

export const getCurrentUser = async () => {
    const session = await getSession();
    return session?.user;
};