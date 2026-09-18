const API_URL = 'https://nuve-miru.onrender.com';
const CLOUDINARY_CLOUD_NAME = 'nefbv7lf'; // Nombre único de tu cuenta/Cloudinary Cloud donde se almacenan las imágenes.
const CLOUDINARY_UPLOAD_PRESET = 'nuve_profile_images'; // Configuración que indica cómo se pueden subir las imágenes a Cloudinary.

export const findByEmail = async (email: string) => {
    const response = await fetch(
        // encodeURIComponent: Codifica el email para pasarlo de forma segura como parte de la URL.
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
        throw new Error('Error al iniciar sesión.');
    }

     return await response.json();
}

// file va a ser de tipo File, es decir un archivo (imagen, pdf...)
export const uploadImage = async (file: File): Promise<string> => { 

    // Crea un FormData para preparar los datos que se enviarán a Cloudinary.
    const formData = new FormData(); 
    // Añade el archivo que queremos subir.
    formData.append('file', file);
    //Añade el preset que indica la configuración de subida de Cloudinary.
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET); 
    
    const response = await fetch( 
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { 
            method: 'POST', 
            body: formData, 
        }); 
        if (!response.ok) { 
            throw new Error('Error al subir la imagen'); 
        } 
        const data = await response.json(); 
        
        return data.secure_url; 
};

export const createUser = async (data: {
    email: string,
    password: string,
    name: string,
    lastname: string,
    phone: string,
    zipCode: string,
    image: string,
}) => {
    const response = await fetch(
        `${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    );

    if(!response.ok) {
        throw new Error('Error al crear el usuario');
    }

    return await response.json()
}