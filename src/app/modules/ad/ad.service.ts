
import { Request } from "express";
import { Ad } from "./ad.model";
import { IAd } from "./ad.interface";
import { apiFeatures } from "../../../lib/apiFeatures";

// =====================================================
// Create Ad
// =====================================================

const createAdIntoDB = async (
    adInfo: IAd
) => {
    const result = await Ad.create(
        adInfo
    );

    return result;
};

// =====================================================
// Get Single Ad
// =====================================================

const getSingleAd = async (
    id: string
) => {
    const result = await Ad.findOne({
        _id: id,
        isDeleted: false,
    }).populate(
        "category",
        "name slug parent"
    );

    return result;
};

// =====================================================
// Get All Ads
// =====================================================

const getAllAdFromDB = async (
    req: Request
) => {
    const { mongooseQuery, total } =
        await apiFeatures(
            Ad,
            req.query
        );

    const result = await mongooseQuery
        .populate(
            "category",
            "name slug parent"
        );

    return {
        result,
        total,
    };
};



// =====================================================
// Update Ad
// =====================================================

const updateAdInDB = async (
    id: string,
    adInfo: Partial<IAd>
) => {
    const result =
        await Ad.findOneAndUpdate(
            {
                _id: id,
                isDeleted: false,
            },
            {
                $set: adInfo,
            },
            {
                new: true,
                runValidators: true,
            }
        ).populate(
            "category",
            "name slug parent"
        );

    return result;
};

// =====================================================
// Delete Ad
// =====================================================

const deleteAdFromDB = async (
    id: string
) => {
    const result =
        await Ad.findOneAndUpdate(
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
// Update Ad Status
// =====================================================


export const adService = {
    createAdIntoDB,
    getSingleAd,
    getAllAdFromDB,
    updateAdInDB,
    deleteAdFromDB,
};
