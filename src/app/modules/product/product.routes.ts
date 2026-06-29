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


export const parseProductBody = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        if (
            req.body?.variants &&
            typeof req.body.variants === "string"
        ) {
            req.body.variants = JSON.parse(
                req.body.variants
            );
        }

        if (
            req.body?.existingImages &&
            typeof req.body.existingImages === "string"
        ) {
            req.body.existingImages = JSON.parse(
                req.body.existingImages
            );
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

    (req, res, next) => {
        console.log("BODY =>", req.body);
        console.log("FILES =>", req.files);
        next();
    },

    parseProductBody,
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