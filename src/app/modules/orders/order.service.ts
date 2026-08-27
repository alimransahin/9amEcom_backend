import status from "http-status";
import AppError from "../../../errors/AppError";
import { IOrder } from "./order.interface";
import { Order } from "./order.model";
import { Product } from "../product/product.model";
import { apiFeatures } from "../../../lib/apiFeatures";
import { Request } from "express";

const createOrder = async (payload: IOrder) => {
    const {
        firstName,
        lastName,
        address,
        district,
        upazila,
        mobile,
        email,
        items,
    } = payload;

    // Empty cart check
    if (!items || items.length === 0) {
        throw new AppError(
            status.BAD_REQUEST,
            "Cart cannot be empty"
        );
    }

    const orderItems = [];

    let subtotal = 0;

    // Calculate every item from database
    for (const item of items) {

        const product = await Product.findById(
            item.product
        );

        if (!product) {
            throw new AppError(
                status.NOT_FOUND,
                `Product not found: ${item.product}`
            );
        }

        // Optional: Check product active status
        if (!product.isActive) {
            throw new AppError(
                status.BAD_REQUEST,
                `${product.name} is currently unavailable`
            );
        }

        // Database price
        const price = product.price;

        // Calculate item total
        const itemTotal =
            price * item.quantity;

        // Add to subtotal
        subtotal += itemTotal;

        // Create order item from database
        orderItems.push({
            product: product._id,

            name: product.name,

            image: product.images[0],

            price,

            quantity: item.quantity,

            color: item.color,

            size: item.size,
        });
    }

    // Shipping calculation
    const shipping = 0;
    // Final total
    const total = subtotal + shipping;

    // Create order
    const result = await Order.create({
        firstName,
        lastName,
        address,
        district,
        upazila,
        mobile,
        email,

        items: orderItems,

        subtotal,
        shipping,
        total,

        status: "pending",
    });

    return result;
};


const getAllOrders = async (req: Request) => {
    const { mongooseQuery, total } = await apiFeatures(
        Order,
        req.query
    );

    const result = await mongooseQuery
        .populate("user")
        .populate("items.product");

    return {
        result,
        total,
    };
};


const getSingleOrder = async (id: string) => {
    const result = await Order.findById(id)
        .populate("user")
        .populate("items.product");

    return result;
};


const updateOrder = async (
    id: string,
    payload: Partial<IOrder>
) => {
    const result = await Order.findByIdAndUpdate(
        id,
        payload,
        {
            new: true,
            runValidators: true,
        }
    );

    return result;
};


const deleteOrder = async (id: string) => {
    const result = await Order.findByIdAndDelete(id);

    return result;
};


export const OrderService = {
    createOrder,
    getAllOrders,
    getSingleOrder,
    updateOrder,
    deleteOrder,
};