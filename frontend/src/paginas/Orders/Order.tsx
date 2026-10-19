import Navbar from "../../componentes/Navbar";
import Footer from "../../componentes/Footer";
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

import { getOrders } from "../../services/cart.service";

import { getAddresses } from "../../services/user.service";

import type { Order as OrderType } from "../../types/carrito";
import type { Address } from "../../types/perfil";

import "../../estilos/order/order.css";

function Order() {
  const [valorInput, setValorInput] = useState("");
  const navigate = useNavigate();

  const [order, setOrder] = useState<OrderType | null>(null);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  useEffect(() => {
    const loadOrder = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "null");

      const userId = user?.id;

      if (!userId) {
        setTimeout(() => {
          setLoading(false);
        }, 2000);

        return;
      }

      try {
        const orders = await getOrders(userId);

        const activeOrder = orders.find(
          (order: OrderType) => order.status === "active",
        );

        setOrder(activeOrder || null);
      } catch (error) {
        console.error("Error al obtener el pedido:", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      }
    };

    loadOrder();
  }, []);

  useEffect(() => {
    const loadAddresses = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "null");

      const userId = user?.id;

      if (!userId) return;

      try {
        const data = await getAddresses(userId);

        setAddresses(data);

        if (data.length > 0) {
          setSelectedAddress(data[0].id);
        }
      } catch (error) {
        console.error("Error al obtener las direcciones:", error);
      }
    };

    loadAddresses();
  }, []);

  const subtotal =
    order?.items.reduce((total, item) => {
      return total + Number(item.unitPrice) * item.quantity;
    }, 0) || 0;

  const shipping = 0;

  const total = subtotal + shipping;

  if (loading) {
    return (
      <>
        <Navbar valorInput={valorInput} setValorInput={setValorInput} />

        <main className="order-page">
          <div className="carrito-loading">
          <div className="carrito-spinner"></div>

          <p>Cargando tu pedido...</p>
        </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar valorInput={valorInput} setValorInput={setValorInput} />

      <main className="order-page">
        <div className="order-page__container">
          <button
            type="button"
            className="favoritos-back"
            onClick={() => navigate("/carts")}
          >
            ← Volver al carrito
          </button>
          <div className="order-page__header">
            <p className="order-page__eyebrow">FINALIZAR COMPRA</p>

            <h1>Resumen del pedido</h1>
          </div>

          {!order || order.items.length === 0 ? (
            <div className="order-page__empty">
              <h2>Tu carrito está vacío</h2>

              <p>No tienes productos preparados para realizar el pedido.</p>
            </div>
          ) : (
            <div className="order-page__content">
              {/* =========================
                  COLUMNA IZQUIERDA
              ========================= */}

              <div className="order-page__main">
                {/* DIRECCIÓN */}

                <section className="order-card">
                  <div className="order-card__header">
                    <h2>Dirección de envío</h2>
                  </div>

                  {addresses.length === 0 ? (
                    <p className="order-card__empty">
                      No tienes direcciones guardadas.
                    </p>
                  ) : (
                    <div className="order-addresses">
                      {addresses.map((address) => (
                        <button
                          key={address.id}
                          type="button"
                          className={`order-address ${
                            selectedAddress === address.id
                              ? "order-address--selected"
                              : ""
                          }`}
                          onClick={() => setSelectedAddress(address.id)}
                        >
                          <span className="order-address__radio">
                            {selectedAddress === address.id ? "✓" : ""}
                          </span>

                          <span className="order-address__content">
                            <span className="order-address__name">
                              {address.name || "DIRECCIÓN"}
                            </span>

                            <strong>{address.street || "Dirección"}</strong>

                            <span>
                              {address.city || ""}
                              {address.state ? `, ${address.state}` : ""}
                            </span>

                            <span>{address.country || ""}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </section>

                {/* PRODUCTOS */}

                <section className="order-card">
                  <div className="order-card__header">
                    <h2>Productos</h2>

                    <span>
                      {order.items.length}{" "}
                      {order.items.length === 1 ? "producto" : "productos"}
                    </span>
                  </div>

                  <div className="order-products">
                    {order.items.map((item) => {
                      const product = item.productvariant.product;

                      const image = product.images?.[0]?.url;

                      const itemTotal = Number(item.unitPrice) * item.quantity;

                      return (
                        <div key={item.id} className="order-product">
                          <div className="order-product__image">
                            {image && <img src={image} alt={product.name} />}
                          </div>

                          <div className="order-product__info">
                            <h3>{product.name}</h3>

                            <p>Color: {item.productvariant.color}</p>

                            <p>Talla: {item.productvariant.size}</p>

                            <p>Cantidad: {item.quantity}</p>
                          </div>

                          <div className="order-product__price">
                            {formatPrice(itemTotal)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>

              {/* =========================
                  RESUMEN
              ========================= */}

              <aside className="order-summary">
                <h2>Resumen</h2>

                <div className="order-summary__row">
                  <span>Subtotal</span>

                  <span>{formatPrice(subtotal)}</span>
                </div>

                <div className="order-summary__row">
                  <span>Envío</span>

                  <span>
                    {shipping === 0 ? "Gratis" : formatPrice(shipping)}
                  </span>
                </div>

                <div className="order-summary__separator" />

                <div className="order-summary__total">
                  <span>Total</span>

                  <strong>{formatPrice(total)}</strong>
                </div>

                <button
                  type="button"
                  className="order-summary__button"
                  disabled={!selectedAddress}
                >
                  Pagar pedido
                </button>

                {!selectedAddress && (
                  <p className="order-summary__warning">
                    Selecciona una dirección para continuar.
                  </p>
                )}
              </aside>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Order;
