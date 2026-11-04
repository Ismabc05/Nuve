import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import {
  LuArrowDown,
  LuArrowRight,
  LuArrowUpRight,
  LuBell,
  LuBoxes,
  LuCheck,
  LuChevronDown,
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
  getAdminBrands,
  getAdminCategories,
  getAdminImages,
  getAdminOrders,
  getAdminProducts,
  getAdminUsers,
  getAdminVariants,
  updateAdminBrand,
  updateAdminCategory,
  updateAdminOrder,
  updateAdminProduct,
  updateAdminVariant,
  type AdminImage,
  type AdminOrder,
  type AdminUser,
  type AdminVariant,
} from "../../services/admin.service";
import type { Brand, Category, Product } from "../../types/product";

type Section = "overview" | "products" | "orders" | "customers" | "catalog" | "inventory";
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

const navigation: { id: Section; label: string; icon: typeof LuLayoutDashboard }[] = [
  { id: "overview", label: "Resumen", icon: LuLayoutDashboard },
  { id: "products", label: "Productos", icon: LuPackage },
  { id: "orders", label: "Pedidos", icon: LuClipboardList },
  { id: "customers", label: "Clientes", icon: LuUsers },
  { id: "catalog", label: "Catálogo", icon: LuTags },
  { id: "inventory", label: "Inventario", icon: LuBoxes },
];

const orderStatuses = ["active", "pending", "paid", "shipped", "completed", "cancelled"];

const formatCurrency = (value: number | string) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

const customerName = (user?: AdminUser) => {
  const name = [user?.profile?.name, user?.profile?.lastname].filter(Boolean).join(" ");
  return name || user?.email || "Cliente";
};

