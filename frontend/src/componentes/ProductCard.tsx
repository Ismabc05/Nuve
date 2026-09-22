import { useState } from 'react';
import { LuHeart, LuShoppingBag } from 'react-icons/lu';
import '../estilos/product/product-card.css';

type Product = {
  name: string;
  price: number;
  image: string;
  colors: {
    name: string;
    value: string;
  }[];
};

function ProductCard() {
  const [isFavorite, setIsFavorite] = useState(false);

  const product: Product = {
    name: 'Camiseta Oversize',
    price: 39.99,
    image: '/camiseta.jpg',
    colors: [
      {
        name: 'Negro',
        value: '#111111',
      },
      {
        name: 'Beige',
        value: '#E8E4DC',
      },
      {
        name: 'Gris',
        value: '#B8B8B8',
      },
      {
        name: 'Marrón claro',
        value: '#C9A58D',
      },
    ],
  };

  const formattedPrice = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(product.price);

  return (
    <article className="product-card">
      <div className="product-card__image-container">
        <img
          className="product-card__image"
          src={product.image}
          alt={product.name}
        />

        <div className="product-card__actions">
          <button
            type="button"
            className={`product-card__favorite ${
              isFavorite ? 'product-card__favorite--active' : ''
            }`}
            onClick={() => setIsFavorite((favorite) => !favorite)}
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
              fill={isFavorite ? 'currentColor' : 'none'}
            />
          </button>
        </div>

        <div
          className="product-card__colors"
          aria-label={`Colores disponibles: ${product.colors
            .map((color) => color.name)
            .join(', ')}`}
        >
          {product.colors.map((color) => (
            <span
              key={color.name}
              className="product-card__color"
              style={{ backgroundColor: color.value }}
              title={color.name}
              aria-hidden="true"
            />
          ))}
        </div>

        <button
          type="button"
          className="product-card__quick-action"
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
          {product.colors.length}{' '}
          {product.colors.length === 1
            ? 'color disponible'
            : 'colores disponibles'}
        </p>
      </div>
    </article>
  );
}

export default ProductCard;