import { z } from "zod";

// Variant Validation
const productVariantZodSchema = z.object({
    size: z
        .string()
        .min(1, "Size is required"),

    color: z.string().optional(),

    sku: z.string().optional(),

    stock: z.coerce
        .number()
        .min(0, "Stock cannot be negative")
        .optional(),
});

// Base Product Schema
const productBaseSchema = z.object({
    name: z
        .string()
        .min(
            2,
            "Product name must be at least 2 characters"
        ),

    sku: z.string().optional(),

    description:
        z.string().optional(),

    category: z.string().min(
        1,
        "Category is required"
    ),

    subCategory:
        z.string().optional(),

    brand: z.string().optional(),

    sizeChart:
        z.string().optional(),

    purchasePrice: z.coerce
        .number()
        .min(
            0,
            "Purchase price cannot be negative"
        )
        .optional(),

    price: z.coerce
        .number()
        .min(
            0,
            "Price cannot be negative"
        ),

    discountPrice: z.coerce
        .number()
        .min(
            0,
            "Discount price cannot be negative"
        )
        .optional(),

    discountPercent: z.coerce
        .number()
        .min(
            0,
            "Discount percent cannot be negative"
        )
        .max(
            100,
            "Discount percent cannot exceed 100"
        )
        .optional(),

    variants: z
        .array(
            productVariantZodSchema
        )
        .default([]),


    images: z.any().optional(),
    existingImages: z.array(z.string()).optional(),

    isActive:
        z.boolean().optional(),
});

// Create Validation
export const createProductZodSchema =
    productBaseSchema.refine(
        (data) => {
            if (
                data.discountPrice &&
                data.discountPrice >
                data.price
            ) {
                return false;
            }

            return true;
        },
        {
            message:
                "Discount price cannot exceed regular price",
            path: ["discountPrice"],
        }
    );

// Update Validation
export const updateProductZodSchema =
    productBaseSchema
        .partial()
        .refine(
            (data) => {
                if (
                    data.discountPrice &&
                    data.price &&
                    data.discountPrice >
                    data.price
                ) {
                    return false;
                }

                return true;
            },
            {
                message:
                    "Discount price cannot exceed regular price",
                path: ["discountPrice"],
            }
        );