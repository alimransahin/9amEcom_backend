// product.interface.ts

import { Types } from "mongoose";
import { ICategory } from "../category/category.interface";
import { IBrand } from "../brand/brand.interface";


export type IProduct = {
    name: string;
    sku?: string;

    description?: string;
    category: Types.ObjectId | ICategory;
    brand?: Types.ObjectId | IBrand;
    subCategory?: string;
    size?: string[];

    purchasePrice: number;
    price: number;
    discountPrice?: number;

    stock: number;

    images: string[];

    isActive: boolean;
};