import Navbar from '../../componentes/Navbar';

import Footer from '../../componentes/Footer';

import { useEffect, useMemo, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import {
  LuChevronLeft,
  LuHeart,
  LuMinus,
  LuPlus,
  LuRotateCcw,
  LuShieldCheck,
  LuShoppingBag,
  LuTruck,
} from 'react-icons/lu';

import type {
  Product as ProductType,
  Review,
} from '../../types/product';

import { productById } from '../../services/product.service';

import '../../estilos/product/product-detail.css';

import { useCart } from '../../context/cart/UseCart';

import { useFavorite } from '../../context/favorites/UseFavorite';

function Product() {
  const [valorInput, setValorInput] = useState('');
  const [product, setProduct] =
    useState<ProductType | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState('');

  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();

  const {
    isFavorite,
    addFavoriteProduct,
    removeFavoriteProduct,
  } = useFavorite();

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setError('Producto no encontrado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        const productData = await productById(Number(id));

        setProduct(productData);

        const firstVariant =
          productData.variants?.[0];

        if (firstVariant) {
          setSelectedColor(firstVariant.color);
          setSelectedSize(firstVariant.size);
        }
      } catch (error) {
        console.error(error);
        setError(
          'No se ha podido cargar el producto'
        );
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const uniqueColors = useMemo(() => {
    if (!product) {
      return [];
    }

    return Array.from(
      new Map(
        product.variants.map((variant) => [
          variant.color,
          variant,
        ])
      ).values()
    );
  }, [product]);

  const uniqueSizes = useMemo(() => {
    if (!product) {
      return [];
    }

    return Array.from(
      new Set(
        product.variants.map((variant) => variant.size)
      )
    );
  }, [product]);

  const formattedPrice = product
    ? new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
      }).format(Number(product.price))
    : '';

  const handleQuantityChange = (amount: number) => {
    setQuantity((currentQuantity) => {
      const nextQuantity = currentQuantity + amount;

      return Math.max(
        1,
        Math.min(nextQuantity, 10)
      );
    });
  };

  const handleFavorite = async () => {
    if (!product) {
      return;
    }

    try {
      if (isFavorite(product.id)) {
        await removeFavoriteProduct(product.id);

        setNotification(
          'Producto eliminado de favoritos'
        );
      } else {
        await addFavoriteProduct(product.id);

        setNotification(
          'Producto añadido a favoritos'
        );
      }
    } catch (error) {
      console.error(
        'Error al actualizar favoritos:',
        error
      );

      setNotification(
        'Error al actualizar favoritos'
      );
    }
  };

  const handleAddToCart = async () => {
    if (
      !product ||
      !selectedColor ||
      !selectedSize
    ) {
      return;
    }

    try {
      const selectedVariant =
        product.variants.find(
          (variant) =>
            variant.color === selectedColor &&
            variant.size === selectedSize
        );

      if (!selectedVariant) {
        console.error(
          'No se ha encontrado la variante seleccionada'
        );

        return;
      }

      await addToCart(
        selectedVariant.id,
        quantity
      );

      setNotification(
        'Producto añadido al carrito'
      );
    } catch (error) {
      console.error(
        'Error al añadir al carrito:',
        error
      );
    }
  };

  if (loading) {
    return (
      <>
        <Navbar
          valorInput={valorInput}
          setValorInput={setValorInput}
        />

        <main className="product-detail product-detail--state">
          <div className="product-detail__loader">
            <span className="product-detail__loader-line" />

            <p>Cargando producto...</p>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Navbar
          valorInput={valorInput}
          setValorInput={setValorInput}
        />

        <main className="product-detail product-detail--state">
          <div className="product-detail__empty">
            <p>
              {error || 'Producto no encontrado'}
            </p>

            <button
              type="button"
              onClick={() => navigate(-1)}
            >
              Volver
            </button>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  const favoriteActive = isFavorite(product.id);

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

      <main className="product-detail">
        <div className="product-detail__back-container">
          <button
            type="button"
            className="product-detail__back"
            onClick={() => navigate(-1)}
          >
            <LuChevronLeft size={17} />

            <span>Volver a productos</span>
          </button>
        </div>

        <div className="product-detail__container">
          <section className="product-detail__gallery">
            <div className="product-detail__gallery-header">
              <span className="product-detail__gallery-label">
                Vista del producto
              </span>

              <span className="product-detail__gallery-count">
                {selectedImage + 1} /{' '}
                {product.images.length}
              </span>
            </div>

            <div className="product-detail__gallery-content">
              <div className="product-detail__thumbnails">
                {product.images.map(
                  (image, index) => (
                    <button
                      key={image.id}
                      type="button"
                      className={`product-detail__thumbnail ${
                        selectedImage === index
                          ? 'product-detail__thumbnail--active'
                          : ''
                      }`}
                      onClick={() =>
                        setSelectedImage(index)
                      }
                      aria-label={`Ver imagen ${
                        index + 1
                      }`}
                      aria-pressed={
                        selectedImage === index
                      }
                    >
                      <img
                        src={image.url}
                        alt={`${product.name} - imagen ${
                          index + 1
                        }`}
                      />
                    </button>
                  )
                )}
              </div>

              <div className="product-detail__image-section">
                <img
                  className="product-detail__image"
                  src={
                    product.images[selectedImage]?.url
                  }
                  alt={product.name}
                />

                <span className="product-detail__image-badge">
                  Colección Nuvé
                </span>
              </div>
            </div>
          </section>

          <section className="product-detail__info">
            <div className="product-detail__topline">
              <p className="product-detail__brand">
                {product.brand.name}
              </p>

              <button
                type="button"
                className={`product-detail__favorite ${
                  favoriteActive
                    ? 'product-detail__favorite--active'
                    : ''
                }`}
                onClick={handleFavorite}
                aria-label={
                  favoriteActive
                    ? 'Quitar producto de favoritos'
                    : 'Añadir producto a favoritos'
                }
                aria-pressed={favoriteActive}
              >
                <LuHeart
                  size={18}
                  strokeWidth={1.8}
                  fill={
                    favoriteActive
                      ? 'currentColor'
                      : 'none'
                  }
                />
              </button>
            </div>

            <h1 className="product-detail__name">
              {product.name}
            </h1>

            <div className="product-detail__rating">
              <span className="product-detail__stars">
                ★★★★★
              </span>

              <span className="product-detail__rating-text">
                {product.reviews?.length || 0}{' '}
                reseñas
              </span>
            </div>

            <p className="product-detail__price">
              {formattedPrice}
            </p>

            <p className="product-detail__taxes">
              Impuestos incluidos
            </p>

            <div className="product-detail__separator" />

            <p className="product-detail__description">
              {product.description}
            </p>

            <div className="product-detail__section">
              <div className="product-detail__section-heading">
                <h2>Color</h2>

                <span>
                  {selectedColor ||
                    'Selecciona un color'}
                </span>
              </div>

              <div className="product-detail__colors">
                {uniqueColors.map((variant) => (
                  <button
                    key={variant.color}
                    type="button"
                    className={`product-detail__color ${
                      selectedColor === variant.color
                        ? 'product-detail__color--active'
                        : ''
                    }`}
                    style={{
                      backgroundColor:
                        variant.colorHex,
                    }}
                    title={variant.color}
                    aria-label={`Seleccionar color ${variant.color}`}
                    aria-pressed={
                      selectedColor ===
                      variant.color
                    }
                    onClick={() =>
                      setSelectedColor(
                        variant.color
                      )
                    }
                  />
                ))}
              </div>
            </div>

            <div className="product-detail__section">
              <div className="product-detail__section-heading">
                <h2>Talla</h2>

                <button
                  type="button"
                  className="product-detail__size-guide"
                >
                  Guía de tallas
                </button>
              </div>

              <div className="product-detail__sizes">
                {uniqueSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`product-detail__size ${
                      selectedSize === size
                        ? 'product-detail__size--active'
                        : ''
                    }`}
                    onClick={() =>
                      setSelectedSize(size)
                    }
                    aria-pressed={
                      selectedSize === size
                    }
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="product-detail__purchase">
              <div className="product-detail__quantity">
                <button
                  type="button"
                  onClick={() =>
                    handleQuantityChange(-1)
                  }
                  aria-label="Reducir cantidad"
                >
                  <LuMinus size={15} />
                </button>

                <span>{quantity}</span>

                <button
                  type="button"
                  onClick={() =>
                    handleQuantityChange(1)
                  }
                  aria-label="Aumentar cantidad"
                >
                  <LuPlus size={15} />
                </button>
              </div>

              <button
                type="button"
                className="product-detail__add"
                onClick={handleAddToCart}
                disabled={
                  !selectedColor ||
                  !selectedSize
                }
              >
                <LuShoppingBag size={18} />

                <span>Añadir al carrito</span>
              </button>
            </div>

            <div className="product-detail__benefits">
              <div className="product-detail__benefit">
                <LuTruck size={19} />

                <div>
                  <strong>Envío rápido</strong>

                  <span>
                    Recíbelo en 2-4 días laborables
                  </span>
                </div>
              </div>

              <div className="product-detail__benefit">
                <LuRotateCcw size={19} />

                <div>
                  <strong>
                    Devoluciones sencillas
                  </strong>

                  <span>
                    Tienes 30 días para devolverlo
                  </span>
                </div>
              </div>

              <div className="product-detail__benefit">
                <LuShieldCheck size={19} />

                <div>
                  <strong>Compra segura</strong>

                  <span>
                    Tus datos están protegidos
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="product-detail__reviews">
          <div className="product-detail__reviews-header">
            <div>
              <span className="product-detail__reviews-eyebrow">
                Opiniones verificadas
              </span>

              <h2>
                Lo que dicen de este producto
              </h2>
            </div>

            <span className="product-detail__reviews-count">
              {product.reviews?.length || 0}{' '}
              {product.reviews?.length === 1
                ? 'reseña'
                : 'reseñas'}
            </span>
          </div>

          {Array.isArray(product.reviews) &&
          product.reviews.length > 0 ? (
            <div className="product-detail__reviews-list">
              {product.reviews.map(
                (review: Review) => (
                  <article
                    key={review.id}
                    className="product-detail__review"
                  >
                    <div className="product-detail__review-top">
                      <div className="product-detail__review-rating">
                        <span>
                          {'★'.repeat(
                            review.rating
                          )}
                        </span>

                        <span className="product-detail__review-date">
                          Compra verificada
                        </span>
                      </div>

                      <span className="product-detail__review-user">
                        Usuario #{review.userId}
                      </span>
                    </div>

                    <p className="product-detail__review-comment">
                      {review.comment}
                    </p>
                  </article>
                )
              )}
            </div>
          ) : (
            <div className="product-detail__no-reviews">
              <p>
                Todavía no hay reseñas para este
                producto.
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Product;