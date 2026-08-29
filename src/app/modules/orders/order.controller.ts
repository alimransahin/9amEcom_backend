import { Request, Response } from "express";
import { status } from "http-status";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import AppError from "../../../errors/AppError";

import { OrderService } from "./order.service";


// ===============================
// Create Order
// ===============================

const createOrder = catchAsync(
    async (req: Request, res: Response) => {

        const userId =
            req.user?.userId?.toString();

        const result =
            await OrderService.createOrder(
                req.body,
                userId
            );

        sendResponse(res, {
            statusCode: status.CREATED,
            success: true,
            message: "Order created successfully",
            data: result,
        });
    }
);

// ===============================
// Get My Orders
// ===============================

const getMyOrders = catchAsync(
    async (req: Request, res: Response) => {

        const userId = req.user?.userId?.toString();

        if (!userId) {
            throw new AppError(
                status.UNAUTHORIZED,
                "You must be logged in"
            );
        }

        const result =
            await OrderService.getMyOrders(userId);

        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message: "My orders retrieved successfully",
            data: result,
        });
    }
);

// ===============================
// Get All Orders
// ===============================

const getAllOrders = catchAsync(
    async (req: Request, res: Response) => {

        const {
            result,
            total,
        } = await OrderService.getAllOrders(req);

        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message: "Orders retrieved successfully",
            data: result,
            total,
        });
    }
);


// ===============================
// Get Single Order
// ===============================

const getSingleOrder = catchAsync(
    async (req: Request, res: Response) => {

        const userId =
            req.user?._id?.toString();

        const role =
            req.user?.role;

        const result =
            await OrderService.getSingleOrder(
                req.params.id as string,
                userId,
                role
            );

        if (!result) {
            throw new AppError(
                status.NOT_FOUND,
                "Order not found"
            );
        }

        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message: "Order retrieved successfully",
            data: result,
        });
    }
);


// ===============================
// Update Order
// ===============================

const updateOrder = catchAsync(
    async (req: Request, res: Response) => {

        const result =
            await OrderService.updateOrder(
                req.params.id as string,
                req.body
            );

        if (!result) {
            throw new AppError(
                status.NOT_FOUND,
                "Order not found"
            );
        }

        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message: "Order updated successfully",
            data: result,
        });
    }
);


// ===============================
// Delete Order
// ===============================

const deleteOrder = catchAsync(
    async (req: Request, res: Response) => {

        const result =
            await OrderService.deleteOrder(
                req.params.id as string
            );

        if (!result) {
            throw new AppError(
                status.NOT_FOUND,
                "Order not found"
            );
        }

        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message: "Order deleted successfully",
            data: null,
        });
    }
);


export const OrderController = {
    createOrder,
    getMyOrders,
    getAllOrders,
    getSingleOrder,
    updateOrder,
    deleteOrder,
};