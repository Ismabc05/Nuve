import { useEffect, useState } from "react";

import Navbar from "../../componentes/Navbar";
import Footer from "../../componentes/Footer";

import {
  getUser,
  getAddresses,
  updateUser,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../../services/user.service";

import { uploadImage } from "../../services/auth.service";

import "../../estilos/users/perfil.css";

import { useNavigate } from "react-router-dom";

import {
  validateProfile,
  validateAddress,
  validateProfileImage,
  type ProfileErrors,
  type AddressErrors,
} from "../../paginas/User/Validation";

import type { Address, User } from "../../types/perfil";

const getOrderStatus = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "En curso";

    case "pending":
      return "Pendiente";

    case "completed":
      return "Completado";

    case "cancelled":
      return "Cancelado";

    case "shipped":
      return "Enviado";

    case "delivered":
      return "Entregado";

    default:
      return status;
  }
};

function Perfil() {
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [valorInput, setValorInput] = useState("");
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    lastname: "",
    phone: "",
    zipCode: "",
    image: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    country: "",
  });
  const [editingAddress, setEditingAddress] = useState<number | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressError, setAddressError] = useState("");
  const [addressSuccess, setAddressSuccess] = useState("");
  const [profileFieldErrors, setProfileFieldErrors] = useState<ProfileErrors>(
    {},
  );
  const [addressFieldErrors, setAddressFieldErrors] = useState<AddressErrors>(
    {},
  );
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        setError("No hay usuario autenticado");
        setLoading(false);
        return;
      }

      const startTime = Date.now();

      try {
        const loggedUser = JSON.parse(storedUser);

        const userId = loggedUser?.id;

        if (!userId) {
          setError("No hay usuario autenticado");
          setLoading(false);
          return;
        }

        const [userData, addressData] = await Promise.all([
          getUser(userId),
          getAddresses(userId),
        ]);

        setUser(userData);

        setAddresses(addressData);

        // =========================
        // FORMULARIO PERFIL
        // =========================

        setProfileForm({
          name: userData.profile.name || "",
          lastname: userData.profile.lastname || "",
          phone: userData.profile.phone || "",
          zipCode: userData.profile.zip_code || "",
          image: userData.profile.image || "",
        });
      } catch (error) {
        console.error("Error al cargar el perfil:", error);

        setError("No se ha podido cargar la información del perfil");
      } finally {
        const elapsedTime = Date.now() - startTime;

        const remainingTime = Math.max(1000 - elapsedTime, 0);

        setTimeout(() => {
          setLoading(false);
        }, remainingTime);
      }
    };

    loadProfile();
  }, []);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setProfileFieldErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));

    setProfileError("");
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const imageError = validateProfileImage(file);

    if (imageError) {
      setProfileError(imageError);
      e.target.value = "";
      return;
    }

    try {
      setUploadingImage(true);
      setProfileError("");

      const imageUrl = await uploadImage(file);

      setProfileForm((prev) => ({
        ...prev,
        image: imageUrl,
      }));
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      setProfileError("No se ha podido subir la imagen");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProfile = async () => {
    const errors = validateProfile(profileForm);

    setProfileFieldErrors(errors);
    setProfileError("");
    setProfileSuccess("");

    // Si hay errores en el frontend, no llamamos al backend.
    if (Object.keys(errors).length > 0) {
      return;
    }

    if (!user) return;

    try {
      setSavingProfile(true);

      const updatedUser = await updateUser(user.id, {
        ...profileForm,
        name: profileForm.name.trim(),
        lastname: profileForm.lastname.trim(),
        phone: profileForm.phone.trim(),
        zipCode: profileForm.zipCode.trim(),
      });

      setUser(updatedUser);

      setProfileForm({
        name: updatedUser.profile.name || "",
        lastname: updatedUser.profile.lastname || "",
        phone: updatedUser.profile.phone || "",
        zipCode: updatedUser.profile.zip_code || "",
        image: updatedUser.profile.image || "",
      });

      setProfileFieldErrors({});
      setEditingProfile(false);
      setProfileSuccess("Perfil actualizado correctamente");
    } catch {
      setProfileError(
        "No se ha podido actualizar la información. Comprueba los datos e inténtalo de nuevo.",
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setAddressForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setAddressFieldErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));

    setAddressError("");
  };

  const handleNewAddress = () => {
    setAddressForm({
      name: "",
      street: "",
      city: "",
      state: "",
      country: "",
    });

    setEditingAddress(null);

    setAddressError("");

    setAddressSuccess("");

    setShowAddressForm(true);
  };

  const handleEditAddress = (address: Address) => {
    setAddressForm({
      name: address.name || "",
      street: address.street || "",
      city: address.city || "",
      state: address.state || "",
      country: address.country || "",
    });

    setEditingAddress(address.id);

    setAddressError("");

    setAddressSuccess("");

    setShowAddressForm(true);
  };

  const handleSaveAddress = async () => {
    const errors = validateAddress(addressForm);

    setAddressFieldErrors(errors);
    setAddressError("");
    setAddressSuccess("");

    if (Object.keys(errors).length > 0) {
      return;
    }
    if (!user) return;

    try {
      setSavingAddress(true);

      setAddressError("");

      setAddressSuccess("");

      if (editingAddress !== null) {
        await updateAddress(user.id, editingAddress, addressForm);

        setAddressSuccess("Dirección actualizada correctamente");
      } else {
        await createAddress(user.id, addressForm);

        setAddressSuccess("Dirección añadida correctamente");
      }

      const updatedAddresses = await getAddresses(user.id);

      setAddresses(updatedAddresses);

      setAddressForm({
        name: "",
        street: "",
        city: "",
        state: "",
        country: "",
      });

      setEditingAddress(null);

      setShowAddressForm(false);
    } catch (error) {
      console.error("Error al guardar la dirección:", error);

      setAddressError(
        editingAddress !== null
          ? "No se ha podido actualizar la dirección"
          : "No se ha podido añadir la dirección",
      );
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    if (!user) return;

    try {
      setAddressError("");
      setAddressSuccess("");

      await deleteAddress(user.id, addressId);

      const updatedAddresses = await getAddresses(user.id);

      setAddresses(updatedAddresses);

      setAddressSuccess("Dirección eliminada correctamente");
    } catch (error) {
      console.error("Error al eliminar la dirección:", error);

      setAddressError("No se ha podido eliminar la dirección");
    }
  };

  const handleCancelAddress = () => {
    setShowAddressForm(false);

    setEditingAddress(null);

    setAddressError("");

    setAddressForm({
      name: "",
      street: "",
      city: "",
      state: "",
      country: "",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    navigate("/login", { replace: true });
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleViewOrder = (status: string) => {
    if (status === "active") {
      navigate("/carts");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar valorInput={valorInput} setValorInput={setValorInput} />

        <main className="perfil-page">
          <div className="perfil-loading">
            <div className="perfil-spinner" />

            <p>Cargando perfil...</p>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  if (error || !user) {
    return (
      <>
        <Navbar valorInput={valorInput} setValorInput={setValorInput} />

        <main className="perfil-page">
          <div className="perfil-error">
            <div className="perfil-error-icon">!</div>

            <h2>No se ha podido cargar el perfil</h2>

            <p>{error || "No se ha encontrado la información del usuario."}</p>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar valorInput={valorInput} setValorInput={setValorInput} />

      {profileSuccess && (
        <div
          className="notification"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="notification__indicator" />

          <div className="notification__content">
            <span className="notification__label">Actualización</span>

            <p className="notification__message">{profileSuccess}</p>
          </div>

          <button
            type="button"
            className="notification__close"
            onClick={() => setProfileSuccess("")}
            aria-label="Cerrar notificación"
          >
            ×
          </button>
        </div>
      )}

      {addressSuccess && (
        <div
          className="notification"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="notification__indicator" />

          <div className="notification__content">
            <span className="notification__label">Direcciones</span>

            <p className="notification__message">{addressSuccess}</p>
          </div>

          <button
            type="button"
            className="notification__close"
            onClick={() => setAddressSuccess("")}
            aria-label="Cerrar notificación"
          >
            ×
          </button>
        </div>
      )}

      <main className="perfil-page">
        <div className="perfil-container">
          <button
            type="button"
            className="favoritos-back"
            onClick={() => navigate("/products")}
          >
            ← Volver a productos
          </button>

          <header className="perfil-header">
            <div>
              <span className="perfil-label">MI CUENTA</span>

              <h1>Mi perfil</h1>

              <p>
                Consulta y gestiona tu información personal, tus direcciones y
                tus pedidos.
              </p>
            </div>
          </header>

          <section className="perfil-section">
            <div className="perfil-section-header">
              <div>
                <span className="perfil-section-label">
                  INFORMACIÓN PERSONAL
                </span>

                <h2>Datos personales</h2>
              </div>

              <div className="perfil-section-actions">
                {!editingProfile && (
                  <button
                    type="button"
                    className="perfil-edit-button"
                    onClick={() => {
                      setProfileForm({
                        name: user.profile.name || "",
                        lastname: user.profile.lastname || "",
                        phone: user.profile.phone || "",
                        zipCode: user.profile.zip_code || "",
                        image: user.profile.image || "",
                      });

                      setProfileError("");
                      setEditingProfile(true);
                    }}
                  >
                    Editar información
                  </button>
                )}

                <button
                  type="button"
                  className="perfil-logout-button"
                  onClick={handleLogoutClick}
                >
                  Cerrar sesión
                </button>
              </div>
            </div>

            <div className="perfil-personal">
              <div className="perfil-avatar-container">
                <div className="perfil-avatar">
                  {profileForm.image ? (
                    <img
                      src={profileForm.image}
                      alt={`${user.profile.name} ${user.profile.lastname}`}
                    />
                  ) : (
                    <span>{user.profile.name?.charAt(0).toUpperCase()}</span>
                  )}
                </div>

                {editingProfile && (
                  <>
                    <label
                      htmlFor="profile-image"
                      className="perfil-image-button"
                    >
                      {uploadingImage ? "Subiendo..." : "Cambiar imagen"}
                    </label>

                    <input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={uploadingImage}
                      className="perfil-image-input"
                    />
                  </>
                )}
              </div>

              {!editingProfile ? (
                <div className="perfil-info-grid">
                  <div className="perfil-info-item">
                    <span>Nombre</span>

                    <strong>{user.profile.name || "No indicado"}</strong>
                  </div>

                  <div className="perfil-info-item">
                    <span>Apellidos</span>

                    <strong>{user.profile.lastname || "No indicado"}</strong>
                  </div>

                  <div className="perfil-info-item">
                    <span>Email</span>

                    <strong>{user.email}</strong>
                  </div>

                  <div className="perfil-info-item">
                    <span>Teléfono</span>

                    <strong>{user.profile.phone || "No indicado"}</strong>
                  </div>

                  <div className="perfil-info-item">
                    <span>Código postal</span>

                    <strong>{user.profile.zip_code || "No indicado"}</strong>
                  </div>
                </div>
              ) : (
                <form
                  noValidate
                  className="perfil-info-grid perfil-info-edit"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveProfile();
                  }}
                >
                  <div className="perfil-info-item">
                    <span>Nombre</span>

                    <input
                      type="text"
                      name="name"
                      value={profileForm.name}
                      onChange={handleProfileChange}
                    />
                    {profileFieldErrors.name && (
                      <p
                        id="profile-name-error"
                        className="perfil-field-error"
                        role="alert"
                      >
                        {profileFieldErrors.name}
                      </p>
                    )}
                  </div>

                  <div className="perfil-info-item">
                    <span>Apellidos</span>

                    <input
                      type="text"
                      name="lastname"
                      value={profileForm.lastname}
                      onChange={handleProfileChange}
                    />
                    {profileFieldErrors.lastname && (
                      <p
                        id="profile-lastname-error"
                        className="perfil-field-error"
                        role="alert"
                      >
                        {profileFieldErrors.lastname}
                      </p>
                    )}
                  </div>

                  <div className="perfil-info-item">
                    <span>Email</span>

                    <strong>{user.email}</strong>
                  </div>

                  <div className="perfil-info-item">
                    <span>Teléfono</span>

                    <input
                      type="text"
                      name="phone"
                      value={profileForm.phone}
                      onChange={handleProfileChange}
                    />
                    {profileFieldErrors.phone && (
                      <p
                        id="profile-phone-error"
                        className="perfil-field-error"
                        role="alert"
                      >
                        {profileFieldErrors.phone}
                      </p>
                    )}
                  </div>

                  <div className="perfil-info-item">
                    <span>Código postal</span>

                    <input
                      type="text"
                      name="zipCode"
                      value={profileForm.zipCode}
                      onChange={handleProfileChange}
                    />
                    {profileFieldErrors.zipCode && (
                      <p
                        id="profile-zipCode-error"
                        className="perfil-field-error"
                        role="alert"
                      >
                        {profileFieldErrors.zipCode}
                      </p>
                    )}
                  </div>

                  {profileError && (
                    <p className="perfil-form-error">{profileError}</p>
                  )}

                  <div className="perfil-edit-actions">
                    <button
                      type="button"
                      className="perfil-edit-cancel"
                      onClick={() => {
                        setEditingProfile(false);
                        setProfileError("");
                      }}
                      disabled={savingProfile || uploadingImage}
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      className="perfil-edit-save"
                      onClick={handleSaveProfile}
                      disabled={savingProfile || uploadingImage}
                    >
                      {savingProfile ? "Guardando..." : "Guardar cambios"}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* SEGURIDAD DE LA CUENTA */}
            <section className="perfil-section perfil-security-section">
              <div className="perfil-section-header">
                <div>
                  <span className="perfil-section-label">SEGURIDAD</span>

                  <h2>Contraseña</h2>
                </div>

                <button
                  type="button"
                  className="perfil-edit-button"
                  onClick={() => {}}
                >
                  Cambiar contraseña
                </button>
              </div>
            </section>
          </section>

          <section className="perfil-section">
            <div className="perfil-section-header">
              <div>
                <span className="perfil-section-label">DIRECCIONES</span>

                <h2>Mis direcciones</h2>
              </div>

              {!showAddressForm && (
                <button
                  type="button"
                  className="perfil-edit-button"
                  onClick={handleNewAddress}
                >
                  Añadir dirección
                </button>
              )}
            </div>

            {showAddressForm ? (
              <form
                noValidate
                className="perfil-address-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveAddress();
                }}
              >
                <div className="perfil-address-form-header">
                  <div>
                    <span className="perfil-section-label">
                      {editingAddress !== null ? "EDITAR" : "NUEVA"}
                    </span>

                    <h3>
                      {editingAddress !== null
                        ? "Editar dirección"
                        : "Añadir dirección"}
                    </h3>
                  </div>
                </div>

                <div className="perfil-address-form-grid">
                  <div className="perfil-info-item">
                    <span>Nombre</span>

                    <input
                      type="text"
                      name="name"
                      value={addressForm.name}
                      onChange={handleAddressChange}
                      placeholder="Ej. Casa"
                    />
                    {addressFieldErrors.name && (
                      <p
                        id="address-name-error"
                        className="perfil-field-error"
                        role="alert"
                      >
                        {addressFieldErrors.name}
                      </p>
                    )}
                  </div>

                  <div className="perfil-info-item">
                    <span>Dirección</span>

                    <input
                      type="text"
                      name="street"
                      value={addressForm.street}
                      onChange={handleAddressChange}
                      placeholder="Calle y número"
                    />
                    {addressFieldErrors.street && (
                      <p
                        id="address-street-error"
                        className="perfil-field-error"
                        role="alert"
                      >
                        {addressFieldErrors.street}
                      </p>
                    )}
                  </div>

                  <div className="perfil-info-item">
                    <span>Ciudad</span>

                    <input
                      type="text"
                      name="city"
                      value={addressForm.city}
                      onChange={handleAddressChange}
                      placeholder="Ciudad"
                    />
                    {addressFieldErrors.city && (
                      <p
                        id="address-city-error"
                        className="perfil-field-error"
                        role="alert"
                      >
                        {addressFieldErrors.city}
                      </p>
                    )}
                  </div>

                  <div className="perfil-info-item">
                    <span>Provincia / Estado</span>

                    <input
                      type="text"
                      name="state"
                      value={addressForm.state}
                      onChange={handleAddressChange}
                      placeholder="Provincia"
                    />
                    {addressFieldErrors.state && (
                      <p
                        id="address-state-error"
                        className="perfil-field-error"
                        role="alert"
                      >
                        {addressFieldErrors.state}
                      </p>
                    )}
                  </div>

                  <div className="perfil-info-item">
                    <span>País</span>

                    <input
                      type="text"
                      name="country"
                      value={addressForm.country}
                      onChange={handleAddressChange}
                      placeholder="País"
                    />
                    {addressFieldErrors.country && (
                      <p
                        id="address-country-error"
                        className="perfil-field-error"
                        role="alert"
                      >
                        {addressFieldErrors.country}
                      </p>
                    )}
                  </div>
                </div>

                {addressError && (
                  <p className="perfil-form-error">{addressError}</p>
                )}

                <div className="perfil-edit-actions">
                  <button
                    type="button"
                    className="perfil-edit-cancel"
                    onClick={handleCancelAddress}
                    disabled={savingAddress}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="perfil-edit-save"
                    onClick={handleSaveAddress}
                    disabled={savingAddress}
                  >
                    {savingAddress ? "Guardando..." : "Guardar dirección"}
                  </button>
                </div>
              </form>
            ) : (
              <>
                {addressError && (
                  <p className="perfil-form-error perfil-address-message">
                    {addressError}
                  </p>
                )}

                {addresses.length === 0 ? (
                  <div className="perfil-empty">
                    <div className="perfil-empty-icon">⌂</div>

                    <h3>No tienes direcciones</h3>

                    <p>Cuando añadas una dirección aparecerá aquí.</p>
                  </div>
                ) : (
                  <div className="perfil-addresses">
                    {addresses.map((address) => (
                      <article key={address.id} className="perfil-address">
                        <div className="perfil-address-icon">⌂</div>

                        <div className="perfil-address-content">
                          <span>{address.name || "DIRECCIÓN"}</span>

                          <strong>{address.street || "Dirección"}</strong>

                          <p>
                            {address.city || ""}
                            {address.state ? `, ${address.state}` : ""}
                          </p>

                          <p>{address.country || ""}</p>
                        </div>

                        <div className="perfil-address-actions">
                          <button
                            type="button"
                            className="perfil-address-edit"
                            onClick={() => handleEditAddress(address)}
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            className="perfil-address-delete"
                            onClick={() => handleDeleteAddress(address.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </>
            )}
          </section>

          <section className="perfil-section">
            <div className="perfil-section-header">
              <div>
                <span className="perfil-section-label">PEDIDOS</span>

                <h2>Mis pedidos</h2>
              </div>

              {user.orders.length > 0 && (
                <span className="perfil-orders-count">
                  {user.orders.length}{" "}
                  {user.orders.length === 1 ? "pedido" : "pedidos"}
                </span>
              )}
            </div>

            {user.orders.length === 0 ? (
              <div className="perfil-empty">
                <div className="perfil-empty-icon">▱</div>

                <h3>No tienes pedidos</h3>

                <p>Cuando realices tu primer pedido, aparecerá aquí.</p>

                <button
                  type="button"
                  className="perfil-empty-button"
                  onClick={() => navigate("/products")}
                >
                  Ver productos
                </button>
              </div>
            ) : (
              <div className="perfil-orders">
                {user.orders.map((order, index) => (
                  <article key={order.id} className="perfil-order">
                    <div className="perfil-order-info">
                      <span>PEDIDO</span>

                      <strong>{index + 1}</strong>
                    </div>

                    <div className="perfil-order-info">
                      <span>ESTADO</span>

                      <strong>{getOrderStatus(order.status)}</strong>
                    </div>

                    <div className="perfil-order-info">
                      <span>TOTAL</span>

                      <strong>
                        {new Intl.NumberFormat("es-ES", {
                          style: "currency",
                          currency: "EUR",
                        }).format(Number(order.total))}
                      </strong>
                    </div>

                    <button
                      type="button"
                      className="perfil-order-button"
                      onClick={() => handleViewOrder(order.status)}
                    >
                      Ver pedido
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      {showLogoutModal && (
        <div className="logout-modal-overlay">
          <div
            className="logout-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-modal-title"
          >
            <h2 id="logout-modal-title">¿Cerrar sesión?</h2>

            <p>¿Estás seguro de que quieres cerrar sesión?</p>

            <div className="logout-modal-buttons">
              <button
                type="button"
                className="logout-cancel-button"
                onClick={handleCancelLogout}
              >
                Seguir en mi cuenta
              </button>

              <button
                type="button"
                className="logout-confirm-button"
                onClick={handleLogout}
              >
                Sí, cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default Perfil;
