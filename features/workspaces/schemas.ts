import { z } from "zod";

export const createWorkspaceSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Required")
        .max(50, "Workspace name must be 50 characters or less"),
    description: z
        .string()
        .trim()
        .max(280, "Description must be 280 characters or less")
        .optional(),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;