import { useCallback, useState, useEffect, type ReactNode } from "react";

import {
  getOrders,
  addOrderItem,
  removeOrderItem,
  updateOrderItem,
} from "../../services/cart.service";

import { CartContext } from "./CartContext";

// Definimos el tipado de cartProvider que va a tener la propiedad children, esta sirve para que cualqier elemento que este dentro de él podrá acceder a las funciones y valores definidos
type CartProviderProps = {
  children: ReactNode;
};

export function CartProvider({ children }: CartProviderProps) {
  const [cartCount, setCartCount] = useState(0); // Estado que almacena la cantidad de productos

  const refreshCart = useCallback(async () => {
    const storedUser = localStorage.getItem("user");

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
        (order: { status: string; items: { quantity: number }[] }) =>
          order.status === "active",
      );

      if (!activeOrder) {
        setCartCount(0);
        return;
      }

      const totalItems = activeOrder.items.reduce(
        (total: number, item: { quantity: number }) => total + item.quantity,
        0,
      );

      setCartCount(totalItems);
    } catch (error) {
      console.error("Error al cargar el carrito:", error);
      setCartCount(0);
    }
  }, []);

  useEffect(() => {
    const loadCart = async () => {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        return;
      }

      const user = JSON.parse(storedUser);
      const userId = user?.id;

      if (!userId) {
        return;
      }

      try {
        const orders = await getOrders(userId);

        const activeOrder = orders.find(
          (order: { status: string; items: { quantity: number }[] }) =>
            order.status === "active",
        );

        if (!activeOrder) {
          setCartCount(0);
          return;
        }

        const totalItems = activeOrder.items.reduce(
          (total: number, item: { quantity: number }) => total + item.quantity,
          0,
        );

        setCartCount(totalItems);
      } catch (error) {
        console.error("Error al cargar el carrito:", error);
      }
    };

    loadCart();
  }, []);

  const addToCart = async (productVariantId: number, quantity: number) => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      throw new Error("No hay usuario autenticado");
    }

    const user = JSON.parse(storedUser);
    const userId = user.id;

    const orders = await getOrders(userId);

    const activeOrder = orders.find(
      (order: { status: string }) => order.status === "active",
    );

    if (!activeOrder) {
      throw new Error("No existe una orden activa");
    }

    await addOrderItem({
      quantity,
      productvariantId: productVariantId,
      orderId: activeOrder.id,
    });

    // Actualizamos el carrito con lo que ya habia sumandole la cantidad que hemos añadido
    setCartCount((currentCount) => currentCount + quantity);
  };

  const deleteFromCart = async (orderItemId: number, quantity: number) => {
    await removeOrderItem(orderItemId);

    // Actualiza el carrito con una operacion matematica que resta la cantidad actual menos la cantidad que acabamos de eliminar
    setCartCount((currentCount) => Math.max(0, currentCount - quantity));
  };

  const updateCartItem = async (
    orderItemId: number,
    oldQuantity: number,
    newQuantity: number,
  ) => {
    await updateOrderItem(orderItemId, newQuantity);

    // Guardamos la diferencia restando la nueva cantidad y la vieja
    const difference = newQuantity - oldQuantity;

    // Y actualizamos el carrito sumandole la diferencia
    setCartCount((currentCount) => Math.max(0, currentCount + difference));
  };

  const clearCart = () => {
    setCartCount(0);
  };

  return (
    <CartContext.Provider
      value={{
        cartCount,
        addToCart,
        deleteFromCart,
        updateCartItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
