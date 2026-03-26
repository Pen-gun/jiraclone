import { deleteCookie, getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";

import { prisma } from "@/lib/prismaHelper";
import { AUTH_COOKIE_NAME } from "@/features/auth/constant";

type user = {
  id: string;
  email: string;
  fullName: string | null;
  age: number | null;
  bio: string | null;
  onBoardingCompleted: boolean;
};


export const sessionMiddleware = createMiddleware<{ Variables: {user: user} }>(async (c, next) => {
    const session = await getCookie(c, AUTH_COOKIE_NAME);
    if (!session) {
        return c.json({ error: "Unauthorized" }, 401);
    }

    const dbSession = await prisma.session.findUnique({
        where: { id: session },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    fullName: true,
                    age: true,
                    bio: true,
                    onBoardingCompleted: true,
                },
            },
        },
    });

    if (!dbSession) {
        deleteCookie(c, AUTH_COOKIE_NAME, { path: "/" });
        return c.json({ error: "Unauthorized" }, 401);
    }

    if (dbSession.expiresAt < new Date()) {
        await prisma.session.delete({
            where: { id: dbSession.id },
        });
        deleteCookie(c, AUTH_COOKIE_NAME, { path: "/" });
        return c.json({ error: "Session expired" }, 401);
    }

    c.set("user", dbSession.user);
    return next();
});