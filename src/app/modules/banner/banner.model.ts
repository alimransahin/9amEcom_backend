
import { model, Schema, Types } from "mongoose";

import { IBanner } from "./banner.interface";

import { Collection } from "../../utils/modelConstants";

import { customTransform } from "../../../lib/customTransform";

const bannerSchema = new Schema<IBanner>(
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

        subtitle: {
            type: String,
            required: false,
            trim: true,
        },

        productUrl: {
            type: String,
            required: false,
            trim: true,
        },

        image: {
            type: String,
            required: true,
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

export const Banner = model<IBanner>(
    Collection.Banner,
    bannerSchema
);
