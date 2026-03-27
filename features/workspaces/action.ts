"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prismaHelper";
import { AUTH_COOKIE_NAME } from "@/features/auth/constant";

export const getWorkspaces = async () => {
    const session = (await cookies()).get(AUTH_COOKIE_NAME);
    if (!session) return null;

    try {
        const dbSession = await prisma.session.findUnique({
            where: { id: session.value }
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

        const members = await prisma.workspaceMember.findMany({
            where: {
                userId: dbSession.userId,
            },
            include: {
                workspace: true,
            },
        });

        return members.map((member) => member.workspace);
    } catch (error) {
        return null;
    }
};