import { useState } from 'react';
import {
  LuChevronUp,
  LuChevronDown
} from 'react-icons/lu';

import '../estilos/product/product.filter.css';

type Section = 'categorias' | 'marcas' | 'precio';

function ProductFilters() {
  const [openSections, setOpenSections] = useState<Record<Section, boolean>>({
    categorias: true,
    marcas: true,
    precio: true
  });

  const toggleSection = (section: Section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <aside className="product-filters">

      {/* CATEGORÍAS */}
      <section className="product-filters__section">
        <button
          type="button"
          className="product-filters__header"
          onClick={() => toggleSection('categorias')}
        >
          <h2>Categorías</h2>

          {openSections.categorias ? (
            <LuChevronUp />
          ) : (
            <LuChevronDown />
          )}
        </button>

        {openSections.categorias && (
          <div className="product-filters__options">
            <label className="product-filters__option">
              <input type="checkbox" />
              <span>Camisetas</span>
            </label>

            <label className="product-filters__option">
              <input type="checkbox" />
              <span>Pantalones</span>
            </label>

            <label className="product-filters__option">
              <input type="checkbox" />
              <span>Sudaderas</span>
            </label>

            <label className="product-filters__option">
              <input type="checkbox" />
              <span>Chaquetas</span>
            </label>

            <label className="product-filters__option">
              <input type="checkbox" />
              <span>Zapatillas</span>
            </label>

            <label className="product-filters__option">
              <input type="checkbox" />
              <span>Accesorios</span>
            </label>
          </div>
        )}
      </section>

      {/* MARCAS */}
      <section className="product-filters__section">
        <button
          type="button"
          className="product-filters__header"
          onClick={() => toggleSection('marcas')}
        >
          <h2>Marcas</h2>

          {openSections.marcas ? (
            <LuChevronUp />
          ) : (
            <LuChevronDown />
          )}
        </button>

        {openSections.marcas && (
          <div className="product-filters__options">
            <label className="product-filters__option">
              <input type="checkbox" />
              <span>Nike</span>
            </label>

            <label className="product-filters__option">
              <input type="checkbox" />
              <span>Adidas</span>
            </label>

            <label className="product-filters__option">
              <input type="checkbox" />
              <span>Puma</span>
            </label>

            <label className="product-filters__option">
              <input type="checkbox" />
              <span>New Balance</span>
            </label>

            <label className="product-filters__option">
              <input type="checkbox" />
              <span>Vans</span>
            </label>
          </div>
        )}
      </section>

      {/* PRECIO */}
      <section className="product-filters__section">
        <button
          type="button"
          className="product-filters__header"
          onClick={() => toggleSection('precio')}
        >
          <h2>Precio</h2>

          {openSections.precio ? (
            <LuChevronUp />
          ) : (
            <LuChevronDown />
          )}
        </button>

        {openSections.precio && (
          <div className="product-filters__options">
            <label className="product-filters__option">
              <input
                type="radio"
                name="price-order"
              />
              <span>Mayor a menor</span>
            </label>

            <label className="product-filters__option">
              <input
                type="radio"
                name="price-order"
              />
              <span>Menor a mayor</span>
            </label>
          </div>
        )}
      </section>

    </aside>
  );
}

export default ProductFilters;
