
import { Request } from "express";
import { Types } from "mongoose";

import { Banner } from "./banner.model";

// import apiFeatures from "../../utils/apiFeatures";

import { IBanner } from "./banner.interface";
import { apiFeatures } from "../../../lib/apiFeatures";


// =====================================================
// Create Banner
// =====================================================

const createBannerIntoDB = async (
    bannerInfo: IBanner
) => {
    const result = await Banner.create(
        bannerInfo
    );

    return result;
};


// =====================================================
// Get Single Banner
// =====================================================

const getSingleBanner = async (
    id: string
) => {
    const result = await Banner.findOne({
        _id: id,
        isDeleted: false,
    });

    return result;
};


// =====================================================
// Get All Banners
// =====================================================

const getAllBannerFromDB = async (
    req: Request
) => {
    const { mongooseQuery, total } = await apiFeatures(Banner, req.query);

    const result = await mongooseQuery;

    return { result, total }
};


// =====================================================
// Update Banner
// =====================================================

const updateBannerInDB = async (
    id: string,
    bannerInfo: Partial<IBanner>
) => {
    const result =
        await Banner.findOneAndUpdate(
            {
                _id: id,
                isDeleted: false,
            },
            {
                $set: bannerInfo,
            },
            {
                new: true,
                runValidators: true,
            }
        );

    return result;
};


// =====================================================
// Delete Banner
// =====================================================

const deleteBannerFromDB = async (
    id: string
) => {
    const result =
        await Banner.findOneAndUpdate(
            {
                _id: id,
                isDeleted: false,
            },
            {
                $set: {
                    isDeleted: true,
                },
            },
            {
                new: true,
            }
        );

    return result;
};


// =====================================================
// Update Banner Status
// =====================================================

const updateBannerStatusInDB = async (
    id: string,
    isActive: boolean
) => {
    const result =
        await Banner.findOneAndUpdate(
            {
                _id: id,
                isDeleted: false,
            },
            {
                $set: {
                    isActive,
                },
            },
            {
                new: true,
                runValidators: true,
            }
        );

    return result;
};


export const bannerService = {
    createBannerIntoDB,
    getSingleBanner,
    getAllBannerFromDB,
    updateBannerInDB,
    deleteBannerFromDB,
    updateBannerStatusInDB,
};
