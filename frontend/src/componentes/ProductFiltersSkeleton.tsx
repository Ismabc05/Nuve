import '../estilos/product/product.filter.css';

function ProductFiltersSkeleton() {
  return (
    <aside
      className="product-filters product-filters--skeleton"
      aria-busy="true"
      aria-label="Cargando filtros"
    >
      {(['Categorías', 'Marcas', 'Precio'] as const).map((section, index) => (
        <section className="product-filters__section" key={section}>
          <div className="product-filters__header" aria-hidden="true">
            <h2>{section}</h2>
            <span className="product-filters-skeleton__chevron skeleton-block" />
          </div>
          <div className="product-filters__options" aria-hidden="true">
            {Array.from(
              { length: index === 2 ? 2 : 4 },
              (_, optionIndex) => (
                <div
                  className="product-filters__option"
                  key={optionIndex}
                >
                  <span className="product-filters-skeleton__control skeleton-block" />
                  <span
                    className={`product-filters-skeleton__label product-filters-skeleton__label--${index}-${optionIndex} skeleton-block`}
                  />
                </div>
              ),
            )}
          </div>
        </section>
      ))}
    </aside>
  );
}

export default ProductFiltersSkeleton;
