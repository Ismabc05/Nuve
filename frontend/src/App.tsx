import { Route, Routes } from "react-router-dom"


import Login from "./paginas/login/Login"
import Register from "./paginas/register/Register"
import Home from "./paginas/home/Home"
import Carrito from "./paginas/carrito/Carrito"
import Favoritos from "./paginas/favoritos/Favoritos"
import Perfil from "./paginas/perfil/Perfil"
import Order from "./paginas/order/Order"
import Product from "./paginas/product/Product"
import Admin from "./paginas/admin/Admin"
import RootRedirect from "./paginas/root/RootRedirect"
import Orders from "./paginas/orders/Pedidos"

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<RootRedirect/>} />

        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>

        <Route path="/products" element={<Home/>}/>
        <Route path="/products/:id" element={<Product/>}/>

        <Route path="/carts" element={<Carrito/>}/>
        <Route path="/favorites" element={<Favoritos/>}/>

        <Route path="/perfil" element={<Perfil/>}/>

        <Route path="/orders" element={<Orders/>}/>
        <Route path="/orders/:id" element={<Order/>}/>

        <Route path="/admin" element={<Admin/>}/>
      </Routes>
    </>
  )
}

export default App
