import { Route, Routes } from "react-router-dom";
import { CartProvider } from "./context/cart/CartProvider";
import { FavoriteProvider } from "./context/favorites/FavoriteProvider";

import Login from "./paginas/Auth/Login";
import Register from "./paginas/Auth/Register";
import Home from "./paginas/Product/Home";
import Carrito from "./paginas/User/Carrito";
import Favoritos from "./paginas/User/Favoritos";
import Perfil from "./paginas/User/Perfil";
import OrderSuccess from "./paginas/Orders/OrderSuccess";
import Product from "./paginas/Product/Product";
import Admin from "./paginas/Admin/Admin";
import RootRedirect from "./paginas/Root/RootRedirect";
import Orders from "./paginas/Orders/Order";
import ProtectedRoute from "./paginas/Root/RootRedirect";

function App() {
  return (
    <CartProvider>
      <FavoriteProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

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
