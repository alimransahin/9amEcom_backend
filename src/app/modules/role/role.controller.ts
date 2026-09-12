import { status } from "http-status";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

import AppError from "../../../errors/AppError";

import { roleService } from "./role.service";

// =====================================================
// Create Role
// =====================================================

const createRole = catchAsync(
    async (req, res) => {

        const roleInfo = req.body;

        const result =
            await roleService.createRoleIntoDB(
                roleInfo
            );

        if (!result) {
            throw new AppError(
                status.NOT_FOUND,
                "Failed to Create Role"
            );
        }

        sendResponse(res, {
            statusCode: status.CREATED,
            success: true,
            message: "Role created successfully",
            data: result,
        });
    }
);

// =====================================================
// Get All Roles
// =====================================================

const getAllRole = catchAsync(
    async (req, res) => {

        const {
            result,
            total,
        } =
            await roleService.getAllRoleFromDB(
                req
            );

        if (!result) {
            throw new AppError(
                status.NOT_FOUND,
                "No Roles found"
            );
        }

        sendResponse(res, {
            statusCode: status.OK,
            total,
            count: result.length,
            success: true,
            message:
                "All role information retrieved successfully",
            data: result,
        });
    }
);

// =====================================================
// Get Single Role
// =====================================================

const getSingleRole = catchAsync(
    async (req, res) => {

        const { id } = req.params;

        const result =
            await roleService.getSingleRole(
                id as string
            );

        if (!result) {
            throw new AppError(
                status.NOT_FOUND,
                "Role not found"
            );
        }

        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message:
                "Role information retrieved successfully",
            data: result,
        });
    }
);

// =====================================================
// Update Role
// =====================================================

const updateRole = catchAsync(
    async (req, res) => {

        const { id } = req.params;

        const roleInfo = req.body;

        const existing =
            await roleService.getSingleRole(
                id as string
            );

        if (!existing) {
            throw new AppError(
                status.NOT_FOUND,
                "Role not found"
            );
        }

        const result =
            await roleService.updateRoleInDB(
                id as string,
                roleInfo
            );

        if (!result) {
            throw new AppError(
                status.NOT_FOUND,
                "Failed to Update Role"
            );
        }

        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message: "Role updated successfully",
            data: result,
        });
    }
);

// =====================================================
// Delete Role
// =====================================================

const deleteRole = catchAsync(
    async (req, res) => {

        const { id } = req.params;

        const existing =
            await roleService.getSingleRole(
                id as string
            );

        if (!existing) {
            throw new AppError(
                status.NOT_FOUND,
                "Role not found"
            );
        }

        const result =
            await roleService.deleteRoleFromDB(
                id as string
            );

        if (!result) {
            throw new AppError(
                status.NOT_FOUND,
                "Failed to Delete Role"
            );
        }

        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message:
                "Role deleted successfully",
            data: result,
        });
    }
);

export const roleController = {
    createRole,
    getAllRole,
    getSingleRole,
    updateRole,
    deleteRole,
};