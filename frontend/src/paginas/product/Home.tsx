import { useEffect, useState } from 'react';

import Footer from '../../componentes/Footer';
import Navbar from '../../componentes/Navbar';
import ProductCard from '../../componentes/ProductCard';
import ProductFilters from '../../componentes/ProductFilters';
import ProductSkeleton from '../../componentes/ProductSkeleton';

import '../../estilos/product/product.css';

import {
  type Category,
  type Brand,
  type Product,
  type PriceOrder
} from '../../types/product';

import {
  products,
  categories,
  brands
} from '../../services/product.service';

function Home() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [brandList, setBrandList] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [ valorInput, setValorInput ] = useState("");
  const [priceOrder, setPriceOrder] = useState<PriceOrder>("");

  const filteredProducts = [...productList]
    .filter((product) =>
      product.name.toLowerCase().includes(valorInput.toLowerCase())
    )
    .sort((a, b) => {
      const priceA = Number(a.price);
      const priceB = Number(b.price);

      if (priceOrder === 'asc') {
        return priceA - priceB;
      }

      if (priceOrder === 'desc') {
        return priceB - priceA;
      }

      return 0;
    });

  useEffect(() => {

    products()
      .then((data) => {
        setProductList(data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });

    categories()
      .then((data) => {
        setCategoryList(data);
      })
      .catch((error) => {
        console.error(error);
      });

    brands()
      .then((data) => {
        setBrandList(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <Navbar valorInput={valorInput} setValorInput={setValorInput} />

      <main className="product">

        <div className="product__content">

          <ProductFilters
            categories={categoryList}
            brands={brandList}
            priceOrder={priceOrder}
            setPriceOrder={setPriceOrder} 
          />

          <div className="product__grid">

            {loading ? (

              Array.from({ length: 6 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))

            ) : (
              filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))
            ) : (
              <p className='product__no-results'>No se encontraron productos.</p>
            )
            )}

          </div>

        </div>

      </main>

      <Footer />
    </>
  );
}

export default Home;