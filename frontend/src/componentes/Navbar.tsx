import {
  LuHeart,
  LuShoppingCart,
  LuUser,
  LuSearch
} from 'react-icons/lu';

import '../estilos/navbar/navbar.css'
import { useCart } from '../context/cart/UseCart';
import { useFavorite } from '../context/favorites/UseFavorite';
import { useNavigate } from 'react-router-dom';

// Recibe estas dos props del componente Home que es el que renderiza product
type NavbarProps = {
  valorInput: string; // Contiene el texto del buscador
  setValorInput: (valor: string) => void; // Funcion que actualiza el texto del buscador
};

function Navbar({valorInput, setValorInput}: NavbarProps) {
  const { cartCount } = useCart(); // Nos traemos de useCart el contador de productos de el carrito
  const { favoriteCount } = useFavorite(); // Nos traemos de useCart el contador de productos de favoritos
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="navbar__container">

        <a href="/products" className="navbar__logo" aria-label="Nuvé">
          <img src="/login.png" alt="Nuvé" />
        </a>

        <div className="navbar__search">
          <LuSearch className="navbar__search-icon" />

          <input
            type="text"
            placeholder="¿Qué estás buscando?"
            aria-label="Buscar productos"
            value={valorInput}
            onChange={(event) => {setValorInput(event.target.value)}}
          />
        </div>

        <nav className="navbar__actions" aria-label="Acciones de usuario">

          <button
            type="button"
            className="navbar__action"
            aria-label="Favoritos"
            onClick={() => navigate('/favorites')}
          >
            <LuHeart />
            { /* MOSTRAMOS LA CANTIDAD*/}
            {favoriteCount > 0 && (
              <span className="navbar__favorite-count">
                {favoriteCount}
              </span>
            )}
          </button>

          <button
            type="button"
            className="navbar__action"
            aria-label="Carrito"
            onClick={() => navigate('/carts')}
          >
            <LuShoppingCart />
            { /* MOSTRAMOS LA CANTIDAD*/}
            {cartCount > 0 && (
              <span className="navbar__cart-count">
              {cartCount}
              </span>
            )}
          </button>

          <button
            type="button"
            className="navbar__action"
            aria-label="Perfil"
            onClick={() => navigate('/perfil')}
          >
            <LuUser />
          </button>

        </nav>

      </div>
    </header>
  );
}

export default Navbar;