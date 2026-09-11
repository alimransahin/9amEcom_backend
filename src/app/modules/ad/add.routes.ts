import { Router } from "express";

import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";

import { uploadFile } from "../../utils/multer";

import {
    createAdValidationSchema,
    updateAdValidationSchema,
} from "./ad.validation";

import { adController } from "./ad.controller";

const router = Router();

// =====================================================
// Create Ad
// =====================================================

router.post(
    "/",
    auth("admin"),
    uploadFile("ads").single("image"),
    validateRequest(createAdValidationSchema),
    adController.createAd
);

// =====================================================
// Get All Ads
// =====================================================

router.get(
    "/",
    auth("admin"),
    adController.getAllAd
);


// =====================================================
// Get Single Ad
// =====================================================

router.get(
    "/:id",
    auth("admin"),
    adController.getSingleAd
);

// =====================================================
// Delete Ad
// =====================================================

router.delete(
    "/:id",
    auth("admin"),
    adController.deleteAd
);

// =====================================================
// Update Ad
// =====================================================

router.patch(
    "/:id",
    auth("admin"),
    uploadFile("ads").single("image"),
    validateRequest(updateAdValidationSchema),
    adController.updateAd
);


export const AdRoutes = router;