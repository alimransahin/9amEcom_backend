import { Schema, model } from "mongoose";
import { ICart } from "./cart.interface";
import { Collection } from "../../utils/modelConstants";

const cartSchema = new Schema<ICart>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        color: {
            type: String,
            default: "",
        },
        size: {
            type: String,
            default: "",
        },
        quantity: {
            type: Number,
            required: true,
            default: 1,
            min: 1,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

cartSchema.index(
    {
        user: 1,
        product: 1,
        color: 1,
        size: 1,
    },
    {
        unique: true,
    }
);

export const Cart = model<ICart>(Collection.Cart, cartSchema);