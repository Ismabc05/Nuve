import { useEffect, useState } from 'react';

import Footer from '../../componentes/Footer';
import Navbar from '../../componentes/Navbar';
import ProductCard from '../../componentes/ProductCard';
import ProductFilters from '../../componentes/ProductFilters';
import ProductSkeleton from '../../componentes/ProductSkeleton';

import '../../estilos/product/product.css';

import { useFavorite } from '../../context/favorites/UseFavorite';

import {
  type Category,
  type Brand,
  type Product,
  type PriceOrder,
} from '../../types/product';

import {
  products,
  categories,
  brands,
} from '../../services/product.service';

function Home() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [brandList, setBrandList] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [valorInput, setValorInput] = useState('');
  const [priceOrder, setPriceOrder] = useState<PriceOrder>('');
  const [selectedCategories, setSelectedCategories] =
    useState<number[]>([]);
  const [selectedBrands, setSelectedBrands] =
    useState<number[]>([]);
  const [notification, setNotification] = useState('');

  const {
    isFavorite,
    addFavoriteProduct,
    removeFavoriteProduct,
  } = useFavorite();

  const filteredProducts = [...productList]
    .filter((product) =>
      product.name
        .toLowerCase()
        .includes(valorInput.toLowerCase())
    )
    .filter(
      (product) =>
        selectedCategories.length === 0 ||
        selectedCategories.some((categoryId) =>
          product.categories.some(
            (category) => category.id === categoryId
          )
        )
    )
    .filter(
      (product) =>
        selectedBrands.length === 0 ||
        selectedBrands.some(
          (brandId) => brandId === product.brand.id
        )
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

  // Cargar productos, categorías y marcas
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

  const handleFavorite = async (productId: number) => {
  if (isFavorite(productId)) {
    await removeFavoriteProduct(productId);
  } else {
    await addFavoriteProduct(productId);
  }
};

  return (
    <>
      <Navbar
        valorInput={valorInput}
        setValorInput={setValorInput}
      />

      {notification && (
        <div
          className="notification"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="notification__indicator" />

          <div className="notification__content">
            <span className="notification__label">
              Actualización
            </span>

            <p className="notification__message">
              {notification}
            </p>
          </div>

          <button
            type="button"
            className="notification__close"
            onClick={() => setNotification('')}
            aria-label="Cerrar notificación"
          >
            ×
          </button>
        </div>
      )}

      <main className="product">
        <div className="product__content">
          <ProductFilters
            categories={categoryList}
            brands={brandList}
            priceOrder={priceOrder}
            setPriceOrder={setPriceOrder}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedBrands={selectedBrands}
            setSelectedBrands={setSelectedBrands}
          />

          <div className="product__results">
            <div className="product__grid">
              {loading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <ProductSkeleton key={index} />
                ))
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    setNotification={setNotification}
                    isFavorite={isFavorite(product.id)}
                    onToggleFavorite={() =>
                      handleFavorite(product.id)
                    }
                  />
                ))
              ) : (
                <p className="product__no-results">
                  No se encontraron productos.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Home;