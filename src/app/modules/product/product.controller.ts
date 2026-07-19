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
const createProduct = catchAsync(async (req, res) => {
  const productInfo = req.body;

  const uploadedImages =
    Array.isArray(req.files)
      ? req.files.map(
        (file: Express.Multer.File) =>
          `/uploads/products/${file.filename}`
      )
      : [];

  productInfo.images = uploadedImages;

  const result =
    await ProductService.createProduct(productInfo);

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
const getNewProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.getNewProducts();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "New Products retrieved successfully",
    data: result,
  });
});

// get single product
const getSingleProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.getSingleProduct(req.params.id as string);
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


const updateProduct = catchAsync(async (req, res) => {
  const { id } = req.params;

  const productInfo = req.body;

  const existing =
    await ProductService.getSingleProduct(id as string);

  if (!existing) {
    throw new AppError(
      status.NOT_FOUND,
      "Product not found"
    );
  }

  // Images user kept
  const existingImages = Array.isArray(
    productInfo.existingImages
  )
    ? productInfo.existingImages
    : [];

  // Newly uploaded images
  const uploadedImages =
    Array.isArray(req.files)
      ? req.files.map(
        (file: Express.Multer.File) =>
          `/uploads/products/${file.filename}`
      )
      : [];

  // Final Images
  const finalImages = [
    ...existingImages,
    ...uploadedImages,
  ];

  // Deleted Images
  const deletedImages = existing.images.filter(
    (img: string) => !finalImages.includes(img)
  );

  // Delete removed files
  deletedImages.forEach((img: string) => {
    const imagePath = path.join(process.cwd(), img);

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  });

  productInfo.images = finalImages;

  delete productInfo.existingImages;

  const result =
    await ProductService.updateProduct(
      id as string,
      productInfo
    );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Product updated successfully",
    data: result,
  });
});


const updateProductStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const result = await ProductService.updateProductStatus(
    id as string,
    status
  );

  sendResponse(res, {
    statusCode: 200,
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
  getNewProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  updateProductStatus
};