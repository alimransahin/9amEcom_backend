import { Schema, model } from "mongoose";
import { IOrder, IOrderItem } from "./order.interface";
import { customTransform } from "../../../lib/customTransform";

const orderItemSchema = new Schema<IOrderItem>(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },

        name: {
            type: String,
        },

        image: {
            type: String,
        },

        price: {
            type: Number,
            required: true,
        },

        quantity: {
            type: Number,
            required: true,
            min: 1,
        },

        color: {
            type: String,
        },

        size: {
            type: String,
        },
    },
    {
        _id: false,
    }
);

const orderSchema = new Schema<IOrder>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

        orderId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        address: {
            type: String,
            required: true,
            trim: true,
        },

        district: {
            type: String,
            required: true,
        },

        upazila: {
            type: String,
            required: true,
        },

        phone: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            trim: true,
        },

        items: {
            type: [orderItemSchema],
            required: true,
        },

        subtotal: {
            type: Number,
            required: true,
            min: 0,
        },

        shipping: {
            type: Number,
            required: true,
            min: 0,
        },

        total: {
            type: Number,
            required: true,
            min: 0,
        },

        status: {
            type: String,
            enum: [
                "pending",
                "processing",
                "shipping",
                "delivered",
                "cancelled",
            ],
            default: "pending",
        },
    },
    {
        timestamps: true,

        toJSON: {
            transform(_doc, ret, _options) {

                // Order items image transform
                if (ret.items && Array.isArray(ret.items)) {
                    ret.items = ret.items.map((item: any) => {

                        if (item.image) {
                            customTransform(item, ["image"]);
                        }

                        return item;
                    });
                }

                return ret;
            },
        },
    }
);

export const Order = model<IOrder>("Order", orderSchema);