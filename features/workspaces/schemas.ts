import { z } from "zod";

export const createWorkspaceSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Required")
        .max(50, "Workspace name must be 50 characters or less"),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;