export interface IShipping {
    area: string;
    amount: number;
}

export interface IShop {
    name: string;
    logo?: string;
    email?: string;
    phone: string;
    address?: string;
    defaultShippingCharge: number;
    shipping: IShipping[];

    facebook?: string;
    instagram?: string;
}