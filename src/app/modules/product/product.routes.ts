// product.route.ts

import { NextFunction, Request, Response, Router } from "express";

import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";

import { uploadFile } from "../../utils/multer";

import { ProductController } from "./product.controller";

import {
    createProductZodSchema,
    updateProductZodSchema,
} from "./product.validation";



const router = Router();

export const parseProductBody = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (
            req.body.variants &&
            typeof req.body.variants === "string"
        ) {
            req.body.variants = JSON.parse(req.body.variants);
        }

        if (
            req.body.existingImages &&
            typeof req.body.existingImages === "string"
        ) {
            req.body.existingImages = JSON.parse(
                req.body.existingImages
            );
        }
        next();
    } catch (err) {
        next(err);
    }
};

router.post(
    "/",
    auth("admin"),
    uploadFile("products").array("images", 10),
    parseProductBody,
    validateRequest(createProductZodSchema),
    ProductController.createProduct
);

router.patch(
    "/:id",
    auth("admin"),
    uploadFile("products").array("images", 10),
    parseProductBody,
    validateRequest(updateProductZodSchema),
    ProductController.updateProduct
);
router.patch(
    "/:id/status",
    auth("admin"),
    ProductController.updateProductStatus
);

// get all products
router.get("/", ProductController.getAllProducts);
router.get("/new", ProductController.getNewProducts);

// get single product
router.get("/:id", ProductController.getSingleProduct);



// delete product
router.delete(
    "/:id",
    auth("admin"),
    ProductController.deleteProduct
);

export const ProductRoutes = router;