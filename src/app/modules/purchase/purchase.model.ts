import { Schema, model } from "mongoose";
import { IPurchase } from "./purchase.interface";
import { Collection } from "../../utils/modelConstants";

const purchaseItemSchema = new Schema(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: Collection.Product,
            required: true,
        },

        size: {
            type: String,
            required: true,
            trim: true,
        },

        color: {
            type: String,
            trim: true,
        },

        quantity: {
            type: Number,
            required: true,
            min: 1,
        },

        purchasePrice: {
            type: Number,
            required: true,
            min: 0,
        },

        total: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {
        _id: false,
    }
);

const purchaseSchema = new Schema<IPurchase>(
    {
        supplier: {
            type: String,
            trim: true,
        },

        items: {
            type: [purchaseItemSchema],
            required: true,
            validate: {
                validator: function (items: IPurchase["items"]) {
                    return items.length > 0;
                },
                message: "Purchase must contain at least one item",
            },
        },

        subtotal: {
            type: Number,
            required: true,
            min: 0,
        },

        discount: {
            type: Number,
            default: 0,
            min: 0,
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },

        note: {
            type: String,
            trim: true,
        },

        purchaseDate: {
            type: Date,
            default: Date.now,
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

export const Purchase = model<IPurchase>(
    Collection.Purchase,
    purchaseSchema
);