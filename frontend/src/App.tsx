import { Route, Routes } from "react-router-dom";
import { CartProvider } from "./context/cart/CartProvider";
import { FavoriteProvider } from "./context/favorites/FavoriteProvider";

import Login from "./paginas/auth/Login";
import Register from "./paginas/auth/Register";
import Home from "./paginas/product/Home";
import Carrito from "./paginas/user/Carrito";
import Favoritos from "./paginas/user/Favoritos";
import Perfil from "./paginas/user/Perfil";
import OrderSuccess from "./paginas/orders/OrderSuccess";
import Product from "./paginas/product/Product";
import Admin from "./paginas/admin/Admin";
import RootRedirect from "./paginas/root/RootRedirect";
import Orders from "./paginas/orders/Order";
import ProtectedRoute from "./paginas/root/RootRedirect";
import ForgotPassword from "./paginas/auth/ForgotPassword";
import ResetPassword from "./paginas/auth/ResetPassword";


function App() {
  return (
    <CartProvider>
      <FavoriteProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />}/>
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Todas las demás rutas requieren iniciar sesión */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<RootRedirect />} />

            <Route path="/products" element={<Home />} />
            <Route path="/products/:id" element={<Product />} />

            <Route path="/carts" element={<Carrito />} />
            <Route path="/favorites" element={<Favoritos />} />
            <Route path="/perfil" element={<Perfil />} />

            <Route
              path="/orders/success"
              element={<OrderSuccess />}
            />
            <Route path="/orders/:id" element={<Orders />} />
          </Route>

          {/* Solo administradores */}
          <Route
            element={<ProtectedRoute allowedRoles={["admin"]} />}
          >
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
      </FavoriteProvider>
    </CartProvider>
  );
}

export default App;
