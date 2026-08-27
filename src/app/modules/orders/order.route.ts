import express from "express";

import { OrderController } from "./order.controller";
import validateRequest from "../../middlewares/validateRequest";
import { OrderValidation } from "./order.validation";

const router = express.Router();


// Create Order
router.post(
    "/",
    validateRequest(
        OrderValidation.createOrderValidationSchema
    ),
    OrderController.createOrder
);


// Get All Orders
router.get(
    "/",
    OrderController.getAllOrders
);


// Get Single Order
router.get(
    "/:id",
    OrderController.getSingleOrder
);


// Update Order
router.patch(
    "/:id",
    validateRequest(
        OrderValidation.updateOrderValidationSchema
    ),
    OrderController.updateOrder
);


// Delete Order
router.delete(
    "/:id",
    OrderController.deleteOrder
);


export const OrderRoutes = router;