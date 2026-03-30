"use server";

import { getSession } from "@/lib/getSessionClient";

export const getCurrentUser = async () => {
   try {
     const session = await getSession();
     return session?.user;
   } catch (error) {
     return null;
   }
}