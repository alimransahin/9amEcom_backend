// product.route.ts

import { Router } from "express";

import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";

import { uploadFile } from "../../utils/multer";

import { ProductController } from "./product.controller";

import {
    createProductZodSchema,
    updateProductZodSchema,
} from "./product.validation";


export const parseProductBody = (
    req,
    res,
    next
) => {
    try {
        if (req.body.variants) {
            req.body.variants =
                JSON.parse(req.body.variants);
        }

        next();
    } catch (error) {
        next(error);
    }
};
const router = Router();

// create product
router.post(
    "/",
    auth("admin"),
    uploadFile("products").array("images", 10),
    parseProductBody,
    validateRequest(createProductZodSchema),
    ProductController.createProduct
);



// get all products
router.get(
    "/",
    ProductController.getAllProducts
);

// get single product
router.get(
    "/:id",
    ProductController.getSingleProduct
);

// update product
router.patch(
    "/:id",
    auth("admin"),
    uploadFile("products").array("images", 10),
    validateRequest(updateProductZodSchema),
    ProductController.updateProduct
);

// delete product
router.delete(
    "/:id",
    auth("admin"),
    ProductController.deleteProduct
);

export const ProductRoutes = router;