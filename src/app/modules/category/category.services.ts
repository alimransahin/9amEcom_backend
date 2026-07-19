import { Category } from "./category.model";
import { ICategory } from "./category.interface";
import { apiFeatures, Query } from "../../../lib/apiFeatures";
import { Product } from "../product/product.model";

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

  const result = await mongooseQuery.populate("featuredProduct", "name price images isFeatured");

  return {
    result,
    total,
  };
};

const getSingleCategory = async (id: string) => {
  return await Category.findOne({ _id: id, isDeleted: false }).populate("userId");
};

const updateCategory = async (
  id: string,
  payload: Partial<ICategory>
) => {
  const category = await Category.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!category) {
    throw new Error("Category not found");
  }

  if (payload.featuredProduct) {
    const updates = [];

    if (
      category.featuredProduct &&
      category.featuredProduct.toString() !== payload.featuredProduct.toString()
    ) {
      updates.push(
        Product.updateOne(
          { _id: category.featuredProduct },
          { isFeatured: false }
        )
      );
    }

    updates.push(
      Product.updateOne(
        { _id: payload.featuredProduct },
        { isFeatured: true }
      )
    );

    await Promise.all(updates);
  }

  return Category.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
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