import { useEffect, useState } from 'react';

import Footer from '../../componentes/Footer';
import Navbar from '../../componentes/Navbar';
import ProductCard from '../../componentes/ProductCard';
import '../../estilos/product/product.css';
import type { Product } from '../../types/product';

import { products } from '../../services/product.service';

function Home() {
  const [productList, setProductList] = useState<Product[]>([]);

  useEffect(() => {
    products()
      .then((data) => {
        setProductList(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <Navbar />

      <main className="product">
        <div className="product__grid">
          {productList.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Home;