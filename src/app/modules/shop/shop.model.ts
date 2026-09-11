import { Schema, model } from "mongoose";
import { IShop } from "./shop.interface";
import { customTransform } from "../../../lib/customTransform";

const shippingSchema = new Schema(
    {
        area: {
            type: String,
            required: true,
            trim: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {
        _id: false,
    }
);

const shopSchema = new Schema<IShop>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        logo: {
            type: String,
        },

        email: {
            type: String,
            lowercase: true,
            trim: true,
        },

        phone: {
            type: String,
            required: true,
        },

        address: {
            type: String,
        },
        steadfastApiKey: {
            type: String
        },
        steadfastSecretKey: {
            type: String
        },
        defaultShippingCharge: {
            type: Number,
            default: 0,
            min: 0,
        },

        shipping: {
            type: [shippingSchema],
            required: true,
            default: [],
        },

        facebook: {
            type: String,
        },

        instagram: {
            type: String,
        },
    },
    {
        timestamps: true,

        toJSON: {
            transform(_doc, ret) {
                customTransform(ret, ["logo"]);
            },
        },
    }
);

export const Shop = model<IShop>("Shop", shopSchema);