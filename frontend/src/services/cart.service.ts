const API_URL = 'https://nuve-miru.onrender.com';
import type { CreateOrderItem } from '../types/product';

export const getOrders = async (userId: number) => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(
    `${API_URL}/orders?userId=${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Error al obtener los pedidos');
  }

  return await response.json();
};

export const addOrderItem = async (
  orderItem: CreateOrderItem
) => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(`${API_URL}/order-item`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderItem),
  });

  if (!response.ok) {
    throw new Error('Error al añadir el producto al carrito');
  }

  return await response.json();
};

export const removeOrderItem = async (
  orderItemId: number
) => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(`${API_URL}/order-item/${orderItemId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al eliminar el producto del carrito');
  }

  return await response.json();
};