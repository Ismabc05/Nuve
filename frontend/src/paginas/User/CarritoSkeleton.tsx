function CarritoSkeleton() {
  return (
    <main
      className="carrito-page carrito-page--skeleton"
      aria-busy="true"
      aria-label="Cargando carrito"
    >
      <section className="carrito-container">
        <span className="carrito-skeleton__back skeleton-block" />
        <header className="carrito-header" aria-hidden="true">
          <div className="carrito-skeleton__heading">
            <span className="carrito-skeleton__eyebrow skeleton-block" />
            <span className="carrito-skeleton__title skeleton-block" />
            <span className="carrito-skeleton__subtitle skeleton-block" />
          </div>
          <span className="carrito-skeleton__count skeleton-block" />
        </header>

        <div className="carrito-content" aria-hidden="true">
          <div className="carrito-items">
            {Array.from({ length: 2 }, (_, index) => (
              <article className="carrito-item" key={index}>
                <div className="carrito-item-info">
                  <span className="carrito-item-image skeleton-block" />
                  <div className="carrito-skeleton__details">
                    <span className="carrito-skeleton__category skeleton-block" />
                    <span className="carrito-skeleton__product-name skeleton-block" />
                    <span className="carrito-skeleton__options skeleton-block" />
                  </div>
                </div>
                <div className="carrito-skeleton__data">
                  <span className="carrito-skeleton__data-label skeleton-block" />
                  <span className="carrito-skeleton__data-value skeleton-block" />
                </div>
                <div className="carrito-skeleton__data">
                  <span className="carrito-skeleton__data-label skeleton-block" />
                  <span className="carrito-skeleton__quantity skeleton-block" />
                </div>
                <div className="carrito-skeleton__data carrito-skeleton__subtotal">
                  <span className="carrito-skeleton__data-label skeleton-block" />
                  <span className="carrito-skeleton__data-value skeleton-block" />
                </div>
              </article>
            ))}
          </div>

          <aside className="carrito-summary">
            <span className="carrito-skeleton__summary-heading skeleton-block" />
            <span className="carrito-skeleton__summary-row skeleton-block" />
            <span className="carrito-skeleton__summary-row skeleton-block" />
            <span className="carrito-skeleton__summary-total skeleton-block" />
            <span className="carrito-skeleton__summary-button skeleton-block" />
          </aside>
        </div>
      </section>
    </main>
  );
}

export default CarritoSkeleton;
