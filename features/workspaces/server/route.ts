import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createWorkspaceSchema } from "../schemas";
import { sessionMiddleware } from "@/lib/session-middelware";
import { prisma } from "@/lib/prismaHelper";
import { MemberRole } from "@/features/members/tpyes";
import { generateInviteCode } from "@/lib/utils";

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
            if (!members) {
                return c.json([], 200);
            }
            const workspaces = members.map((member) => member.workspace);
            return c.json(workspaces);
    })
    .post(
        "/",
        zValidator("json", createWorkspaceSchema),
        sessionMiddleware,
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
    );

export default app