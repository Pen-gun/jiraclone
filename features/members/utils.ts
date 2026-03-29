import { prisma } from "@/lib/prismaHelper";

interface GetMembersProps {
    workspaceId: string;
    userId: string;
}

export const getMembers = async ({
    workspaceId,
    userId,
}: GetMembersProps) => {
    const members = await prisma.workspaceMember.findFirst({
        where: {
                workspaceId,
                userId,
            },
    })
    return members;
}