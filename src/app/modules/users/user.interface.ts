import { Types } from "mongoose";

export enum USER_ROLE {
    ADMIN = "admin",
    CUSTOMER = "customer",
    SELLER = "seller"
}
export interface IUser {
    _id?: Types.ObjectId;
    name: string;
    email: string;
    password: string;

    role: USER_ROLE;

    phone?: string;
    address?: string;
    district?: string;
    upazila?: string

    isActive: boolean;
    isVerified: boolean;
    isDeleted: boolean;

    resetPasswordToken?: string;
    resetPasswordExpire?: Date;

    resetOtp?: string;
    resetOtpExpire?: Date;
}