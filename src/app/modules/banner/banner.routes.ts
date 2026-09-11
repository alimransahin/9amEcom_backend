
import { Router } from "express";

import auth from "../../middlewares/auth";

import validateRequest from "../../middlewares/validateRequest";

import { uploadFile } from "../../utils/multer";

import {
    createBannerSchema,
    updateBannerSchema,
} from "./banner.validation";

import { bannerController } from "./banner.controller";


const router = Router();


// =====================================================
// Create Banner
// =====================================================

router.post(
    "/",
    auth("admin"),
    uploadFile("banners").single("image"),
    validateRequest(createBannerSchema),
    bannerController.createBanner
);


// =====================================================
// Get All Banners
// =====================================================

router.get(
    "/",
    auth("admin"),
    bannerController.getAllBanner
);


// =====================================================
// Get Single Banner
// =====================================================

router.get(
    "/:id",
    auth("admin"),
    bannerController.getSingleBanner
);


// =====================================================
// Delete Banner
// =====================================================

router.delete(
    "/:id",
    auth("admin"),
    bannerController.deleteBanner
);


// =====================================================
// Update Banner
// =====================================================

router.patch(
    "/:id",
    auth("admin"),
    uploadFile("banners").single("image"),
    validateRequest(updateBannerSchema),
    bannerController.updateBanner
);


// =====================================================
// Update Banner Status
// =====================================================

router.patch(
    "/:id/status",
    auth("admin"),
    bannerController.updateBannerStatus
);


export const BannerRoutes = router;
