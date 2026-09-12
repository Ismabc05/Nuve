import { Route, Routes } from "react-router-dom"


import Login from "./paginas/Auth/Login"
import Register from "./paginas/Auth/Register"
import Home from "./paginas/Product/Home"
import Carrito from "./paginas/User/Carrito"
import Favoritos from "./paginas/User/Favoritos"
import Perfil from "./paginas/User/Perfil"
import Order from "./paginas/Orders/Order"
import Product from "./paginas/Product/Product"
import Admin from "./paginas/Admin/Admin"
import RootRedirect from "./paginas/Root/RootRedirect"
import Orders from "./paginas/Orders/Orders"

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
