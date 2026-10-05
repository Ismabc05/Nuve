import { useEffect, useState } from 'react';

import type { Product } from '../../types/product';

import { getFavorite } from '../../services/product.service';

import { useFavorite } from '../../context/favorites/UseFavorite';

import ProductCard from '../../componentes/ProductCard';
import { useNavigate } from 'react-router-dom';

import '../../estilos/users/favorite.css';
import Navbar from '../../componentes/Navbar';
import Footer from '../../componentes/Footer';

function Favoritos() {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [, setNotification] = useState('');
  const [valorInput, setValorInput] = useState('');
  const navigate = useNavigate();

  const {
    isFavorite,
    addFavoriteProduct,
    removeFavoriteProduct,
  } = useFavorite();

  useEffect(() => {
    const loadFavorites = async () => {
  const storedUser = localStorage.getItem('user');

  if (!storedUser) {
    setError('No hay usuario autenticado');
    setLoading(false);
    return;
  }

  const user = JSON.parse(storedUser);
  const userId = user?.id;

  if (!userId) {
    setError('No hay usuario autenticado');
    setLoading(false);
    return;
  }

  const startTime = Date.now();

  try {
    const favoritesData = await getFavorite(userId);

    console.log('FAVORITOS:', favoritesData);

    setFavorites(favoritesData);
  } catch (error) {
    console.error(
      'Error al cargar favoritos:',
      error
    );

    setError(
      'No se han podido cargar los favoritos'
    );
  } finally {
    const elapsedTime = Date.now() - startTime;

    const remainingTime = Math.max(
      1000 - elapsedTime,
      0
    );

    setTimeout(() => {
      setLoading(false);
    }, remainingTime);
  }
};

    loadFavorites();
  }, []);

  const handleFavorite = async (productId: number) => {
    try {
      if (isFavorite(productId)) {
        await removeFavoriteProduct(productId);

        setFavorites((currentFavorites) =>
          currentFavorites.filter(
            (product) => product.id !== productId
          )
        );
      } else {
        await addFavoriteProduct(productId);
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

  if (loading) {
    return (
      <main className="favoritos-page">
        <div className="favoritos-loading">
          <div className="favoritos-spinner"></div>
          <p>Cargando tus favoritos...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="favoritos-page">
        <div className="favoritos-error">
          <span className="favoritos-error-icon">
            !
          </span>

          <h2>Ups...</h2>

          <p>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <>
    <Navbar
          valorInput={valorInput}
          setValorInput={setValorInput}
        />
    <main className="favoritos-page">
      <section className="favoritos-container">
        <button
            className="favoritos-back"
            onClick={() => navigate('/products')}
          >
            ← Volver a productos
          </button>
        <header className="favoritos-header">
          <div>
            <span className="favoritos-label">
              TU SELECCIÓN
            </span>

            <h1>Mis favoritos</h1>

            <p>
              Los productos que has guardado para
              volver a ellos cuando quieras.
            </p>
          </div>

          <div className="favoritos-count">
            <span>{favorites.length}</span>
            <small>
              {favorites.length === 1
                ? 'producto'
                : 'productos'}
            </small>
          </div>
        </header>

        {favorites.length === 0 ? (
          <div className="favoritos-empty">
            <div className="favoritos-empty-icon">
              ♡
            </div>

            <h2>Aún no tienes favoritos</h2>

            <p>
              Cuando encuentres un producto que te
              guste, pulsa el corazón para guardarlo
              aquí.
            </p>
          </div>
        ) : (
          <div className="favoritos-grid">
            {favorites.map((product) => (
              <div
                className="favoritos-card"
                key={product.id}
              >
                <ProductCard
                  product={product}
                  setNotification={setNotification}
                  isFavorite={isFavorite(product.id)}
                  onToggleFavorite={() =>
                    handleFavorite(product.id)
                  }
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
    <Footer />
    </>
  );
}

export default Favoritos;