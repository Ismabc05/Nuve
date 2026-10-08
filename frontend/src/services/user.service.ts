import type { AddressData, UserData } from "../types/perfil";

const API_URL = 'https://nuve-miru.onrender.com';

export const getUser = async (userId: number) => {
  const token = localStorage.getItem('token');

    if (!token) {
    throw new Error('No hay token de autenticación');
    };

    const response = await fetch(
        `${API_URL}/users/${userId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error('Error al obtener el usuario');
    }

    return await response.json();
}

export const getAddresses = async (userId: number) => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(
    `${API_URL}/users/${userId}/address`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // El usuario no tiene direcciones
  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new Error(
      'Error al obtener las direcciones'
    );
  }

  return await response.json();
};


export const updateUser = async (
  userId: number,
  userData: UserData
) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No hay token de autenticación");
  }

  const response = await fetch(
    `${API_URL}/users/${userId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    }
  );

  if (!response.ok) {
    const errorData = await response.text();

    console.error(
      "Error del backend:",
      response.status,
      errorData
    );

    throw new Error(
      `Error al actualizar el usuario: ${response.status} ${errorData}`
    );
  }

  return await response.json();
};
export const createAddress = async (userId: number, addressData: AddressData) => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(
    `${API_URL}/users/${userId}/address`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(addressData),
    }
  ); 

  if (!response.ok) {
    throw new Error('Error al crear la dirección');
  }

  return await response.json();
}

export const updateAddress = async (userId: number, addressId: number, addressData: AddressData) => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(
    `${API_URL}/users/${userId}/addresses/${addressId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(addressData),
    }
  );

  if (!response.ok) {
    throw new Error('Error al actualizar la dirección');
  }
  return await response.json();
}

