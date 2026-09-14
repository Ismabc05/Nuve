import '../../estilos/auth/login.css'
import { LuEye, LuEyeOff } from "react-icons/lu";
import { useState } from 'react';

function Login() {

    const [showPassword, setShowPassword] = useState(false);


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
                        <div className="login__password-wrapper">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                            />
                            <button
                                type="button"
                                className="login__password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showPassword ? <LuEyeOff size={20} /> : <LuEye size={20} />}
                            </button>
                        </div>

                        <p className="login__forgot__password">
                            ¿Has olvidado tu contraseña?
                        </p>

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