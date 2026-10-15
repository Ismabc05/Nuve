import { useEffect, useState, type ReactNode, } from 'react';

import { getOrders, addOrderItem, removeOrderItem, updateOrderItem, } from '../../services/cart.service';

import { CartContext } from './CartContext';

// Definimos el tipado de cartProvider que va a tener la propiedad children, esta sirve para que cualqier elemento que este dentro de él podrá acceder a las funciones y valores definidos
type CartProviderProps = {
  children: ReactNode;
};

export function CartProvider({ children }: CartProviderProps) {
  const [cartCount, setCartCount] = useState(0); // Estado que almacena la cantidad de productos
  
  // Gracias a [], se ejecuta cuando se monta el componente, en este caso el Navbar que es el que usa esto para mostrar el numero de productos
  useEffect(() => {
    const loadCart = async () => {
      // Cogemos el usuario
      const storedUser = localStorage.getItem('user');

      //Verificamos que exista
      if (!storedUser) {
        setCartCount(0);
        return;
      }

      // Se parsea ya que cuando lo extraes de localsotrage vienen como string y necesitos pasearlo para convetirlo en objeto y poder sacar el user.id
      const user = JSON.parse(storedUser);
      const userId = user?.id;

      // Verfificamos que exista
      if (!userId) {
        setCartCount(0);
        return;
      }

      try {
        // Hacemos el fetch
        const orders = await getOrders(userId);

        // Buscamos dentro de orders, la order que tenga el status como active
        const activeOrder = orders.find(
          (order: {
            status: string;
            items: { quantity: number }[];
          }) => order.status === 'active'
        );

        // Verificamos que exista
        if (!activeOrder) {
          setCartCount(0);
          return;
        }

        // reduce recorre el array y va acumulando la suma hasta tener el total
        const totalItems = activeOrder.items.reduce(
          (total: number, item: { quantity: number }) =>
            total + item.quantity,
          0
        );

        // Actualizamos el carrito con esa suma
        setCartCount(totalItems);
      } catch (error) {
        console.error(
          'Error al cargar el carrito:',
          error
        );

        // Si hay un error no se imprime nada
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

    // Actualizamos el carrito con lo que ya habia sumandole la cantidad que hemos añadido
    setCartCount(
      (currentCount) => currentCount + quantity
    );
  };

  const deleteFromCart = async (
    orderItemId: number,
    quantity: number
  ) => {
    await removeOrderItem(orderItemId);

    // Actualiza el carrito con una operacion matematica que resta la cantidad actual menos la cantidad que acabamos de eliminar
    setCartCount((currentCount) =>
      Math.max(0, currentCount - quantity)
    );
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
    setCartCount((currentCount) =>
      Math.max(0, currentCount + difference)
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartCount,
        addToCart,
        deleteFromCart,
        updateCartItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}