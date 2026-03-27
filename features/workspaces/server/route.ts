import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createWorkspaceSchema } from "../schemas";
import { sessionMiddleware } from "@/lib/session-middelware";
import { prisma } from "@/lib/prismaHelper";

const app = new Hono()
    .get(
        "/", 
        sessionMiddleware, 
        async (c) => {
            const user = c.get("user");
            const workspaces = await prisma.workspace.findMany({
                where: {
                    ownerId: user.id,
                },
            });
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
                },
            });
            return c.json(workspace, 201);
        }
    );

export default app