
import { z } from "zod";

export const createBannerSchema = z.object({

    title: z
        .string()
        .trim()
        .min(1, "Banner title is required"),

    subtitle: z
        .string()
        .trim()
        .optional(),

    productUrl: z
        .string()
        .trim()
        .optional(),

    isActive: z
        .union([
            z.boolean(),
            z.string(),
        ])
        .optional(),

});

export const updateBannerSchema = z.object({

    title: z
        .string()
        .trim()
        .min(1, "Banner title is required")
        .optional(),

    subtitle: z
        .string()
        .trim()
        .optional(),

    productUrl: z
        .string()
        .trim()
        .optional(),

    isActive: z
        .union([
            z.boolean(),
            z.string(),
        ])
        .optional(),

});
