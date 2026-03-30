"use server";

import { prisma } from "@/lib/prismaHelper";
import { getSession } from "@/lib/getSessionClient";


export const getWorkspaces = async () => {
    const session = await getSession();

    if (!session) {
        return { workspaces: []};
    }

    try {
        // Fetch workspaces via membership
        const members = await prisma.workspaceMember.findMany({
            where: {
                userId: session.userId,
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
    const session = await getSession();

    if (!session) {
        return null;
    }

    try {
        const workspace = await prisma.workspace.findFirst({
            where: {
                id: workspaceId,
                OR: [
                    { ownerId: session.userId },
                    { members: { some: { userId: session.userId } } },
                ],
            },
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
}

interface GetWorkspaceInfoProps {
    workspaceId: string;
};

export const getWorkspaceInfo = async ({ workspaceId }: GetWorkspaceInfoProps) => {
    const session = await getSession();

    if (!session) {
        return null;
    }

    try {
        const workspace = await prisma.workspace.findFirst({
            where: {
                id: workspaceId,
            },
        });

        return { name: workspace?.name };
    } catch (error) {
        console.error("[GET_WORKSPACE_INFO_ERROR]", error);
        return null;
    }
};