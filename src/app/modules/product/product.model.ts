// product.model.ts

import { Schema, model } from "mongoose";
import { IProduct } from "./product.interface";
import { Collection } from "../../utils/modelConstants";


const productSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true },
        sku: { type: String, unique: true, sparse: true },

        description: { type: String },
        category: { type: Schema.Types.ObjectId, ref: Collection.Category, required: true },
        brand: { type: Schema.Types.ObjectId, ref: Collection.Brand, required: false },
        subCategory: String,
        size: [String],

        purchasePrice: { type: Number, required: true },
        price: { type: Number, required: true },
        discountPrice: Number,

        stock: { type: Number, required: true, min: 0, default: 0 },



        images: [{ type: String }],

        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);



export const Product = model<IProduct>(Collection.Product, productSchema);