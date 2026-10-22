import { Navigate, Outlet, useLocation } from "react-router-dom";

type ProtectedRouteProps = {
  allowedRoles?: string[];
};

export default function ProtectedRoute({
  allowedRoles,
}: ProtectedRouteProps) {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");

  if (!token || !userRaw) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  let user: { role?: string };

  try {
    user = JSON.parse(userRaw);
  } catch {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(
      String(user.role ?? "").toLowerCase()
    )
  ) {
    return <Navigate to="/products" replace />;
  }

  return <Outlet />;
}