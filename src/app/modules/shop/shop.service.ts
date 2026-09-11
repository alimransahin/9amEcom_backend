
import { IShop } from "./shop.interface";
import { Shop } from "./shop.model";

const getShopInfo = async () => {
    const result = await Shop.findOne();

    return result;
};

const updateShopInfo = async (payload: Partial<IShop>) => {
    const result = await Shop.findOneAndUpdate(
        {},
        {
            $set: payload,
        },
        {
            new: true,
            upsert: true,
            runValidators: true,
        }
    );


    return result;
};

export const ShopServices = {
    getShopInfo,
    updateShopInfo,
};
