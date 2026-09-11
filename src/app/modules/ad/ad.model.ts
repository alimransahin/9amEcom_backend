import { model, Schema, Types } from "mongoose";

import { IAd } from "./ad.interface";

import { Collection } from "../../utils/modelConstants";

import { customTransform } from "../../../lib/customTransform";

const adSchema = new Schema<IAd>(
    {
        image: {
            type: String,
            required: [true, "Ad image is required"],
            trim: true,
        },

        category: {
            type: Types.ObjectId,
            ref: Collection.Category,
            required: [true, "Category is required"],
        },

        productUrl: {
            type: String,
            required: false,
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

                customTransform(ret, imageFields);
            },
        },
    }
);

export const Ad = model<IAd>(
    Collection.Ad,
    adSchema
);