import { getSession } from '@/lib/getSessionClient';
import { sessionMiddleware } from '@/lib/session-middelware';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';
import { getMember } from '../utils';
import { prisma } from '@/lib/prismaHelper';
import { MemberRole } from '../types';

const app = new Hono()
    .get(
        '/',
        sessionMiddleware,
        zValidator('query', z.object({ workspaceId: z.string() })),
        async (c) => {
            const session = await getSession();
            if (!session) {
                return c.json({ error: 'Unauthorized' }, 401);
            }

            const user = c.get('user');
            const { workspaceId } = c.req.valid('query');

            const member = await getMember({ workspaceId, userId: user.id });
            if (!member) {
                return c.json({ error: 'Unauthorized' }, 401);
            }

            const populatemembers = await prisma.workspaceMember.findMany({
                where: { workspaceId },
                select: { 
                    id: true, 
                    userId: true, 
                    role: true,
                    user: {
                        select: {
                            fullName: true
                        }
                    }
                 },
            });

            return c.json({
                data: {
                    ...member,
                    member: populatemembers,
                }
            });
        },

    )
    .delete(
        "/:memberId",
        sessionMiddleware,
        zValidator("query", z.object({ workspaceId: z.string() })),
        async (c) => {
            const { memberId } = c.req.param();
            const { workspaceId } = c.req.valid("query");

            const session = await getSession();
            if (!session) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const user = c.get("user");

            const currentMember = await getMember({
                workspaceId,
                userId: user.id,
            });

            if (!currentMember || currentMember.role !== MemberRole.ADMIN) {
                return c.json({ error: "Forbidden" }, 403);
            }

            const memberToDelete = await prisma.workspaceMember.findFirst({
                where: { workspaceId, id: memberId },
            });

            if (!memberToDelete) {
                return c.json({ error: "Member not found" }, 404);
            }

            // Prevent deleting admin
            if (memberToDelete.role === MemberRole.ADMIN) {
                return c.json({ error: "Cannot delete an admin member" }, 403);
            }

            await prisma.workspaceMember.delete({
                where: { id: memberId },
            });

            return c.json({ success: true });
        }
    )
    .patch(
        "/:memberId",
        sessionMiddleware,
        zValidator("query", z.object({ workspaceId: z.string() })),
        zValidator("json", z.object({ role: z.enum(MemberRole) })),
        async (c) => {
            const { memberId } = c.req.param();
            const { workspaceId } = c.req.valid("query");

            const session = await getSession();
            if (!session) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const user = c.get("user");

            const currentMember = await getMember({
                workspaceId,
                userId: user.id,
            });

            if (!currentMember || currentMember.role !== MemberRole.ADMIN) {
                return c.json({ error: "Forbidden" }, 403);
            }

            const memberToUpdate = await prisma.workspaceMember.findFirst({
                where: { workspaceId, id: memberId },
            });

            if (!memberToUpdate) {
                return c.json({ error: "Member not found" }, 404);
            }

            // Prevent updating admin
            if (memberToUpdate.role === MemberRole.ADMIN) {
                return c.json({ error: "Cannot update an admin member" }, 403);
            }

            const { role } = c.req.valid("json");

            await prisma.workspaceMember.update({
                where: { id: memberId },
                data: { role },
            });
            return c.json({ success: true });
        }
    )

export default app;