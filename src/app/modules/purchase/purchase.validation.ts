import { z } from "zod";

const purchaseItemZodSchema = z.object({
    product: z
        .string()
        .min(1, "Product is required"),

    size: z
        .string()
        .min(1, "Size is required"),

    color: z
        .string()
        .optional(),

    quantity: z.coerce
        .number()
        .min(1, "Quantity must be at least 1"),

    purchasePrice: z.coerce
        .number()
        .min(
            0,
            "Purchase price cannot be negative"
        ),
});

export const createPurchaseZodSchema = z.object({
    supplier: z
        .string()
        .optional(),
    invoice: z.string().optional(),
    items: z
        .array(purchaseItemZodSchema)
        .min(
            1,
            "At least one product is required"
        ),

    discount: z.coerce
        .number()
        .min(
            0,
            "Discount cannot be negative"
        )
        .optional(),

    note: z
        .string()
        .optional(),

    purchaseDate: z
        .string()
        .optional(),
});

export const updatePurchaseZodSchema =
    createPurchaseZodSchema.partial();