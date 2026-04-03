import { getSession } from "@/lib/getSessionClient";
import { prisma } from "@/lib/prismaHelper";

interface GetProjectProps {
    projectId: string;
};

export const getProject = async ({ projectId }: GetProjectProps) => {
    const session = await getSession();

    if (!session) {
        return null;
    }
    const member = await prisma.workspaceMember.findFirst({
        where: {
            userId: session.userId,
        },
        select: {
            workspaceId: true,
        },
    });
    if (!member) {
        return null;
    }

    try {
        const project = await prisma.project.findFirst({
            where: {
                id: projectId,
                workspaceId: member.workspaceId,
            },
        });

        return project;

    } catch (error) {
        console.error("[GET_PROJECT_ERROR]", error);
        return null;
    }
}