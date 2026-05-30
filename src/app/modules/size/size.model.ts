import { Schema, model, Types } from "mongoose";
import { ISizeChart } from "./size.interface";
import { Collection } from "../../utils/modelConstants";
import { customTransform } from "../../../lib/customTransform";

// ======================
// Schema
// ======================
const sizeChartSchema = new Schema<ISizeChart>(
  {
    userId: {
      type: Types.ObjectId,
      ref: Collection.User,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    unit: {
      type: String,
      enum: ["inch", "cm"],
      default: "inch",
    },

    columns: {
      type: [String],
      default: [],
    },

    measurements: [
      {
        size: { type: String, required: true },

        values: {
          type: Map,
          of: Schema.Types.Mixed,
          default: {},
        },
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// ======================
// MODEL
// ======================
export const SizeChart = model<ISizeChart>(
  Collection.SizeChart,
  sizeChartSchema
);