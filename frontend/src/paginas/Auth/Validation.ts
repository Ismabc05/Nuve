export const validateRegisterForm = (formData: {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    lastName: string;
    phone: string;
    zipCode: string;
}) => {

    const errors: Record<string, string> = {};

    if (!formData.email.trim()) {
        errors.email = 'El email es obligatorio';
    } else if (!formData.email.includes('@')) {
        errors.email = 'Introduce un email válido';
    }

    if (!formData.password) {
        errors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 8) {
        errors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (!formData.confirmPassword) {
        errors.confirmPassword = 'Debes confirmar la contraseña';
    } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.name.trim()) {
        errors.name = 'El nombre es obligatorio';
    }

    if (formData.phone && !/^[0-9]{9}$/.test(formData.phone)) {
        errors.phone = 'Introduce un teléfono válido';
    }

    if (formData.zipCode && !/^[0-9]{5}$/.test(formData.zipCode)) {
        errors.zipCode = 'Introduce un código postal válido';
    }

    return errors;
};