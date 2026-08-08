import { Types } from "mongoose";
import { IUser } from "../users/user.interface";

export interface ICategory {
  userId: Types.ObjectId | IUser;

  name: string;

  slug: string;

  parent?: Types.ObjectId | ICategory | null;

  image: string;

  description?: string;

  isActive: boolean;

  isDeleted: boolean;
}

export interface ICategoryHierarchy {
  name: string;
  parent: Types.ObjectId | null;
}