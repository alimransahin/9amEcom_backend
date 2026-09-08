import { Request } from "express";
import mongoose from "mongoose";

import { Purchase } from "./purchase.model";
import { Product } from "../product/product.model";
import { IPurchase } from "./purchase.interface";
import { apiFeatures } from "../../../lib/apiFeatures";

const createPurchase = async (
    payload: IPurchase
) => {
    const session =
        await mongoose.startSession();

    session.startTransaction();

    try {
        let subtotal = 0;

        const purchaseItems = [];

        for (const item of payload.items) {

            const product =
                await Product.findById(
                    item.product
                ).session(session);

            if (!product) {
                throw new Error(
                    "Product not found"
                );
            }

            if (!product.isActive) {
                throw new Error(
                    `Product "${product.name}" is inactive`
                );
            }

            // Find selected variant
            const variantIndex =
                product.variants.findIndex(
                    (variant) =>
                        variant.size === item.size &&
                        (variant.color || "") ===
                        (item.color || "")
                );

            if (variantIndex === -1) {
                throw new Error(
                    `Variant not found for ${product.name} - ${item.size}${item.color ? ` / ${item.color}` : ""}`
                );
            }

            const itemTotal =
                item.quantity *
                item.purchasePrice;

            subtotal += itemTotal;

            purchaseItems.push({
                product: item.product,
                size: item.size,
                color: item.color,
                quantity: item.quantity,
                purchasePrice:
                    item.purchasePrice,
                total: itemTotal,
            });

            // Increase variant stock
            product.variants[
                variantIndex
            ].stock += item.quantity;

            await product.save({
                session,
            });
        }

        const discount =
            payload.discount || 0;

        if (discount > subtotal) {
            throw new Error(
                "Discount cannot exceed subtotal"
            );
        }

        const totalAmount =
            subtotal - discount;

        const purchaseData = {
            supplier: payload.supplier,
            items: purchaseItems,
            subtotal,
            discount,
            totalAmount,
            note: payload.note,
            purchaseDate:
                payload.purchaseDate ||
                new Date(),
        };

        const [result] =
            await Purchase.create(
                [purchaseData],
                { session }
            );

        await session.commitTransaction();
        session.endSession();

        return result;

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        throw error;
    }
};

const getAllPurchases = async (
    req: Request
) => {
    const {
        mongooseQuery,
        total,
    } = await apiFeatures(
        Purchase,
        req.query
    );

    const result =
        await mongooseQuery
            .populate({
                path: "items.product",
                populate: [
                    {
                        path: "category",
                    },
                    {
                        path: "brand",
                    },
                ],
            })
            .sort({
                createdAt: -1,
            });

    return {
        result,
        total,
    };
};

const getSinglePurchase = async (
    id: string
) => {
    return await Purchase.findById(id)
        .populate({
            path: "items.product",
            populate: [
                {
                    path: "category",
                },
                {
                    path: "brand",
                },
            ],
        });
};

const deletePurchase = async (
    id: string
) => {
    return await Purchase.findOneAndUpdate(
        {
            _id: id,
            isDeleted: false,
        },
        {
            $set: {
                isDeleted: true,
            },
        },
        {
            new: true,
        }
    );
};

export const PurchaseService = {
    createPurchase,
    getAllPurchases,
    getSinglePurchase,
    deletePurchase,
};