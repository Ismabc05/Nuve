import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { resetPassword } from "../../services/password.service";
import "../../estilos/auth/reset-password.css";
import { Spinner } from "./Spinner";
import { LuEye, LuEyeOff } from "react-icons/lu";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPasswordIcon, setShowPasswordIcon] = useState(false);
  const [showConfirmPasswordIcon, setShowConfirmPasswordIcon] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!token) {
      setError("El enlace de recuperación no es válido.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setLoading(true);

    try {
      await resetPassword(token, password);

      // Mantener el spinner visible 2 segundos más
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setPassword("");
      setConfirmPassword("");
      setMessage("Tu contraseña se ha restablecido correctamente.");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo restablecer la contraseña.",
      );
      return;
    } finally {
      setLoading(false);
    }

    // Mostrar el mensaje de éxito durante 2 segundos
    await new Promise((resolve) => setTimeout(resolve, 4000));

    navigate("/login");
  };

  if (!token) {
    return (
      <main className="reset-password">
        <section className="reset-password__card">
          <h1>Enlace no válido</h1>

          <p>El enlace de recuperación no es válido o está incompleto.</p>

          <Link to="/forgot-password">Solicitar un nuevo enlace</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="reset-password">
      <section className="reset-password__card">
        <h1>Restablecer contraseña</h1>

        <p>
          Introduce tu nueva contraseña para recuperar el acceso a tu cuenta.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="password">Nueva contraseña</label>

          <div className="reset-password__password-wrapper">
            <input
              id="password"
              type={showPasswordIcon ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onFocus={() => setError("")}
              required
              minLength={8}
            />

            <button
              type="button"
              className="reset-password__password-toggle"
              onClick={() => setShowPasswordIcon(!showPasswordIcon)}
              aria-label={
                showPasswordIcon ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            >
              {showPasswordIcon ? <LuEyeOff size={20} /> : <LuEye size={20} />}
            </button>
          </div>

          <label htmlFor="confirmPassword">Confirmar contraseña</label>

          <div className="reset-password__password-wrapper">
            <input
              id="confirmPassword"
              type={showConfirmPasswordIcon ? "text" : "password"}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              onFocus={() => setError("")}
              required
              minLength={8}
            />

            <button
              type="button"
              className="reset-password__password-toggle"
              onClick={() =>
                setShowConfirmPasswordIcon(!showConfirmPasswordIcon)
              }
              aria-label={
                showConfirmPasswordIcon
                  ? "Ocultar contraseña"
                  : "Mostrar contraseña"
              }
            >
              {showConfirmPasswordIcon ? (
                <LuEyeOff size={20} />
              ) : (
                <LuEye size={20} />
              )}
            </button>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? <Spinner /> : "Restablecer contraseña"}
          </button>
        </form>

        {message && (
          <p className="reset-password__success" role="status">
            {message}
          </p>
        )}

        {error && (
          <p className="reset-password__error" role="alert">
            {error}
          </p>
        )}

        <div className="back-to-login">
          <Link to="/login">Volver a iniciar sesión</Link>
        </div>
      </section>
    </main>
  );
}
