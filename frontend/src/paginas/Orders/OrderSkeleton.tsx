function OrderSkeleton() {
  return (
    <main
      className="order-page order-page--skeleton"
      aria-busy="true"
      aria-label="Cargando resumen del pedido"
    >
      <div className="order-page__container">
        <span className="order-skeleton__back skeleton-block" />
        <div className="order-page__header" aria-hidden="true">
          <span className="order-skeleton__eyebrow skeleton-block" />
          <span className="order-skeleton__title skeleton-block" />
        </div>

        <div className="order-page__content" aria-hidden="true">
          <div className="order-page__main">
            <section className="order-card">
              <div className="order-card__header">
                <span className="order-skeleton__card-title skeleton-block" />
              </div>
              <div className="order-skeleton__addresses">
                <span className="order-skeleton__address skeleton-block" />
                <span className="order-skeleton__address skeleton-block" />
              </div>
            </section>

            <section className="order-card">
              <div className="order-card__header">
                <span className="order-skeleton__card-title skeleton-block" />
                <span className="order-skeleton__count skeleton-block" />
              </div>
              <div className="order-products">
                {Array.from({ length: 2 }, (_, index) => (
                  <div className="order-product" key={index}>
                    <span className="order-product__image skeleton-block" />
                    <div className="order-product__info">
                      <span className="order-skeleton__product-name skeleton-block" />
                      <span className="order-skeleton__product-detail skeleton-block" />
                      <span className="order-skeleton__product-detail order-skeleton__product-detail--short skeleton-block" />
                    </div>
                    <span className="order-skeleton__price skeleton-block" />
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="order-summary">
            <span className="order-skeleton__summary-title skeleton-block" />
            <span className="order-skeleton__summary-row skeleton-block" />
            <span className="order-skeleton__summary-row skeleton-block" />
            <span className="order-skeleton__summary-total skeleton-block" />
            <span className="order-skeleton__button skeleton-block" />
          </aside>
        </div>
      </div>
    </main>
  );
}

export default OrderSkeleton;
