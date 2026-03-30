import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createWorkspaceSchema, updateWorkspaceSchema } from "../schemas";
import { sessionMiddleware } from "@/lib/session-middelware";
import { prisma } from "@/lib/prismaHelper";
import { generateInviteCode } from "@/lib/utils";
import { validateWorkspaceAccess } from "@/features/members/utils";
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
            try {
                const user = c.get("user");
                const { workspaceId } = c.req.param();
                const { name } = c.req.valid("form");

                if (typeof name === "undefined") {
                    return c.json({ message: "Workspace name is required" }, 400);
                }

                await validateWorkspaceAccess({
                    workspaceId,
                    userId: user.id,
                });

                const workspace = await prisma.workspace.update({
                    where: { id: workspaceId },
                    data: { name },
                });
                return c.json({ data: workspace }, 200);
            } catch (error) {
                const message = error instanceof Error ? error.message : "Internal server error";
                const statusCode = message === "Unauthorized" ? 403 : message === "Workspace not found" ? 404 : 500;
                return c.json({ message }, statusCode);
            }
        }
    )
    .delete(
        "/:workspaceId",
        sessionMiddleware,
        async (c) => {
            try {
                const user = c.get("user");
                const { workspaceId } = c.req.param();
                const workspace = await validateWorkspaceAccess({
                    workspaceId,
                    userId: user.id,
                });

                // Workspace -> Project/Member -> Task/Comment are configured with onDelete: Cascade.
                await prisma.workspace.delete({
                    where: { id: workspaceId },
                });
                return c.json({ data: workspace }, 200);
            } catch (error) {
                const message = error instanceof Error ? error.message : "Internal server error";
                const statusCode = message === "Unauthorized" ? 403 : message === "Workspace not found" ? 404 : 500;
                return c.json({ message }, statusCode);
            }
        }
    )
    .post(
        "/:workspaceId/reset-invite-code",
        sessionMiddleware,
        async (c) => {
            try {
                const user = c.get("user");
                const { workspaceId } = c.req.param();
                await validateWorkspaceAccess({
                    workspaceId,
                    userId: user.id,
                });

                const workspace = await prisma.workspace.update({
                    where: { id: workspaceId },
                    data: { inviteCode: generateInviteCode(6) },
                });
                return c.json({ data: workspace }, 200);
            } catch (error) {
                const message = error instanceof Error ? error.message : "Internal server error";
                const statusCode = message === "Unauthorized" ? 403 : message === "Workspace not found" ? 404 : 500;
                return c.json({ message }, statusCode);
            }
        }
    )


export default app