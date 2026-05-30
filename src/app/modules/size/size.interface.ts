import { Types } from "mongoose";
import { IUser } from "../users/user.interface";


export interface ISizeChartMeasurement {
  size: string;

  values: Record<string, string | number>;
}

export interface ISizeChart {
  userId: Types.ObjectId | IUser;
  title: string;
  unit: "inch" | "cm";
  columns: string[];
  measurements: ISizeChartMeasurement[];
  isActive: boolean;
  isDeleted: boolean;
}