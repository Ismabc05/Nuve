import type { AdminUser } from "../../../types/admin";

export const orderStatuses = [
  "active",
  "pending",
  "paid",
  "shipped",
  "completed",
  "cancelled",
];

export const formatCurrency = (value: number | string) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

export const customerName = (user?: AdminUser) => {
  const name = [user?.profile?.name, user?.profile?.lastname]
    .filter(Boolean)
    .join(" ");
  return name || user?.email || "Cliente";
};

export const initials = (value: string) =>
  value
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

export function statusLabel(status: string) {
  const labels: Record<string, string> = {
    active: "Activo",
    pending: "Pendiente",
    paid: "Pagado",
    shipped: "Enviado",
    completed: "Completado",
    cancelled: "Cancelado",
  };
  return labels[status] ?? status;
}
