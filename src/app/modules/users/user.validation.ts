import { z } from "zod";

export const createUserZodSchema = z.object({
    body: z.object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(6),
        role: z.enum(["admin", "customer"]).optional(),
        phone: z.string().optional(),
        address: z.string().optional()
    })
});