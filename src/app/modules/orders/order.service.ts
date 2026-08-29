import status from "http-status";
import AppError from "../../../errors/AppError";
import { IOrder } from "./order.interface";
import { Order } from "./order.model";
import { Product } from "../product/product.model";
import { apiFeatures } from "../../../lib/apiFeatures";
import { Request } from "express";
import mongoose, { Schema } from "mongoose";
import { User } from "../users/user.model";

// ===============================
// Counter Schema
// ===============================

const counterSchema = new Schema(
    {
        _id: {
            type: String,
            required: true,
        },

        sequence: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

export const Counter = mongoose.model("Counter", counterSchema);

// ===============================
// Generate Order ID
// Format: DDMMYYXXX
// Example: 290826001
// ===============================

const generateOrderId = async (): Promise<string> => {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = String(now.getFullYear()).slice(-2);

    const datePrefix = `${day}${month}${year}`;

    // Separate counter for every day
    const counter = await Counter.findOneAndUpdate(
        {
            _id: `order-${datePrefix}`,
        },
        {
            $inc: {
                sequence: 1,
            },
        },
        {
            new: true,
            upsert: true,
        }
    );

    if (!counter) {
        throw new AppError(
            status.INTERNAL_SERVER_ERROR,
            "Failed to generate order ID"
        );
    }

    // 001, 002, 003...
    const sequence = String(counter.sequence).padStart(3, "0");

    return `${datePrefix}${sequence}`;
};

export default generateOrderId;

// ===============================
// Create Order
// ===============================

const createOrder = async (
    payload: IOrder,
    userId?: string
) => {
    const {
        name,
        address,
        district,
        upazila,
        phone,
        email,
        items,
    } = payload;

    // ===============================
    // Empty Cart Check
    // ===============================

    if (!items?.length) {
        throw new AppError(
            status.BAD_REQUEST,
            "Cart cannot be empty"
        );
    }

    // ===============================
    // Generate Order ID
    // ===============================

    const orderId = await generateOrderId();

    const orderItems = [];

    let subtotal = 0;

    // ===============================
    // Validate Products
    // ===============================

    for (const item of items) {
        if (!item.quantity || item.quantity < 1) {
            throw new AppError(
                status.BAD_REQUEST,
                "Invalid product quantity"
            );
        }

        const product = await Product.findById(
            item.product
        );

        if (!product) {
            throw new AppError(
                status.NOT_FOUND,
                `Product not found: ${item.product}`
            );
        }

        if (!product.isActive) {
            throw new AppError(
                status.BAD_REQUEST,
                `${product.name} is currently unavailable`
            );
        }

        const price = product.price;
        const itemTotal = price * item.quantity;

        subtotal += itemTotal;

        orderItems.push({
            product: product._id,
            name: product.name,
            image: product.images?.[0],
            price,
            quantity: item.quantity,
            color: item.color,
            size: item.size,
        });
    }

    // ===============================
    // Calculate Total
    // ===============================

    const shipping = 0;
    const total = subtotal + shipping;

    // ===============================
    // Prepare Order
    // ===============================

    const orderData: Partial<IOrder> = {
        orderId,
        name,
        address,
        district,
        upazila,
        phone,
        email,

        items: orderItems,

        subtotal,
        shipping,
        total,

        status: "pending",

        ...(userId && {
            user: userId,
        }),
    };

    // ===============================
    // Update User Address
    // ===============================

    if (userId) {
        await User.findByIdAndUpdate(
            userId,
            {
                address,
                district,
                upazila,
            },
            {
                new: true,
            }
        );
    }

    // ===============================
    // Create Order
    // ===============================

    const result = await Order.create(orderData);

    return result;
};


// ===============================
// Get My Orders
// ===============================

const getMyOrders = async (
    userId: string
) => {

    const result = await Order.find({
        user: userId,
    })
        .populate("items.product")
        .sort({
            createdAt: -1,
        });

    return result;
};


// ===============================
// Get All Orders
// ===============================

const getAllOrders = async (
    req: Request
) => {

    const {
        mongooseQuery,
        total,
    } = await apiFeatures(
        Order,
        req.query
    );

    const result =
        await mongooseQuery
            .populate("user")
            .populate("items.product");

    return {
        result,
        total,
    };
};


// ===============================
// Get Single Order
// ===============================

const getSingleOrder = async (
    id: string,
    userId?: string,
    role?: string
) => {

    const query: any = {
        _id: id,
    };


    // Customer can see only own order
    if (role === "customer") {
        query.user = userId;
    }


    const result =
        await Order.findOne(query)
            .populate("user")
            .populate("items.product");


    return result;
};


// ===============================
// Update Order
// ===============================

const updateOrder = async (
    id: string,
    payload: Partial<IOrder>
) => {

    const result =
        await Order.findByIdAndUpdate(
            id,
            payload,
            {
                new: true,
                runValidators: true,
            }
        );

    return result;
};


// ===============================
// Delete Order
// ===============================

const deleteOrder = async (
    id: string
) => {

    const result =
        await Order.findByIdAndDelete(id);

    return result;
};


export const OrderService = {
    createOrder,
    getMyOrders,
    getAllOrders,
    getSingleOrder,
    updateOrder,
    deleteOrder,
};