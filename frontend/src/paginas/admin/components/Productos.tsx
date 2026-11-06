import { LuPackage, LuShirt, LuTrash2 } from "react-icons/lu";
import type { Product } from "../../../types/product";
import { EmptyState, PanelHeading } from "./admin-ui";
import { formatCurrency } from "./admin-utils";

type Props = {
  products: Product[];
  query: string;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
};

export default function Productos({
  products,
  query,
  onEdit,
  onDelete,
}: Props) {
  return (
    <section className="admin__panel admin__table-panel">
      <PanelHeading
        title="Todos los productos"
        caption={`${products.length} artículos en el catálogo`}
        action={
          <span className="admin__panel-mark">
            <LuPackage size={17} />
          </span>
        }
      />
      <div className="admin__table-wrap">
        <table className="admin__table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Reseñas</th>
              <th>Estado</th>
              <th>
                <span className="admin__sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const stock =
                product.variants?.reduce(
                  (total, variant) => total + Number(variant.stock || 0),
                  0,
                ) ?? 0;
              return (
                <tr key={product.id}>
                  <td>
                    <div className="admin__table-product">
                      <span className="admin__product-thumb">
                        {product.images?.[0]?.url ? (
                          <img src={product.images[0].url} alt="" />
                        ) : (
                          <LuShirt size={20} />
                        )}
                      </span>
                      <span>
                        <strong>{product.name}</strong>
                        <small>{product.brand?.name ?? "Sin marca"}</small>
                      </span>
                    </div>
                  </td>
                  <td>
                    {product.categories
                      ?.map((category) => category.name)
                      .join(", ") || "—"}
                  </td>
                  <td className="admin__table-price">
                    {formatCurrency(product.price)}
                  </td>
                  <td>{stock} uds.</td>
                  <td>{product.reviews?.length ?? 0}</td>
                  <td>
                    <span
                      className={`admin__stock-pill ${stock === 0 ? "is-out" : stock <= 5 ? "is-low" : "is-in"}`}
                    >
                      <i />
                      {stock === 0
                        ? "Sin stock"
                        : stock <= 5
                          ? "Stock bajo"
                          : "Disponible"}
                    </span>
                  </td>
                  <td>
                    <div className="admin__row-actions">
                      <button title="Editar producto" onClick={() => onEdit(product)}>
                        Editar
                      </button>
                      <button
                        className="admin__delete-button"
                        title="Eliminar producto"
                        onClick={() => onDelete(product)}
                      >
                        <LuTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!products.length && (
          <EmptyState
            title="No se encontraron productos"
            detail={
              query
                ? "Prueba con otra búsqueda."
                : "Añade el primer producto de tu catálogo."
            }
          />
        )}
      </div>
    </section>
  );
}
