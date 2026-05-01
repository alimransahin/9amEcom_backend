import { Schema, model } from "mongoose";
import { IUser, USER_ROLE } from "./user.interface";

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, select: false },

        role: {
            type: String,
            enum: Object.values(USER_ROLE),
            default: USER_ROLE.CUSTOMER
        },

        phone: String,
        address: String,

        isActive: { type: Boolean, default: true },
        isVerified: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },

        resetPasswordToken: String,
        resetPasswordExpire: Date,

        resetOtp: String,
        resetOtpExpire: Date,
    },
    {
        timestamps: true
    }
);

export const User = model<IUser>("User", userSchema);