import { Request, Response } from "express";
import httpStatus from "http-status";
import { OrderService } from "./order.service";

const createOrder = async (
    req: Request,
    res: Response
) => {
    try {
        const result = await OrderService.createOrder(req.body);

        res.status(httpStatus.CREATED).json({
            success: true,
            message: "Order created successfully",
            data: result,
        });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to create order",
            error,
        });
    }
};


const getAllOrders = async (
    req: Request,
    res: Response
) => {
    try {
        // Pass req for apiFeatures
        const { result, total } =
            await OrderService.getAllOrders(req);

        res.status(httpStatus.OK).json({
            success: true,
            message: "Orders retrieved successfully",
            total,
            data: result,
        });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to retrieve orders",
            error,
        });
    }
};


const getSingleOrder = async (
    req: Request,
    res: Response
) => {
    try {
        const result = await OrderService.getSingleOrder(
            req.params.id as string
        );

        if (!result) {
            return res.status(httpStatus.NOT_FOUND).json({
                success: false,
                message: "Order not found",
            });
        }

        res.status(httpStatus.OK).json({
            success: true,
            message: "Order retrieved successfully",
            data: result,
        });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to retrieve order",
            error,
        });
    }
};


const updateOrder = async (
    req: Request,
    res: Response
) => {
    try {
        const result = await OrderService.updateOrder(
            req.params.id as string,
            req.body
        );

        if (!result) {
            return res.status(httpStatus.NOT_FOUND).json({
                success: false,
                message: "Order not found",
            });
        }

        res.status(httpStatus.OK).json({
            success: true,
            message: "Order updated successfully",
            data: result,
        });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to update order",
            error,
        });
    }
};


const deleteOrder = async (
    req: Request,
    res: Response
) => {
    try {
        const result = await OrderService.deleteOrder(
            req.params.id as string
        );

        if (!result) {
            return res.status(httpStatus.NOT_FOUND).json({
                success: false,
                message: "Order not found",
            });
        }

        res.status(httpStatus.OK).json({
            success: true,
            message: "Order deleted successfully",
            data: null,
        });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to delete order",
            error,
        });
    }
};


export const OrderController = {
    createOrder,
    getAllOrders,
    getSingleOrder,
    updateOrder,
    deleteOrder,
};