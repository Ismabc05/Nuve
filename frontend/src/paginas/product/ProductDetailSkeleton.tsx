function ProductDetailSkeleton() {
  return (
    <main
      className="product-detail product-detail--skeleton"
      aria-busy="true"
      aria-label="Cargando producto"
    >
      <div className="product-detail__back-container">
        <span className="product-detail-skeleton__back skeleton-block" />
      </div>

      <div className="product-detail__container" aria-hidden="true">
        <section className="product-detail__gallery">
          <div className="product-detail__gallery-header">
            <span className="product-detail-skeleton__label skeleton-block" />
            <span className="product-detail-skeleton__count skeleton-block" />
          </div>
          <div className="product-detail__gallery-content">
            <div className="product-detail__thumbnails">
              {Array.from({ length: 3 }, (_, index) => (
                <span
                  className="product-detail-skeleton__thumbnail skeleton-block"
                  key={index}
                />
              ))}
            </div>
            <span className="product-detail-skeleton__image skeleton-block" />
          </div>
        </section>

        <section className="product-detail__info">
          <span className="product-detail-skeleton__brand skeleton-block" />
          <span className="product-detail-skeleton__name skeleton-block" />
          <span className="product-detail-skeleton__rating skeleton-block" />
          <span className="product-detail-skeleton__price skeleton-block" />
          <span className="product-detail-skeleton__description skeleton-block" />
          <span className="product-detail-skeleton__description product-detail-skeleton__description--short skeleton-block" />
          <span className="product-detail-skeleton__section-title skeleton-block" />
          <div className="product-detail-skeleton__options">
            {Array.from({ length: 4 }, (_, index) => (
              <span
                className="product-detail-skeleton__option skeleton-block"
                key={index}
              />
            ))}
          </div>
          <span className="product-detail-skeleton__button skeleton-block" />
        </section>
      </div>
    </main>
  );
}

export default ProductDetailSkeleton;
