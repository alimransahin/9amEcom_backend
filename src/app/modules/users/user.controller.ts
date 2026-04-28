import { Request, Response } from "express";
import status from "http-status";
import { UserService } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../middlewares/AppError";

// ➕ Create User
const createUser = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createUser(req.body);

    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: "User created successfully",
        data: result
    });
});

// 📋 Get All Users
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.getAllUsers();

    const isEmpty = !result || result.length === 0;

    sendResponse(res, {
        statusCode: isEmpty ? status.NOT_FOUND : status.OK,
        success: !isEmpty,
        message: isEmpty ? "No users found" : "Users retrieved successfully",
        data: result || []
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
    createUser,
    getAllUsers,
    getSingleUser,
    deleteUser
};