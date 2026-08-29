import { status } from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { cartService } from "./cart.service";

const addToCart = catchAsync(async (req, res) => {
    const result = await cartService.addToCartIntoDB(
        req.user.userId,
        req.body
    );

    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: "Product added to cart",
        data: result,
    });
});

const getCart = catchAsync(async (req, res) => {
    const { result, total } = await cartService.getCartFromDB(
        req,
        req.user.userId
    );
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        total,
        count: result.length,
        message: "Cart retrieved successfully",
        data: result,
    });
});

const updateCart = catchAsync(async (req, res) => {
    const result = await cartService.updateCartInDB(
        req.user.userId,
        req.params.id as string,
        req.body.quantity
    );

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Cart updated successfully",
        data: result,
    });
});

const removeCart = catchAsync(async (req, res) => {
    const result = await cartService.removeCartItemFromDB(
        req.user.userId,
        req.params.id as string
    );

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Cart item removed",
        data: result,
    });
});

const clearCart = catchAsync(async (req, res) => {
    await cartService.clearCartFromDB(req.user.userId);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Cart cleared successfully",
        data: [],
    });
});

const mergeCart = catchAsync(async (req, res) => {
    await cartService.mergeCartIntoDB(
        req.user.userId,
        req.body.items
    );

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Cart merged successfully",
        data: [],
    });
});

export const cartController = {
    addToCart,
    getCart,
    updateCart,
    removeCart,
    clearCart,
    mergeCart,
};