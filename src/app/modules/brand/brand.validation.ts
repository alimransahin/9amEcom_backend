import { z } from "zod";

// Create brand payload
export const createBrandSchema = z.object({
    name: z.string().min(1, "Brand name is required"),
    image: z.string().optional(),
    description: z.string().optional(),
    website: z.string().optional(),
    isActive: z.boolean().optional(),
});

// Update brand payload
export const updateBrandSchema = createBrandSchema.partial()

export type CreateBrandInput = z.infer<typeof createBrandSchema>;
export type UpdateBrandInput = z.infer<typeof updateBrandSchema>;
