import { LuPlus, LuTrash2 } from "react-icons/lu";
import type { AdminImage } from "../../../types/admin";
import type { Brand, Category, Product } from "../../../types/product";
import {
  CatalogPanel,
  CatalogRow,
  EmptyState,
  PanelHeading,
} from "./admin-ui";

type CatalogType = "category" | "brand";

type Props = {
  categories: Category[];
  brands: Brand[];
  products: Product[];
  images: AdminImage[];
  onAddCatalog: (type: CatalogType) => void;
  onEditCatalog: (
    type: CatalogType,
    id: number,
    name: string,
  ) => void;
  onDeleteCategory: (category: Category) => void;
  onDeleteBrand: (brand: Brand) => void;
  onAddImage: () => void;
  onDeleteImage: (image: AdminImage) => void;
};

export default function Catalogo({
  categories,
  brands,
  products,
  images,
  onAddCatalog,
  onEditCatalog,
  onDeleteCategory,
  onDeleteBrand,
  onAddImage,
  onDeleteImage,
}: Props) {
  return (
    <div className="admin__catalog-grid">
      <CatalogPanel
        title="Categorías"
        caption={`${categories.length} categorías`}
        onAdd={() => onAddCatalog("category")}
      >
        {categories.map((category) => (
          <CatalogRow
            key={category.id}
            name={category.name}
            count={
              products.filter((product) =>
                product.categories?.some((item) => item.id === category.id),
              ).length
            }
            onEdit={() =>
              onEditCatalog("category", category.id, category.name)
            }
            onDelete={() => onDeleteCategory(category)}
          />
        ))}
      </CatalogPanel>
      <CatalogPanel
        title="Marcas"
        caption={`${brands.length} marcas`}
        onAdd={() => onAddCatalog("brand")}
      >
        {brands.map((brand) => (
          <CatalogRow
            key={brand.id}
            name={brand.name}
            count={
              products.filter((product) => product.brand?.id === brand.id)
                .length
            }
            onEdit={() => onEditCatalog("brand", brand.id, brand.name)}
            onDelete={() => onDeleteBrand(brand)}
          />
        ))}
      </CatalogPanel>
      <section className="admin__panel admin__images-panel">
        <PanelHeading
          title="Imágenes"
          caption={`${images.length} imágenes de producto`}
          action={
            <button
              className="admin__button admin__button--light admin__button--small"
              onClick={onAddImage}
            >
              <LuPlus size={15} /> Añadir
            </button>
          }
        />
        {images.length ? (
          <div className="admin__image-grid">
            {images.map((image) => (
              <article className="admin__image-card" key={image.id}>
                <img
                  src={image.url}
                  alt={image.product?.name ?? "Imagen de producto"}
                />
                <div>
                  <span title={image.product?.name}>
                    {image.product?.name ?? "Producto"}
                  </span>
                  <button
                    aria-label="Eliminar imagen"
                    onClick={() => onDeleteImage(image)}
                  >
                    <LuTrash2 size={15} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Aún no hay imágenes"
            detail="Añade imágenes para completar las fichas de producto."
          />
        )}
      </section>
    </div>
  );
}
