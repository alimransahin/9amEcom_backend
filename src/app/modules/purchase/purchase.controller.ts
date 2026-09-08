import { Request, Response } from "express";
import { status } from "http-status";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import AppError from "../../../errors/AppError";

import { PurchaseService } from "./purchase.service";

// Create Purchase
const createPurchase = catchAsync(
    async (
        req: Request,
        res: Response
    ) => {

        const purchaseInfo = req.body;

        const result =
            await PurchaseService.createPurchase(
                purchaseInfo
            );

        sendResponse(res, {
            statusCode: status.CREATED,
            success: true,
            message:
                "Purchase created successfully",
            data: result,
        });
    }
);

// Get All Purchases
const getAllPurchases = catchAsync(
    async (
        req: Request,
        res: Response
    ) => {

        const {
            result,
            total,
        } =
            await PurchaseService.getAllPurchases(
                req
            );

        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message:
                "Purchases retrieved successfully",
            data: result,
            total,
        });
    }
);

// Get Single Purchase
const getSinglePurchase = catchAsync(
    async (
        req: Request,
        res: Response
    ) => {

        const result =
            await PurchaseService.getSinglePurchase(
                req.params.id as string
            );

        if (!result) {
            throw new AppError(
                status.NOT_FOUND,
                "Purchase not found"
            );
        }

        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message:
                "Purchase retrieved successfully",
            data: result,
        });
    }
);

// Delete Purchase
const deletePurchase = catchAsync(
    async (
        req: Request,
        res: Response
    ) => {

        const result =
            await PurchaseService.deletePurchase(
                req.params.id as string
            );

        if (!result) {
            throw new AppError(
                status.NOT_FOUND,
                "Purchase not found"
            );
        }

        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message:
                "Purchase deleted successfully",
            data: result,
        });
    }
);

export const PurchaseController = {
    createPurchase,
    getAllPurchases,
    getSinglePurchase,
    deletePurchase,
};