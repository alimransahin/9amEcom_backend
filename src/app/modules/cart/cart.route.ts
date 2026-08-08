import { Router } from "express";
import auth from "../../middlewares/auth";
import { cartController } from "./cart.controller";

const router = Router();

router.get("/", auth("customer"), cartController.getCart);

router.post("/", auth("customer"), cartController.addToCart);

router.post("/merge", auth("customer"), cartController.mergeCart);

router.patch("/:id", auth("customer"), cartController.updateCart);

router.delete("/clear", auth("customer"), cartController.clearCart);

router.delete("/:id", auth("customer"), cartController.removeCart);

export const CartRoutes = router;