import { Types } from "mongoose";

export interface IAd {
    image: string;
    category: Types.ObjectId;
    productUrl?: string;
    isActive: boolean;
    isDeleted: boolean
}