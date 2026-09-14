import '../../estilos/auth/register.css'

function Register() {
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

              <input
                id="password"
                type="password"
                name="password"
                required
              />
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
                required
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
                required
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
                required
              />
            </div>

            <div className="register__field register__field--full">
              <label htmlFor="image">
                Imagen <span>(opcional)</span>
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