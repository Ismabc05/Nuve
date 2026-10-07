import { createContext } from 'react';

type CartContextType = {
  cartCount: number;
  addToCart: (
    productVariantId: number,
    quantity: number
  ) => Promise<void>;
  deleteFromCart: (orderItemId: number, quantity: number) => Promise<void>;
};

export const CartContext = createContext<
  CartContextType | undefined
>(undefined);