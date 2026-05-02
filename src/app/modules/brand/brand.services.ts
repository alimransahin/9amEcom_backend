import { Connection } from "mongoose";
import { IBrand } from "./brand.interface";
import { Brand } from "./brand.model";
import { apiFeatures } from "../../../lib/apiFeatures";
import { Request } from "express";

const createBrandIntoDB = async (payload: IBrand) => {
  // Trim spaces
  payload.name = payload.name.trim();


  // Check if brand already exists
  const existingBrand = await Brand.findOne({ name: payload.name });
  if (existingBrand) {
    throw new Error("Brand with this name already exists");
  }

  // Create new brand
  const newBrand = await Brand.create(payload);
  return newBrand;
};

const updateBrandInDB = async (
  id: string,
  payload: Partial<IBrand>
) => {

  const updatedBrand = await Brand.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true }
  );
  return updatedBrand;
};

const getAllBrandFromDB = async (req: Request) => {


  const { mongooseQuery, total } = await apiFeatures(Brand, req.query);

  const result = await mongooseQuery;

  return { result, total }
};


const getSingleBrand = async (id: string) => {
  return await Brand.findOne({ _id: id, isDeleted: false });
};



const deleteBrandFromDB = async (id: string) => {

  // Find the Customer by ID and mark as deleted or remove entirely
  const result = await Brand.findOneAndUpdate(
    { _id: id },
    { $set: { isDeleted: true } },
    { new: true }
  );

  return result;
};

export const brandService = {
  createBrandIntoDB,
  updateBrandInDB,
  getAllBrandFromDB,
  deleteBrandFromDB,
  getSingleBrand
};
