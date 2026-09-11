
import { status } from "http-status";

import catchAsync from "../../utils/catchAsync";

import { bannerService } from "./banner.services";

import sendResponse from "../../utils/sendResponse";

import AppError from "../../../errors/AppError";

import fs from "fs";
import path from "path";


// =====================================================
// Create Banner
// =====================================================

const createBanner = catchAsync(
    async (req, res) => {

        const bannerInfo = req.body;

        bannerInfo.userId =
            req.user?.userId;

        // Image
        if (req.file) {
            bannerInfo.image = `/uploads/banners/${req.file.filename}`;
        }

        const result =
            await bannerService.createBannerIntoDB(
                bannerInfo
            );

        if (!result) {
            throw new AppError(
                status.NOT_FOUND,
                "Failed to Create Banner"
            );
        }

        sendResponse(res, {
            statusCode: status.CREATED,
            success: true,
            message: "Banner created successfully",
            data: result,
        });
    }
);


// =====================================================
// Get All Banner
// =====================================================

const getAllBanner = catchAsync(
    async (req, res) => {

        const {
            result,
            total,
        } =
            await bannerService.getAllBannerFromDB(
                req
            );

        if (!result) {
            throw new AppError(
                status.NOT_FOUND,
                "No Banner found"
            );
        }

        sendResponse(res, {
            statusCode: status.OK,
            total,
            count: result.length,
            success: true,
            message:
                "All banner information retrieved successfully",
            data: result,
        });
    }
);


// =====================================================
// Get Single Banner
// =====================================================

const getSingleBanner = catchAsync(
    async (req, res) => {

        const { id } = req.params;

        const result =
            await bannerService.getSingleBanner(
                id as string
            );

        if (!result) {
            throw new AppError(
                status.NOT_FOUND,
                "Banner not found"
            );
        }

        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message:
                "Banner information retrieved successfully",
            data: result,
        });
    }
);


// =====================================================
// Update Banner
// =====================================================

const updateBanner = catchAsync(
    async (req, res) => {

        const { id } = req.params;

        const bannerInfo = req.body;

        // Get existing banner
        const existing =
            await bannerService.getSingleBanner(
                id as string
            );

        if (!existing) {
            throw new AppError(
                status.NOT_FOUND,
                "Banner not found"
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

            bannerInfo.image =
                `/uploads/banners/${req.file.filename}`;
        }

        const result =
            await bannerService.updateBannerInDB(
                id as string,
                bannerInfo
            );

        if (!result) {
            throw new AppError(
                status.NOT_FOUND,
                "Failed to Update Banner"
            );
        }

        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message: "Banner updated successfully",
            data: result,
        });
    }
);


// =====================================================
// Delete Banner
// =====================================================

const deleteBanner = catchAsync(
    async (req, res) => {

        const { id } = req.params;

        // Get existing banner
        const existing =
            await bannerService.getSingleBanner(
                id as string
            );

        if (!existing) {
            throw new AppError(
                status.NOT_FOUND,
                "Banner not found"
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
            await bannerService.deleteBannerFromDB(
                id as string
            );

        if (!result) {
            throw new AppError(
                status.NOT_FOUND,
                "Failed to Delete Banner"
            );
        }

        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message: "Banner Deleted Successfully",
            data: result,
        });
    }
);


// =====================================================
// Update Banner Status
// =====================================================

const updateBannerStatus = catchAsync(
    async (req, res) => {

        const { id } = req.params;

        const { isActive } = req.body;

        if (
            typeof isActive !== "boolean"
        ) {
            throw new AppError(
                status.BAD_REQUEST,
                "isActive must be a boolean"
            );
        }

        const result =
            await bannerService.updateBannerStatusInDB(
                id as string,
                isActive
            );

        if (!result) {
            throw new AppError(
                status.NOT_FOUND,
                "Banner not found"
            );
        }

        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message:
                "Banner status updated successfully",
            data: result,
        });
    }
);


export const bannerController = {
    createBanner,
    getAllBanner,
    getSingleBanner,
    updateBanner,
    deleteBanner,
    updateBannerStatus,
};
