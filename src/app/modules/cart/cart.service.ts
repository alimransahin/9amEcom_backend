import { Request } from "express";
import { ICart } from "./cart.interface";
import { Cart } from "./cart.model";
import { apiFeatures } from "../../../lib/apiFeatures";

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
    const { mongooseQuery, total } = await apiFeatures(
        Cart.find({ user: userId }).populate("product"),
        req.query
    );

    const result = await mongooseQuery;

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
    items: Partial<ICart>[]
) => {
    for (const item of items) {
        const existing = await Cart.findOne({
            user: userId,
            product: item.product,
            color: item.color || "",
            size: item.size || "",
        });

        if (existing) {
            existing.quantity += item.quantity || 1;
            await existing.save();
        } else {
            await Cart.create({
                user: userId,
                product: item.product,
                color: item.color || "",
                size: item.size || "",
                quantity: item.quantity || 1,
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