import { z } from "zod";

export const createProjectSchema = z.object({
    name: z.string().min(1, "Project name is required"),
    workspaceId: z.string().min(1, "Workspace ID is required"),
    description: z.string().optional(),
});