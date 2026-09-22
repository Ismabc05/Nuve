import Footer from "../../componentes/Footer"
import Navbar from "../../componentes/Navbar"
import ProductCard from "../../componentes/ProductCard"
import '../../estilos/product/product.css'

function Home() {
    return <>
        <Navbar/>
        <main className="product">
            <div className="product__grid">
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
            </div>
        </main>
        <Footer/>
    </>
}

export default Home