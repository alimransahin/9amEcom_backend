import { Request } from "express";
import { ICart } from "./cart.interface";
import { Cart } from "./cart.model";
import { apiFeatures } from "../../../lib/apiFeatures";
import { Types } from "mongoose";

interface IMergeCartItem {
    product?: {
        _id: Types.ObjectId | string;
        price?: number;
        discountPrice?: number;
    };

    color?: string;
    size?: string;
    quantity?: number;
}

const addToCartIntoDB = async (
    userId: string,
    payload: Partial<ICart>
) => {
    const existing = await Cart.findOne({
        user: userId,
        product: payload.product,
        color: payload.color || "",
        size: payload.size || "",
    });

    if (existing) {
        existing.quantity += payload.quantity || 1;
        return await existing.save();
    }

    return await Cart.create({
        ...payload,
        user: userId,
    });
};

const getCartFromDB = async (req: Request, userId: string) => {
    const query = {
        ...req.query,
        "_filter[user]": userId,
    };

    const { mongooseQuery, total } = await apiFeatures(
        Cart,
        query as any
    );

    const result = await mongooseQuery.populate("product");

    return {
        result,
        total,
    };
};

const updateCartInDB = async (
    userId: string,
    id: string,
    quantity: number
) => {
    return await Cart.findOneAndUpdate(
        {
            _id: id,
            user: userId,
        },
        {
            $set: {
                quantity,
            },
        },
        {
            new: true,
        }
    );
};

const removeCartItemFromDB = async (
    userId: string,
    id: string
) => {
    return await Cart.findOneAndDelete({
        _id: id,
        user: userId,
    });
};

const clearCartFromDB = async (userId: string) => {
    return await Cart.deleteMany({
        user: userId,
    });
};

const mergeCartIntoDB = async (
    userId: string,
    items: IMergeCartItem[]
) => {
    console.log({ items });

    if (!items || items.length === 0) {
        return true;
    }

    for (const item of items) {

        const productId = item.product?._id;

        if (!productId) {
            continue;
        }

        const existing = await Cart.findOne({
            user: userId,
            product: productId,
            color: item.color || "",
            size: item.size || "",
        });

        if (existing) {

            existing.quantity +=
                item.quantity || 1;

            await existing.save();

        } else {

            await Cart.create({
                user: userId,
                product: productId,
                color: item.color || "",
                size: item.size || "",
                quantity: item.quantity || 1,

                price:
                    item.product?.discountPrice ??
                    item.product?.price ??
                    0,
            });
        }
    }

    return true;
};

export const cartService = {
    addToCartIntoDB,
    getCartFromDB,
    updateCartInDB,
    removeCartItemFromDB,
    clearCartFromDB,
    mergeCartIntoDB,
};