import { prisma } from "@/lib/prismaHelper";
import { MemberRole } from "./types";

interface GetMemberProps {
    workspaceId: string;
    userId: string;
}

export const getMember = async ({
    workspaceId,
    userId,
}: GetMemberProps) => {
    const member = await prisma.workspaceMember.findFirst({
        where: {
                workspaceId,
                userId,
            },
    })
    return member;
}

interface ValidateWorkspaceAccessProps {
    workspaceId: string;
    userId: string;
}

/**
 * Validates that user is an ADMIN member of the workspace and returns the workspace.
 * Throws an error if unauthorized or workspace not found.
 */
export const validateWorkspaceAccess = async ({
    workspaceId,
    userId,
}: ValidateWorkspaceAccessProps) => {
    const member = await getMember({ workspaceId, userId });
    
    if (!member || member.role !== MemberRole.ADMIN) {
        throw new Error("Unauthorized");
    }
    
    const workspace = await prisma.workspace.findUnique({
        where: { id: workspaceId },
    });
    
    if (!workspace) {
        throw new Error("Workspace not found");
    }
    
    return workspace;
}