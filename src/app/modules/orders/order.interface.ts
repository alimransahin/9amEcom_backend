import { Types } from "mongoose";

export interface IOrderItem {
    product: Types.ObjectId | string;

    name?: string;
    image?: string;

    price: number;
    quantity: number;

    color?: string;
    size?: string;
}

export interface IOrder {
    user?: Types.ObjectId | string;
    orderId?: string;

    name: string;

    address: string;
    district: string;
    upazila: string;

    phone: string;
    email?: string;

    items: IOrderItem[];

    subtotal: number;
    shipping: number;
    total: number;

    status?: "pending" | "processing" | "shipping" | "delivered" | "cancelled";

    createdAt?: Date;
    updatedAt?: Date;
}