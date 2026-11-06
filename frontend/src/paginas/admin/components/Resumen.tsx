import {
  LuArrowDown,
  LuArrowRight,
  LuArrowUpRight,
  LuBoxes,
  LuCheck,
  LuClipboardList,
  LuPackage,
  LuShirt,
  LuUsers,
} from "react-icons/lu";
import type { AdminOrder, AdminUser } from "../../../types/admin";
import type { Category, Product, ProductVariant } from "../../../types/product";
import { EmptyState, PanelHeading, StatCard } from "./admin-ui";
import {
  customerName,
  formatCurrency,
  initials,
  orderStatuses,
  statusLabel,
} from "./admin-utils";

type Props = {
  orders: AdminOrder[];
  products: Product[];
  categories: Category[];
  users: AdminUser[];
  variants: ProductVariant[];
  lowStock: number;
  onNavigate: (section: "products" | "orders" | "inventory") => void;
};

export default function Resumen({
  orders,
  products,
  categories,
  users,
  variants,
  lowStock,
  onNavigate,
}: Props) {
  const sales = orders
    .filter((order) => order.paid || order.status === "completed")
    .reduce((sum, order) => sum + Number(order.total || 0), 0);
  const statusCounts = orderStatuses.map((status) => ({
    status,
    count: orders.filter((order) => order.status === status).length,
  }));
  const maxStatusCount = Math.max(
    1,
    ...statusCounts.map((item) => item.count),
  );
  const recentOrders = [...orders].sort((a, b) => b.id - a.id).slice(0, 5);
  const topProducts = [...products]
    .sort((a, b) => (b.reviews?.length ?? 0) - (a.reviews?.length ?? 0))
    .slice(0, 4);

  return (
    <>
      <section className="admin__welcome">
        <div className="admin__welcome-copy">
          <span className="admin__welcome-tag">
            <span /> TU TIENDA, A PRIMERA VISTA
          </span>
          <h2>
            Un buen día empieza
            <br />
            con todo en su sitio.
          </h2>
          <p>Consulta pedidos, catálogo y stock desde un solo lugar.</p>
          <button onClick={() => onNavigate("products")}>
            Explorar catálogo <LuArrowRight size={16} />
          </button>
        </div>
        <div className="admin__welcome-art">
          <span className="admin__art-orbit admin__art-orbit--one" />
          <span className="admin__art-orbit admin__art-orbit--two" />
          <div className="admin__art-card">
            <span>NUVÉ / NEW SEASON</span>
            <strong>
              La calma
              <br />
              también viste.
            </strong>
            <i>01 — 06</i>
          </div>
          <span className="admin__art-dot" />
        </div>
      </section>

      <section className="admin__stats">
        <StatCard
          label="Ventas completadas"
          value={formatCurrency(sales)}
          meta={`${orders.filter((order) => order.paid || order.status === "completed").length} pedidos pagados`}
          icon={<LuArrowUpRight size={18} />}
        />
        <StatCard
          label="Pedidos totales"
          value={String(orders.length)}
          meta={`${orders.filter((order) => order.status === "pending").length} pendientes de revisar`}
          icon={<LuClipboardList size={18} />}
        />
        <StatCard
          label="Productos activos"
          value={String(products.length)}
          meta={`${categories.length} categorías`}
          icon={<LuPackage size={18} />}
        />
        <StatCard
          label="Clientes"
          value={String(users.length)}
          meta="Cuentas registradas"
          icon={<LuUsers size={18} />}
        />
      </section>

      <div className="admin__overview-grid">
        <section className="admin__panel admin__panel--status">
          <PanelHeading
            title="Estado de los pedidos"
            caption="Distribución actual"
            action={
              <span className="admin__panel-mark">
                <LuClipboardList size={17} />
              </span>
            }
          />
          <div className="admin__status-total">
            <strong>{orders.length}</strong>
            <span>pedidos en total</span>
          </div>
          <div className="admin__status-bars">
            {statusCounts
              .filter((item) => item.count > 0 || item.status === "pending")
              .map(({ status, count }) => (
                <div className="admin__status-row" key={status}>
                  <span
                    className={`admin__status-dot admin__status-dot--${status}`}
                  />
                  <span className="admin__status-name">
                    {statusLabel(status)}
                  </span>
                  <div className="admin__status-track">
                    <i
                      className={`admin__status-fill admin__status-fill--${status}`}
                      style={{
                        width: `${Math.max(count ? 8 : 0, (count / maxStatusCount) * 100)}%`,
                      }}
                    />
                  </div>
                  <strong>{count}</strong>
                </div>
              ))}
          </div>
          <button
            className="admin__text-link"
            onClick={() => onNavigate("orders")}
          >
            Ver todos los pedidos <LuArrowRight size={15} />
          </button>
        </section>

        <section className="admin__panel admin__panel--stock">
          <PanelHeading
            title="Atención al stock"
            caption="Inventario"
            action={
              <span className="admin__panel-mark admin__panel-mark--warm">
                <LuBoxes size={17} />
              </span>
            }
          />
          <div className="admin__stock-callout">
            <span className={lowStock ? "is-warning" : "is-good"}>
              {lowStock ? <LuArrowDown size={16} /> : <LuCheck size={16} />}
            </span>
            <div>
              <strong>{lowStock || "Todo en orden"}</strong>
              <small>
                {lowStock
                  ? "variantes con 5 unidades o menos"
                  : "No hay variantes con stock bajo"}
              </small>
            </div>
          </div>
          <div className="admin__stock-summary">
            <div>
              <span>Unidades en inventario</span>
              <strong>
                {variants.reduce(
                  (total, variant) => total + Number(variant.stock || 0),
                  0,
                )}
              </strong>
            </div>
            <div>
              <span>Variantes</span>
              <strong>{variants.length}</strong>
            </div>
          </div>
          <button
            className="admin__text-link"
            onClick={() => onNavigate("inventory")}
          >
            Gestionar inventario <LuArrowRight size={15} />
          </button>
        </section>

        <section className="admin__panel admin__panel--recent">
          <PanelHeading
            title="Pedidos recientes"
            caption="Actividad de la tienda"
            action={
              <button
                className="admin__panel-link"
                onClick={() => onNavigate("orders")}
              >
                Ver todos <LuArrowRight size={14} />
              </button>
            }
          />
          {recentOrders.length ? (
            <div className="admin__recent-list">
              {recentOrders.map((order) => (
                <div className="admin__recent-order" key={order.id}>
                  <span className="admin__avatar">
                    {initials(customerName(order.user))}
                  </span>
                  <div className="admin__recent-customer">
                    <strong>{customerName(order.user)}</strong>
                    <small>
                      Pedido #{order.id} · {order.items?.length ?? 0} artículos
                    </small>
                  </div>
                  <span
                    className={`admin__status-pill admin__status-pill--${order.status}`}
                  >
                    {statusLabel(order.status)}
                  </span>
                  <strong className="admin__recent-total">
                    {formatCurrency(order.total)}
                  </strong>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Aún no hay pedidos"
              detail="Cuando llegue el primer pedido, aparecerá aquí."
            />
          )}
        </section>

        <section className="admin__panel admin__panel--popular">
          <PanelHeading
            title="Catálogo destacado"
            caption="Productos con más reseñas"
            action={
              <span className="admin__panel-mark admin__panel-mark--mint">
                <LuShirt size={17} />
              </span>
            }
          />
          {topProducts.length ? (
            <div className="admin__popular-list">
              {topProducts.map((product, index) => (
                <div className="admin__popular-product" key={product.id}>
                  <span className="admin__popular-index">0{index + 1}</span>
                  <div className="admin__product-thumb">
                    {product.images?.[0]?.url ? (
                      <img src={product.images[0].url} alt="" />
                    ) : (
                      <LuShirt size={20} />
                    )}
                  </div>
                  <div className="admin__popular-info">
                    <strong>{product.name}</strong>
                    <small>
                      {product.brand?.name ?? "Sin marca"} ·{" "}
                      {product.reviews?.length ?? 0} reseñas
                    </small>
                  </div>
                  <strong>{formatCurrency(product.price)}</strong>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Tu catálogo está vacío"
              detail="Crea tu primer producto para empezar."
            />
          )}
        </section>
      </div>
    </>
  );
}
