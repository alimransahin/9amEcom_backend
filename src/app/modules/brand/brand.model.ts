import { Connection, model, Query, Schema, Types } from "mongoose";
import { IBrand } from "./brand.interface";
import { Collection } from "../../utils/modelConstants";
import { customTransform } from "../../../lib/customTransform";


const brandSchema = new Schema<IBrand>(
  {
    userId: { type: Types.ObjectId, ref: Collection.User, required: true },
    name: { type: String, required: true, unique: true },
    image: { type: String, required: false },
    description: { type: String, required: false },
    website: { type: String, required: false },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret, _options) {
        const imageFields = ['image']
        customTransform(ret, imageFields)
      },
    }
  }
);


export const Brand = model<IBrand>(Collection.Brand, brandSchema);