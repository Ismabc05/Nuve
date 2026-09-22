import '../estilos/product/product-card.css';

function ProductCard() {
  const product = {
    name: 'Camiseta Oversize',
    price: 39.99,
    image: '/camiseta.jpg',
    colors: [
      '#111111',
      '#E8E4DC',
      '#B8B8B8',
      '#C9A58D'
    ]
  };

  return (
    <article className="product-card">

      <div className="product-card__image-container">

        <img
          className="product-card__image"
          src={product.image}
          alt={product.name}
        />

        <div className="product-card__colors">
          {product.colors.map((color, index) => (
            <span
              key={index}
              className="product-card__color"
              style={{ backgroundColor: color }}
              aria-label={`Color ${index + 1}`}
            />
          ))}
        </div>

      </div>

      <div className="product-card__info">

        <h2 className="product-card__name">
          {product.name}
        </h2>

        <p className="product-card__price">
          {product.price.toFixed(2).replace('.', ',')} €
        </p>

      </div>

    </article>
  );
}

export default ProductCard;