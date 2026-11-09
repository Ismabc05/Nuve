function AdminSkeleton() {
  return (
    <div className="admin-skeleton" aria-busy="true" aria-label="Cargando datos">
      <div className="admin-skeleton__stats" aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => (
          <div className="admin-skeleton__stat" key={index}>
            <span className="admin-skeleton__label skeleton-block" />
            <span className="admin-skeleton__value skeleton-block" />
            <span className="admin-skeleton__meta skeleton-block" />
          </div>
        ))}
      </div>
      <div className="admin-skeleton__panels" aria-hidden="true">
        {Array.from({ length: 2 }, (_, index) => (
          <div className="admin-skeleton__panel" key={index}>
            <span className="admin-skeleton__heading skeleton-block" />
            <span className="admin-skeleton__line skeleton-block" />
            <span className="admin-skeleton__line admin-skeleton__line--short skeleton-block" />
            <span className="admin-skeleton__chart skeleton-block" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminSkeleton;
