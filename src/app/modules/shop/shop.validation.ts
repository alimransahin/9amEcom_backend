
import { z } from "zod";

const shippingValidationSchema = z.object({
    area: z
        .string()
        .min(1, "Shipping area is required"),

    amount: z
        .number()
        .min(0, "Shipping amount cannot be negative"),
});

const optionalUrl = z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
        (value) => {
            if (!value) return true;

            try {
                new URL(value);
                return true;
            } catch {
                return false;
            }
        },
        {
            message: "Invalid URL",
        }
    );

const updateShopValidationSchema = z
    .object({
        name: z
            .string()
            .min(1, "Shop name cannot be empty")
            .optional(),

        email: z
            .string()
            .email("Invalid email address")
            .optional()
            .or(z.literal("")),

        phone: z
            .string()
            .min(
                11,
                "Phone number must be at least 11 characters"
            )
            .optional(),

        address: z
            .string()
            .optional(),
        steadfastApiKey: z.string().optional(),
        steadfastSecretKey: z.string().optional(),
        defaultShippingCharge: z.string().optional(),

        shipping: z
            .union([
                z.array(shippingValidationSchema),

                // FormData থেকে JSON string আসলে
                z.string().transform((value, ctx) => {
                    try {
                        return JSON.parse(value);
                    } catch {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: "Invalid shipping data",
                        });

                        return z.NEVER;
                    }
                }).pipe(
                    z.array(shippingValidationSchema)
                ),
            ])
            .optional(),

        facebook: optionalUrl,

        instagram: optionalUrl,
    })
    .partial();

export type UpdateShopInput = z.infer<
    typeof updateShopValidationSchema
>;

export const ShopValidation = {
    updateShopValidationSchema,
};

