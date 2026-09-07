
import { Router } from "express";

import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { uploadFile } from "../../utils/multer";

import { ShopControllers } from "./shop.controller";
import { ShopValidation } from "./shop.validation";

const router = Router();

// Get single shop information
router.get(
    "/",
    ShopControllers.getShopInfo
);

// Update single shop information + logo
router.patch(
    "/",
    auth("admin"),
    uploadFile("shops").single("logo"),
    validateRequest(
        ShopValidation.updateShopValidationSchema
    ),
    ShopControllers.updateShopInfo
);

export const ShopRoutes = router;
