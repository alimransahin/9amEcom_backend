import express from "express";
import { OrderController } from "./order.controller";
import validateRequest from "../../middlewares/validateRequest";
import { OrderValidation } from "./order.validation";
import auth from "../../middlewares/auth";
import optionalAuth from "../../middlewares/optionalAuth";

const router = express.Router();

// Create Order
router.post(
    "/",
    optionalAuth,
    validateRequest(
        OrderValidation.createOrderValidationSchema
    ),
    OrderController.createOrder
);
// Get My Orders
router.get(
    "/my-orders",
    auth("customer"),
    OrderController.getMyOrders
);

// Get All Orders
router.get(
    "/",
    auth("admin"),
    OrderController.getAllOrders
);

// Get Single Order
router.get(
    "/:id",
    auth("customer", "admin"),
    OrderController.getSingleOrder
);

// Update Order
router.patch(
    "/:id",
    auth("admin"),
    validateRequest(
        OrderValidation.updateOrderValidationSchema
    ),
    OrderController.updateOrder
);

// Delete Order
router.delete(
    "/:id",
    auth("admin"),
    OrderController.deleteOrder
);

export const OrderRoutes = router;