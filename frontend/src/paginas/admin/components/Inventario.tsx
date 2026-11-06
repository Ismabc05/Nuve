import { LuArrowDown, LuBoxes, LuShirt, LuTrash2 } from "react-icons/lu";
import type { AdminVariant } from "../../../types/admin";
import { EmptyState, PanelHeading, StatCard } from "./admin-ui";

type Props = {
  variants: AdminVariant[];
  onEdit: (variant: AdminVariant) => void;
  onDelete: (variant: AdminVariant) => void;
};

export default function Inventario({ variants, onEdit, onDelete }: Props) {
  const lowStockVariants = variants.filter(
    (variant) => variant.stock <= 5,
  ).length;

  return (
    <>
      <section className="admin__stats admin__stats--compact">
        <StatCard
          label="Unidades disponibles"
          value={String(
            variants.reduce(
              (total, variant) => total + Number(variant.stock || 0),
              0,
            ),
          )}
          meta="Stock total en todas las variantes"
          icon={<LuBoxes size={18} />}
        />
        <StatCard
          label="Variantes"
          value={String(variants.length)}
          meta="Tallas y colores"
          icon={<LuShirt size={18} />}
        />
        <StatCard
          label="Stock bajo"
          value={String(lowStockVariants)}
          meta="5 unidades o menos"
          icon={<LuArrowDown size={18} />}
        />
      </section>
      <section className="admin__panel admin__table-panel">
        <PanelHeading
          title="Tallas, colores y existencias"
          caption="Control de inventario por variante"
          action={
            <span className="admin__panel-mark">
              <LuBoxes size={17} />
            </span>
          }
        />
        <div className="admin__table-wrap">
          <table className="admin__table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Talla</th>
                <th>Color</th>
                <th>Stock disponible</th>
                <th>Estado</th>
                <th>
                  <span className="admin__sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {variants.map((variant) => (
                <tr key={variant.id}>
                  <td>
                    <strong>
                      {variant.product?.name ??
                        `Producto #${variant.product?.id ?? "—"}`}
                    </strong>
                  </td>
                  <td>{variant.size}</td>
                  <td>
                    <span className="admin__color-swatch">
                      <i style={{ backgroundColor: variant.colorHex }} />
                      {variant.color}
                    </span>
                  </td>
                  <td>
                    <strong>{variant.stock}</strong> uds.
                  </td>
                  <td>
                    <span
                      className={`admin__stock-pill ${variant.stock === 0 ? "is-out" : variant.stock <= 5 ? "is-low" : "is-in"}`}
                    >
                      <i />
                      {variant.stock === 0
                        ? "Sin stock"
                        : variant.stock <= 5
                          ? "Stock bajo"
                          : "Disponible"}
                    </span>
                  </td>
                  <td>
                    <div className="admin__row-actions">
                      <button onClick={() => onEdit(variant)}>Editar</button>
                      <button
                        className="admin__delete-button"
                        title="Eliminar variante"
                        onClick={() => onDelete(variant)}
                      >
                        <LuTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!variants.length && (
            <EmptyState
              title="No hay variantes todavía"
              detail="Añade tallas y colores para controlar el stock de tus productos."
            />
          )}
        </div>
      </section>
    </>
  );
}
