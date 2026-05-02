import { status } from "http-status";
import catchAsync from "../../utils/catchAsync";
import { brandService } from "./brand.services";
import sendResponse from "../../utils/sendResponse";
import AppError from "../../../errors/AppError";
import fs from "fs";
import path from "path";

// create brand
const createBrand = catchAsync(async (req, res) => {
  const brandInfo = req.body;
  brandInfo.userId = req.user?.userId;
  if (req.file) {
    brandInfo.image = `/uploads/brands/${req.file.filename}`;
  }

  const result = await brandService.createBrandIntoDB(brandInfo);

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Failed to Create Brand");
  }

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Brand created successfully",
    data: result,
  });
});

// update brand
const updateBrand = catchAsync(async (req, res) => {
  const { id } = req.params;
  const brandInfo = req.body;

  // 🔥 get existing brand
  const existing = await brandService.getSingleBrand(id as string);

  if (!existing) {
    throw new AppError(status.NOT_FOUND, "Brand not found");
  }

  // 🔥 new image upload
  if (req.file) {
    // delete old image
    if (existing.image) {
      const oldPath = path.join(process.cwd(), existing.image);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    brandInfo.image = `/uploads/brands/${req.file.filename}`;
  }

  const result = await brandService.updateBrandInDB(id as string, brandInfo);

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Failed to Update Brand");
  }

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Brand updated successfully",
    data: result,
  });
});


// get all brand
const getAllBrand = catchAsync(async (req, res) => {

  const { result, total } = await brandService.getAllBrandFromDB(req);

  if (!result) {
    throw new AppError(status.NOT_FOUND, "No Brand found");
  }

  sendResponse(res, {
    statusCode: status.OK,
    total,
    count: result.length,
    success: true,
    message: "All brand Information retrieved successfully",
    data: result,
  });
});


// delete brand
const deleteBrand = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await brandService.deleteBrandFromDB(id as string);

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Failed to Delete Brand");
  }

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Brand Deleted Successfully",
    data: result ?? [],
  });
});

export const brandController = {
  createBrand,
  updateBrand,
  getAllBrand,
  deleteBrand,
};