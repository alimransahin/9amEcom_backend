import { IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: IUser) => {
    const result = await User.create(payload);
    return result;
};

const getAllUsers = async () => {
    return await User.find({ isDeleted: false });
};

const getSingleUser = async (id: string) => {
    return await User.findById(id);
};

const deleteUser = async (id: string) => {
    return await User.findByIdAndUpdate(id, {
        isDeleted: true
    });
};

export const UserService = {
    createUser,
    getAllUsers,
    getSingleUser,
    deleteUser
};