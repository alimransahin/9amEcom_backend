import { Schema, model, Types } from "mongoose";
import { ICategory } from "./category.interface";
import { Collection } from "../../utils/modelConstants";
import { customTransform } from "../../../lib/customTransform";

const categorySchema = new Schema<ICategory>(
  {
    userId: {
      type: Types.ObjectId,
      ref: Collection.User,
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    parent: {
      type: Types.ObjectId,
      ref: Collection.Category,
      default: null,
    },

    image: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      trim: true,
    },

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

    toJSON: {
      transform(_doc, ret, _options) {
        const imageFields = ["image"];

        customTransform(
          ret,
          imageFields
        );
      },
    },
  }
);

// Index
categorySchema.index({
  userId: 1,
  slug: 1,
}, {
  unique: true,
});

categorySchema.index({
  userId: 1,
  parent: 1,
});

export const Category = model<ICategory>(
  Collection.Category,
  categorySchema
);