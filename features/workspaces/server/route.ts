import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createWorkspaceSchema } from "../schemas";
import { sessionMiddleware } from "@/lib/session-middelware";
import { prisma } from "@/lib/prismaHelper";

const app = new Hono()
    .post(
        "/",
        zValidator("json", createWorkspaceSchema),
        sessionMiddleware,
        async (c) => {
            const user = c.get("user");
            const { name, description } = c.req.valid("json");
            const workspace = await prisma.project.create({
                data: {
                    name,
                    description,
                    ownerId: user.id,
                },
            });
            return c.json(workspace, 201);
        }
    );

export default app