import { useEffect, useState } from 'react';

import { getOrders } from '../../services/product.service';

import Navbar from '../../componentes/Navbar';
import Footer from '../../componentes/Footer';
import { useNavigate } from 'react-router-dom';

import '../../estilos/users/carrito.css';

type CartItem = {
  id: number;
  quantity: number;
  unitPrice: number;
  productvariant: {
    id: number;
    size: string;
    color: string;
    colorHex: string;
    product: {
      id: number;
      name: string;
      price: number;
      images: {
        id: number;
        url: string;
      }[]
    };
  };
};

type Order = {
  id: number;
  status: string;
  total: number;
  items: CartItem[];
};

function Carrito() {
  const [order, setOrder] = useState<Order | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [valorInput, setValorInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadCart = async () => {
      const storedUser = localStorage.getItem('user');

      if (!storedUser) {
        setError('No hay usuario autenticado');
        setLoading(false);
        return;
      }

      const user = JSON.parse(storedUser);
      const userId = user?.id;

      if (!userId) {
        setError('No hay usuario autenticado');
        setLoading(false);
        return;
      }

      const startTime = Date.now();

      try {
        setLoading(true);
        setError('');

        const orders = await getOrders(userId);

        console.log(
  'PRODUCT VARIANT:',
  JSON.stringify(
    orders[0]?.items[0]?.productvariant,
    null,
    2
  )
);

        const activeOrder = orders.find(
          (order: Order) =>
            order.status === 'active'
        );

        setOrder(activeOrder ?? null);
      } catch (error) {
        console.error(
          'Error al cargar el carrito:',
          error
        );

        setError(
          'No se ha podido cargar el carrito'
        );
      } finally {
        const elapsedTime = Date.now() - startTime;

        const remainingTime = Math.max(
          1000 - elapsedTime,
          0
        );

        setTimeout(() => {
          setLoading(false);
        }, remainingTime);
      }
    };

    loadCart();
  }, []);

  const totalItems =
    order?.items.reduce(
      (total, item) => total + item.quantity,
      0
    ) ?? 0;

  const total =
    order?.items.reduce(
      (total, item) =>
        total +
        Number(item.unitPrice) * item.quantity,
      0
    ) ?? 0;

  if (loading) {
    return (
      <main className="carrito-page">
        <div className="carrito-loading">
          <div className="carrito-spinner"></div>

          <p>Cargando tu carrito...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="carrito-page">
        <div className="carrito-error">
          <span className="carrito-error-icon">
            !
          </span>

          <h2>Ups...</h2>

          <p>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <>
      <Navbar
        valorInput={valorInput}
        setValorInput={setValorInput}
      />

      <main className="carrito-page">
        <section className="carrito-container">
          <button
            className="carrito-back"
            onClick={() => navigate('/products')}
          >
            ← Volver a productos
          </button>
          <header className="carrito-header">
            <div>
              <span className="carrito-label">
                TU COMPRA
              </span>

              <h1>Mi carrito</h1>

              <p>
                Revisa los productos que has añadido
                antes de finalizar tu compra.
              </p>
            </div>

            <div className="carrito-count">
              <span>{totalItems}</span>

              <small>
                {totalItems === 1
                  ? 'producto'
                  : 'productos'}
              </small>
            </div>
          </header>

          {!order ||
          !order.items ||
          order.items.length === 0 ? (
            <div className="carrito-empty">
              <div className="carrito-empty-icon">
                🛒
              </div>

              <h2>Tu carrito está vacío</h2>

              <p>
                Añade algún producto y aparecerá aquí.
              </p>

              <button
                className="carrito-empty-button"
                onClick={() =>
                  (window.location.href =
                    '/products')
                }
              >
                Ver productos
              </button>
            </div>
          ) : (
            <div className="carrito-content">

              <div className="carrito-items">
                {order.items.map((item) => {
                  const product =
                    item.productvariant.product;

                  const subtotal =
                    Number(item.unitPrice) *
                    item.quantity;

                  return (
                    <article
                      className="carrito-item"
                      key={item.id}
                    >
                      <div className="carrito-item-info">

                        <div className="carrito-item-image">
                            {product.images?.[0]?.url ? (
                                <img
                                    src={product.images[0].url}
                                    alt={product.name}
                                />
                            ) : (
                                <span>
                                    {product.name
                                        .charAt(0)
                                        .toUpperCase()}
                                </span>
                            )}
                        </div>

                        <div className="carrito-item-details">
                          <span className="carrito-item-category">
                            PRODUCTO
                          </span>

                          <h2>{product.name}</h2>

                          <div className="carrito-item-options">
                            <span>
                              Talla:{' '}
                              <strong>
                                {item.productvariant.size}
                              </strong>
                            </span>

                            <span>
                              Color:{' '}
                              <strong>
                                {item.productvariant.color}
                              </strong>
                            </span>

                            <span className="carrito-color">
                              <i
                                style={{
                                  backgroundColor:
                                    item.productvariant
                                      .colorHex,
                                }}
                              />
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="carrito-item-price">
                        <span>Precio</span>

                        <strong>
                          {Number(
                            item.unitPrice
                          ).toLocaleString('es-ES', {
                            style: 'currency',
                            currency: 'EUR',
                          })}
                        </strong>
                      </div>

                      <div className="carrito-item-quantity">
                        <span>Cantidad</span>

                        <div className="carrito-quantity-controls">
                          <button
                            type="button"
                            className="carrito-quantity-button"
                            onClick={() => {}}
                          >
                            −
                          </button>

                          <strong>
                            {item.quantity}
                          </strong>

                          <button
                            type="button"
                            className="carrito-quantity-button"
                            onClick={() => {}}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="carrito-item-subtotal">
                        <span>Subtotal</span>

                        <strong>
                          {subtotal.toLocaleString(
                            'es-ES',
                            {
                              style: 'currency',
                              currency: 'EUR',
                            }
                          )}
                        </strong>

                        <button
                          type="button"
                          className="carrito-remove-button"
                          onClick={() => {}}
                        >
                          Eliminar
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>

              <aside className="carrito-summary">
                <span className="carrito-summary-label">
                  RESUMEN
                </span>

                <h2>Resumen del pedido</h2>

                <div className="carrito-summary-row">
                  <span>Productos</span>

                  <span>{totalItems}</span>
                </div>

                <div className="carrito-summary-row">
                  <span>Subtotal</span>

                  <span>
                    {total.toLocaleString(
                      'es-ES',
                      {
                        style: 'currency',
                        currency: 'EUR',
                      }
                    )}
                  </span>
                </div>

                <div className="carrito-summary-row">
                  <span>Envío</span>

                  <span>Gratis</span>
                </div>

                <div className="carrito-summary-divider" />

                <div className="carrito-summary-total">
                  <span>Total</span>

                  <strong>
                    {total.toLocaleString(
                      'es-ES',
                      {
                        style: 'currency',
                        currency: 'EUR',
                      }
                    )}
                  </strong>
                </div>

                <button
                  type="button"
                  className="carrito-checkout"
                  onClick={() => {}}
                >
                  Finalizar compra
                </button>
              </aside>

            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Carrito;