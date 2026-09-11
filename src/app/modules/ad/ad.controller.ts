
import { status } from "http-status";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

import AppError from "../../../errors/AppError";

import { adService } from "./ad.service";

import fs from "fs";
import path from "path";

// =====================================================
// Create Ad
// =====================================================

const createAd = catchAsync(
    async (req, res) => {

        const adInfo = req.body;

        adInfo.userId =
            req.user?.userId;

        // Image
        if (req.file) {
            adInfo.image = `/uploads/ads/${req.file.filename}`;
        }

        const result =
            await adService.createAdIntoDB(
                adInfo
            );

        if (!result) {
            throw new AppError(
                status.NOT_FOUND,
                "Failed to Create Ad"
            );
        }

        sendResponse(res, {
            statusCode: status.CREATED,
            success: true,
            message: "Ad created successfully",
            data: result,
        });
    }
);

// =====================================================
// Get All Ads
// =====================================================

const getAllAd = catchAsync(
    async (req, res) => {

        const {
            result,
            total,
        } =
            await adService.getAllAdFromDB(
                req
            );

        if (!result) {
            throw new AppError(
                status.NOT_FOUND,
                "No Ads found"
            );
        }

        sendResponse(res, {
            statusCode: status.OK,
            total,
            count: result.length,
            success: true,
            message:
                "All ad information retrieved successfully",
            data: result,
        });
    }
);



// =====================================================
// Get Single Ad
// =====================================================

const getSingleAd = catchAsync(
    async (req, res) => {

        const { id } = req.params;

        const result =
            await adService.getSingleAd(
                id as string
            );

        if (!result) {
            throw new AppError(
                status.NOT_FOUND,
                "Ad not found"
            );
        }

        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message:
                "Ad information retrieved successfully",
            data: result,
        });
    }
);

// =====================================================
// Update Ad
// =====================================================

const updateAd = catchAsync(
    async (req, res) => {

        const { id } = req.params;

        const adInfo = req.body;

        // Get existing ad
        const existing =
            await adService.getSingleAd(
                id as string
            );

        if (!existing) {
            throw new AppError(
                status.NOT_FOUND,
                "Ad not found"
            );
        }

        // New image uploaded
        if (req.file) {

            // Delete old image
            if (existing.image) {

                const oldPath =
                    path.join(
                        process.cwd(),
                        existing.image
                    );

                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }

            adInfo.image = `/uploads/ads/${req.file.filename}`;
        }

        const result =
            await adService.updateAdInDB(
                id as string,
                adInfo
            );

        if (!result) {
            throw new AppError(
                status.NOT_FOUND,
                "Failed to Update Ad"
            );
        }

        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message: "Ad updated successfully",
            data: result,
        });
    }
);

// =====================================================
// Delete Ad
// =====================================================

const deleteAd = catchAsync(
    async (req, res) => {

        const { id } = req.params;

        // Get existing ad
        const existing =
            await adService.getSingleAd(
                id as string
            );

        if (!existing) {
            throw new AppError(
                status.NOT_FOUND,
                "Ad not found"
            );
        }

        // Delete image from filesystem
        if (existing.image) {

            const imagePath =
                path.join(
                    process.cwd(),
                    existing.image
                );

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        const result =
            await adService.deleteAdFromDB(
                id as string
            );

        if (!result) {
            throw new AppError(
                status.NOT_FOUND,
                "Failed to Delete Ad"
            );
        }

        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message:
                "Ad deleted successfully",
            data: result,
        });
    }
);

export const adController = {
    createAd,
    getAllAd,
    getSingleAd,
    updateAd,
    deleteAd,
};
