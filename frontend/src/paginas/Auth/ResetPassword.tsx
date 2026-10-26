import { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../services/password.service';
import '../../estilos/auth/reset-password.css'

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        setMessage('');
        setError('');

        if (!token) {
            setError('El enlace de recuperación no es válido.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        if (password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres.');
            return;
        }

        setLoading(true);

        try {
            await resetPassword(token, password);

            setMessage(
                'Tu contraseña se ha restablecido correctamente.',
            );

            setPassword('');
            setConfirmPassword('');

            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'No se pudo restablecer la contraseña.',
            );
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <main className="reset-password">
                <section className="reset-password__card">
                    <h1>Enlace no válido</h1>

                    <p>
                        El enlace de recuperación no es válido o está
                        incompleto.
                    </p>

                    <Link to="/forgot-password">
                        Solicitar un nuevo enlace
                    </Link>
                </section>
            </main>
        );
    }

    return (
        <main className="reset-password">
            <section className="reset-password__card">
                <h1>Restablecer contraseña</h1>

                <p>
                    Introduce tu nueva contraseña para recuperar el acceso
                    a tu cuenta.
                </p>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="password">
                        Nueva contraseña
                    </label>

                    <input
                        id="password"
                        type="password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        required
                        minLength={8}
                    />

                    <label htmlFor="confirmPassword">
                        Confirmar contraseña
                    </label>

                    <input
                        id="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(event) =>
                            setConfirmPassword(event.target.value)
                        }
                        required
                        minLength={8}
                    />

                    <button type="submit" disabled={loading}>
                        {loading
                            ? 'Restableciendo...'
                            : 'Restablecer contraseña'}
                    </button>
                </form>

                {message && (
                    <p
                        className="reset-password__success"
                        role="status"
                    >
                        {message}
                    </p>
                )}

                {error && (
                    <p
                        className="reset-password__error"
                        role="alert"
                    >
                        {error}
                    </p>
                )}

                <Link to="/login">
                    Volver a iniciar sesión
                </Link>
            </section>
        </main>
    );
}