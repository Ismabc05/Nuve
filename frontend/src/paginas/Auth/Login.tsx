import '../../estilos/auth/login.css'

function Login() {
    return (
        <>
            <main className="login">
                <section className="login__container">

                    <img className="login__logo" src="/login.png" alt="Nuvé" />

                    <h1 className="login__title">¡Hola!</h1>

                    <p className="login__description">Introduce tu dirección de correo para iniciar sesión o registrarte</p>

                    <form className="login__form">
                        <label htmlFor="email">EMAIL:</label>
                        <input id="email" type="email" name="email" />
                        <label htmlFor="email">CONTRASEÑA:</label>
                        <input id="password" type="passwors" name="password" />
                        <p className="login__terms">
                            Al continuar, aceptas los términos y condiciones de Nuvé
                            y confirmas que has leído nuestra política de privacidad.
                        </p>
                        <button type="submit">Continuar</button>
                    </form>

                </section>
            </main>
        </>
    )
}

export default Login