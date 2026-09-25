export type ProductVariant = {
  id: number;
  size: string;
  color: string;
  colorHex: string;
  stock: number;
};

export type ProductImage = {
  id: number;
  url: string;
};

export type Product = {
  id: number;
  name: string;
  price: string;
  description: string;
  reviews: unknown;
  categories: {
    id: number;
    name: string;
  }[];
  variants: ProductVariant[];
  images: ProductImage[];
  brand: {
    id: number;
    name: string;
  };
};

export type Category = {
  id: number;
  name: string
  products: Product[]
}

export type Brand = {
  id: number;
  name: string
  products: Product[]
}