import {
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import {
  getOrders,
  addOrderItem,
  removeOrderItem,
} from '../../services/cart.service';

import { CartContext } from './CartContext';

type CartProviderProps = {
  children: ReactNode;
};

export function CartProvider({ children }: CartProviderProps) {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const loadCart = async () => {
      const storedUser = localStorage.getItem('user');

      if (!storedUser) {
        setCartCount(0);
        return;
      }

      const user = JSON.parse(storedUser);
      const userId = user?.id;

      if (!userId) {
        setCartCount(0);
        return;
      }

      try {
        const orders = await getOrders(userId);

        const activeOrder = orders.find(
          (order: {
            status: string;
            items: { quantity: number }[];
          }) => order.status === 'active'
        );

        if (!activeOrder) {
          setCartCount(0);
          return;
        }

        const totalItems = activeOrder.items.reduce(
          (total: number, item: { quantity: number }) =>
            total + item.quantity,
          0
        );

        setCartCount(totalItems);
      } catch (error) {
        console.error(
          'Error al cargar el carrito:',
          error
        );

        setCartCount(0);
      }
    };

    loadCart();
  }, []);

  const addToCart = async (
    productVariantId: number,
    quantity: number
  ) => {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      throw new Error('No hay usuario autenticado');
    }

    const user = JSON.parse(storedUser);
    const userId = user.id;

    const orders = await getOrders(userId);

    const activeOrder = orders.find(
      (order: { status: string }) =>
        order.status === 'active'
    );

    if (!activeOrder) {
      throw new Error('No existe una orden activa');
    }

    await addOrderItem({
      quantity,
      productvariantId: productVariantId,
      orderId: activeOrder.id,
    });

    setCartCount(
      (currentCount) => currentCount + quantity
    );
  };

  const deleteFromCart = async (
    orderItemId: number,
    quantity: number
  ) => {
    await removeOrderItem(orderItemId);

    setCartCount((currentCount) =>
      Math.max(0, currentCount - quantity)
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartCount,
        addToCart,
        deleteFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}