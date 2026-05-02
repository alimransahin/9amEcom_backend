import { Category } from "./category.model";
import { ICategory } from "./category.interface";
import { apiFeatures, Query } from "../../../lib/apiFeatures";

const createCategory = async (payload: ICategory) => {
  payload.slug = payload.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  const result = await Category.create(payload);
  return result;
};


const getAllCategory = async (query: Query) => {
  const { mongooseQuery, total } = await apiFeatures(Category, query);

  const result = await mongooseQuery;

  return {
    result,
    total,
  };
};

const getSingleCategory = async (id: string) => {
  return await Category.findOne({ _id: id, isDeleted: false }).populate("userId");
};

const updateCategory = async (id: string, payload: Partial<ICategory>) => {
  const result = await Category.findOneAndUpdate(
    { _id: id, isDeleted: false },
    payload,
    { new: true, runValidators: true }
  );

  return result;
};

const deleteCategory = async (id: string) => {
  return await Category.findOneAndUpdate(
    { _id: id },
    { isDeleted: true },
    { new: true }
  );
};

export const CategoryService = {
  createCategory,
  getAllCategory,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};