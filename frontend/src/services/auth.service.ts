const API_URL = 'https://nuve-miru.onrender.com'

export const findByEmail = async (email: string ) => {
    const response = await fetch(
        `${API_URL}/users/email/${encodeURIComponent(email)}`
    );

    if (!response.ok) {
        throw new Error('Error al buscar el usuario');
    }

    return await response.json()
}