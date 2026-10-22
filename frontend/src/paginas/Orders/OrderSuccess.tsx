import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrders } from "../../services/cart.service";
import "../../estilos/order/order-success.css";

type OrderWithPayment = {
  id: number;
  paid?: boolean;
  stripeSessionId?: string | null;
  status: string;
};

type PaymentState = "checking" | "confirmed" | "pending" | "error";

export default function OrderSuccess() {
  const [state, setState] = useState<PaymentState>("checking");

  useEffect(() => {
    let cancelled = false;
    const startTime = Date.now();

    const verifyPayment = async () => {
      const sessionId = new URLSearchParams(window.location.search).get(
        "session_id",
      );

      const userRaw = localStorage.getItem("user");

      if (!sessionId || !userRaw) {
        setState("error");
        return;
      }

      let userId: number;

      try {
        const user = JSON.parse(userRaw);
        userId = Number(user.id);
      } catch {
        setState("error");
        return;
      }

      if (!Number.isFinite(userId) || userId <= 0) {
        setState("error");
        return;
      }

      try {
        // Esperamos hasta 30 segundos a que llegue el webhook.
        for (let attempt = 0; attempt < 15; attempt++) {
          if (cancelled) return;

          const orders = (await getOrders()) as OrderWithPayment[];

          const paidOrder = orders.find(
            (order) =>
              order.stripeSessionId === sessionId && order.paid === true,
          );

          if (paidOrder) {
            // Mantener la pantalla de carga al menos 4 segundos
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, 7000 - elapsed);

            if (remaining > 0) {
              await new Promise((resolve) => setTimeout(resolve, remaining));
            }

            if (!cancelled) {
              setState("confirmed");
            }

            return;
          }

          if (attempt < 14) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }
        }

        if (!cancelled) setState("pending");
      } catch (error) {
        console.error("Error verificando el pago:", error);
        if (!cancelled) setState("error");
      }
    };

    void verifyPayment();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="order-success">
      {state === "checking" && (
        <>
          <div className="success-spinner" />
          <h1>Verificando tu pago</h1>
          <p>
            El pago se ha realizado. Estamos esperando la confirmación de tu
            pedido.
          </p>
        </>
      )}

      {state === "confirmed" && (
        <>
          <div className="success-icon">✓</div>
          <h1>¡Pedido confirmado!</h1>
          <p>Tu pago se ha verificado correctamente. Gracias por tu compra.</p>
          <Link to="/products" className="success-button">
            Seguir comprando
          </Link>
        </>
      )}

      {state === "pending" && (
        <>
          <h1>Pago recibido</h1>
          <p>
            Stripe ha procesado tu pago, pero todavía no hemos recibido la
            confirmación final de tu pedido. Espera un momento y consulta tus
            pedidos más tarde.
          </p>
          <Link to="/perfil" className="success-button">
            Ir a mi perfil
          </Link>
        </>
      )}

      {state === "error" && (
        <>
          <h1>No hemos podido verificar el pedido</h1>
          <p>
            No significa necesariamente que el pago haya fallado. Comprueba tus
            pedidos antes de volver a pagar.
          </p>
          <Link to="/perfil" className="success-button">
            Consultar mis pedidos
          </Link>
        </>
      )}
    </main>
  );
}
