const API_URL = import.meta.env.VITE_API_URL;

// Función auxiliar para realizar las peticiones

const getHeaders = () => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Tu sesión ha caducado. Inicia sesión para continuar.");
    }

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
};


// PRODUCTOS

export const createAdminProduct = async (data: {
    name: string;
    price: number;
    description: string;
    categories: number[];
    brandId: number;
}) => {
    const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Error al crear el producto");
    }

    return await response.json();
};

export const updateAdminProduct = async (
    id: number,
    data: {
        name: string;
        price: number;
        description: string;
        categories: number[];
        brandId: number;
    }
) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Error al actualizar el producto");
    }

    return await response.json();
};

export const deleteAdminProduct = async (id: number) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error("Error al eliminar el producto");
    }
};


// CATEGORÍAS

export const createAdminCategory = async (name: string) => {
    const response = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ name }),
    });

    if (!response.ok) {
        throw new Error("Error al crear la categoría");
    }

    return await response.json();
};

export const updateAdminCategory = async (id: number, name: string) => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ name }),
    });

    if (!response.ok) {
        throw new Error("Error al actualizar la categoría");
    }

    return await response.json();
};

export const deleteAdminCategory = async (id: number) => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error("Error al eliminar la categoría");
    }
};


// MARCAS

export const createAdminBrand = async (name: string) => {
    const response = await fetch(`${API_URL}/brands`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ name }),
    });

    if (!response.ok) {
        throw new Error("Error al crear la marca");
    }

    return await response.json();
};

export const updateAdminBrand = async (id: number, name: string) => {
    const response = await fetch(`${API_URL}/brands/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ name }),
    });

    if (!response.ok) {
        throw new Error("Error al actualizar la marca");
    }

    return await response.json();
};

export const deleteAdminBrand = async (id: number) => {
    const response = await fetch(`${API_URL}/brands/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error("Error al eliminar la marca");
    }
};

// USUARIOS

export const getAdminUsers = async () => {
    const response = await fetch(`${API_URL}/users`, {
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error("Error al obtener los usuarios");
    }

    return await response.json();
};

export const deleteAdminUser = async (id: number) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error("Error al eliminar el usuario");
    }
};

// PEDIDOS

export const getAdminOrders = async () => {
    const response = await fetch(`${API_URL}/orders`, {
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error("Error al obtener los pedidos");
    }

    return await response.json();
};

export const updateAdminOrder = async (id: number, status: string) => {
    const response = await fetch(`${API_URL}/orders/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ status }),
    });

    if (!response.ok) {
        throw new Error("Error al actualizar el pedido");
    }

    return await response.json();
};

// VARIANTES DE PRODUCTOS

export const getAdminVariants = async () => {
    const response = await fetch(`${API_URL}/product-variant`, {
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error("Error al obtener las variantes");
    }

    return await response.json();
};

export const createAdminVariant = async (data: {
    size: string;
    color: string;
    colorHex: string;
    stock: number;
    productId: number;
}) => {
    const response = await fetch(`${API_URL}/product-variant`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Error al crear la variante");
    }

    return await response.json();
};

export const updateAdminVariant = async (
    id: number,
    data: {
        size: string;
        color: string;
        colorHex: string;
        stock: number;
        productId: number;
    }
) => {
    const response = await fetch(`${API_URL}/product-variant/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Error al actualizar la variante");
    }

    return await response.json();
};

export const deleteAdminVariant = async (id: number) => {
    const response = await fetch(`${API_URL}/product-variant/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error("Error al eliminar la variante");
    }
};

// IMÁGENES DE PRODUCTOS

export const getAdminImages = async () => {
    const response = await fetch(`${API_URL}/product-image`, {
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error("Error al obtener las imágenes");
    }

    return await response.json();
};

export const createAdminImage = async (data: {
    url: string;
    productId: number;
}) => {
    const response = await fetch(`${API_URL}/product-image`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Error al crear la imagen");
    }

    return await response.json();
};

export const deleteAdminImage = async (id: number) => {
    const response = await fetch(`${API_URL}/product-image/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error("Error al eliminar la imagen");
    }
};
