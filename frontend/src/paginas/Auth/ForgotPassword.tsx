import { useState } from "react";
import type React from "react";
import { forgotPassword } from "../../services/password.service";
import "../../estilos/auth/forgot-password.css";
import { Spinner } from "./Spinner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: Parameters<NonNullable<React.ComponentProps<"form">["onSubmit"]>>[0],
  ) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      await forgotPassword(email.trim());

      // Mantener el spinner visible 2 segundos más
      await new Promise((resolve) => setTimeout(resolve, 3000));

      setMessage(
        "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.",
      );
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Ha ocurrido un error. Inténtalo de nuevo.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="forgot-password">
      <section className="forgot-password__card">
        <h1>¿Has olvidado tu contraseña?</h1>

        <p>
          No te preocupes. Introduce el correo electrónico asociado a tu cuenta
          y te enviaremos instrucciones para recuperarla.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Correo electrónico</label>

          <input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? <Spinner /> : "Enviar enlace"}
          </button>
        </form>

        {message && (
          <p className="forgot-password__success" role="status">
            {message}
          </p>
        )}

        {error && (
          <p className="forgot-password__error" role="alert">
            {error}
          </p>
        )}
        <div className="back-to-login">
          <a href="/login">Volver a iniciar sesión</a>
        </div>
      </section>
    </main>
  );
}
