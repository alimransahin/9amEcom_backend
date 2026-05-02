import { Router } from "express";
import { createBrandSchema, updateBrandSchema } from "./brand.validation";
import auth from "../../middlewares/auth";
import { brandController } from "./brand.controller";
import validateRequest from "../../middlewares/validateRequest";
import { uploadFile } from "../../utils/multer";

const router = Router();

router.post("/", auth("admin"), uploadFile("brands").single("image"), validateRequest(createBrandSchema), brandController.createBrand
);
router.get("/", auth("admin"), brandController.getAllBrand);

router.delete("/:id", auth("admin"), brandController.deleteBrand);
router.patch("/:id", auth("admin"), uploadFile("brands").single("image"), validateRequest(updateBrandSchema), brandController.updateBrand);

export const BrandRoutes = router;