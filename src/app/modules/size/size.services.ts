import { Request } from "express";
import { ISizeChart } from "./size.interface";
import { SizeChart } from "./size.model";
import { apiFeatures } from "../../../lib/apiFeatures";

// ======================
// CREATE
// ======================
const createSizeChartIntoDB = async (payload: ISizeChart) => {
  payload.title = payload.title.trim();

  // Optional: duplicate check (same title per user)
  const existing = await SizeChart.findOne({
    title: payload.title,
    isDeleted: false,
  });

  if (existing) {
    throw new Error("Size chart with this title already exists");
  }

  const result = await SizeChart.create(payload);
  return result;
};

// ======================
// UPDATE
// ======================
const updateSizeChartInDB = async (
  id: string,
  payload: Partial<ISizeChart>
) => {
  const result = await SizeChart.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true }
  );

  return result;
};

// ======================
// GET ALL
// ======================
const getAllSizeChartFromDB = async (req: Request) => {
  const { mongooseQuery, total } = await apiFeatures(
    SizeChart,
    req.query
  );

  const result = await mongooseQuery;

  return { result, total };
};

// ======================
// GET SINGLE
// ======================
const getSingleSizeChartFromDB = async (id: string) => {
  return await SizeChart.findOne({
    _id: id,
    isDeleted: false,
  });
};

// ======================
// DELETE (soft delete)
// ======================
const deleteSizeChartFromDB = async (id: string) => {
  const result = await SizeChart.findOneAndUpdate(
    { _id: id },
    { $set: { isDeleted: true } },
    { new: true }
  );

  return result;
};

// ======================
// EXPORT
// ======================
export const sizeChartService = {
  createSizeChartIntoDB,
  updateSizeChartInDB,
  getAllSizeChartFromDB,
  getSingleSizeChartFromDB,
  deleteSizeChartFromDB,
};