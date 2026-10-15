import { createContext } from 'react';

// Definimos lo que va a contener el provider
type CartContextType = {
  cartCount: number; // Contador de productos que hay en el carrito
  addToCart: ( //funcion que añade
    productVariantId: number,
    quantity: number
  ) => Promise<void>;
  updateCartItem: ( // Funcion que actualiza
    orderItemId: number,
    oldQuantity: number,
    newQuantity: number
  ) => Promise<void>;
  deleteFromCart: (orderItemId: number, quantity: number) => Promise<void>; // funcion que elimina
  clearCart: () => void;
  refreshCart: () => Promise<void>;
};

export const CartContext = createContext< // Carcontext va a ser un contexto de el tipo que hemos definido
  CartContextType | undefined
>(undefined);