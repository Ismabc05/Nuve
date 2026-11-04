import type { Brand, Category, Product, ProductImage, ProductVariant } from "../types/product";

const API_URL = "https://nuve-miru.onrender.com";

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

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Tu sesión ha caducado. Inicia sesión para continuar.");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    let message = body;
    try {
      const parsed = JSON.parse(body) as { message?: string | string[] };
      message = Array.isArray(parsed.message)
        ? parsed.message.join(", ")
        : parsed.message ?? body;
    } catch {
      // The API may return a plain-text error.
    }
    throw new Error(message || `Error del servidor (${response.status})`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const body = await response.text();
  return body ? (JSON.parse(body) as T) : (undefined as T);
}

const json = (method: string, value?: unknown): RequestInit => ({
  method,
  ...(value === undefined ? {} : { body: JSON.stringify(value) }),
});

export const getAdminProducts = () => request<Product[]>("/products");
export const getAdminCategories = () => request<Category[]>("/categories");
export const getAdminBrands = () => request<Brand[]>("/brands");
export const getAdminUsers = () => request<AdminUser[]>("/users");
export const getAdminOrders = () => request<AdminOrder[]>("/orders");
export const getAdminVariants = () => request<AdminVariant[]>("/product-variant");
export const getAdminImages = () => request<AdminImage[]>("/product-image");

export const createAdminProduct = (data: {
  name: string;
  price: number;
  description: string;
  categories: number[];
  brandId: number;
}) => request<Product>("/products", json("POST", data));

export const updateAdminProduct = (
  id: number,
  data: {
    name: string;
    price: number;
    description: string;
    categories: number[];
    brandId: number;
  },
) => request<Product>(`/products/${id}`, json("PUT", data));

export const deleteAdminProduct = (id: number) =>
  request<void>(`/products/${id}`, json("DELETE"));

export const createAdminCategory = (name: string) =>
  request<Category>("/categories", json("POST", { name }));
export const updateAdminCategory = (id: number, name: string) =>
  request<Category>(`/categories/${id}`, json("PUT", { name }));
export const deleteAdminCategory = (id: number) =>
  request<void>(`/categories/${id}`, json("DELETE"));

export const createAdminBrand = (name: string) =>
  request<Brand>("/brands", json("POST", { name }));
export const updateAdminBrand = (id: number, name: string) =>
  request<Brand>(`/brands/${id}`, json("PUT", { name }));
export const deleteAdminBrand = (id: number) =>
  request<void>(`/brands/${id}`, json("DELETE"));

export const updateAdminOrder = (id: number, status: string) =>
  request<AdminOrder>(`/orders/${id}`, json("PUT", { status }));
export const deleteAdminUser = (id: number) =>
  request<void>(`/users/${id}`, json("DELETE"));

export const createAdminVariant = (data: {
  size: string;
  color: string;
  colorHex: string;
  stock: number;
  productId: number;
}) => request<AdminVariant>("/product-variant", json("POST", data));

export const updateAdminVariant = (
  id: number,
  data: {
    size: string;
    color: string;
    colorHex: string;
    stock: number;
    productId: number;
  },
) => request<AdminVariant>(`/product-variant/${id}`, json("PUT", data));

export const deleteAdminVariant = (id: number) =>
  request<void>(`/product-variant/${id}`, json("DELETE"));

export const createAdminImage = (data: { url: string; productId: number }) =>
  request<AdminImage>("/product-image", json("POST", data));
export const deleteAdminImage = (id: number) =>
  request<void>(`/product-image/${id}`, json("DELETE"));
