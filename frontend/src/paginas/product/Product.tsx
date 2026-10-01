import Navbar from "../../componentes/Navbar";
import Footer from "../../componentes/Footer";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Product as ProductType, Review } from "../../types/product";
import { getFavorite, productById } from "../../services/product.service";
import "../../estilos/product/product-detail.css";

function Product() {
  const [valorInput, setValorInput] = useState("");
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [product, setProduct] = useState<ProductType | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;

      try {
        const productData = await productById(Number(id));
        setProduct(productData);
      } catch (error) {
        console.error(error);
      }
    };

    loadProduct();
  }, [id]);

  useEffect(() => {
    const loadFavorites = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      const userId = user?.id;

      if (!userId) return;

      try {
        const favorites = await getFavorite(userId);
        setFavoriteCount(favorites.length);
      } catch (error) {
        console.error(error);
      }
    };

    loadFavorites();
  }, []);

  return (
    <>
      <Navbar
        valorInput={valorInput}
        setValorInput={setValorInput}
        favoriteCount={favoriteCount}
      />

      <main className="product-detail">
        {product && (
          <>
            <div className="product-detail__back-container">
              <button
                type="button"
                className="product-detail__back"
                onClick={() => navigate(-1)}
              >
                ← Volver
              </button>
            </div>

            <div className="product-detail__container">
              <div className="product-detail__gallery">
                <div className="product-detail__thumbnails">
                  {product.images.map((image, index) => (
                    <button
                      key={image.id}
                      type="button"
                      className={`product-detail__thumbnail ${
                        selectedImage === index
                          ? "product-detail__thumbnail--active"
                          : ""
                      }`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img
                        src={image.url}
                        alt={`${product.name} - imagen ${index + 1}`}
                      />
                    </button>
                  ))}
                </div>

                <div className="product-detail__image-section">
                  <img
                    className="product-detail__image"
                    src={product.images[selectedImage]?.url}
                    alt={product.name}
                  />
                </div>
              </div>

              <div className="product-detail__info">
                <p className="product-detail__brand">
                  {product.brand.name}
                </p>

                <h1 className="product-detail__name">
                  {product.name}
                </h1>

                <p className="product-detail__price">
                  {new Intl.NumberFormat("es-ES", {
                    style: "currency",
                    currency: "EUR",
                  }).format(Number(product.price))}
                </p>

                <div className="product-detail__separator" />

                <p className="product-detail__description">
                  {product.description}
                </p>

                <div className="product-detail__section">
                  <h2>Colores</h2>

                  <div className="product-detail__colors">
                    {Array.from(
                      new Map(
                        product.variants.map((variant) => [
                          variant.color,
                          variant,
                        ])
                      ).values()
                    ).map((variant) => (
                      <button
                        key={variant.color}
                        type="button"
                        className="product-detail__color"
                        style={{
                          backgroundColor: variant.colorHex,
                        }}
                        title={variant.color}
                        aria-label={`Color ${variant.color}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="product-detail__section">
                  <h2>Talla</h2>

                  <div className="product-detail__sizes">
                    {Array.from(
                      new Set(
                        product.variants.map(
                          (variant) => variant.size
                        )
                      )
                    ).map((size) => (
                      <button
                        key={size}
                        type="button"
                        className="product-detail__size"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  className="product-detail__add"
                >
                  Añadir al carrito
                </button>
              </div>
            </div>

            <section className="product-detail__reviews">
              <div className="product-detail__reviews-header">
                <h2>Reseñas</h2>

                <span>
                  {Array.isArray(product.reviews)
                    ? product.reviews.length
                    : 0}{" "}
                  {Array.isArray(product.reviews) &&
                  product.reviews.length === 1
                    ? "reseña"
                    : "reseñas"}
                </span>
              </div>

              {Array.isArray(product.reviews) &&
              product.reviews.length > 0 ? (
                <div className="product-detail__reviews-list">
                  {product.reviews.map((review: Review) => (
                    <article
                      key={review.id}
                      className="product-detail__review"
                    >
                      <div className="product-detail__review-top">
                        <div className="product-detail__review-rating">
                          {"★".repeat(review.rating)}
                          {"☆".repeat(5 - review.rating)}
                        </div>

                        <span className="product-detail__review-user">
                          Usuario #{review.userId}
                        </span>
                      </div>

                      <p className="product-detail__review-comment">
                        {review.comment}
                      </p>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="product-detail__no-reviews">
                  <p>No hay reseñas disponibles.</p>
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <Footer />
    </>
  );
}

export default Product;