import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import {
  LuBoxes,
  LuCheck,
  LuCircleAlert,
  LuClipboardList,
  LuLayoutDashboard,
  LuLogOut,
  LuMenu,
  LuPackage,
  LuPlus,
  LuSearch,
  LuShirt,
  LuTags,
  LuTrash2,
  LuUsers,
  LuX,
} from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import Catalogo from "./components/Catalogo";
import Clientes from "./components/Clientes";
import Inventario from "./components/Inventario";
import Pedidos from "./components/Pedidos";
import Productos from "./components/Productos";
import Resumen from "./components/Resumen";
import { customerName } from "./components/admin-utils";
import "../../estilos/admin/admin.css";
import {
  createAdminBrand,
  createAdminCategory,
  createAdminImage,
  createAdminProduct,
  createAdminVariant,
  deleteAdminBrand,
  deleteAdminCategory,
  deleteAdminImage,
  deleteAdminProduct,
  deleteAdminUser,
  deleteAdminVariant,
  getAdminImages,
  getAdminOrders,
  getAdminUsers,
  getAdminVariants,
  updateAdminBrand,
  updateAdminCategory,
  updateAdminOrder,
  updateAdminProduct,
  updateAdminVariant,
} from "../../services/admin.service";

import { categories, products, brands } from "../../services/product.service";
import type { Brand, Category, Product } from "../../types/product";
import type {
  AdminUser,
  AdminOrder,
  AdminImage,
  AdminVariant,
} from "../../types/admin";

type Section =
  | "overview"
  | "products"
  | "orders"
  | "customers"
  | "catalog"
  | "inventory";
type CatalogType = "category" | "brand";

type DashboardData = {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  users: AdminUser[];
  orders: AdminOrder[];
  variants: AdminVariant[];
  images: AdminImage[];
};

const emptyData: DashboardData = {
  products: [],
  categories: [],
  brands: [],
  users: [],
  orders: [],
  variants: [],
  images: [],
};

const navigation: {
  id: Section;
  label: string;
  icon: typeof LuLayoutDashboard;
}[] = [
  { id: "overview", label: "Resumen", icon: LuLayoutDashboard },
  { id: "products", label: "Productos", icon: LuPackage },
  { id: "orders", label: "Pedidos", icon: LuClipboardList },
  { id: "customers", label: "Clientes", icon: LuUsers },
  { id: "catalog", label: "Catálogo", icon: LuTags },
  { id: "inventory", label: "Inventario", icon: LuBoxes },
];

