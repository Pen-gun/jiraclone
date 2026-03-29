import { z } from "zod";

export const createWorkspaceSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Required")
        .max(50, "Workspace name must be 50 characters or less"),
});

export const updateWorkspaceSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Required")
        .max(50, "Workspace name must be 50 characters or less")
        .optional(),
});