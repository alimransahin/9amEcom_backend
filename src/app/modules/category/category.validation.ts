import { z } from "zod";

export const createCategorySchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters"),

    parent: z
        .string()
        .nullable()
        .optional(),

    description: z
        .string()
        .optional(),

    isFeatured: z
        .union([
            z.boolean(),
            z.string().transform((value) => value === "true"),
        ])
        .optional(),

    isActive: z
        .coerce
        .boolean()
        .optional(),
});

export const updateCategorySchema =
    createCategorySchema.partial();