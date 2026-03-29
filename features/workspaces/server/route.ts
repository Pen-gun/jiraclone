import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createWorkspaceSchema, updateWorkspaceSchema } from "../schemas";
import { sessionMiddleware } from "@/lib/session-middelware";
import { prisma } from "@/lib/prismaHelper";
import { generateInviteCode } from "@/lib/utils";
import { getMembers } from "@/features/members/utils";
import { MemberRole } from "@/features/members/types";

const app = new Hono()
    .get(
        "/", 
        sessionMiddleware, 
        async (c) => {
            const user = c.get("user");
            const members = await prisma.workspaceMember.findMany({
                where: {
                    userId: user.id,
                },
                include: {
                    workspace: true,
                },
            });
            const workspaces = members.map((member) => ({
                ...member.workspace,
                role: member.role,
            }));
            return c.json(workspaces);
    })
    .post(
        "/",
        sessionMiddleware,
        zValidator("json", createWorkspaceSchema),
        async (c) => {
            const user = c.get("user");
            const { name } = c.req.valid("json");
            const workspace = await prisma.workspace.create({
                data: {
                    name,
                    ownerId: user.id,
                    inviteCode: generateInviteCode(6),
                },
            });
            await prisma.workspaceMember.create({
                data: {
                    userId: user.id,
                    workspaceId: workspace.id,
                    role: MemberRole.ADMIN,
                },
            });
            return c.json(workspace, 201);
        }
    )
    .patch(
        "/:workspaceId",
        sessionMiddleware,
        zValidator("form", updateWorkspaceSchema),
        async (c) => {
            const user = c.get("user");
            const { workspaceId } = c.req.param();
            const { name } = c.req.valid("form");

            if (typeof name === "undefined") {
                return c.json({ message: "Workspace name is required" }, 400);
            }

            const member = await getMembers({
                workspaceId,
                userId: user.id,
            });

            if( !member || member.role !== MemberRole.ADMIN) {
                return c.json({ message: "Unauthorized" }, 403);
            }

            const existingWorkspace = await prisma.workspace.findUnique({
                where: {
                    id: workspaceId,
                },
                select: {
                    id: true,
                },
            });

            if (!existingWorkspace) {
                return c.json({ message: "Workspace not found" }, 404);
            }

            const workspace = await prisma.workspace.update({
                where: {
                    id: workspaceId,
                },
                data: {
                    name,
                },
            });
            return c.json({ data: workspace }, 200);
        }
    );

export default app