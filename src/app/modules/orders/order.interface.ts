import { Types } from "mongoose";

export type IOrderStatus =
    | "pending"
    | "processing"
    | "shipping"
    | "delivered"
    | "cancelled";

export interface IOrderShipping {
    courier: "steadfast";
    consignmentId?: number;
    trackingCode?: string;
    status?: string;
    createdAt?: Date;
}
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
    orderId: string;

    name: string;

    address: string;
    district: string;
    upazila: string;

    phone: string;
    email?: string;

    items: IOrderItem[];
    shippingInfo: IOrderShipping
    subtotal: number;
    shipping: number;
    total: number;

    status?: IOrderStatus;

    createdAt?: Date;
    updatedAt?: Date;
}