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
  const [productList, setProductList] = useState<Product[]>([]); // Estado que contiene el listado de productos
  const [categoryList, setCategoryList] = useState<Category[]>([]); // Estado que contiene listado de categorias
  const [brandList, setBrandList] = useState<Brand[]>([]); // Estado que contiene listado de marcas
  const [loading, setLoading] = useState(true); // Estado de carga
  const [valorInput, setValorInput] = useState(''); // Estado que contiene el valor del buscador para listar todos los productos 
  const [priceOrder, setPriceOrder] = useState<PriceOrder>(''); // El estado que contiene el orden de precio (menor o mayor)
  const [selectedCategories, setSelectedCategories] = // Estado que contiene las categorias seleccionadas
    useState<number[]>([]);
  const [selectedBrands, setSelectedBrands] = // // Estado que contiene las marcas seleccionadas
    useState<number[]>([]);
  const [notification, setNotification] = useState(''); // Estado de notificacion

  const {
    isFavorite,
    addFavoriteProduct,
    removeFavoriteProduct,
  } = useFavorite();

  const filteredProducts = [...productList]
  // Filtra la lista solo con los productos que contenga valorInput
    .filter((product) =>
      product.name
        .toLowerCase()
        .includes(valorInput.toLowerCase())
    )
    .filter(
  // Filtra la lista mostrando solo los productos qur contenga esas categorias
      (product) =>
        selectedCategories.length === 0 ||
        selectedCategories.some((categoryId) =>
          product.categories.some(
            (category) => category.id === categoryId
          )
        )
    )
  //Filtra la lista mostrando solo los producto que contenga esas marcas
    .filter(
      (product) =>
        selectedBrands.length === 0 ||
        selectedBrands.some(
          (brandId) => brandId === product.brand.id
        )
    )
  // Orderna la lista segun sea ascendente o descendente
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

  // Cargar productos, categorías y marcas una vez cuando se renderiza el componente
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
        {/* LE PASAMOS TODAS LAS PROPS NECESARIAS A PRODUCTFILTER PARA PINTAR */}
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