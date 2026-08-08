import { Category } from "./category.model";
import { ICategory, ICategoryHierarchy } from "./category.interface";
import {
  apiFeatures,
  Query,
} from "../../../lib/apiFeatures";
import { Types } from "mongoose";

// =====================================
// GET PARENT ID
// =====================================

const getParentId = (
  parent?: Types.ObjectId | ICategory | string | null
): Types.ObjectId | null => {
  if (!parent) {
    return null;
  }

  if (typeof parent === "object" && "_id" in parent) {
    return new Types.ObjectId(
      parent._id.toString()
    );
  }

  return new Types.ObjectId(
    parent.toString()
  );
};

// =====================================
// GENERATE CATEGORY SLUG
// =====================================

const generateCategorySlug = async (
  name: string,
  parentId?: Types.ObjectId | string | null,
  excludeId?: string
) => {
  const parts: string[] = [];

  // -------------------------------------
  // Get parent hierarchy
  // -------------------------------------

  if (parentId) {
    let currentId: Types.ObjectId | null =
      typeof parentId === "string"
        ? new Types.ObjectId(parentId)
        : parentId;

    const hierarchy: string[] = [];

    while (currentId !== null) {
      const category: ICategoryHierarchy | null =
        await Category.findOne(
          {
            _id: currentId,
            isDeleted: false,
          },
          {
            name: 1,
            parent: 1,
          }
        )
          .lean<ICategoryHierarchy>()
          .exec();

      if (!category) {
        break;
      }

      hierarchy.unshift(category.name);

      currentId = category.parent
        ? new Types.ObjectId(
          category.parent.toString()
        )
        : null;
    }

    parts.push(...hierarchy);
  }

  // -------------------------------------
  // Add current category name
  // -------------------------------------

  parts.push(name);

  // -------------------------------------
  // Generate base slug
  // -------------------------------------

  const baseSlug = parts
    .join("-")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  // -------------------------------------
  // Make slug unique
  // -------------------------------------

  let slug = baseSlug;
  let counter = 2;

  while (
    await Category.exists({
      slug,
      isDeleted: false,
      ...(excludeId
        ? {
          _id: {
            $ne: excludeId,
          },
        }
        : {}),
    })
  ) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};

// =====================================
// CREATE CATEGORY
// =====================================

const createCategory = async (
  payload: ICategory
) => {
  const parentId = getParentId(
    payload.parent
  );

  // -------------------------------------
  // Validate parent
  // -------------------------------------

  if (parentId) {
    const parentCategory =
      await Category.findOne({
        _id: parentId,
        isDeleted: false,
      });

    if (!parentCategory) {
      throw new Error(
        "Parent category not found"
      );
    }

    payload.parent =
      parentCategory._id;
  } else {
    payload.parent = null;
  }

  // -------------------------------------
  // Generate slug
  // -------------------------------------

  payload.slug =
    await generateCategorySlug(
      payload.name,
      parentId
    );

  return await Category.create(
    payload
  );
};

// =====================================
// GET ALL CATEGORY
// =====================================

const getAllCategory = async (
  query: Query
) => {
  const {
    mongooseQuery,
    total,
  } = await apiFeatures(
    Category,
    query
  );

  const result =
    await mongooseQuery.populate(
      "parent",
      "name slug parent"
    );

  return {
    result,
    total,
  };
};

// =====================================
// GET SINGLE CATEGORY
// =====================================

const getSingleCategory = async (
  id: string
) => {
  return await Category.findOne({
    _id: id,
    isDeleted: false,
  })
    .populate("userId")
    .populate("parent");
};

// =====================================
// UPDATE CATEGORY
// =====================================

const updateCategory = async (
  id: string,
  payload: Partial<ICategory>
) => {
  const category =
    await Category.findOne({
      _id: id,
      isDeleted: false,
    });

  if (!category) {
    throw new Error(
      "Category not found"
    );
  }

  // -------------------------------------
  // Determine final parent
  // -------------------------------------

  let finalParentId =
    getParentId(category.parent);

  if (
    payload.parent !== undefined
  ) {
    finalParentId =
      getParentId(payload.parent);

    // No parent
    if (!finalParentId) {
      payload.parent = null;
    } else {
      // Cannot select itself
      if (
        finalParentId.toString() ===
        id.toString()
      ) {
        throw new Error(
          "A category cannot be its own parent"
        );
      }

      // Parent must exist
      const parentCategory =
        await Category.findOne({
          _id: finalParentId,
          isDeleted: false,
        });

      if (!parentCategory) {
        throw new Error(
          "Parent category not found"
        );
      }

      // Cannot select child as parent
      const childCategoryIds =
        await getAllChildCategoryIds(
          id
        );

      const isChild =
        childCategoryIds.some(
          (childId) =>
            childId.toString() ===
            finalParentId!.toString()
        );

      if (isChild) {
        throw new Error(
          "A category cannot have its child as parent"
        );
      }

      payload.parent =
        parentCategory._id;
    }
  }

  // -------------------------------------
  // Regenerate slug
  // if name OR parent changes
  // -------------------------------------

  const nameChanged =
    payload.name !== undefined &&
    payload.name.trim() !==
    category.name;

  const parentChanged =
    payload.parent !== undefined &&
    finalParentId?.toString() !==
    getParentId(
      category.parent
    )?.toString();

  if (
    nameChanged ||
    parentChanged
  ) {
    const finalName =
      payload.name?.trim() ||
      category.name;

    payload.slug =
      await generateCategorySlug(
        finalName,
        finalParentId,
        id
      );
  }

  // -------------------------------------
  // Update
  // -------------------------------------

  return await Category.findByIdAndUpdate(
    id,
    {
      $set: payload,
    },
    {
      new: true,
      runValidators: true,
    }
  );
};

// =====================================
// GET ALL CHILDREN RECURSIVELY
// =====================================

const getAllChildCategoryIds = async (
  categoryId: string
): Promise<Types.ObjectId[]> => {
  const children =
    await Category.find(
      {
        parent: categoryId,
        isDeleted: false,
      },
      {
        _id: 1,
      }
    );

  let childIds = children.map(
    (child) => child._id
  );

  for (const child of children) {
    const descendants =
      await getAllChildCategoryIds(
        child._id.toString()
      );

    childIds = [
      ...childIds,
      ...descendants,
    ];
  }

  return childIds;
};

// =====================================
// DELETE CATEGORY
// =====================================

const deleteCategory = async (
  id: string
) => {
  return await Category.findOneAndUpdate(
    {
      _id: id,
      isDeleted: false,
    },
    {
      $set: {
        isDeleted: true,
      },
    },
    {
      new: true,
    }
  );
};

export const CategoryService = {
  createCategory,
  getAllCategory,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};