const initials = (value: string) =>
  value
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

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
  const [catalogForm, setCatalogForm] = useState<{ type: CatalogType; id?: number; name: string } | null>(null);
  const [variantForm, setVariantForm] = useState<AdminVariant | null | "new">(null);
  const [imageFormOpen, setImageFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const reload = useCallback(async () => {
    try {
      const [products, categories, brands, users, orders, variants, images] = await Promise.all([
        getAdminProducts(),
        getAdminCategories(),
        getAdminBrands(),
        getAdminUsers(),
        getAdminOrders(),
        getAdminVariants(),
        getAdminImages(),
      ]);
      setData({ products, categories, brands, users, orders, variants, images });
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "No se pudieron cargar los datos.");
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
      [product.name, product.brand?.name, ...(product.categories ?? []).map((category) => category.name)]
        .join(" ")
        .toLocaleLowerCase()
        .includes(search),
    );
  }, [data.products, query]);

  const filteredOrders = useMemo(() => {
    const search = query.trim().toLocaleLowerCase();
    return data.orders.filter((order) =>
      !search ||
      `${order.id} ${customerName(order.user)} ${order.status}`.toLocaleLowerCase().includes(search),
    );
  }, [data.orders, query]);

  const filteredUsers = useMemo(() => {
    const search = query.trim().toLocaleLowerCase();
    return data.users.filter((user) =>
      !search || `${customerName(user)} ${user.email}`.toLocaleLowerCase().includes(search),
    );
  }, [data.users, query]);

  const sales = data.orders
    .filter((order) => order.paid || order.status === "completed")
    .reduce((sum, order) => sum + Number(order.total || 0), 0);
  const lowStock = data.variants.filter((variant) => variant.stock <= 5).length;
  const activeSection = navigation.find((item) => item.id === section);

  const perform = async (action: () => Promise<unknown>, successMessage: string) => {
    setSaving(true);
    setError("");
    try {
      await action();
      await reload();
      setNotice(successMessage);
      return true;
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "No se pudo completar la operación.");
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
        await createAdminImage({ url: imageUrl, productId: savedProduct.id ?? editingProduct?.id ?? 0 });
      }
      setProductFormOpen(false);
      await reload();
      setNotice(editingProduct ? "Producto actualizado correctamente." : "Producto creado correctamente.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "No se pudo guardar el producto.");
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
    const action = type === "category"
      ? id ? () => updateAdminCategory(id, name) : () => createAdminCategory(name)
      : id ? () => updateAdminBrand(id, name) : () => createAdminBrand(name);
    const done = await perform(action, `${type === "category" ? "Categoría" : "Marca"} guardada correctamente.`);
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
    const action = variantForm && variantForm !== "new"
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

  const requestDelete = async (label: string, action: () => Promise<unknown>) => {
    if (!window.confirm(`¿Seguro que quieres eliminar ${label}? Esta acción no se puede deshacer.`)) return;
    await perform(action, "Elemento eliminado correctamente.");
  };

  const changeOrderStatus = async (order: AdminOrder, status: string) => {
    if (order.status === status) return;
    await perform(() => updateAdminOrder(order.id, status), `Pedido #${order.id} actualizado.`);
  };

  return (
    <div className="admin">
      <aside className={`admin__sidebar ${mobileMenuOpen ? "admin__sidebar--open" : ""}`}>
        <Link className="admin__brand" to="/products" aria-label="Nuvé, volver a la tienda">
          <img src="/logo.png" alt="" />
          <span><strong>nuvé</strong><small>ADMIN STUDIO</small></span>
        </Link>
        <div className="admin__nav-label">GESTIÓN</div>
        <nav className="admin__nav" aria-label="Navegación de administrador">
          {navigation.map(({ id, label, icon: Icon }) => (
            <button
              className={`admin__nav-item ${section === id ? "is-active" : ""}`}
              key={id}
              onClick={() => { setSection(id); setQuery(""); setMobileMenuOpen(false); }}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
              {id === "orders" && data.orders.filter((order) => order.status === "pending").length > 0 && (
                <span className="admin__nav-count">
                  {data.orders.filter((order) => order.status === "pending").length}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="admin__sidebar-bottom">
          <div className="admin__help">
            <span className="admin__help-icon"><LuShirt size={18} /></span>
            <span><strong>Tu tienda, en orden</strong><small>Todo lo que necesitas para gestionar Nuvé.</small></span>
          </div>
          <button className="admin__logout" onClick={handleSignOut}>
            <LuLogOut size={17} /> Cerrar sesión
          </button>
        </div>
      </aside>

      {mobileMenuOpen && <button className="admin__scrim" aria-label="Cerrar menú" onClick={() => setMobileMenuOpen(false)} />}

      <main className="admin__main">
        <header className="admin__topbar">
          <button className="admin__mobile-menu" aria-label="Abrir menú" onClick={() => setMobileMenuOpen(true)}>
            <LuMenu size={21} />
          </button>
          <div className="admin__breadcrumbs"><span>Nuvé</span><span>/</span><strong>{activeSection?.label}</strong></div>
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
            <button className="admin__icon-button admin__notification" aria-label="Notificaciones">
              <LuBell size={18} />
              {lowStock > 0 && <span />}
            </button>
            <div className="admin__profile">
              <span className="admin__avatar admin__avatar--admin">N</span>
              <span><strong>Administrador</strong><small>Workspace Nuvé</small></span>
              <LuChevronDown size={15} />
            </div>
          </div>
        </header>

        <div className="admin__content">
          <div className="admin__page-heading">
            <div>
              <p className="admin__eyebrow">PANEL DE CONTROL <span>·</span> {new Intl.DateTimeFormat("es-ES", { dateStyle: "long" }).format(new Date())}</p>
              <h1>{section === "overview" ? "Buenos días, equipo" : activeSection?.label}</h1>
              <p className="admin__subtitle">{section === "overview" ? "Esto es lo que está pasando hoy en tu tienda." : sectionDescription(section)}</p>
            </div>
            <div className="admin__heading-actions">
              {section === "products" && <button className="admin__button admin__button--dark" onClick={openNewProduct}><LuPlus size={17} /> Nuevo producto</button>}
              {section === "catalog" && <button className="admin__button admin__button--dark" onClick={() => setCatalogForm({ type: "category", name: "" })}><LuPlus size={17} /> Añadir categoría</button>}
              {section === "inventory" && <button className="admin__button admin__button--dark" onClick={() => setVariantForm("new")}><LuPlus size={17} /> Añadir variante</button>}
            </div>
          </div>

          {error && (
            <div className="admin__alert" role="alert">
              <LuCircleAlert size={18} /><span>{error}</span><button aria-label="Cerrar aviso" onClick={() => setError("")}><LuX size={16} /></button>
            </div>
          )}
          {notice && <div className="admin__toast" role="status"><LuCheck size={17} />{notice}</div>}

          {loading && !data.products.length && !error ? (
            <div className="admin__loading"><span className="admin__spinner" />Cargando datos de la tienda...</div>
          ) : (
            <>
              {section === "overview" && renderOverview()}
              {section === "products" && renderProducts()}
              {section === "orders" && renderOrders()}
              {section === "customers" && renderCustomers()}
              {section === "catalog" && renderCatalog()}
              {section === "inventory" && renderInventory()}
            </>
          )}
        </div>
      </main>

      {productFormOpen && (
        <Modal title={editingProduct ? "Editar producto" : "Añadir producto"} onClose={() => setProductFormOpen(false)}>
          <form className="admin__form" onSubmit={handleProductSubmit}>
            <label>Nombre del producto<input name="name" required maxLength={100} defaultValue={editingProduct?.name ?? ""} placeholder="Ej. Camiseta Essential" /></label>
            <div className="admin__form-row">
              <label>Precio (€)<input name="price" type="number" step="0.01" min="0.01" required defaultValue={editingProduct?.price ?? ""} placeholder="49,90" /></label>
              <label>Marca<select name="brandId" required defaultValue={editingProduct?.brand?.id ?? ""}><option value="" disabled>Selecciona marca</option>{data.brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)}</select></label>
            </div>
            <label>Descripción<textarea name="description" rows={3} maxLength={300} required defaultValue={editingProduct?.description ?? ""} placeholder="Describe el producto..." /></label>
            <fieldset className="admin__category-options">
              <legend>Categorías</legend>
              {data.categories.length ? data.categories.map((category) => (
                <label key={category.id} className="admin__checkbox">
                  <input type="checkbox" name="categories" value={category.id} defaultChecked={editingProduct?.categories?.some((item) => item.id === category.id)} />
                  <span>{category.name}</span>
                </label>
              )) : <p>Añade categorías antes de crear un producto.</p>}
            </fieldset>
            <label>Imagen principal <span className="admin__optional">(opcional)</span><input name="imageUrl" type="url" placeholder="https://..." /></label>
            {editingProduct?.images?.length ? (
              <div className="admin__existing-images"><span>Imágenes actuales</span>{editingProduct.images.map((image) => (
                <div key={image.id}><img src={image.url} alt="" /><span title={image.url}>{image.url}</span><button type="button" aria-label="Eliminar imagen" onClick={() => void requestDelete("esta imagen", () => deleteAdminImage(image.id))}><LuTrash2 size={15} /></button></div>
              ))}</div>
            ) : null}
            <div className="admin__modal-actions">
              <button type="button" className="admin__button admin__button--light" onClick={() => setProductFormOpen(false)}>Cancelar</button>
              <button type="submit" className="admin__button admin__button--dark" disabled={saving}>{saving ? "Guardando..." : editingProduct ? "Guardar cambios" : "Crear producto"}</button>
            </div>
          </form>
        </Modal>
      )}

      {catalogForm && (
        <Modal title={`${catalogForm.id ? "Editar" : "Añadir"} ${catalogForm.type === "category" ? "categoría" : "marca"}`} onClose={() => setCatalogForm(null)}>
          <form className="admin__form" onSubmit={handleCatalogSubmit}>
            <label>Nombre<input name="name" required maxLength={100} defaultValue={catalogForm.name} placeholder={catalogForm.type === "category" ? "Ej. Camisetas" : "Ej. Nuvé Studio"} /></label>
            <div className="admin__modal-actions"><button type="button" className="admin__button admin__button--light" onClick={() => setCatalogForm(null)}>Cancelar</button><button type="submit" className="admin__button admin__button--dark" disabled={saving}>{saving ? "Guardando..." : "Guardar"}</button></div>
          </form>
        </Modal>
      )}

      {variantForm && (
        <Modal title={variantForm === "new" ? "Añadir variante" : "Editar variante"} onClose={() => setVariantForm(null)}>
          <form className="admin__form" onSubmit={handleVariantSubmit}>
            <label>Producto<select name="productId" required defaultValue={variantForm === "new" ? "" : variantForm.product?.id ?? ""}><option value="" disabled>Selecciona producto</option>{data.products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</select></label>
            <div className="admin__form-row">
              <label>Talla<input name="size" required defaultValue={variantForm === "new" ? "" : variantForm.size} placeholder="M" /></label>
              <label>Color<input name="color" required defaultValue={variantForm === "new" ? "" : variantForm.color} placeholder="Negro" /></label>
            </div>
            <div className="admin__form-row">
              <label>Stock<input name="stock" type="number" min="0" required defaultValue={variantForm === "new" ? 0 : variantForm.stock} /></label>
              <label>Color HEX<input name="colorHex" type="color" defaultValue={variantForm === "new" ? "#171a18" : variantForm.colorHex} /></label>
            </div>
            <div className="admin__modal-actions"><button type="button" className="admin__button admin__button--light" onClick={() => setVariantForm(null)}>Cancelar</button><button type="submit" className="admin__button admin__button--dark" disabled={saving}>{saving ? "Guardando..." : "Guardar variante"}</button></div>
          </form>
        </Modal>
      )}

      {imageFormOpen && (
        <Modal title="Añadir imagen" onClose={() => setImageFormOpen(false)}>
          <form className="admin__form" onSubmit={async (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const done = await perform(
              () => createAdminImage({ url: String(formData.get("url") ?? "").trim(), productId: Number(formData.get("productId")) }),
              "Imagen añadida correctamente.",
            );
            if (done) setImageFormOpen(false);
          }}>
            <label>Producto<select name="productId" required defaultValue=""><option value="" disabled>Selecciona producto</option>{data.products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</select></label>
            <label>URL de la imagen<input name="url" type="url" required placeholder="https://..." /></label>
            <div className="admin__modal-actions"><button type="button" className="admin__button admin__button--light" onClick={() => setImageFormOpen(false)}>Cancelar</button><button type="submit" className="admin__button admin__button--dark" disabled={saving}>{saving ? "Guardando..." : "Añadir imagen"}</button></div>
          </form>
        </Modal>
      )}
    </div>
  );

  function renderOverview() {
    const statusCounts = orderStatuses.map((status) => ({
      status,
      count: data.orders.filter((order) => order.status === status).length,
    }));
    const maxStatusCount = Math.max(1, ...statusCounts.map((item) => item.count));
    const recentOrders = [...data.orders].sort((a, b) => b.id - a.id).slice(0, 5);
    const topProducts = [...data.products].sort((a, b) => (b.reviews?.length ?? 0) - (a.reviews?.length ?? 0)).slice(0, 4);

    return (
      <>
        <section className="admin__welcome">
          <div className="admin__welcome-copy"><span className="admin__welcome-tag"><span /> TU TIENDA, A PRIMERA VISTA</span><h2>Un buen día empieza<br />con todo en su sitio.</h2><p>Consulta pedidos, catálogo y stock desde un solo lugar.</p><button onClick={() => setSection("products")}>Explorar catálogo <LuArrowRight size={16} /></button></div>
          <div className="admin__welcome-art"><span className="admin__art-orbit admin__art-orbit--one" /><span className="admin__art-orbit admin__art-orbit--two" /><div className="admin__art-card"><span>NUVÉ / NEW SEASON</span><strong>La calma<br />también viste.</strong><i>01 — 06</i></div><span className="admin__art-dot" /></div>
        </section>

        <section className="admin__stats">
          <StatCard label="Ventas completadas" value={formatCurrency(sales)} meta={`${data.orders.filter((order) => order.paid || order.status === "completed").length} pedidos pagados`} icon={<LuArrowUpRight size={18} />} />
          <StatCard label="Pedidos totales" value={String(data.orders.length)} meta={`${data.orders.filter((order) => order.status === "pending").length} pendientes de revisar`} icon={<LuClipboardList size={18} />} />
          <StatCard label="Productos activos" value={String(data.products.length)} meta={`${data.categories.length} categorías`} icon={<LuPackage size={18} />} />
          <StatCard label="Clientes" value={String(data.users.length)} meta="Cuentas registradas" icon={<LuUsers size={18} />} />
        </section>

        <div className="admin__overview-grid">
          <section className="admin__panel admin__panel--status">
            <PanelHeading title="Estado de los pedidos" caption="Distribución actual" action={<span className="admin__panel-mark"><LuClipboardList size={17} /></span>} />
            <div className="admin__status-total"><strong>{data.orders.length}</strong><span>pedidos en total</span></div>
            <div className="admin__status-bars">{statusCounts.filter((item) => item.count > 0 || item.status === "pending").map(({ status, count }) => (
              <div className="admin__status-row" key={status}><span className={`admin__status-dot admin__status-dot--${status}`} /><span className="admin__status-name">{statusLabel(status)}</span><div className="admin__status-track"><i className={`admin__status-fill admin__status-fill--${status}`} style={{ width: `${Math.max(count ? 8 : 0, (count / maxStatusCount) * 100)}%` }} /></div><strong>{count}</strong></div>
            ))}</div>
            <button className="admin__text-link" onClick={() => setSection("orders")}>Ver todos los pedidos <LuArrowRight size={15} /></button>
          </section>

          <section className="admin__panel admin__panel--stock">
            <PanelHeading title="Atención al stock" caption="Inventario" action={<span className="admin__panel-mark admin__panel-mark--warm"><LuBoxes size={17} /></span>} />
            <div className="admin__stock-callout"><span className={lowStock ? "is-warning" : "is-good"}>{lowStock ? <LuArrowDown size={16} /> : <LuCheck size={16} />}</span><div><strong>{lowStock || "Todo en orden"}</strong><small>{lowStock ? "variantes con 5 unidades o menos" : "No hay variantes con stock bajo"}</small></div></div>
            <div className="admin__stock-summary"><div><span>Unidades en inventario</span><strong>{data.variants.reduce((total, variant) => total + Number(variant.stock || 0), 0)}</strong></div><div><span>Variantes</span><strong>{data.variants.length}</strong></div></div>
            <button className="admin__text-link" onClick={() => setSection("inventory")}>Gestionar inventario <LuArrowRight size={15} /></button>
          </section>

          <section className="admin__panel admin__panel--recent">
            <PanelHeading title="Pedidos recientes" caption="Actividad de la tienda" action={<button className="admin__panel-link" onClick={() => setSection("orders")}>Ver todos <LuArrowRight size={14} /></button>} />
            {recentOrders.length ? <div className="admin__recent-list">{recentOrders.map((order) => (
              <div className="admin__recent-order" key={order.id}><span className="admin__avatar">{initials(customerName(order.user))}</span><div className="admin__recent-customer"><strong>{customerName(order.user)}</strong><small>Pedido #{order.id} · {order.items?.length ?? 0} artículos</small></div><span className={`admin__status-pill admin__status-pill--${order.status}`}>{statusLabel(order.status)}</span><strong className="admin__recent-total">{formatCurrency(order.total)}</strong></div>
            ))}</div> : <EmptyState title="Aún no hay pedidos" detail="Cuando llegue el primer pedido, aparecerá aquí." />}
          </section>

          <section className="admin__panel admin__panel--popular">
            <PanelHeading title="Catálogo destacado" caption="Productos con más reseñas" action={<span className="admin__panel-mark admin__panel-mark--mint"><LuShirt size={17} /></span>} />
            {topProducts.length ? <div className="admin__popular-list">{topProducts.map((product, index) => (
              <div className="admin__popular-product" key={product.id}><span className="admin__popular-index">0{index + 1}</span><div className="admin__product-thumb">{product.images?.[0]?.url ? <img src={product.images[0].url} alt="" /> : <LuShirt size={20} />}</div><div className="admin__popular-info"><strong>{product.name}</strong><small>{product.brand?.name ?? "Sin marca"} · {product.reviews?.length ?? 0} reseñas</small></div><strong>{formatCurrency(product.price)}</strong></div>
            ))}</div> : <EmptyState title="Tu catálogo está vacío" detail="Crea tu primer producto para empezar." />}
          </section>
        </div>
      </>
    );
  }

  function renderProducts() {
    return (
      <section className="admin__panel admin__table-panel">
        <PanelHeading title="Todos los productos" caption={`${filteredProducts.length} artículos en el catálogo`} action={<span className="admin__panel-mark"><LuPackage size={17} /></span>} />
        <div className="admin__table-wrap"><table className="admin__table"><thead><tr><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Reseñas</th><th>Estado</th><th><span className="admin__sr-only">Acciones</span></th></tr></thead><tbody>
          {filteredProducts.map((product) => {
            const stock = product.variants?.reduce((total, variant) => total + Number(variant.stock || 0), 0) ?? 0;
            return <tr key={product.id}>
              <td><div className="admin__table-product"><span className="admin__product-thumb">{product.images?.[0]?.url ? <img src={product.images[0].url} alt="" /> : <LuShirt size={20} />}</span><span><strong>{product.name}</strong><small>{product.brand?.name ?? "Sin marca"}</small></span></div></td>
              <td>{product.categories?.map((category) => category.name).join(", ") || "—"}</td>
              <td className="admin__table-price">{formatCurrency(product.price)}</td><td>{stock} uds.</td><td>{product.reviews?.length ?? 0}</td>
              <td><span className={`admin__stock-pill ${stock === 0 ? "is-out" : stock <= 5 ? "is-low" : "is-in"}`}><i />{stock === 0 ? "Sin stock" : stock <= 5 ? "Stock bajo" : "Disponible"}</span></td>
              <td><div className="admin__row-actions"><button title="Editar producto" onClick={() => { setEditingProduct(product); setProductFormOpen(true); }}>Editar</button><button className="admin__delete-button" title="Eliminar producto" onClick={() => void requestDelete(`el producto “${product.name}”`, () => deleteAdminProduct(product.id))}><LuTrash2 size={16} /></button></div></td>
            </tr>;
          })}
        </tbody></table>
        {!filteredProducts.length && <EmptyState title="No se encontraron productos" detail={query ? "Prueba con otra búsqueda." : "Añade el primer producto de tu catálogo."} />}
        </div>
      </section>
    );
  }

  function renderOrders() {
    return (
      <section className="admin__panel admin__table-panel">
        <PanelHeading title="Gestión de pedidos" caption={`${filteredOrders.length} pedidos registrados`} action={<span className="admin__panel-mark"><LuClipboardList size={17} /></span>} />
        <div className="admin__table-wrap"><table className="admin__table"><thead><tr><th>Pedido</th><th>Cliente</th><th>Artículos</th><th>Total</th><th>Pago</th><th>Estado del pedido</th></tr></thead><tbody>
          {[...filteredOrders].sort((a, b) => b.id - a.id).map((order) => <tr key={order.id}>
            <td><strong className="admin__order-id">#{order.id}</strong></td><td><div className="admin__table-customer"><span className="admin__avatar">{initials(customerName(order.user))}</span><span><strong>{customerName(order.user)}</strong><small>{order.user?.email ?? "—"}</small></span></div></td><td>{order.items?.reduce((total, item) => total + Number(item.quantity || 0), 0) ?? 0}</td><td className="admin__table-price">{formatCurrency(order.total)}</td>
            <td><span className={`admin__payment ${order.paid ? "is-paid" : "is-unpaid"}`}><i />{order.paid ? "Pagado" : "Pendiente"}</span></td>
            <td><select className={`admin__status-select admin__status-select--${order.status}`} value={order.status} onChange={(event) => void changeOrderStatus(order, event.target.value)} aria-label={`Estado del pedido ${order.id}`}>{orderStatuses.map((status) => <option key={status} value={status}>{statusLabel(status)}</option>)}</select></td>
          </tr>)}
        </tbody></table>{!filteredOrders.length && <EmptyState title="No se encontraron pedidos" detail="Los pedidos nuevos aparecerán aquí." />}</div>
      </section>
    );
  }

  function renderCustomers() {
    return (
      <section className="admin__panel admin__table-panel">
        <PanelHeading title="Tus clientes" caption={`${filteredUsers.length} cuentas registradas`} action={<span className="admin__panel-mark admin__panel-mark--mint"><LuUsers size={17} /></span>} />
        <div className="admin__table-wrap"><table className="admin__table"><thead><tr><th>Cliente</th><th>Correo electrónico</th><th>Teléfono</th><th>Pedidos</th><th>Rol</th><th><span className="admin__sr-only">Acciones</span></th></tr></thead><tbody>
          {filteredUsers.map((user) => {
            const userOrders = data.orders.filter((order) => order.user?.id === user.id).length;
            return <tr key={user.id}><td><div className="admin__table-customer"><span className="admin__avatar">{initials(customerName(user))}</span><span><strong>{customerName(user)}</strong><small>Cliente #{user.id}</small></span></div></td><td>{user.email}</td><td>{user.profile?.phone || "—"}</td><td>{userOrders}</td><td><span className={`admin__role-pill ${user.role === "admin" ? "is-admin" : ""}`}>{user.role === "admin" ? "Admin" : "Cliente"}</span></td><td>{user.role !== "admin" && <button className="admin__delete-button" title="Eliminar cliente" onClick={() => void requestDelete(`la cuenta de ${customerName(user)}`, () => deleteAdminUser(user.id))}><LuTrash2 size={16} /></button>}</td></tr>;
          })}
        </tbody></table>{!filteredUsers.length && <EmptyState title="No se encontraron clientes" detail="Prueba con otro nombre o correo." />}</div>
      </section>
    );
  }

  function renderCatalog() {
    return (
      <div className="admin__catalog-grid">
        <CatalogPanel title="Categorías" caption={`${data.categories.length} categorías`} onAdd={() => setCatalogForm({ type: "category", name: "" })}>
          {data.categories.map((category) => <CatalogRow key={category.id} name={category.name} count={category.products?.length} onEdit={() => setCatalogForm({ type: "category", id: category.id, name: category.name })} onDelete={() => void requestDelete(`la categoría “${category.name}”`, () => deleteAdminCategory(category.id))} />)}
        </CatalogPanel>
        <CatalogPanel title="Marcas" caption={`${data.brands.length} marcas`} onAdd={() => setCatalogForm({ type: "brand", name: "" })}>
          {data.brands.map((brand) => <CatalogRow key={brand.id} name={brand.name} count={brand.products?.length} onEdit={() => setCatalogForm({ type: "brand", id: brand.id, name: brand.name })} onDelete={() => void requestDelete(`la marca “${brand.name}”`, () => deleteAdminBrand(brand.id))} />)}
        </CatalogPanel>
        <section className="admin__panel admin__images-panel">
          <PanelHeading title="Imágenes" caption={`${data.images.length} imágenes de producto`} action={<button className="admin__button admin__button--light admin__button--small" onClick={() => setImageFormOpen(true)}><LuPlus size={15} /> Añadir</button>} />
          {data.images.length ? <div className="admin__image-grid">{data.images.map((image) => <article className="admin__image-card" key={image.id}><img src={image.url} alt={image.product?.name ?? "Imagen de producto"} /><div><span title={image.product?.name}>{image.product?.name ?? "Producto"}</span><button aria-label="Eliminar imagen" onClick={() => void requestDelete("esta imagen", () => deleteAdminImage(image.id))}><LuTrash2 size={15} /></button></div></article>)}</div> : <EmptyState title="Aún no hay imágenes" detail="Añade imágenes para completar las fichas de producto." />}
        </section>
      </div>
    );
  }

  function renderInventory() {
    const lowStockVariants = data.variants.filter((variant) => variant.stock <= 5).length;
    return (
      <>
        <section className="admin__stats admin__stats--compact">
          <StatCard label="Unidades disponibles" value={String(data.variants.reduce((total, variant) => total + Number(variant.stock || 0), 0))} meta="Stock total en todas las variantes" icon={<LuBoxes size={18} />} />
          <StatCard label="Variantes" value={String(data.variants.length)} meta="Tallas y colores" icon={<LuShirt size={18} />} />
          <StatCard label="Stock bajo" value={String(lowStockVariants)} meta="5 unidades o menos" icon={<LuArrowDown size={18} />} />
        </section>
        <section className="admin__panel admin__table-panel">
          <PanelHeading title="Tallas, colores y existencias" caption="Control de inventario por variante" action={<span className="admin__panel-mark"><LuBoxes size={17} /></span>} />
          <div className="admin__table-wrap"><table className="admin__table"><thead><tr><th>Producto</th><th>Talla</th><th>Color</th><th>Stock disponible</th><th>Estado</th><th><span className="admin__sr-only">Acciones</span></th></tr></thead><tbody>
            {data.variants.map((variant) => <tr key={variant.id}><td><strong>{variant.product?.name ?? `Producto #${variant.product?.id ?? "—"}`}</strong></td><td>{variant.size}</td><td><span className="admin__color-swatch"><i style={{ backgroundColor: variant.colorHex }} />{variant.color}</span></td><td><strong>{variant.stock}</strong> uds.</td><td><span className={`admin__stock-pill ${variant.stock === 0 ? "is-out" : variant.stock <= 5 ? "is-low" : "is-in"}`}><i />{variant.stock === 0 ? "Sin stock" : variant.stock <= 5 ? "Stock bajo" : "Disponible"}</span></td><td><div className="admin__row-actions"><button onClick={() => setVariantForm(variant)}>Editar</button><button className="admin__delete-button" title="Eliminar variante" onClick={() => void requestDelete(`la variante ${variant.size} / ${variant.color}`, () => deleteAdminVariant(variant.id))}><LuTrash2 size={16} /></button></div></td></tr>)}
          </tbody></table>{!data.variants.length && <EmptyState title="No hay variantes todavía" detail="Añade tallas y colores para controlar el stock de tus productos." />}</div>
        </section>
      </>
    );
  }
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

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    active: "Activo",
    pending: "Pendiente",
    paid: "Pagado",
    shipped: "Enviado",
    completed: "Completado",
    cancelled: "Cancelado",
  };
  return labels[status] ?? status;
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="admin__modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="admin__modal" role="dialog" aria-modal="true" aria-labelledby="admin-modal-title">
        <header><div><p className="admin__eyebrow">GESTIÓN DE TIENDA</p><h2 id="admin-modal-title">{title}</h2></div><button aria-label="Cerrar" onClick={onClose}><LuX size={19} /></button></header>
        {children}
      </section>
    </div>
  );
}

function StatCard({ label, value, meta, icon }: { label: string; value: string; meta: string; icon: ReactNode }) {
  return <article className="admin__stat-card"><div className="admin__stat-top"><span>{label}</span><i>{icon}</i></div><strong className="admin__stat-value">{value}</strong><div className="admin__stat-meta"><span className="admin__stat-spark"><LuArrowUpRight size={13} /></span>{meta}</div><span className="admin__stat-decoration" /></article>;
}

function PanelHeading({ title, caption, action }: { title: string; caption: string; action?: ReactNode }) {
  return <header className="admin__panel-heading"><div><h2>{title}</h2><p>{caption}</p></div>{action}</header>;
}

function EmptyState({ title, detail }: { title: string; detail: string }) {
  return <div className="admin__empty"><span><LuPackage size={20} /></span><strong>{title}</strong><p>{detail}</p></div>;
}

function CatalogPanel({ title, caption, onAdd, children }: { title: string; caption: string; onAdd: () => void; children: ReactNode }) {
  return <section className="admin__panel admin__catalog-panel"><PanelHeading title={title} caption={caption} action={<button className="admin__icon-button admin__catalog-add" aria-label={`Añadir ${title.toLocaleLowerCase()}`} onClick={onAdd}><LuPlus size={18} /></button>} /><div className="admin__catalog-list">{children || <EmptyState title={`Sin ${title.toLocaleLowerCase()}`} detail="Añade el primer elemento para empezar." />}</div></section>;
}

function CatalogRow({ name, count, onEdit, onDelete }: { name: string; count?: number; onEdit: () => void; onDelete: () => void }) {
  return <div className="admin__catalog-row"><span className="admin__catalog-icon"><LuTags size={17} /></span><span className="admin__catalog-name"><strong>{name}</strong><small>{count ?? 0} productos</small></span><button className="admin__catalog-edit" onClick={onEdit}>Editar</button><button className="admin__delete-button" aria-label={`Eliminar ${name}`} onClick={onDelete}><LuTrash2 size={16} /></button></div>;
}

export default Admin;