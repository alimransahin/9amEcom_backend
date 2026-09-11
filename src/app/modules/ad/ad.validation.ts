import { z } from "zod";

const productUrlSchema = z
    .string()
    .trim()
    .refine(
        (value) => {
            if (!value) return true;

            if (value.startsWith("/")) {
                return true;
            }

            try {
                const url = new URL(value);

                return url.protocol === "http:" || url.protocol === "https:";
            } catch {
                return false;
            }
        },
        {
            message: "Product URL must be a valid URL",
        }
    )
    .optional()
    .default("");

export const createAdValidationSchema = z.object({
    category: z.string().min(1, "Category is required"),
    productUrl: productUrlSchema,
});

export const updateAdValidationSchema = z.object({
    category: z.string().min(1, "Category is required").optional(),
    productUrl: productUrlSchema,
    isActive: z
        .union([
            z.boolean(),
            z.string(),
        ])
        .optional(),
});