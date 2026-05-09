// product.validation.ts

import { z } from "zod";

// create product validation
export const createProductZodSchema = z.object({
    name: z
        .string()
        .min(2, "Product name must be at least 2 characters"),

    sku: z.string().optional(),

    description: z.string().optional(),

    category: z.string().optional(),

    subCategory: z.string().optional(),

    size: z.array(z.string()).optional(),

    purchasePrice: z.coerce
        .number()
        .min(0, "Purchase price cannot be negative"),

    price: z.coerce
        .number()
        .min(0, "Price cannot be negative"),

    discountPrice: z.coerce
        .number()
        .min(0, "Discount price cannot be negative")
        .optional(),

    stock: z.coerce
        .number()
        .min(0, "Stock cannot be negative"),

    images: z.array(z.string()).optional(),

    isActive: z.boolean().optional(),
});

// update product validation
export const updateProductZodSchema =
    createProductZodSchema.partial();