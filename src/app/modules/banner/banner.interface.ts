
import { Types } from "mongoose";
import { IUser } from "../users/user.interface";

export interface IBanner {
    userId: Types.ObjectId | IUser;

    title: string;

    subtitle?: string;

    productUrl?: string;

    image: string;

    isActive: boolean;

    isDeleted: boolean;
}
