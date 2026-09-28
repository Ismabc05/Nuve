import '../estilos/product/product-skeleton.css';

function ProductSkeleton() {
  return (
    <article className="product-skeleton">

      <div className="product-skeleton__image">
        <div className="product-skeleton__shine" />
      </div>

      <div className="product-skeleton__info">

        <div className="product-skeleton__name">
          <div className="product-skeleton__shine" />
        </div>

        <div className="product-skeleton__price">
          <div className="product-skeleton__shine" />
        </div>

      </div>

    </article>
  );
}

export default ProductSkeleton;