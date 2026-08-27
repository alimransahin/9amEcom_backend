import { Router } from "express";
import auth from "../../middlewares/auth";
import { cartController } from "./cart.controller";

const router = Router();

router.get("/", auth("customer", "admin"), cartController.getCart);

router.post("/", auth("customer", "admin"), cartController.addToCart);

router.post("/merge", auth("customer", "admin"), cartController.mergeCart);

router.patch("/:id", auth("customer", "admin"), cartController.updateCart);

router.delete("/clear", auth("customer", "admin"), cartController.clearCart);

router.delete("/:id", auth("customer", "admin"), cartController.removeCart);

export const CartRoutes = router;