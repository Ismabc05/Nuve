import { useState } from 'react';

import {
  LuChevronUp,
  LuChevronDown
} from 'react-icons/lu';

import type { Category, Brand } from '../types/product';

import '../estilos/product/product.filter.css';

type Section = 'categorias' | 'marcas' | 'precio';

type ProductFiltersProps = {
  categories: Category[];
  brands: Brand[];
};

function ProductFilters({
  categories,
  brands
}: ProductFiltersProps) {

  const [openSections, setOpenSections] = useState<
    Record<Section, boolean>
  >({
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

            {categories.map((category) => (
              <label
                key={category.id}
                className="product-filters__option"
              >
                <input type="checkbox" />
                <span>{category.name}</span>
              </label>
            ))}

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

            {brands.map((brand) => (
              <label
                key={brand.id}
                className="product-filters__option"
              >
                <input type="checkbox" />
                <span>{brand.name}</span>
              </label>
            ))}

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
