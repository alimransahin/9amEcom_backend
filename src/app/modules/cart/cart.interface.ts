import { Types } from "mongoose";
import { IUser } from "../users/user.interface";

export interface ICart {
    user: string | IUser;
    product: Types.ObjectId;
    color?: string;
    size?: string;
    quantity: number;
    price: number;
}