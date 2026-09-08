import { Router } from "express";

import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";

import {
    createPurchaseZodSchema,
} from "./purchase.validation";

import { PurchaseController } from "./purchase.controller";

const router = Router();

// Create Purchase
router.post(
    "/",
    auth("admin"),
    validateRequest(
        createPurchaseZodSchema
    ),
    PurchaseController.createPurchase
);

// Get All Purchases
router.get(
    "/",
    auth("admin"),
    PurchaseController.getAllPurchases
);

// Get Single Purchase
router.get(
    "/:id",
    auth("admin"),
    PurchaseController.getSinglePurchase
);

// Delete Purchase
router.delete(
    "/:id",
    auth("admin"),
    PurchaseController.deletePurchase
);

export const PurchaseRoutes = router;