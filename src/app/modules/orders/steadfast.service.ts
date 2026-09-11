import status from "http-status";
import AppError from "../../../errors/AppError";
import { Shop } from "../shop/shop.model";

const STEADFAST_BASE_URL = "https://portal.packzy.com/api/v1";

interface ISteadfastOrderPayload {
    invoice: string;
    recipient_name: string;
    recipient_phone: string;
    recipient_email?: string;
    recipient_address: string;
    cod_amount: number;
    note?: string;
    item_description?: string;
    total_lot?: number;
    delivery_type?: number;
}

const createOrder = async (
    payload: ISteadfastOrderPayload
) => {
    const shop = await Shop.findOne({}).lean();

    const apiKey = shop?.steadfastApiKey?.trim();
    const secretKey = shop?.steadfastSecretKey?.trim();
    if (!apiKey || !secretKey) {
        throw new AppError(
            status.BAD_REQUEST,
            "Steadfast API key and secret key are not configured"
        );
    }

    const response = await fetch(
        `${STEADFAST_BASE_URL}/create_order`,
        {
            method: "POST",

            headers: {
                "Api-Key": apiKey,

                "Secret-Key": secretKey,

                "Content-Type":
                    "application/json",
            },

            body: JSON.stringify(payload),
        }
    );

    const data = await response.json();
    if (!response.ok) {
        throw new AppError(
            status.BAD_REQUEST,
            data?.message ||
            "Failed to create Steadfast shipment"
        );
    }

    return data;
};

export const SteadfastService = {
    createOrder,
};