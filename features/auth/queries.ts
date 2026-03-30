"use server";

import { getSession } from "@/lib/createSessionClient";

export const getCurrentUser = async () => {
   try {
     const session = await getSession();
     return session?.user;
   } catch (error) {
     return null;
   }
}