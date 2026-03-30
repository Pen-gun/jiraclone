import "server-only";

import { cookies } from "next/headers";
import { prisma } from "./prismaHelper";
import { AUTH_COOKIE_NAME } from "@/features/auth/constant";

export const getSession = async () => {
    const cookieStore = await cookies();
    const session = cookieStore.get(AUTH_COOKIE_NAME);

    if (!session?.value) {
        return null;
    }

    try {
        const dbSession = await prisma.session.findUnique({
            where: { id: session.value },
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
            return null;
        }

        if (dbSession.expiresAt < new Date()) {
            await prisma.session.delete({
                where: { id: dbSession.id },
            });
            return null;
        }

        return dbSession;
    } catch {
        return null;
    }
};