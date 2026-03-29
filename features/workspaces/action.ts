"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prismaHelper";
import { AUTH_COOKIE_NAME } from "@/features/auth/constant";


export const getWorkspaces = async () => {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME);

    // No session cookie → return empty result
    if (!sessionCookie) {
        return { workspaces: []};
    }

    try {
        // Fetch session
        const dbSession = await prisma.session.findUnique({
            where: { id: sessionCookie.value },
            select: {
                id: true,
                userId: true,
                expiresAt: true,
            },
        });

        // Invalid or expired session
        if (!dbSession || dbSession.expiresAt < new Date()) {
            if (dbSession) {
                await prisma.session.delete({
                    where: { id: dbSession.id },
                });
            }

            // Remove invalid cookie
            cookieStore.delete(AUTH_COOKIE_NAME);

            return { workspaces: [] };
        }

        // Fetch workspaces via membership
        const members = await prisma.workspaceMember.findMany({
            where: {
                userId: dbSession.userId,
            },
            select: {
                workspace: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                workspace: {
                    createdAt: "desc",
                },
            },
        });

        const workspaces = members.map((m) => m.workspace);

        return {
            workspaces,
        };
    } catch (error) {
        console.error("[GET_WORKSPACES_ERROR]", error);

        return { workspaces: [] };
    }
};

interface GetWorkspaceProps {
    workspaceId: string;
};

export const getWorkspace = async ({ workspaceId }: GetWorkspaceProps) => {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME);
    // No session cookie → return empty result
    if (!sessionCookie) {
        return null;
    }
    try {
        const workspace = await prisma.workspace.findUnique({
            where: { id: workspaceId },
            include: {
                owner: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                    },
                },
                members: {
                    select: {
                        id: true,
                        userId: true,
                        role: true,
                    },
                },
            },
        });

        return workspace;
    } catch (error) {
        console.error("[GET_WORKSPACE_ERROR]", error);
        return null;
    }
};