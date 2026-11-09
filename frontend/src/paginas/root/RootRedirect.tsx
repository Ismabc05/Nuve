
import { Navigate, Outlet, useLocation } from "react-router-dom";

// Obtener el rol del usuario
function getUserRole(): string | null {
  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");

  if (!token || !userRaw) {
    return null;
  }

  try {
    const user = JSON.parse(userRaw);
    const role = String(user?.role ?? "").toLowerCase();

    if (role !== "user" && role !== "admin") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return null;
    }

    return role;
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return null;
  }
}

// Redirección principal
export function RootRedirect() {
  const role = getUserRole();

  if (role === "user") {
    return <Navigate to="/home" replace />;
  }

  if (role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/login" replace />;
}

// Protección de rutas
type ProtectedRouteProps = {
  allowedRoles?: string[];
};

export function ProtectedRoute({
  allowedRoles,
}: ProtectedRouteProps) {
  const location = useLocation();
  const role = getUserRole();

  if (!role) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === "user") {
      return <Navigate to="/home" replace />;
    }

    if (role === "admin") {
      return <Navigate to="/admin" replace />;
    }
  }

  return <Outlet />;
}
