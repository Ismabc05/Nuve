const API_URL = 'https://nuve-miru.onrender.com';

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