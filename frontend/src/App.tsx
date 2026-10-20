import { Route, Routes } from "react-router-dom"
import { CartProvider } from "./context/cart/CartProvider"
import { FavoriteProvider } from "./context/favorites/FavoriteProvider"


import Login from "./paginas/Auth/Login"
import Register from "./paginas/Auth/Register"
import Home from "./paginas/Product/Home"
import Carrito from "./paginas/User/Carrito"
import Favoritos from "./paginas/User/Favoritos"
import Perfil from "./paginas/User/Perfil"
import OrderSuccess from "./paginas/Orders/OrderSuccess"
import Product from "./paginas/Product/Product"
import Admin from "./paginas/Admin/Admin"
import RootRedirect from "./paginas/Root/RootRedirect"
import Orders from "./paginas/Orders/Order"

function App() {

  // Englobamos las rutas de la aplicación dentro de los providers de carrito y favoritos para que estén disponibles en toda la app.
  return (
    <>
      <CartProvider>
        <FavoriteProvider>
          <Routes>
            <Route path="/" element={<RootRedirect/>} />

            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>

            <Route path="/products" element={<Home/>}/>
            <Route path="/products/:id" element={<Product/>}/>

            <Route path="/carts" element={<Carrito/>}/>
            <Route path="/favorites" element={<Favoritos/>}/>

            <Route path="/perfil" element={<Perfil/>}/>

            <Route path="/orders/success" element={<OrderSuccess/>}/>
            <Route path="/orders/:id" element={<Orders/>}/>

            <Route path="/admin" element={<Admin/>}/>
          </Routes>
        </FavoriteProvider>
      </CartProvider>
    </>
  )
}

export default App
