import ProductSkeleton from "../../componentes/ProductSkeleton";

function FavoritosSkeleton() {
  return (
    <main
      className="favoritos-page favoritos-page--skeleton"
      aria-busy="true"
      aria-label="Cargando favoritos"
    >
      <section className="favoritos-container">
        <span className="favoritos-skeleton__back skeleton-block" />
        <header className="favoritos-header" aria-hidden="true">
          <div>
            <span className="favoritos-skeleton__eyebrow skeleton-block" />
            <span className="favoritos-skeleton__title skeleton-block" />
            <span className="favoritos-skeleton__subtitle skeleton-block" />
          </div>
          <span className="favoritos-skeleton__count skeleton-block" />
        </header>
        <div className="favoritos-grid" aria-hidden="true">
          {Array.from({ length: 4 }, (_, index) => (
            <div className="favoritos-card" key={index}>
              <ProductSkeleton />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default FavoritosSkeleton;
