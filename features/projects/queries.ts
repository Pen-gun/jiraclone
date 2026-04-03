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

    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
            workspace: {
                members: {
                    some: {
                        userId: session.userId,
                    },
                },
            },
        },
    });
    if (!project) {
        return null;
    }

    return project;
};