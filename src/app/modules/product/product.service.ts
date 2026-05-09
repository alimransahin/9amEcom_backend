// product.service.ts

import { Request } from "express";
import { IProduct } from "./product.interface";
import { Product } from "./product.model";
import { apiFeatures } from "../../../lib/apiFeatures";

const createProduct = async (payload: IProduct) => {
  // trim name
  payload.name = payload.name.trim();

  // check existing product
  const existingProduct = await Product.findOne({
    name: payload.name,
    isDeleted: false,
  });

  if (existingProduct) {
    throw new Error("Product with this name already exists");
  }

  // create product
  const result = await Product.create(payload);

  return result;
};

const getAllProducts = async (req: Request) => {
  const { mongooseQuery, total } = await apiFeatures(
    Product,
    req.query
  );

  const result = await mongooseQuery
    .populate("category")
    .sort({ createdAt: -1 });

  return { result, total };
};

const getSingleProduct = async (id: string) => {
  return await Product.findOne({
    _id: id,
    isDeleted: false,
  }).populate("category");
};

const updateProduct = async (
  id: string,
  payload: Partial<IProduct>
) => {
  // trim name if exists
  if (payload.name) {
    payload.name = payload.name.trim();
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    { $set: payload },
    {
      new: true,
      runValidators: true,
    }
  ).populate("category");

  return updatedProduct;
};

const deleteProduct = async (id: string) => {
  // soft delete
  const result = await Product.findOneAndUpdate(
    { _id: id },
    { $set: { isDeleted: true } },
    { new: true }
  );

  return result;
};

export const ProductService = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};