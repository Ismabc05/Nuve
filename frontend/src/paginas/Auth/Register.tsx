import '../../estilos/auth/register.css'
import { LuEye, LuEyeOff } from "react-icons/lu";
import { useState } from 'react';

function Register() {

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);
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

        <form className="register__form">
          <div className="register__fields">
            <div className="register__field">
              <label htmlFor="email">
                Email <span>*</span>
              </label>

              <input
                id="email"
                type="email"
                name="email"
                required
              />
            </div>

            <div className="register__field">
              <label htmlFor="password">
                Contraseña <span>*</span>
              </label>

              <div className="register__password-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                />
                <button
                  type="button"
                  className="register__password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <LuEyeOff size={20} /> : <LuEye size={20} />}
                </button>
              </div>
            </div>

            <div className="register__field">
              <label htmlFor="confirmPassword">
                Confirmar contraseña <span>*</span>
              </label>

              <div className="register__password-wrapper">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                />
                <button
                  type="button"
                  className="register__password-toggle"
                  onClick={() => setConfirmShowPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showConfirmPassword ? <LuEyeOff size={20} /> : <LuEye size={20} />}
                </button>
              </div>
            </div>

            <div className="register__field">
              <label htmlFor="name">
                Nombre <span>*</span>
              </label>

              <input
                id="name"
                type="text"
                name="name"
                required
              />
            </div>

            <div className="register__field">
              <label htmlFor="lastName">
                Apellidos <span>(opcional)</span>
              </label>

              <input
                id="lastName"
                type="text"
                name="lastName"
              />
            </div>

            <div className="register__field">
              <label htmlFor="phone">
                Teléfono <span>(opcional)</span>
              </label>

              <input
                id="phone"
                type="tel"
                name="phone"
              />
            </div>

            <div className="register__field">
              <label htmlFor="postalCode">
                Código postal <span>(opcional)</span>
              </label>

              <input
                id="postalCode"
                type="text"
                name="postalCode"
              />
            </div>

            <div className="register__field">
              <label htmlFor="image">
                Foto de perfil <span>(opcional)</span>
              </label>

              <input
                id="image"
                type="file"
                name="image"
                accept="image/*"
              />
            </div>
          </div>

          <button className="register__button" type="submit">
            CREAR CUENTA
          </button>
        </form>
      </section>
    </main>
  );
}

export default Register;