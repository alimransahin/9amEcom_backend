import { Schema, model } from "mongoose";
import { IProduct } from "./product.interface";
import { Collection } from "../../utils/modelConstants";
import { customTransform } from "../../../lib/customTransform";

const productVariantSchema = new Schema(
    {
        size: {
            type: String,
            required: true,
        },

        color: String,

        sku: String,

        stock: {
            type: Number,
            default: 0,
        },
    },
    {
        _id: false,
    }
);

const productSchema = new Schema<IProduct>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        sku: {
            type: String,
            unique: true,
            sparse: true,
            trim: true,
        },

        description: String,

        category: {
            type: Schema.Types.ObjectId,
            ref: Collection.Category,
            required: true,
        },

        subCategory: String,

        brand: {
            type: Schema.Types.ObjectId,
            ref: Collection.Brand,
        },

        sizeChart: {
            type: Schema.Types.ObjectId,
            ref: Collection.SizeChart,
        },

        purchasePrice: {
            type: Number,
            default: 0,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        discountPrice: {
            type: Number,
            default: 0,
        },

        discountPercent: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },

        variants: {
            type: [productVariantSchema],
            default: [],
        },

        images: {
            type: [String],
            default: [],
        },
        isFetured: {
            type: Boolean,
            default: false,
        },
        isTrending: {
            type: Boolean,
            default: false,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(_doc, ret, _options) {
                const imageFields = ['images']
                customTransform(ret, imageFields)
            },
        }
    }
);

export const Product = model<IProduct>(
    Collection.Product,
    productSchema
);