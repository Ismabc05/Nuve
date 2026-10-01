import type { Brand, Category, Product } from '../types/product'
const API_URL = 'https://nuve-miru.onrender.com';

export const products = async (): Promise<Product[]> => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(`${API_URL}/products`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al buscar los productos');
  }

  return await response.json();
};

export const productById = async (id: number): Promise<Product> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(`${API_URL}/products/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al buscar el producto');
  }

  return await response.json();
};

export const categories = async (): Promise<Category[]> => {
  const token = localStorage.getItem('token');

    if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(`${API_URL}/categories`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

    if (!response.ok) {
    throw new Error('Error al buscar las categorias');
  }

  return await response.json();
}

export const brands = async (): Promise<Brand[]> => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(`${API_URL}/brands`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

    if (!response.ok) {
    throw new Error('Error al buscar las marcas');
  }

  return await response.json();
}

export const addFavorite = async (userId: number, productId: number) => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(`${API_URL}/users/${userId}/favorites/${productId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al añadir el producto a favoritos');
  }

  return await response.json()

}

export const deleteFavorite = async (userId: number, productId: number) => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(`${API_URL}/users/${userId}/favorites/${productId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al eliminar el producto de favoritos');
  }

  return await response.json()

}

export const getFavorite = async (userId: number) => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(`${API_URL}/users/${userId}/favorites`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener los favoritos');
  }

  return await response.json()

}