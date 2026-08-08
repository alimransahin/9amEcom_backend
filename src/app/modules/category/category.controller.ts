import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { status } from "http-status";
import AppError from "../../../errors/AppError";

import fs from "fs";
import path from "path";

import { CategoryService } from "./category.services";

// =====================================
// CREATE
// =====================================

const createCategory = catchAsync(async (req, res) => {
  const payload = req.body;

  payload.userId = req.user.userId;

  if (req.file) {
    payload.image =
      `/uploads/categories/${req.file.filename}`;
  }

  if (!payload.image) {
    throw new AppError(
      status.BAD_REQUEST,
      "Category image is required"
    );
  }

  const result =
    await CategoryService.createCategory(payload);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Category created successfully",
    data: result,
  });
});

// =====================================
// GET ALL
// =====================================

const getAllCategory = catchAsync(async (req, res) => {
  const { result, total } =
    await CategoryService.getAllCategory(req.query);

  if (!result) {
    throw new AppError(
      status.NOT_FOUND,
      "Category not found"
    );
  }

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Categories fetched successfully",
    total,
    count: result.length,
    data: result,
  });
});

// =====================================
// GET SINGLE
// =====================================

const getSingleCategory = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result =
    await CategoryService.getSingleCategory(id as string);

  if (!result) {
    throw new AppError(
      status.NOT_FOUND,
      "Category not found"
    );
  }

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Category fetched successfully",
    data: result,
  });
});

// =====================================
// UPDATE
// =====================================

const updateCategory = catchAsync(async (req, res) => {
  const { id } = req.params;

  // Get existing category
  const existing =
    await CategoryService.getSingleCategory(id as string);

  if (!existing) {
    throw new AppError(
      status.NOT_FOUND,
      "Category not found"
    );
  }

  const payload = req.body;

  // =====================================
  // New Image Uploaded
  // =====================================

  if (req.file) {
    const newImage =
      `/uploads/categories/${req.file.filename}`;

    // Delete old image
    if (existing.image) {
      const oldImagePath = path.join(
        process.cwd(),
        existing.image
      );

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Set new image
    payload.image = newImage;
  }

  const result =
    await CategoryService.updateCategory(
      id as string,
      payload
    );

  if (!result) {
    throw new AppError(
      status.NOT_FOUND,
      "Failed to update category"
    );
  }

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Category updated successfully",
    data: result,
  });
});

// =====================================
// DELETE
// =====================================

const deleteCategory = catchAsync(async (req, res) => {
  const { id } = req.params;

  // Existing category
  const existing =
    await CategoryService.getSingleCategory(id as string);

  if (!existing) {
    throw new AppError(
      status.NOT_FOUND,
      "Category not found"
    );
  }

  // =====================================
  // Delete Image
  // =====================================

  if (existing.image) {
    const imagePath = path.join(
      process.cwd(),
      existing.image
    );

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  // Soft delete category
  const result =
    await CategoryService.deleteCategory(
      id as string
    );

  if (!result) {
    throw new AppError(
      status.NOT_FOUND,
      "Failed to delete category"
    );
  }

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Category deleted successfully",
    data: result,
  });
});

export const CategoryController = {
  createCategory,
  getAllCategory,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};