
import { Request, Response } from "express";
import status from "http-status";
import fs from "fs";
import path from "path";

import { ShopServices } from "./shop.service";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";

const getShopInfo = catchAsync(
    async (req: Request, res: Response) => {
        const result = await ShopServices.getShopInfo();

        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: "Shop information retrieved successfully",
            data: result,
        });
    }
);

const updateShopInfo = catchAsync(
    async (req: Request, res: Response) => {
        const shopInfo = req.body;

        // Get existing shop
        const existingShop =
            await ShopServices.getShopInfo();
        // New logo uploaded
        if (req.file) {
            // Delete old logo
            if (existingShop?.logo) {
                const oldPath = path.join(
                    process.cwd(),
                    existingShop.logo
                );

                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }

            // Save new logo path
            shopInfo.logo =
                `/uploads/shops/${req.file.filename}`;
        }

        const result =
            await ShopServices.updateShopInfo(
                shopInfo
            );

        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message:
                "Shop information updated successfully",
            data: result,
        });
    }
);

export const ShopControllers = {
    getShopInfo,
    updateShopInfo,
};

