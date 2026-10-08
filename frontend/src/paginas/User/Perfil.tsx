import { useEffect, useState } from "react";
import Navbar from "../../componentes/Navbar";
import Footer from "../../componentes/Footer";
import {
  getUser,
  getAddresses,
  updateUser,
} from "../../services/user.service";
import { uploadImage } from "../../services/auth.service";
import "../../estilos/users/perfil.css";
import { useNavigate } from "react-router-dom";
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

  const navigate = useNavigate();

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

        setError(
          "No se ha podido cargar la información del perfil"
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

    loadProfile();
  }, []);

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUploadingImage(true);

      setProfileError("");

      const imageUrl = await uploadImage(file);

      setProfileForm((prev) => ({
        ...prev,
        image: imageUrl,
      }));
    } catch (error) {
      console.error(
        "Error al subir la imagen:",
        error
      );

      setProfileError(
        "No se ha podido subir la imagen"
      );
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      setSavingProfile(true);

      setProfileError("");

      setProfileSuccess("");

      const updatedUser = await updateUser(
        user.id,
        profileForm
      );

      setUser(updatedUser);

      setProfileForm({
        name: updatedUser.profile.name || "",
        lastname: updatedUser.profile.lastname || "",
        phone: updatedUser.profile.phone || "",
        zipCode: updatedUser.profile.zip_code || "",
        image: updatedUser.profile.image || "",
      });

      setEditingProfile(false);

      setProfileSuccess(
        "Perfil actualizado correctamente"
      );
    } catch (error) {
      console.error(
        "Error al actualizar el perfil:",
        error
      );

      setProfileError(
        "No se ha podido actualizar la información"
      );
    } finally {
      setSavingProfile(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar
          valorInput={valorInput}
          setValorInput={setValorInput}
        />

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
        <Navbar
          valorInput={valorInput}
          setValorInput={setValorInput}
        />

        <main className="perfil-page">
          <div className="perfil-error">
            <div className="perfil-error-icon">
              !
            </div>

            <h2>
              No se ha podido cargar el perfil
            </h2>

            <p>
              {error ||
                "No se ha encontrado la información del usuario."}
            </p>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar
        valorInput={valorInput}
        setValorInput={setValorInput}
      />

      {profileSuccess && (
        <div
          className="notification"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="notification__indicator" />

          <div className="notification__content">
            <span className="notification__label">
              Actualización
            </span>

            <p className="notification__message">
              {profileSuccess}
            </p>
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

      <main className="perfil-page">
        <div className="perfil-container">
          <button
            className="favoritos-back"
            onClick={() => navigate("/products")}
          >
            ← Volver a productos
          </button>

          <header className="perfil-header">
            <div>
              <span className="perfil-label">
                MI CUENTA
              </span>

              <h1>Mi perfil</h1>

              <p>
                Consulta y gestiona tu información
                personal, tus direcciones y tus pedidos.
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

              {!editingProfile && (
                <button
                  type="button"
                  className="perfil-edit-button"
                  onClick={() => {
                    setProfileForm({
                      name:
                        user.profile.name || "",

                      lastname:
                        user.profile.lastname || "",

                      phone:
                        user.profile.phone || "",

                      zipCode:
                        user.profile.zip_code || "",

                      image:
                        user.profile.image || "",
                    });

                    setProfileError("");

                    setEditingProfile(true);
                  }}
                >
                  Editar información
                </button>
              )}

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
                    <span>
                      {user.profile.name
                        ?.charAt(0)
                        .toUpperCase()}
                    </span>
                  )}

                </div>

                {editingProfile && (
                  <>
                    <label
                      htmlFor="profile-image"
                      className="perfil-image-button"
                    >
                      {uploadingImage
                        ? "Subiendo..."
                        : "Cambiar imagen"}
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

                    <strong>
                      {user.profile.name ||
                        "No indicado"}
                    </strong>
                  </div>

                  <div className="perfil-info-item">
                    <span>Apellidos</span>

                    <strong>
                      {user.profile.lastname ||
                        "No indicado"}
                    </strong>
                  </div>

                  <div className="perfil-info-item">
                    <span>Email</span>

                    <strong>
                      {user.email}
                    </strong>
                  </div>

                  <div className="perfil-info-item">
                    <span>Teléfono</span>

                    <strong>
                      {user.profile.phone ||
                        "No indicado"}
                    </strong>
                  </div>

                  <div className="perfil-info-item">
                    <span>Código postal</span>

                    <strong>
                      {user.profile.zip_code ||
                        "No indicado"}
                    </strong>
                  </div>

                </div>

              ) : (

                <div className="perfil-info-grid perfil-info-edit">

                  <div className="perfil-info-item">

                    <span>Nombre</span>

                    <input
                      type="text"
                      name="name"
                      value={profileForm.name}
                      onChange={handleProfileChange}
                    />

                  </div>

                  <div className="perfil-info-item">

                    <span>Apellidos</span>

                    <input
                      type="text"
                      name="lastname"
                      value={profileForm.lastname}
                      onChange={handleProfileChange}
                    />

                  </div>

                  <div className="perfil-info-item">

                    <span>Email</span>

                    <strong>
                      {user.email}
                    </strong>

                  </div>

                  <div className="perfil-info-item">

                    <span>Teléfono</span>

                    <input
                      type="text"
                      name="phone"
                      value={profileForm.phone}
                      onChange={handleProfileChange}
                    />

                  </div>

                  <div className="perfil-info-item">

                    <span>Código postal</span>

                    <input
                      type="text"
                      name="zipCode"
                      value={profileForm.zipCode}
                      onChange={handleProfileChange}
                    />

                  </div>

                  {profileError && (
                    <p className="perfil-form-error">
                      {profileError}
                    </p>
                  )}

                  <div className="perfil-edit-actions">

                    <button
                      type="button"
                      className="perfil-edit-cancel"
                      onClick={() => {
                        setEditingProfile(false);
                        setProfileError("");
                      }}
                      disabled={
                        savingProfile ||
                        uploadingImage
                      }
                    >
                      Cancelar
                    </button>

                    <button
                      type="button"
                      className="perfil-edit-save"
                      onClick={handleSaveProfile}
                      disabled={
                        savingProfile ||
                        uploadingImage
                      }
                    >
                      {savingProfile
                        ? "Guardando..."
                        : "Guardar cambios"}
                    </button>

                  </div>

                </div>

              )}

            </div>

          </section>

          <section className="perfil-section">

            <div className="perfil-section-header">

              <div>

                <span className="perfil-section-label">
                  DIRECCIONES
                </span>

                <h2>Mis direcciones</h2>

              </div>

              <button
                type="button"
                className="perfil-edit-button"
              >
                Añadir dirección
              </button>

            </div>

            {addresses.length === 0 ? (

              <div className="perfil-empty">

                <div className="perfil-empty-icon">
                  ⌂
                </div>

                <h3>
                  No tienes direcciones
                </h3>

                <p>
                  Cuando añadas una dirección
                  aparecerá aquí.
                </p>

              </div>

            ) : (

              <div className="perfil-addresses">

                {addresses.map((address) => (

                  <article
                    key={address.id}
                    className="perfil-address"
                  >

                    <div className="perfil-address-icon">
                      ⌂
                    </div>

                    <div className="perfil-address-content">

                      <span>
                        DIRECCIÓN
                      </span>

                      <strong>
                        {address.street ||
                          "Dirección"}
                      </strong>

                      <p>
                        {address.postalCode}{" "}
                        {address.city}
                      </p>

                      <p>
                        {address.country}
                      </p>

                    </div>

                    <button
                      type="button"
                      className="perfil-address-edit"
                    >
                      Editar
                    </button>

                  </article>

                ))}

              </div>

            )}

          </section>

          <section className="perfil-section">

            <div className="perfil-section-header">

              <div>

                <span className="perfil-section-label">
                  PEDIDOS
                </span>

                <h2>Mis pedidos</h2>

              </div>

              {user.orders.length > 0 && (
                <span className="perfil-orders-count">

                  {user.orders.length}{" "}

                  {user.orders.length === 1
                    ? "pedido"
                    : "pedidos"}

                </span>
              )}

            </div>

            {user.orders.length === 0 ? (

              <div className="perfil-empty">

                <div className="perfil-empty-icon">
                  ▱
                </div>

                <h3>
                  No tienes pedidos
                </h3>

                <p>
                  Cuando realices tu primer pedido,
                  aparecerá aquí.
                </p>

                <button
                  type="button"
                  className="perfil-empty-button"
                  onClick={() =>
                    navigate("/products")
                  }
                >
                  Ver productos
                </button>

              </div>

            ) : (

              <div className="perfil-orders">

                {user.orders.map(
                  (order, index) => (

                    <article
                      key={order.id}
                      className="perfil-order"
                    >

                      <div className="perfil-order-info">

                        <span>
                          PEDIDO
                        </span>

                        <strong>
                          {index + 1}
                        </strong>

                      </div>

                      <div className="perfil-order-info">

                        <span>
                          ESTADO
                        </span>

                        <strong>
                          {getOrderStatus(
                            order.status
                          )}
                        </strong>

                      </div>

                      <div className="perfil-order-info">

                        <span>
                          TOTAL
                        </span>

                        <strong>
                          {new Intl.NumberFormat(
                            "es-ES",
                            {
                              style: "currency",
                              currency: "EUR",
                            }
                          ).format(
                            Number(order.total)
                          )}
                        </strong>

                      </div>

                      <button
                        type="button"
                        className="perfil-order-button"
                      >
                        Ver pedido
                      </button>

                    </article>

                  )
                )}

              </div>

            )}

          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}

export default Perfil;