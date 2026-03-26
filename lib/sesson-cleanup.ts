import { prisma } from "@/lib/prismaHelper";

export async function startSessionCleanupInterval(intervalMs = 1000 * 60 * 60) {
    async function runCleanup() {
        try {
            const result = await prisma.session.deleteMany({
                where: { expiresAt: { lt: new Date() } }
            });

            if (result.count > 0) {
                console.log(`Cleaned up ${result.count} expired sessions`);
            }
        } catch (error) {
            console.error("Session cleanup error:", error);
        } finally {
            setTimeout(runCleanup, intervalMs);
        }
    }
    runCleanup();
}