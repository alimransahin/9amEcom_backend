import { Types } from "mongoose";
import { IUser } from "../users/user.interface";
import { IProduct } from "../product/product.interface";

export interface ICategory {
  userId: Types.ObjectId | IUser;
  name: string;
  slug: string;
  subCategory?: string[];
  description?: string;
  featuredProduct?: Types.ObjectId | IProduct;
  isActive: boolean;
  isDeleted: boolean;
}
