import '../../estilos/auth/register.css';

import { LuEye, LuEyeOff } from 'react-icons/lu';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { validateRegisterForm } from './Validation';
import { uploadImage, createUser } from '../../services/auth.service';
import { Spinner } from './Spinner';

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);

  const [formData, setFormData] = useState<{
    //Tipado de datos del formulario
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    lastName: string;
    phone: string;
    zipCode: string;
    image: File | null;
  }>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    lastName: '',
    phone: '',
    zipCode: '',
    image: null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ serverError, setServerError ] = useState('')
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate()

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const validationErrors = validateRegisterForm(formData);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setServerError('')
      setLoading(true);

      let imageUrl = '';

      if (formData.image) {
        imageUrl = await uploadImage(formData.image);
      }

       await createUser({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        lastname: formData.lastName,
        phone: formData.phone,
        zipCode: formData.zipCode,
        image: imageUrl
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 5000);

    } catch (error) {
      console.error('Error al crear el usuario:', error);
      setServerError('Ha ocurrido un error al crear la cuenta. Inténtalo de nuevo.')

    } finally {
      setLoading(false);
    }
  };

  const clearFieldError = (field: string) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: ''
    }));
  };

  return (
    <main className="register">
      <section className="register__container">

        <img
          className="register__logo"
          src="/login.png"
          alt="Nuvé"
        />

        <h1 className="register__title">
          Crear cuenta
        </h1>

        <form
          className="register__form"
          onSubmit={handleSubmit}
          noValidate // No hace las validacion predeterminadas
        >

          <div className="register__fields">

            <div className="register__field">
              <label htmlFor="email">
                Email <span>*</span>
              </label>

              <input
                id="email"
                type="email"
                name="email"
                disabled={loading}
                value={formData.email}
                onFocus={() => clearFieldError('email')}
                onChange={(event) => {
                  setFormData({
                    ...formData,
                    email: event.target.value
                  });
                }}
              />

              <p className={`error ${errors.email ? 'error--visible' : ''}`}>
                {errors.email}
              </p>
            </div>

            <div className="register__field">
              <label htmlFor="password">
                Contraseña <span>*</span>
              </label>

              <div className="register__password-wrapper">

                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onFocus={() => clearFieldError('password')}
                  disabled={loading}
                  onChange={(event) => {
                    setFormData({
                      ...formData,
                      password: event.target.value
                    });
                  }}
                />

                <button
                  type="button"
                  className="register__password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  aria-label={
                    showPassword
                      ? 'Ocultar contraseña'
                      : 'Mostrar contraseña'
                  }
                >
                  {showPassword
                    ? <LuEyeOff size={20} />
                    : <LuEye size={20} />
                  }
                </button>

              </div>

              <p className={`error ${errors.password ? 'error--visible' : ''}`}>
                {errors.password}
              </p>
            </div>

            <div className="register__field">
              <label htmlFor="confirmPassword">
                Confirmar contraseña <span>*</span>
              </label>

              <div className="register__password-wrapper">

                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onFocus={() => clearFieldError('confirmPassword')}
                  disabled={loading}
                  onChange={(event) => {
                    setFormData({
                      ...formData,
                      confirmPassword: event.target.value
                    });
                  }}
                />

                <button
                  type="button"
                  className="register__password-toggle"
                  disabled={loading}
                  onClick={() =>
                    setConfirmShowPassword(!showConfirmPassword)
                  }
                  aria-label={
                    showConfirmPassword
                      ? 'Ocultar contraseña'
                      : 'Mostrar contraseña'
                  }
                >
                  {showConfirmPassword
                    ? <LuEyeOff size={20} />
                    : <LuEye size={20} />
                  }
                </button>

              </div>

              <p className={`error ${errors.confirmPassword ? 'error--visible' : ''}`}>
                {errors.confirmPassword}
              </p>
            </div>

            <div className="register__field">
              <label htmlFor="name">
                Nombre <span>*</span>
              </label>

              <input
                id="name"
                type="text"
                name="name"
                disabled={loading}
                onFocus={() => clearFieldError('name')}
                value={formData.name}
                onChange={(event) => {
                  setFormData({
                    ...formData,
                    name: event.target.value
                  });
                }}
              />

              <p className={`error ${errors.name ? 'error--visible' : ''}`}>
                {errors.name}
              </p>
            </div>

            <div className="register__field">
              <label htmlFor="lastName">
                Apellidos <span>(opcional)</span>
              </label>

              <input
                id="lastName"
                type="text"
                name="lastName"
                disabled={loading}
                onFocus={() => clearFieldError('lastName')}
                value={formData.lastName}
                onChange={(event) => {
                  setFormData({
                    ...formData,
                    lastName: event.target.value
                  });
                }}
              />

              <p className={`error ${errors.lastName ? 'error--visible' : ''}`}>
                {errors.lastName}
              </p>
            </div>

            <div className="register__field">
              <label htmlFor="phone">
                Teléfono <span>(opcional)</span>
              </label>

              <input
                id="phone"
                type="tel"
                name="phone"
                disabled={loading}
                onFocus={() => clearFieldError('phone')}
                value={formData.phone}
                onChange={(event) => {
                  setFormData({
                    ...formData,
                    phone: event.target.value
                  });
                }}
              />

              <p className={`error ${errors.phone ? 'error--visible' : ''}`}>
                {errors.phone}
              </p>
            </div>

            <div className="register__field">
              <label htmlFor="zipCode">
                Código postal <span>(opcional)</span>
              </label>

              <input
                id="zipCode"
                type="text"
                name="zipCode"
                disabled={loading}
                value={formData.zipCode}
                onFocus={() => clearFieldError('zipCode')}
                onChange={(event) => {
                  setFormData({
                    ...formData,
                    zipCode: event.target.value
                  });
                }}
              />

              <p className={`error ${errors.zipCode ? 'error--visible' : ''}`}>
                {errors.zipCode}
              </p>
            </div>

            <div className="register__field">
              <label htmlFor="image">
                Foto de perfil <span>(opcional)</span>
              </label>

              <div className="register__file-wrapper">

                <input
                  id="image"
                  type="file"
                  name="image"
                  disabled={loading}
                  onFocus={() => clearFieldError('image')}
                  // solo acepta imagenes
                  accept="image/*"
                  className="register__file-input"
                  onChange={(event) => {
                    setFormData({
                      ...formData,
                      // Guarda la imagen seleccionada o null si no existe
                      image: event.target.files?.[0] ?? null
                    });
                  }}
                />

                <label
                  htmlFor="image"
                  className="register__file-label"
                >

                  {formData.image ? (
                    <img
                          // Crea una URL temporal para poder mostrar el archivo seleccionado
                          // sin necesidad de subirlo todavía a Cloudinary
                      src={URL.createObjectURL(formData.image)}
                      alt="Vista previa de la foto de perfil"
                      className="register__file-preview"
                    />
                  ) : (
                    <span className="register__file-text">
                      Ningún archivo seleccionado
                    </span>
                  )}

                  <span className="register__file-button">
                    Seleccionar archivo
                  </span>

                </label>

              </div>

              <p className={`error ${errors.image ? 'error--visible' : ''}`}>
                {errors.image}
              </p>
            </div>

          </div>

          <button
            type="submit"
            className="register__button"
            disabled={loading}
          >
            {loading ? <Spinner /> : 'CREAR CUENTA'}
          </button>
          {success && (
            <div className="register__notification register__notification--success">
              <div className="register__notification-content">
                <span className="register__notification-icon">✓</span>

                <div className="register__notification-text">
                  <p>Tu cuenta se ha creado correctamente. Redirigiendo al inicio de sesión...</p>
                </div>
              </div>
            </div>
          )}

          {serverError && ( <p className="error error--visible">{serverError}</p>)}

        </form>

      </section>
    </main>
  );
}

export default Register;
