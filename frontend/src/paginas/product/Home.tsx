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
  type Product
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
      <Navbar />

      <main className="product">

        <div className="product__content">

          <ProductFilters
            categories={categoryList}
            brands={brandList}
          />

          <div className="product__grid">

            {loading ? (

              Array.from({ length: 6 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))

            ) : (

              productList.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))

            )}

          </div>

        </div>

      </main>

      <Footer />
    </>
  );
}

export default Home;