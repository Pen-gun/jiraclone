"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prismaHelper";
import { AUTH_COOKIE_NAME } from "./auth/constant";

export const getCurrentUser = async () => {
    const session = (await cookies()).get(AUTH_COOKIE_NAME);
    if (!session) {
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

        return dbSession.user;
    } catch (error) {
        return null;
    }
};