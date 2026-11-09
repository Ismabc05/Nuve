function PerfilSkeleton() {
  return (
    <main
      className="perfil-page perfil-page--skeleton"
      aria-busy="true"
      aria-label="Cargando perfil"
    >
      <div className="perfil-container">
        <span className="perfil-skeleton__back skeleton-block" />
        <header className="perfil-header" aria-hidden="true">
          <div>
            <span className="perfil-skeleton__eyebrow skeleton-block" />
            <span className="perfil-skeleton__title skeleton-block" />
            <span className="perfil-skeleton__subtitle skeleton-block" />
          </div>
        </header>

        <section className="perfil-section" aria-hidden="true">
          <div className="perfil-section-header">
            <div>
              <span className="perfil-skeleton__section-label skeleton-block" />
              <span className="perfil-skeleton__section-title skeleton-block" />
            </div>
            <span className="perfil-skeleton__action skeleton-block" />
          </div>
          <div className="perfil-personal">
            <span className="perfil-skeleton__avatar skeleton-block" />
            <div className="perfil-info-grid">
              {Array.from({ length: 6 }, (_, index) => (
                <div className="perfil-info-item" key={index}>
                  <span className="perfil-skeleton__field-label skeleton-block" />
                  <span className="perfil-skeleton__field-value skeleton-block" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="perfil-section perfil-skeleton__secondary" aria-hidden="true">
          <span className="perfil-skeleton__section-label skeleton-block" />
          <span className="perfil-skeleton__section-title skeleton-block" />
        </section>
        <section className="perfil-section perfil-skeleton__secondary" aria-hidden="true">
          <span className="perfil-skeleton__section-label skeleton-block" />
          <span className="perfil-skeleton__section-title skeleton-block" />
          <div className="perfil-skeleton__address-grid">
            <span className="perfil-skeleton__address skeleton-block" />
            <span className="perfil-skeleton__address skeleton-block" />
          </div>
        </section>
      </div>
    </main>
  );
}

export default PerfilSkeleton;
