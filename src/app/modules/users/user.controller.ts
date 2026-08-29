import { Request, Response } from "express";
import status from "http-status";
import { UserService } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../../errors/AppError";
import { Order } from "../orders/order.model";


// 📋 Get All Users
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    console.log({ query: req.query });

    const { data, total } = await UserService.getAllUsers(req.query);

    // Current page-এর user IDs
    const userIds = data.map((user) => user._id);

    // শুধুমাত্র delivered orders
    const orderStats = await Order.aggregate([
        {
            $match: {
                user: {
                    $in: userIds,
                },
                status: "delivered",
            },
        },
        {
            $group: {
                _id: "$user",

                totalOrders: {
                    $sum: 1,
                },

                totalSpent: {
                    $sum: "$total",
                },
            },
        },
    ]);

    // User ID অনুযায়ী statistics map
    const statsMap = new Map(
        orderStats.map((item) => [
            item._id.toString(),
            {
                totalOrders: item.totalOrders,
                totalSpent: item.totalSpent,
            },
        ])
    );

    // User data-এর সাথে order statistics যোগ
    const usersWithStats = data.map((user) => {
        const stats = statsMap.get(user._id!.toString());

        return {
            ...user,

            totalOrders: stats?.totalOrders ?? 0,
            totalSpent: stats?.totalSpent ?? 0,
        };
    });

    const isEmpty = total === 0;

    sendResponse(res, {
        statusCode: isEmpty
            ? status.NOT_FOUND
            : status.OK,

        success: !isEmpty,

        message: isEmpty
            ? "No users found"
            : "Users retrieved successfully",

        data: usersWithStats,

        // Current page-এর user count
        count: usersWithStats.length,

        // সব matching user-এর total count
        total,
    });
});

// 👤 Get Single User
const getSingleUser = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.getSingleUser(req.params.id as string);

    if (!result) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "User retrieved successfully",
        data: result
    });
});

const getMe = async (req: Request, res: Response) => {
    const userId = req.user.userId;

    const result = await UserService.getMe(userId);
    if (!result) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "User profile fetched successfully",
        data: result
    });
};

const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await UserService.updateUser(id as string, req.body);
    if (!result) {
        throw new AppError(status.NOT_FOUND, "Failed to update user");
    }
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "User updated successfully",
        data: result
    });
};

// 🗑️ Delete User (soft delete recommended in service)
const deleteUser = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.deleteUser(req.params.id as string);

    if (!result) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "User deleted successfully",
        data: result
    });
});

export const UserController = {
    getAllUsers,
    getSingleUser,
    deleteUser,
    updateUser,
    getMe
};