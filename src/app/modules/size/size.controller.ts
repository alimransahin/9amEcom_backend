import { status } from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import AppError from "../../../errors/AppError";

import { sizeChartService } from "./size.services";

// ======================
// CREATE SIZE CHART
// ======================
const createSizeChart = catchAsync(async (req, res) => {
  const payload = req.body;

  payload.userId = req.user?.userId;

  const result = await sizeChartService.createSizeChartIntoDB(payload);

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Failed to create size chart");
  }

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Size chart created successfully",
    data: result,
  });
});

// ======================
// UPDATE SIZE CHART
// ======================
const updateSizeChart = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  const existing = await sizeChartService.getSingleSizeChartFromDB(id as string);

  if (!existing) {
    throw new AppError(status.NOT_FOUND, "Size chart not found");
  }

  const result = await sizeChartService.updateSizeChartInDB(id as string, payload);

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Failed to update size chart");
  }

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Size chart updated successfully",
    data: result,
  });
});

// ======================
// GET ALL SIZE CHARTS
// ======================
const getAllSizeChart = catchAsync(async (req, res) => {
  const { result, total } =
    await sizeChartService.getAllSizeChartFromDB(req);

  if (!result) {
    throw new AppError(status.NOT_FOUND, "No size chart found");
  }

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    total,
    count: result.length,
    message: "All size charts retrieved successfully",
    data: result,
  });
});

// ======================
// GET SINGLE
// ======================
const getSingleSizeChart = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await sizeChartService.getSingleSizeChartFromDB(id as string);

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Size chart not found");
  }

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Size chart retrieved successfully",
    data: result,
  });
});

// ======================
// DELETE (soft delete)
// ======================
const deleteSizeChart = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await sizeChartService.deleteSizeChartFromDB(id as string);

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Failed to delete size chart");
  }

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Size chart deleted successfully",
    data: result,
  });
});

// ======================
// EXPORT
// ======================
export const sizeChartController = {
  createSizeChart,
  updateSizeChart,
  getAllSizeChart,
  getSingleSizeChart,
  deleteSizeChart,
};