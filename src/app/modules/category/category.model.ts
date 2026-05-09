import { Schema, model, Types } from "mongoose";
import { ICategory } from "./category.interface";
import { Collection } from "../../utils/modelConstants";

const categorySchema = new Schema<ICategory>(
  {
    userId: { type: Types.ObjectId, ref: Collection.User, required: true, },
    name: { type: String, required: true, trim: true, },
    slug: { type: String, required: true, unique: true, lowercase: true, },
    subCategory: { type: [String], default: [], trim: true, },
    description: { type: String, },
    isActive: { type: Boolean, default: true, },
    isDeleted: { type: Boolean, default: false, },
  },
  { timestamps: true }
);

export const Category = model<ICategory>(Collection.Category, categorySchema);