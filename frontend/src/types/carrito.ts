export type CartItem = {
  id: number;
  quantity: number;
  unitPrice: number;
  productvariant: {
    id: number;
    size: string;
    color: string;
    colorHex: string;
    product: {
      id: number;
      name: string;
      price: number;
      images: {
        id: number;
        url: string;
      }[];
    };
  };
};

export type Order = {
  id: number;
  status: string;
  total: number;
  items: CartItem[];
};

export type CreateOrderItem = {
  quantity: number;
  productvariantId: number;
  orderId: number;
};