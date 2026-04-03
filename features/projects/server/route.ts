import { sessionMiddleware } from '@/lib/session-middelware';
import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator';
import { prisma } from '@/lib/prismaHelper';

const app = new Hono()
    .get('/',
        sessionMiddleware,
        zValidator("query", z.object({ workspaceId: z.string() })),
        async (c) => {
            const user = c.get("user");
            const { workspaceId } = c.req.valid("query");

            if(!workspaceId){
                return c.json({ error: "workspaceId is required" }, 400);
            }

            const member = await prisma.workspaceMember.findFirst({
                where: {
                    userId: user.id,
                    workspaceId
                }
            })
            if (!member) {
                return c.json({ error: "Unauthorized" }, 401);
            }
            const projects = await prisma.project.findMany({
                where: {
                    workspaceId
                }
            });
            return c.json(projects);
        }
    )

export default app;