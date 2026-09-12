import { Request } from "express";

import { Role } from "./role.model";
import { IRole } from "./role.interface";

import { apiFeatures } from "../../../lib/apiFeatures";

// =====================================================
// Create Role
// =====================================================

const createRoleIntoDB = async (
    roleInfo: IRole
) => {
    const result = await Role.create(
        roleInfo
    );

    return result;
};

// =====================================================
// Get Single Role
// =====================================================

const getSingleRole = async (
    id: string
) => {
    const result = await Role.findOne({
        _id: id,
        isDeleted: false,
    });

    return result;
};

// =====================================================
// Get All Roles
// =====================================================

const getAllRoleFromDB = async (
    req: Request
) => {
    const { mongooseQuery, total } =
        await apiFeatures(
            Role,
            req.query
        );

    const result =
        await mongooseQuery;

    return {
        result,
        total,
    };
};

// =====================================================
// Update Role
// =====================================================

const updateRoleInDB = async (
    id: string,
    roleInfo: Partial<IRole>
) => {
    const result =
        await Role.findOneAndUpdate(
            {
                _id: id,
                isDeleted: false,
            },
            {
                $set: roleInfo,
            },
            {
                new: true,
                runValidators: true,
            }
        );

    return result;
};

// =====================================================
// Delete Role
// =====================================================

const deleteRoleFromDB = async (
    id: string
) => {
    const result =
        await Role.findOneAndUpdate(
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

    return result;
};

export const roleService = {
    createRoleIntoDB,
    getSingleRole,
    getAllRoleFromDB,
    updateRoleInDB,
    deleteRoleFromDB,
};