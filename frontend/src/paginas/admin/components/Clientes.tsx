import { LuTrash2, LuUsers } from "react-icons/lu";
import type { AdminOrder, AdminUser } from "../../../types/admin";
import { EmptyState, PanelHeading } from "./admin-ui";
import { customerName, initials } from "./admin-utils";

type Props = {
  users: AdminUser[];
  orders: AdminOrder[];
  onDelete: (user: AdminUser) => void;
};

export default function Clientes({ users, orders, onDelete }: Props) {
  return (
    <section className="admin__panel admin__table-panel">
      <PanelHeading
        title="Tus clientes"
        caption={`${users.length} cuentas registradas`}
        action={
          <span className="admin__panel-mark admin__panel-mark--mint">
            <LuUsers size={17} />
          </span>
        }
      />
      <div className="admin__table-wrap">
        <table className="admin__table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Correo electrónico</th>
              <th>Teléfono</th>
              <th>Pedidos</th>
              <th>Rol</th>
              <th>
                <span className="admin__sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const userOrders = orders.filter(
                (order) => order.user?.id === user.id,
              ).length;
              return (
                <tr key={user.id}>
                  <td>
                    <div className="admin__table-customer">
                      <span className="admin__avatar">
                        {initials(customerName(user))}
                      </span>
                      <span>
                        <strong>{customerName(user)}</strong>
                        <small>Cliente #{user.id}</small>
                      </span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.profile?.phone || "—"}</td>
                  <td>{userOrders}</td>
                  <td>
                    <span
                      className={`admin__role-pill ${user.role === "admin" ? "is-admin" : ""}`}
                    >
                      {user.role === "admin" ? "Admin" : "Cliente"}
                    </span>
                  </td>
                  <td>
                    {user.role !== "admin" && (
                      <button
                        className="admin__delete-button"
                        title="Eliminar cliente"
                        onClick={() => onDelete(user)}
                      >
                        <LuTrash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!users.length && (
          <EmptyState
            title="No se encontraron clientes"
            detail="Prueba con otro nombre o correo."
          />
        )}
      </div>
    </section>
  );
}
