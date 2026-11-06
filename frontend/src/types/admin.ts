import type { Product, ProductImage, ProductVariant } from "./product";

export type AdminUser = {
    id: number;
    email: string;
    role: string;
    profile?: {
        id?: number;
        name?: string;
        lastname?: string;
        phone?: string;
        image?: string;
        zip_code?: string;
    } | null;
};

export type AdminOrder = {
    id: number;
    status: string;
    total: number | string;
    paid: boolean;
    createdAt?: string;
    user?: AdminUser;
    items?: {
        id: number;
        quantity: number;
        unitPrice: number | string;
        productvariant?: ProductVariant & {
            product?: Product;
        };
    }[];
};

export type AdminImage = ProductImage & {
    product?: Pick<Product, "id" | "name">;
};

export type AdminVariant = ProductVariant & {
    product?: Pick<Product, "id" | "name">;
};
