const API_URL = 'https://nuve-miru.onrender.com';

export const products = async () => {
    const response = await fetch(
        `${API_URL}/products`
    );

    if (response.status === 404) {
        return false;
    }

    if (!response.ok) {
        throw new Error('Error al buscar los productos');
    }

    return await response.json();
};
