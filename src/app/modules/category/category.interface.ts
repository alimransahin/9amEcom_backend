import { Types } from "mongoose";
import { IUser } from "../users/user.interface";

export interface ICategory {
  userId: Types.ObjectId | IUser;
  name: string;
  slug: string;
  subCategory?: string[];
  description?: string;
  isActive: boolean;
  isDeleted: boolean;
}
