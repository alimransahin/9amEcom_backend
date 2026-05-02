import { Types } from "mongoose";
import { IUser } from "../users/user.interface";

export interface IBrand {
  userId: Types.ObjectId | IUser;
  name: string;
  image?: string;
  description?: string;
  website?: string;
  isActive: boolean;
  isDeleted: boolean;
}
