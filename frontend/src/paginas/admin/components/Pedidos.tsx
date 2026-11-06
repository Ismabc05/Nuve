import { LuClipboardList } from "react-icons/lu";
import type { AdminOrder } from "../../../types/admin";
import { EmptyState, PanelHeading } from "./admin-ui";
import {
  customerName,
  formatCurrency,
  initials,
  orderStatuses,
  statusLabel,
} from "./admin-utils";

type Props = {
  orders: AdminOrder[];
  onChangeStatus: (order: AdminOrder, status: string) => void;
};

export default function Pedidos({ orders, onChangeStatus }: Props) {
  return (
    <section className="admin__panel admin__table-panel">
      <PanelHeading
        title="Gestión de pedidos"
        caption={`${orders.length} pedidos registrados`}
        action={
          <span className="admin__panel-mark">
            <LuClipboardList size={17} />
          </span>
        }
      />
      <div className="admin__table-wrap">
        <table className="admin__table">
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Cliente</th>
              <th>Artículos</th>
              <th>Total</th>
              <th>Pago</th>
              <th>Estado del pedido</th>
            </tr>
          </thead>
          <tbody>
            {[...orders]
              .sort((a, b) => b.id - a.id)
              .map((order) => (
                <tr key={order.id}>
                  <td>
                    <strong className="admin__order-id">#{order.id}</strong>
                  </td>
                  <td>
                    <div className="admin__table-customer">
                      <span className="admin__avatar">
                        {initials(customerName(order.user))}
                      </span>
                      <span>
                        <strong>{customerName(order.user)}</strong>
                        <small>{order.user?.email ?? "—"}</small>
                      </span>
                    </div>
                  </td>
                  <td>
                    {order.items?.reduce(
                      (total, item) => total + Number(item.quantity || 0),
                      0,
                    ) ?? 0}
                  </td>
                  <td className="admin__table-price">
                    {formatCurrency(order.total)}
                  </td>
                  <td>
                    <span
                      className={`admin__payment ${order.paid ? "is-paid" : "is-unpaid"}`}
                    >
                      <i />
                      {order.paid ? "Pagado" : "Pendiente"}
                    </span>
                  </td>
                  <td>
                    <select
                      className={`admin__status-select admin__status-select--${order.status}`}
                      value={order.status}
                      onChange={(event) =>
                        onChangeStatus(order, event.target.value)
                      }
                      aria-label={`Estado del pedido ${order.id}`}
                    >
                      {orderStatuses.map((status) => (
                        <option key={status} value={status}>
                          {statusLabel(status)}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {!orders.length && (
          <EmptyState
            title="No se encontraron pedidos"
            detail="Los pedidos nuevos aparecerán aquí."
          />
        )}
      </div>
    </section>
  );
}
