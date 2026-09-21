import '../../estilos/auth/login.css'
import { LuEye, LuEyeOff } from "react-icons/lu";
import { useState } from 'react';
import { findByEmail, login } from '../../services/auth.service';
import { useNavigate} from 'react-router-dom';
import { Spinner } from './Spinner';

function Login() {

    const [ email, setEmail] = useState('');
    const [ password, setPasword] = useState('');
    const [ showPassword, setShowPassword] = useState(false);
    const [showPasswordIcon, setShowPasswordIcon] = useState(false);
    const [ loading, setLoading] = useState(false);
    const [ error, setError] = useState('');
    const navigate = useNavigate()

    const handleContinue = async (event: React.SubmitEvent) => {

        event.preventDefault()

        if (!email) {

            setError('Debes introducir un correo electrónico');

            return;
        }

        if (!email.includes('@')) {

            setError('Debes introducir un correo electrónico válido')

            return;
        }

        if (showPassword) {

            if (!password) {

                setError('Debes introducir tu contraseña')

                return;
            }

            setError('')
            setLoading(true)

            setTimeout(async () => {

                try {

                    const data = await login(email, password)

                    localStorage.setItem('token', data.access_token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    navigate('/products')

                } catch {

                    setError('El correo o la contraseña no son correctos')

                } finally {

                    setLoading(false)

                }

            }, 2000)

            return;
        }

        setError('')
        setLoading(true)

        setTimeout(async () => {

            try {

                const user = await findByEmail(email)

                if (!user) {
                    navigate('/register', {
                        state: { email },
                    });

                    return;
                }

                setShowPassword(true);

            } catch {

                setError('Ha ocurrido un error. Intentalo de nuevo')

            } finally {

                setLoading(false)

            }

        }, 2000)
    };


    return (
        <>
            <main  className="login">
                <section className="login__container">

                    <img className="login__logo" src="/login.png" alt="Nuvé" />

                    <h1 className="login__title">¡Hola!</h1>

                    <p className="login__description">Introduce tu dirección de correo para iniciar sesión o registrarte</p>

                    <form className="login__form" onSubmit={handleContinue}>

                        <label htmlFor="email">EMAIL:</label>
                        <input id="email" type="text" value={email} name="email"  onFocus={() => setError('')} onChange={(event) => {
                            setEmail(event.target.value)
                        }} />
                        
                        {!showPassword && (
                            <p className={`error ${error ? 'error--visible' : ''}`}>
                            {error}
                            </p>
                        )}

                        {showPassword && (
                            <><label htmlFor="password">CONTRASEÑA:</label><div className="login__password-wrapper">
                                <input
                                    id="password"
                                    type={showPasswordIcon ? "text" : "password"}
                                    value={password}
                                    name="password"
                                     onFocus={() => setError('')}
                                    onChange={(event) => {
                                        setPasword(event.target.value);
                                    } } />
                                <button
                                    type="button"
                                    className="login__password-toggle"
                                    onClick={() => setShowPasswordIcon(!showPasswordIcon)}
                                    aria-label={showPasswordIcon ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {showPasswordIcon ? <LuEyeOff size={20} /> : <LuEye size={20} />}
                                </button>
                                <p className={`error ${error ? 'error--visible' : ''}`}>
                                    {error}
                                </p>
                            </div>

                            <p className="login__forgot__password">
                                ¿Has olvidado tu contraseña?
                            </p>

                            </>
                        )}

                        <p className="login__terms">
                            Al continuar, aceptas los términos y condiciones de Nuvé
                            y confirmas que has leído nuestra política de privacidad.
                        </p>

                        <button type="submit" disabled={loading}>
                            {loading ? <Spinner/> : 'CONTINUAR'}
                        </button>

                    </form>

                </section>
            </main>
        </>
    )
}

export default Login