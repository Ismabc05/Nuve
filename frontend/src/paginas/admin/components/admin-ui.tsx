import type { ReactNode } from "react";
import {
  LuArrowUpRight,
  LuPackage,
  LuPlus,
  LuTags,
  LuTrash2,
} from "react-icons/lu";

export function StatCard({
  label,
  value,
  meta,
  icon,
}: {
  label: string;
  value: string;
  meta: string;
  icon: ReactNode;
}) {
  return (
    <article className="admin__stat-card">
      <div className="admin__stat-top">
        <span>{label}</span>
        <i>{icon}</i>
      </div>
      <strong className="admin__stat-value">{value}</strong>
      <div className="admin__stat-meta">
        <span className="admin__stat-spark">
          <LuArrowUpRight size={13} />
        </span>
        {meta}
      </div>
      <span className="admin__stat-decoration" />
    </article>
  );
}

export function PanelHeading({
  title,
  caption,
  action,
}: {
  title: string;
  caption: string;
  action?: ReactNode;
}) {
  return (
    <header className="admin__panel-heading">
      <div>
        <h2>{title}</h2>
        <p>{caption}</p>
      </div>
      {action}
    </header>
  );
}

export function EmptyState({
  title,
  detail,
}: {
  title: string;
  detail: string;
}) {
  return (
    <div className="admin__empty">
      <span>
        <LuPackage size={20} />
      </span>
      <strong>{title}</strong>
      <p>{detail}</p>
    </div>
  );
}

export function CatalogPanel({
  title,
  caption,
  onAdd,
  children,
}: {
  title: string;
  caption: string;
  onAdd: () => void;
  children: ReactNode;
}) {
  return (
    <section className="admin__panel admin__catalog-panel">
      <PanelHeading
        title={title}
        caption={caption}
        action={
          <button
            className="admin__icon-button admin__catalog-add"
            aria-label={`Añadir ${title.toLocaleLowerCase()}`}
            onClick={onAdd}
          >
            <LuPlus size={18} />
          </button>
        }
      />
      <div className="admin__catalog-list">
        {children || (
          <EmptyState
            title={`Sin ${title.toLocaleLowerCase()}`}
            detail="Añade el primer elemento para empezar."
          />
        )}
      </div>
    </section>
  );
}

export function CatalogRow({
  name,
  count,
  onEdit,
  onDelete,
}: {
  name: string;
  count?: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="admin__catalog-row">
      <span className="admin__catalog-icon">
        <LuTags size={17} />
      </span>
      <span className="admin__catalog-name">
        <strong>{name}</strong>
        <small>{count ?? 0} productos</small>
      </span>
      <button className="admin__catalog-edit" onClick={onEdit}>
        Editar
      </button>
      <button
        className="admin__delete-button"
        aria-label={`Eliminar ${name}`}
        onClick={onDelete}
      >
        <LuTrash2 size={16} />
      </button>
    </div>
  );
}
