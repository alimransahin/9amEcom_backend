import { Router } from "express";

import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";

import {
    createRoleValidationSchema,
    updateRoleValidationSchema,
} from "./role.validation";

import { roleController } from "./role.controller";

const router = Router();

// =====================================================
// Create Role
// =====================================================

router.post(
    "/",
    auth("admin"),
    validateRequest(
        createRoleValidationSchema
    ),
    roleController.createRole
);

// =====================================================
// Get All Roles
// =====================================================

router.get(
    "/",
    auth("admin"),
    roleController.getAllRole
);

// =====================================================
// Get Single Role
// =====================================================

router.get(
    "/:id",
    auth("admin"),
    roleController.getSingleRole
);

// =====================================================
// Update Role
// =====================================================

router.patch(
    "/:id",
    auth("admin"),
    validateRequest(
        updateRoleValidationSchema
    ),
    roleController.updateRole
);

// =====================================================
// Delete Role
// =====================================================

router.delete(
    "/:id",
    auth("admin"),
    roleController.deleteRole
);

export const RoleRoutes = router;