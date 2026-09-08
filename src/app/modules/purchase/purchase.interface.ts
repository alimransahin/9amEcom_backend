import { Types } from "mongoose";

export interface IPurchaseItem {
    product: Types.ObjectId;

    size: string;
    color?: string;

    quantity: number;
    purchasePrice: number;

    total: number;
}

export interface IPurchase {
    supplier?: string;
    invoice?: string;
    items: IPurchaseItem[];

    subtotal: number;
    discount?: number;
    totalAmount: number;

    note?: string;

    purchaseDate?: Date;

    isDeleted?: boolean;
}