function Admin() {
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>("overview");
  const [data, setData] = useState<DashboardData>(emptyData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [catalogForm, setCatalogForm] = useState<{
    type: CatalogType;
    id?: number;
    name: string;
  } | null>(null);
  const [variantForm, setVariantForm] = useState<AdminVariant | null | "new">(
    null,
  );
  const [imageFormOpen, setImageFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const reload = useCallback(async () => {
    try {
      const [productss, categoriess, brandss, users, orders, variants, images] =
        await Promise.all([
          products(),
          categories(),
          brands(),
          getAdminUsers(),
          getAdminOrders(),
          getAdminVariants(),
          getAdminImages(),
        ]);
      setData({
        products: productss,
        categories: categoriess,
        brands: brandss,
        users,
        orders,
        variants,
        images,
      });
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "No se pudieron cargar los datos.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void reload();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [reload]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 3500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const filteredProducts = useMemo(() => {
    const search = query.trim().toLocaleLowerCase();
    if (!search) return data.products;
    return data.products.filter((product) =>
      [
        product.name,
        product.brand?.name,
        ...(product.categories ?? []).map((category) => category.name),
      ]
        .join(" ")
        .toLocaleLowerCase()
        .includes(search),
    );
  }, [data.products, query]);

  const filteredOrders = useMemo(() => {
    const search = query.trim().toLocaleLowerCase();
    return data.orders.filter(
      (order) =>
        !search ||
        `${order.id} ${customerName(order.user)} ${order.status}`
          .toLocaleLowerCase()
          .includes(search),
    );
  }, [data.orders, query]);

  const filteredUsers = useMemo(() => {
    const search = query.trim().toLocaleLowerCase();
    return data.users.filter(
      (user) =>
        !search ||
        `${customerName(user)} ${user.email}`
          .toLocaleLowerCase()
          .includes(search),
    );
  }, [data.users, query]);

  const lowStock = data.variants.filter((variant) => variant.stock <= 5).length;
  const activeSection = navigation.find((item) => item.id === section);

  const perform = async (
    action: () => Promise<unknown>,
    successMessage: string,
  ) => {
    setSaving(true);
    setError("");
    try {
      await action();
      await reload();
      setNotice(successMessage);
      return true;
    } catch (actionError) {
      setError(
        actionError instanceof Error
          ? actionError.message
          : "No se pudo completar la operación.",
      );
      return false;
    } finally {
      setSaving(false);
    }
  };

  const openNewProduct = () => {
    setEditingProduct(null);
    setProductFormOpen(true);
  };

  const handleProductSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const categoryIds = formData.getAll("categories").map(Number);
    const values = {
      name: String(formData.get("name") ?? "").trim(),
      price: Number(formData.get("price")),
      description: String(formData.get("description") ?? "").trim(),
      categories: categoryIds,
      brandId: Number(formData.get("brandId")),
    };
    const imageUrl = String(formData.get("imageUrl") ?? "").trim();

    setSaving(true);
    setError("");
    try {
      const savedProduct = editingProduct
        ? await updateAdminProduct(editingProduct.id, values)
        : await createAdminProduct(values);
      if (imageUrl) {
        await createAdminImage({
          url: imageUrl,
          productId: savedProduct.id ?? editingProduct?.id ?? 0,
        });
      }
      setProductFormOpen(false);
      await reload();
      setNotice(
        editingProduct
          ? "Producto actualizado correctamente."
          : "Producto creado correctamente.",
      );
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "No se pudo guardar el producto.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCatalogSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!catalogForm) return;
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const { type, id } = catalogForm;
    const action =
      type === "category"
        ? id
          ? () => updateAdminCategory(id, name)
          : () => createAdminCategory(name)
        : id
          ? () => updateAdminBrand(id, name)
          : () => createAdminBrand(name);
    const done = await perform(
      action,
      `${type === "category" ? "Categoría" : "Marca"} guardada correctamente.`,
    );
    if (done) setCatalogForm(null);
  };

  const handleVariantSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values = {
      size: String(formData.get("size") ?? "").trim(),
      color: String(formData.get("color") ?? "").trim(),
      colorHex: String(formData.get("colorHex") ?? "#171a18"),
      stock: Number(formData.get("stock")),
      productId: Number(formData.get("productId")),
    };
    const action =
      variantForm && variantForm !== "new"
        ? () => updateAdminVariant(variantForm.id, values)
        : () => createAdminVariant(values);
    const done = await perform(action, "Variante guardada correctamente.");
    if (done) setVariantForm(null);
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const requestDelete = async (
    label: string,
    action: () => Promise<unknown>,
  ) => {
    if (
      !window.confirm(
        `¿Seguro que quieres eliminar ${label}? Esta acción no se puede deshacer.`,
      )
    )
      return;
    await perform(action, "Elemento eliminado correctamente.");
  };

  const changeOrderStatus = async (order: AdminOrder, status: string) => {
    if (order.status === status) return;
    await perform(
      () => updateAdminOrder(order.id, status),
      `Pedido #${order.id} actualizado.`,
    );
  };

  return (
    <div className="admin">
      <aside
        className={`admin__sidebar ${mobileMenuOpen ? "admin__sidebar--open" : ""}`}
      >
        <Link
          className="admin__brand"
          to="/products"
          aria-label="Nuvé, volver a la tienda"
        >
          <img src="/logo.png" alt="" />
          <span>
            <strong>nuvé</strong>
            <small>ADMIN STUDIO</small>
          </span>
        </Link>
        <div className="admin__nav-label">GESTIÓN</div>
        <nav className="admin__nav" aria-label="Navegación de administrador">
          {navigation.map(({ id, label, icon: Icon }) => (
            <button
              className={`admin__nav-item ${section === id ? "is-active" : ""}`}
              key={id}
              onClick={() => {
                setSection(id);
                setQuery("");
                setMobileMenuOpen(false);
              }}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
              {id === "orders" &&
                data.orders.filter((order) => order.status === "pending")
                  .length > 0 && (
                  <span className="admin__nav-count">
                    {
                      data.orders.filter((order) => order.status === "pending")
                        .length
                    }
                  </span>
                )}
            </button>
          ))}
        </nav>
        <div className="admin__sidebar-bottom">
          <div className="admin__help">
            <span className="admin__help-icon">
              <LuShirt size={18} />
            </span>
            <span>
              <strong>Tu tienda, en orden</strong>
              <small>Todo lo que necesitas para gestionar Nuvé.</small>
            </span>
          </div>
          <button className="admin__logout" onClick={handleSignOut}>
            <LuLogOut size={17} /> Cerrar sesión
          </button>
        </div>
      </aside>

      {mobileMenuOpen && (
        <button
          className="admin__scrim"
          aria-label="Cerrar menú"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <main className="admin__main">
        <header className="admin__topbar">
          <button
            className="admin__mobile-menu"
            aria-label="Abrir menú"
            onClick={() => setMobileMenuOpen(true)}
          >
            <LuMenu size={21} />
          </button>
          <div className="admin__breadcrumbs">
            <span>Nuvé</span>
            <span>/</span>
            <strong>{activeSection?.label}</strong>
          </div>
          <div className="admin__topbar-actions">
            <label className="admin__search">
              <LuSearch size={17} />
              <input
                aria-label="Buscar en esta sección"
                placeholder="Buscar..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <kbd>⌘ K</kbd>
            </label>
            <div className="admin__profile">
              <span className="admin__avatar admin__avatar--admin">N</span>
              <span>
                <strong>Administrador</strong>
                <small>Workspace Nuvé</small>
              </span>
            </div>
          </div>
        </header>

        <div className="admin__content">
          <div className="admin__page-heading">
            <div>
              <p className="admin__eyebrow">
                PANEL DE CONTROL <span>·</span>{" "}
                {new Intl.DateTimeFormat("es-ES", { dateStyle: "long" }).format(
                  new Date(),
                )}
              </p>
              <h1>
                {section === "overview"
                  ? "Buenos días, equipo"
                  : activeSection?.label}
              </h1>
              <p className="admin__subtitle">
                {section === "overview"
                  ? "Esto es lo que está pasando hoy en tu tienda."
                  : sectionDescription(section)}
              </p>
            </div>
            <div className="admin__heading-actions">
              {section === "products" && (
                <button
                  className="admin__button admin__button--dark"
                  onClick={openNewProduct}
                >
                  <LuPlus size={17} /> Nuevo producto
                </button>
              )}
              {section === "catalog" && (
                <button
                  className="admin__button admin__button--dark"
                  onClick={() => setCatalogForm({ type: "category", name: "" })}
                >
                  <LuPlus size={17} /> Añadir categoría
                </button>
              )}
              {section === "inventory" && (
                <button
                  className="admin__button admin__button--dark"
                  onClick={() => setVariantForm("new")}
                >
                  <LuPlus size={17} /> Añadir variante
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="admin__alert" role="alert">
              <LuCircleAlert size={18} />
              <span>{error}</span>
              <button aria-label="Cerrar aviso" onClick={() => setError("")}>
                <LuX size={16} />
              </button>
            </div>
          )}
          {notice && (
            <div className="admin__toast" role="status">
              <LuCheck size={17} />
              {notice}
            </div>
          )}

          {loading && !data.products.length && !error ? (
            <div className="admin__loading">
              <span className="admin__spinner" />
              Cargando datos de la tienda...
            </div>
          ) : (
            <>
              {section === "overview" && (
                <Resumen
                  orders={data.orders}
                  products={data.products}
                  categories={data.categories}
                  users={data.users}
                  variants={data.variants}
                  lowStock={lowStock}
                  onNavigate={setSection}
                />
              )}
              {section === "products" && (
                <Productos
                  products={filteredProducts}
                  query={query}
                  onEdit={(product) => {
                    setEditingProduct(product);
                    setProductFormOpen(true);
                  }}
                  onDelete={(product) =>
                    void requestDelete(
                      `el producto “${product.name}”`,
                      () => deleteAdminProduct(product.id),
                    )
                  }
                />
              )}
              {section === "orders" && (
                <Pedidos
                  orders={filteredOrders}
                  onChangeStatus={(order, status) =>
                    void changeOrderStatus(order, status)
                  }
                />
              )}
              {section === "customers" && (
                <Clientes
                  users={filteredUsers}
                  orders={data.orders}
                  onDelete={(user) =>
                    void requestDelete(
                      `la cuenta de ${customerName(user)}`,
                      () => deleteAdminUser(user.id),
                    )
                  }
                />
              )}
              {section === "catalog" && (
                <Catalogo
                  categories={data.categories}
                  brands={data.brands}
                  products={data.products}
                  images={data.images}
                  onAddCatalog={(type) => setCatalogForm({ type, name: "" })}
                  onEditCatalog={(type, id, name) =>
                    setCatalogForm({ type, id, name })
                  }
                  onDeleteCategory={(category) =>
                    void requestDelete(
                      `la categoría “${category.name}”`,
                      () => deleteAdminCategory(category.id),
                    )
                  }
                  onDeleteBrand={(brand) =>
                    void requestDelete(`la marca “${brand.name}”`, () =>
                      deleteAdminBrand(brand.id),
                    )
                  }
                  onAddImage={() => setImageFormOpen(true)}
                  onDeleteImage={(image) =>
                    void requestDelete("esta imagen", () =>
                      deleteAdminImage(image.id),
                    )
                  }
                />
              )}
              {section === "inventory" && (
                <Inventario
                  variants={data.variants}
                  onEdit={setVariantForm}
                  onDelete={(variant) =>
                    void requestDelete(
                      `la variante ${variant.size} / ${variant.color}`,
                      () => deleteAdminVariant(variant.id),
                    )
                  }
                />
              )}
            </>
          )}
        </div>
      </main>

      {productFormOpen && (
        <Modal
          title={editingProduct ? "Editar producto" : "Añadir producto"}
          onClose={() => setProductFormOpen(false)}
        >
          <form className="admin__form" onSubmit={handleProductSubmit}>
            <label>
              Nombre del producto
              <input
                name="name"
                required
                maxLength={100}
                defaultValue={editingProduct?.name ?? ""}
                placeholder="Ej. Camiseta Essential"
              />
            </label>
            <div className="admin__form-row">
              <label>
                Precio (€)
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  defaultValue={editingProduct?.price ?? ""}
                  placeholder="49,90"
                />
              </label>
              <label>
                Marca
                <select
                  name="brandId"
                  required
                  defaultValue={editingProduct?.brand?.id ?? ""}
                >
                  <option value="" disabled>
                    Selecciona marca
                  </option>
                  {data.brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label>
              Descripción
              <textarea
                name="description"
                rows={3}
                maxLength={300}
                required
                defaultValue={editingProduct?.description ?? ""}
                placeholder="Describe el producto..."
              />
            </label>
            <fieldset className="admin__category-options">
              <legend>Categorías</legend>
              {data.categories.length ? (
                data.categories.map((category) => (
                  <label key={category.id} className="admin__checkbox">
                    <input
                      type="checkbox"
                      name="categories"
                      value={category.id}
                      defaultChecked={editingProduct?.categories?.some(
                        (item) => item.id === category.id,
                      )}
                    />
                    <span>{category.name}</span>
                  </label>
                ))
              ) : (
                <p>Añade categorías antes de crear un producto.</p>
              )}
            </fieldset>
            <label>
              Imagen principal{" "}
              <span className="admin__optional">(opcional)</span>
              <input name="imageUrl" type="url" placeholder="https://..." />
            </label>
            {editingProduct?.images?.length ? (
              <div className="admin__existing-images">
                <span>Imágenes actuales</span>
                {editingProduct.images.map((image) => (
                  <div key={image.id}>
                    <img src={image.url} alt="" />
                    <span title={image.url}>{image.url}</span>
                    <button
                      type="button"
                      aria-label="Eliminar imagen"
                      onClick={() =>
                        void requestDelete("esta imagen", () =>
                          deleteAdminImage(image.id),
                        )
                      }
                    >
                      <LuTrash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
            <div className="admin__modal-actions">
              <button
                type="button"
                className="admin__button admin__button--light"
                onClick={() => setProductFormOpen(false)}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="admin__button admin__button--dark"
                disabled={saving}
              >
                {saving
                  ? "Guardando..."
                  : editingProduct
                    ? "Guardar cambios"
                    : "Crear producto"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {catalogForm && (
        <Modal
          title={`${catalogForm.id ? "Editar" : "Añadir"} ${catalogForm.type === "category" ? "categoría" : "marca"}`}
          onClose={() => setCatalogForm(null)}
        >
          <form className="admin__form" onSubmit={handleCatalogSubmit}>
            <label>
              Nombre
              <input
                name="name"
                required
                maxLength={100}
                defaultValue={catalogForm.name}
                placeholder={
                  catalogForm.type === "category"
                    ? "Ej. Camisetas"
                    : "Ej. Nuvé Studio"
                }
              />
            </label>
            <div className="admin__modal-actions">
              <button
                type="button"
                className="admin__button admin__button--light"
                onClick={() => setCatalogForm(null)}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="admin__button admin__button--dark"
                disabled={saving}
              >
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {variantForm && (
        <Modal
          title={variantForm === "new" ? "Añadir variante" : "Editar variante"}
          onClose={() => setVariantForm(null)}
        >
          <form className="admin__form" onSubmit={handleVariantSubmit}>
            <label>
              Producto
              <select
                name="productId"
                required
                defaultValue={
                  variantForm === "new" ? "" : (variantForm.product?.id ?? "")
                }
              >
                <option value="" disabled>
                  Selecciona producto
                </option>
                {data.products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="admin__form-row">
              <label>
                Talla
                <input
                  name="size"
                  required
                  defaultValue={variantForm === "new" ? "" : variantForm.size}
                  placeholder="M"
                />
              </label>
              <label>
                Color
                <input
                  name="color"
                  required
                  defaultValue={variantForm === "new" ? "" : variantForm.color}
                  placeholder="Negro"
                />
              </label>
            </div>
            <div className="admin__form-row">
              <label>
                Stock
                <input
                  name="stock"
                  type="number"
                  min="0"
                  required
                  defaultValue={variantForm === "new" ? 0 : variantForm.stock}
                />
              </label>
              <label>
                Color HEX
                <input
                  name="colorHex"
                  type="color"
                  defaultValue={
                    variantForm === "new" ? "#171a18" : variantForm.colorHex
                  }
                />
              </label>
            </div>
            <div className="admin__modal-actions">
              <button
                type="button"
                className="admin__button admin__button--light"
                onClick={() => setVariantForm(null)}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="admin__button admin__button--dark"
                disabled={saving}
              >
                {saving ? "Guardando..." : "Guardar variante"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {imageFormOpen && (
        <Modal title="Añadir imagen" onClose={() => setImageFormOpen(false)}>
          <form
            className="admin__form"
            onSubmit={async (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const done = await perform(
                () =>
                  createAdminImage({
                    url: String(formData.get("url") ?? "").trim(),
                    productId: Number(formData.get("productId")),
                  }),
                "Imagen añadida correctamente.",
              );
              if (done) setImageFormOpen(false);
            }}
          >
            <label>
              Producto
              <select name="productId" required defaultValue="">
                <option value="" disabled>
                  Selecciona producto
                </option>
                {data.products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              URL de la imagen
              <input name="url" type="url" required placeholder="https://..." />
            </label>
            <div className="admin__modal-actions">
              <button
                type="button"
                className="admin__button admin__button--light"
                onClick={() => setImageFormOpen(false)}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="admin__button admin__button--dark"
                disabled={saving}
              >
                {saving ? "Guardando..." : "Añadir imagen"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function sectionDescription(section: Section) {
  const descriptions: Record<Section, string> = {
    overview: "El estado de tu tienda de un vistazo.",
    products: "Crea, actualiza y organiza los productos de Nuvé.",
    orders: "Revisa las compras y actualiza su estado.",
    customers: "Consulta las cuentas y la actividad de tus clientes.",
    catalog: "Mantén al día las categorías, marcas e imágenes.",
    inventory: "Controla las existencias por talla y color.",
  };
  return descriptions[section];
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className="admin__modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="admin__modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-modal-title"
      >
        <header>
          <div>
            <p className="admin__eyebrow">GESTIÓN DE TIENDA</p>
            <h2 id="admin-modal-title">{title}</h2>
          </div>
          <button aria-label="Cerrar" onClick={onClose}>
            <LuX size={19} />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}

export default Admin;
