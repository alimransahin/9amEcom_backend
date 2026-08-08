import { Router } from "express";

import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { uploadFile } from "../../utils/multer";

import { CategoryController } from "./category.controller";

import {
	createCategorySchema,
	updateCategorySchema,
} from "./category.validation";

const router = Router();

// CREATE
router.post(
	"/",
	auth("admin"),
	uploadFile("categories").single("image"),
	validateRequest(createCategorySchema),
	CategoryController.createCategory
);

// GET ALL
router.get(
	"/",
	CategoryController.getAllCategory
);

// GET SINGLE
router.get(
	"/:id",
	auth("admin"),
	CategoryController.getSingleCategory
);

// UPDATE
router.patch(
	"/:id",
	auth("admin"),
	uploadFile("categories").single("image"),
	validateRequest(updateCategorySchema),
	CategoryController.updateCategory
);

// DELETE
router.delete(
	"/:id",
	auth("admin"),
	CategoryController.deleteCategory
);

export const CategoryRoutes = router;