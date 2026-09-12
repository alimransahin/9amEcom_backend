import { z } from "zod";

const permissionsSchema = z
    .array(z.string().trim().min(1))
    .min(1, "At least one permission is required");

export const createRoleValidationSchema = z.object({
    roleName: z
        .string()
        .trim()
        .min(1, "Role name is required"),

    permissions: permissionsSchema,
});

export const updateRoleValidationSchema = z.object({
    roleName: z
        .string()
        .trim()
        .min(1, "Role name is required")
        .optional(),

    permissions: permissionsSchema.optional(),

    isActive: z
        .union([
            z.boolean(),
            z.string(),
        ])
        .optional(),
});