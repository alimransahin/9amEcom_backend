import { Types } from "mongoose";
import { ICategory } from "../category/category.interface";
import { IBrand } from "../brand/brand.interface";
import { ISizeChart } from "../size/size.interface";

export interface IProductVariant {
    size: string;
    color?: string;
    sku?: string;
    stock?: number;
}

export interface IProduct {
    name: string;
    sku?: string;

    description?: string;

    category: Types.ObjectId | ICategory;
    subCategory?: string;

    brand?: Types.ObjectId | IBrand;

    sizeChart?: Types.ObjectId | ISizeChart;

    purchasePrice?: number;
    price: number;

    discountPrice?: number;
    discountPercent?: number;

    variants: IProductVariant[];

    images: string[];

    isActive: boolean;
}