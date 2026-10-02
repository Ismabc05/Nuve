import { useNavigate } from 'react-router-dom';

import type { Dispatch, SetStateAction } from 'react';

import { LuHeart, LuShoppingBag } from 'react-icons/lu';

import type { Product } from '../types/product';

import '../estilos/product/product-card.css';

type ProductCardProps = {
  product: Product;
  setNotification: Dispatch<SetStateAction<string>>;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

function ProductCard({
  product,
  setNotification,
  isFavorite,
  onToggleFavorite,
}: ProductCardProps) {
  const navigate = useNavigate();

  // Función que formatea el precio a euros
  const formattedPrice = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(Number(product.price));

  // Obtener únicamente un color por cada color disponible
  const uniqueColors = Array.from(
    new Map(
      product.variants.map((variant) => [
        variant.color,
        variant,
      ])
    ).values()
  );

  const handleFavorite = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();

    try {
      await onToggleFavorite();

      setNotification(
        isFavorite
          ? 'Producto eliminado de favoritos'
          : 'Producto añadido a favoritos'
      );
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

  return (
    <article className="product-card">
      <div className="product-card__image-container">
        <img
          className="product-card__image"
          src={product.images[0]?.url}
          alt={product.name}
        />

        <div className="product-card__actions">
          <button
            type="button"
            className={`product-card__favorite ${
              isFavorite
                ? 'product-card__favorite--active'
                : ''
            }`}
            onClick={handleFavorite}
            aria-label={
              isFavorite
                ? 'Quitar de favoritos'
                : 'Añadir a favoritos'
            }
            aria-pressed={isFavorite}
          >
            <LuHeart
              size={18}
              strokeWidth={1.8}
              fill={
                isFavorite
                  ? 'currentColor'
                  : 'none'
              }
            />
          </button>
        </div>

        <div
          className="product-card__colors"
          aria-label={`Colores disponibles: ${uniqueColors
            .map((variant) => variant.color)
            .join(', ')}`}
        >
          {uniqueColors.map((variant) => (
            <span
              key={variant.color}
              className="product-card__color"
              style={{
                backgroundColor: variant.colorHex,
              }}
              title={variant.color}
              aria-hidden="true"
            />
          ))}
        </div>

        <button
          type="button"
          className="product-card__quick-action"
          onClick={() =>
            navigate(`/products/${product.id}`)
          }
        >
          <LuShoppingBag size={16} />
          <span>Ver producto</span>
        </button>
      </div>

      <div className="product-card__info">
        <div className="product-card__details">
          <h2 className="product-card__name">
            {product.name}
          </h2>

          <p className="product-card__price">
            {formattedPrice}
          </p>
        </div>

        <p className="product-card__available-colors">
          {uniqueColors.length}{' '}
          {uniqueColors.length === 1
            ? 'color disponible'
            : 'colores disponibles'}
        </p>
      </div>
    </article>
  );
}

export default ProductCard;