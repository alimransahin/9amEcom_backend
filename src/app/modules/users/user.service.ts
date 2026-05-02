import { apiFeatures, Query } from "../../../lib/apiFeatures";
import { IUser } from "./user.interface";
import { User } from "./user.model";

const getAllUsers = async (query: Query) => {
    const { mongooseQuery, total } = await apiFeatures(User, query);

    const users = await mongooseQuery;

    return {
        data: users,
        total,
    };
};


const updateUser = async (id: string, payload: Partial<IUser>) => {

    // ❗ prevent updating restricted fields
    const restrictedFields = ["password", "role", "isDeleted"];
    restrictedFields.forEach(field => delete (payload as any)[field]);
    console.log(payload)
    const updatedUser = await User.findOneAndUpdate(
        { _id: id, isDeleted: false },
        payload,
        {
            new: true,
            runValidators: true
        }
    );

    return updatedUser;
};


const getSingleUser = async (id: string) => {
    return await User.findById(id);
};

const getMe = async (userId: string) => {
    const user = await User.findOne({
        _id: userId,
        isDeleted: false
    });

    return user;
};

const deleteUser = async (id: string) => {
    return await User.findByIdAndUpdate(id, {
        isDeleted: true
    });
};

export const UserService = {
    getAllUsers,
    getSingleUser,
    deleteUser,
    updateUser,
    getMe
};