import { Types } from "mongoose";

export interface ICart {
    user: Types.ObjectId;
    product: Types.ObjectId;
    color?: string;
    size?: string;
    quantity: number;
    price: number;
}