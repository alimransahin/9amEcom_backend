import { Types } from "mongoose";
import { apiFeatures, Query } from "../../../lib/apiFeatures";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import { Role } from "../role/role.model";


// ===============================
// Populate Role Name Safely
// ===============================
const populateRoleSafely = async (user: any) => {
    if (
        user.roleName &&
        Types.ObjectId.isValid(user.roleName)
    ) {
        const role = await Role.findById(
            user.roleName
        ).lean();

        return {
            ...user,
            roleName: role ?? user.roleName,
        };
    }

    // Old data যেমন "Manager" হলে
    // আগের data unchanged থাকবে
    return user;
};


// ===============================
// Get All Users
// ===============================
const getAllUsers = async (query: Query) => {
    const { mongooseQuery, total } =
        await apiFeatures(User, query);

    const users = await mongooseQuery.lean();

    const populatedUsers = await Promise.all(
        users.map((user: any) =>
            populateRoleSafely(user)
        )
    );

    return {
        data: populatedUsers,
        total,
    };
};


// ===============================
// Update User
// ===============================
const updateUser = async (
    id: string,
    payload: Partial<IUser>
) => {

    // Prevent restricted fields
    const restrictedFields = [
        "password",
        "role",
        "isDeleted"
    ];

    restrictedFields.forEach((field) => {
        delete (payload as any)[field];
    });

    const updatedUser = await User.findOneAndUpdate(
        {
            _id: id,
            isDeleted: false
        },
        payload,
        {
            new: true,
            runValidators: true
        }
    );

    return updatedUser;
};


// ===============================
// Get Single User
// ===============================
const getSingleUser = async (id: string) => {
    const user = await User.findOne({
        _id: id,
        isDeleted: false
    }).lean();

    if (!user) {
        return null;
    }

    return await populateRoleSafely(user);
};


// ===============================
// Get Me
// ===============================
const getMe = async (userId: string) => {

    const user = await User.findOne({
        _id: userId,
        isDeleted: false
    }).lean();

    if (!user) {
        return null;
    }

    return await populateRoleSafely(user);
};


// ===============================
// Delete User
// ===============================
const deleteUser = async (id: string) => {
    return await User.findOneAndUpdate(
        {
            _id: id,
            isDeleted: false
        },
        {
            $set: {
                isDeleted: true
            }
        },
        {
            new: true
        }
    );
};


export const UserService = {
    getAllUsers,
    getSingleUser,
    deleteUser,
    updateUser,
    getMe
};