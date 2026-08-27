import { z } from "zod";

const createOrderValidationSchema = z.object({
    firstName: z
        .string({
            message: "First name is required",
        })
        .min(1, "First name is required"),

    lastName: z
        .string({
            message: "Last name is required",
        })
        .min(1, "Last name is required"),

    address: z
        .string({
            message: "Address is required",
        })
        .min(1, "Address is required"),

    district: z
        .string({
            message: "District is required",
        })
        .min(1, "District is required"),

    upazila: z
        .string({
            message: "Upazila is required",
        })
        .min(1, "Upazila is required"),

    mobile: z
        .string({
            message: "Mobile number is required",
        })
        .min(11, "Mobile number must be at least 11 characters")
        .max(15, "Invalid mobile number"),

    email: z
        .string()
        .email("Invalid email address")
        .optional()
        .or(z.literal("")),

    items: z
        .array(
            z.object({
                product: z.string().min(1, "Product is required"),

                quantity: z
                    .number()
                    .min(1, "Quantity must be at least 1"),

                color: z.string().optional(),

                size: z.string().optional(),
            })
        )
        .min(1, "Cart cannot be empty"),
});


const updateOrderValidationSchema = z.object({
    status: z
        .enum([
            "pending",
            "processing",
            "shipped",
            "delivered",
            "cancelled",
        ])
        .optional(),

    firstName: z.string().min(1).optional(),

    lastName: z.string().min(1).optional(),

    address: z.string().min(1).optional(),

    district: z.string().min(1).optional(),

    upazila: z.string().min(1).optional(),

    mobile: z.string().min(11).max(15).optional(),

    email: z
        .string()
        .email("Invalid email address")
        .optional(),
});


export const OrderValidation = {
    createOrderValidationSchema,
    updateOrderValidationSchema,
};