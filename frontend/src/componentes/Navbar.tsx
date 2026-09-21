import {
  LuHeart,
  LuShoppingCart,
  LuUser,
  LuSearch
} from 'react-icons/lu';

import '../estilos/navbar/navbar.css';

function Navbar() {
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
          />
        </div>

        <nav className="navbar__actions" aria-label="Acciones de usuario">

          <button
            type="button"
            className="navbar__action"
            aria-label="Favoritos"
          >
            <LuHeart />
          </button>

          <button
            type="button"
            className="navbar__action"
            aria-label="Carrito"
          >
            <LuShoppingCart />
          </button>

          <button
            type="button"
            className="navbar__action"
            aria-label="Perfil"
          >
            <LuUser />
          </button>

        </nav>

      </div>
    </header>
  );
}

export default Navbar;