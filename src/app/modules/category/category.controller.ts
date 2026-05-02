import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { status } from "http-status";
import AppError from "../../../errors/AppError";
import { CategoryService } from "./category.services";

// CREATE
const createCategory = catchAsync(async (req, res) => {
  const payload = req.body;

  payload.userId = req.user.userId;

  const result = await CategoryService.createCategory(payload);

  if (!result) {
    throw new AppError(status.BAD_REQUEST, "Failed to create category");
  }

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Category created successfully",
    data: result,
  });
});

// GET ALL
const getAllCategory = catchAsync(async (req, res) => {
  const { result, total } = await CategoryService.getAllCategory(req.query);

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Category not found");
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

// GET SINGLE
const getSingleCategory = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await CategoryService.getSingleCategory(id as string);

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Category not found");
  }

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Category fetched successfully",
    data: result,
  });
});

// UPDATE
const updateCategory = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await CategoryService.updateCategory(id as string, req.body);

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Failed to update category");
  }

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Category updated successfully",
    data: result,
  });
});

// DELETE (soft delete)
const deleteCategory = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await CategoryService.deleteCategory(id as string);

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