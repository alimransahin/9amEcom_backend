import { z } from "zod";

// ======================
// Measurement Row Schema
// ======================
const sizeChartMeasurementSchema = z.object({
    size: z.string().min(1, "Size is required"),

    values: z.record(
        z.string(),
        z.union([z.string(), z.number()])
    ),
});

// ======================
// CREATE SIZE CHART
// ======================
export const createSizeChartSchema = z.object({
    title: z.string().min(1, "Title is required"),

    unit: z.enum(["inch", "cm"]).default("inch"),

    columns: z.array(z.string().min(1)).default([]),

    measurements: z.array(sizeChartMeasurementSchema).default([]),

    isActive: z.boolean().optional(),
});

// ======================
// UPDATE SIZE CHART
// ======================
export const updateSizeChartSchema =
    createSizeChartSchema.partial();

// ======================
// TYPES
// ======================
export type CreateSizeChartInput = z.infer<
    typeof createSizeChartSchema
>;

export type UpdateSizeChartInput = z.infer<
    typeof updateSizeChartSchema
>;