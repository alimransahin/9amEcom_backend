import { z } from "zod";

export const createCategorySchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters"),

    description: z.string().optional(),
    subCategory: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
    featuredProduct: z.string().optional(),

});

export const updateCategorySchema = createCategorySchema.partial();