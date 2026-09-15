const API_URL = 'https://nuve-miru.onrender.com';

export const findByEmail = async (email: string) => {
    const response = await fetch(
        `${API_URL}/users/email/${encodeURIComponent(email)}`
    );

    if (response.status === 404) {
        return false;
    }

    if (!response.ok) {
        throw new Error('Error al buscar el usuario');
    }

    return await response.json();
};

export const login = async (email: string, password: string) => {
    const response = await fetch(
        `${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email, 
                password,
            }),
        }
    );

    if (!response.ok) {
        throw new Error('Error al crear el usuario');
    }

     return await response.json();
}