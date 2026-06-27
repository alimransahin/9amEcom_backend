// product.controller.ts

import { Request, Response } from "express";
import { status } from "http-status";
import fs from "fs";
import path from "path";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import AppError from "../../../errors/AppError";

import { ProductService } from "./product.service";

// create product
const createProduct = catchAsync(async (req: Request, res: Response) => {
  const productInfo = req.body;

  // multiple image upload
  if (req.files && Array.isArray(req.files)) {
    productInfo.images = req.files.map(
      (file: Express.Multer.File) =>
        `/uploads/products/${file.filename}`
    );
  }

  const result = await ProductService.createProduct(productInfo);

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Failed to create product");
  }

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Product created successfully",
    data: result,
  });
});

// get all products
const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const { result, total } = await ProductService.getAllProducts(req);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Products retrieved successfully",
    data: result,
    total,
  });
});

// get single product
const getSingleProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.getSingleProduct(req.params.id as string);
  console.log({ result, id: req.params.id })
  if (!result) {
    throw new AppError(status.NOT_FOUND, "Product not found");
  }

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Product retrieved successfully",
    data: result,
  });
});

// update product
const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const productInfo = req.body;

  // existing product
  const existing = await ProductService.getSingleProduct(id as string);

  if (!existing) {
    throw new AppError(status.NOT_FOUND, "Product not found");
  }

  // existing images from frontend
  const existingImages = productInfo.existingImages || [];

  // newly uploaded images
  const uploadedImages =
    req.files && Array.isArray(req.files)
      ? req.files.map(
        (file: Express.Multer.File) =>
          `/uploads/products/${file.filename}`
      )
      : [];

  // final images
  const finalImages = [
    ...existingImages,
    ...uploadedImages,
  ];

  // remove deleted old images from server
  const deletedImages = existing.images.filter(
    (img: string) => !existingImages.includes(img)
  );

  deletedImages.forEach((img: string) => {
    const imagePath = path.join(process.cwd(), img);

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  });

  // assign final images
  productInfo.images = finalImages;

  const result = await ProductService.updateProduct(
    id as string,
    productInfo
  );

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Failed to update product");
  }

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Product updated successfully",
    data: result,
  });
});

// delete product
const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  // existing product
  const existing = await ProductService.getSingleProduct(id as string);

  if (!existing) {
    throw new AppError(status.NOT_FOUND, "Product not found");
  }

  // delete images
  if (existing.images?.length) {
    existing.images.forEach((img: string) => {
      const imagePath = path.join(process.cwd(), img);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });
  }

  const result = await ProductService.deleteProduct(id as string);

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Failed to delete product");
  }

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Product deleted successfully",
    data: result,
  });
});

export const ProductController = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};