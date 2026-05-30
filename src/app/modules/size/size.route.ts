import { Router } from "express";

import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";

import { sizeChartController } from "./size.controller";
import {
    createSizeChartSchema,
    updateSizeChartSchema,
} from "./size.validation";

const router = Router();

// ======================
// CREATE
// ======================
router.post(
    "/",
    auth("admin"),
    validateRequest(createSizeChartSchema),
    sizeChartController.createSizeChart
);

// ======================
// GET ALL
// ======================
router.get(
    "/",
    sizeChartController.getAllSizeChart
);

// ======================
// GET SINGLE
// ======================
router.get(
    "/:id",
    sizeChartController.getSingleSizeChart
);

// ======================
// DELETE (soft delete)
// ======================
router.delete(
    "/:id",
    auth("admin"),
    sizeChartController.deleteSizeChart
);

// ======================
// UPDATE
// ======================
router.patch(
    "/:id",
    auth("admin"),
    validateRequest(updateSizeChartSchema),
    sizeChartController.updateSizeChart
);

export const SizeChartRoutes = router;