
/* =========================
   TIPOS DE ERRORES
   ========================= */

export type ProfileErrors = {
  name?: string;
  lastname?: string;
  phone?: string;
  zipCode?: string;
};

export type AddressErrors = {
  name?: string;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
};

/* =========================
   VALIDACIÓN DEL PERFIL
   ========================= */

type ProfileForm = {
  name: string;
  lastname: string;
  phone: string;
  zipCode: string;
};

export const validateProfile = (
  form: ProfileForm
): ProfileErrors => {
  const errors: ProfileErrors = {};

  const name = form.name.trim();
  const lastname = form.lastname.trim();
  const phone = form.phone.trim();
  const zipCode = form.zipCode.trim();

  const validName =
    /^[\p{L}\p{M}]+(?:[ '\u2019-][\p{L}\p{M}]+)*$/u;

  // Nombre
  if (!name) {
    errors.name = "El nombre es obligatorio.";
  } else if (name.length > 80 || !validName.test(name)) {
    errors.name = "Introduce un nombre válido.";
  }

  // Apellidos
  if (!lastname) {
    errors.lastname = "Los apellidos son obligatorios.";
  } else if (
    lastname.length > 100 ||
    !validName.test(lastname)
  ) {
    errors.lastname = "Introduce unos apellidos válidos.";
  }

  // Teléfono: opcional, pero debe ser válido si se introduce
  if (phone) {
    const digits = phone.replace(/\D/g, "");

    if (
      !/^\+?[0-9\s().-]+$/.test(phone) ||
      digits.length < 9 ||
      digits.length > 15
    ) {
      errors.phone =
        "Introduce un teléfono válido con entre 9 y 15 cifras.";
    }
  }

  // Código postal español: opcional
  if (zipCode && !/^\d{5}$/.test(zipCode)) {
    errors.zipCode =
      "El código postal español debe tener 5 cifras.";
  }

  return errors;
};

/* =========================
   VALIDACIÓN DE DIRECCIONES
   ========================= */

type AddressForm = {
  name: string;
  street: string;
  city: string;
  state: string;
  country: string;
};

export const validateAddress = (
  form: AddressForm
): AddressErrors => {
  const errors: AddressErrors = {};

  const fields = [
    {
      key: "name" as const,
      value: form.name,
      label: "El nombre",
    },
    {
      key: "street" as const,
      value: form.street,
      label: "La dirección",
    },
    {
      key: "city" as const,
      value: form.city,
      label: "La ciudad",
    },
    {
      key: "state" as const,
      value: form.state,
      label: "La provincia",
    },
    {
      key: "country" as const,
      value: form.country,
      label: "El país",
    },
  ];

  for (const field of fields) {
    const value = field.value.trim();

    if (!value) {
      errors[field.key] =
        `${field.label} es obligatorio.`;
    } else if (value.length > 120) {
      errors[field.key] =
        "No puede superar los 120 caracteres.";
    } else if ([...value].some((char) => {
       const code = char.charCodeAt(0);
        return code <= 31 || code === 127;
    })) {
      errors[field.key] = "El texto contiene caracteres no válidos.";
    }
  }

  return errors;
};

/* =========================
   VALIDACIÓN DE IMÁGENES
   ========================= */

export const validateProfileImage = (
  file: File
): string | null => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!allowedTypes.includes(file.type)) {
    return "La imagen debe ser JPG, PNG o WEBP.";
  }

  const maxSize = 5 * 1024 * 1024;

  if (file.size > maxSize) {
    return "La imagen no puede superar los 5 MB.";
  }

  return null;
};
