# 👕 Clothing Store API

API RESTful desarrollada con **NestJS** y **TypeScript** para la gestión integral de una tienda de ropa online.

El proyecto implementa una arquitectura modular y escalable, utilizando **TypeORM** como ORM y **PostgreSQL** como sistema de gestión de base de datos. La aplicación incorpora autenticación mediante **JWT**, autorización basada en roles, control de acceso sobre recursos propios, validación de datos y documentación interactiva mediante **Swagger**.

La API permite gestionar usuarios, perfiles, productos, variantes, imágenes, categorías, marcas, pedidos, líneas de pedido y valoraciones de productos.

---

## 📋 Índice

* [Características principales](#-características-principales)
* [Tecnologías utilizadas](#-tecnologías-utilizadas)
* [Arquitectura](#-arquitectura)
* [Modelo de datos](#-modelo-de-datos)
* [Autenticación](#-autenticación)
* [Autorización y roles](#-autorización-y-roles)
* [Control de ownership](#-control-de-ownership)
* [Usuarios](#-usuarios)
* [Perfiles](#-perfiles)
* [Productos](#-productos)
* [Categorías](#-categorías)
* [Marcas](#-marcas)
* [Pedidos](#-pedidos)
* [Líneas de pedido](#-líneas-de-pedido)
* [Reviews](#-reviews)
* [Validación de datos](#-validación-de-datos)
* [Swagger](#-swagger)
* [Base de datos](#-base-de-datos)
* [Docker](#-docker)
* [Instalación](#-instalación)
* [Variables de entorno](#-variables-de-entorno)
* [Ejecución](#-ejecución)
* [Scripts disponibles](#-scripts-disponibles)
* [Ejemplos](#-ejemplos)
* [Estructura del proyecto](#-estructura-del-proyecto)
* [Seguridad](#-seguridad)
* [Estado del proyecto](#-estado-del-proyecto)
* [Contribuciones](#-contribuciones)
* [Licencia](#-licencia)

---

# 🚀 Características principales

La API incluye las siguientes funcionalidades:

### 🔐 Autenticación y seguridad

* Registro de usuarios.
* Inicio de sesión.
* Autenticación mediante **JWT**.
* Tokens con fecha de expiración.
* Protección de endpoints mediante Guards.
* Autorización basada en roles.
* Roles `ADMIN` y `USER`.
* Control de acceso a recursos propios.
* Protección contra acceso de usuarios a información perteneciente a otros usuarios.
* Contraseñas almacenadas mediante hash.
* Exclusión de información sensible en las respuestas.
* Validación de datos recibidos.

### 👤 Gestión de usuarios

* Creación de usuarios.
* Consulta de usuarios.
* Consulta de usuario individual.
* Actualización de usuarios.
* Eliminación de usuarios.
* Gestión de perfiles.
* Gestión de direcciones.
* Gestión de favoritos.

### 👕 Gestión de productos

* Creación de productos.
* Consulta de productos.
* Consulta individual.
* Actualización de productos.
* Eliminación de productos.
* Categorías.
* Marcas.
* Variantes de producto.
* Imágenes.
* Stock.
* Precio.
* Descripción.
* Reviews de usuarios.

### 🛒 Gestión de pedidos

* Creación de pedidos.
* Consulta de pedidos.
* Consulta de pedidos propios.
* Actualización de pedidos.
* Eliminación de pedidos.
* Estados de pedido.
* Líneas de pedido.
* Cantidades.
* Precio unitario.
* Cálculo automático del total.
* Relación entre usuarios, pedidos y líneas de pedido.

### ⭐ Reviews

* Creación de reviews.
* Valoración mediante rating.
* Comentarios.
* Asociación de reviews con usuarios y productos.
* Control de ownership para que un usuario solo pueda gestionar sus propias reviews.

### 🗄️ Persistencia

* PostgreSQL.
* TypeORM.
* Entidades relacionadas.
* Relaciones `OneToOne`, `OneToMany` y `ManyToOne`.
* Persistencia mediante repositorios TypeORM.
* Soporte para migraciones.

### 📚 Documentación

* Swagger UI.
* Documentación de endpoints.
* Ejemplos de request y response.
* Descripción de códigos HTTP.
* Autenticación JWT desde Swagger.

---

# 🛠️ Tecnologías utilizadas

| Tecnología            | Uso                          |
| --------------------- | ---------------------------- |
| **NestJS**            | Framework backend            |
| **TypeScript**        | Lenguaje principal           |
| **TypeORM**           | ORM y acceso a base de datos |
| **PostgreSQL**        | Base de datos relacional     |
| **Docker**            | Contenedores                 |
| **Docker Compose**    | Orquestación de servicios    |
| **JWT**               | Autenticación                |
| **Passport**          | Estrategias de autenticación |
| **Class Validator**   | Validación de DTOs           |
| **Class Transformer** | Transformación de datos      |
| **Swagger / OpenAPI** | Documentación de la API      |
| **Jest**              | Testing                      |
| **ESLint**            | Análisis estático del código |

---

# 🏗️ Arquitectura

El proyecto utiliza una arquitectura modular basada en los módulos de NestJS.

Cada funcionalidad principal está separada en su propio módulo, facilitando el mantenimiento, escalabilidad y reutilización del código.

Los módulos principales son:

```text
src/
├── auth/
├── users/
├── profiles/
├── products/
├── categories/
├── brands/
├── orders/
├── database/
├── app.module.ts
└── main.ts
```

Cada módulo puede contener:

```text
module/
├── controllers/
├── services/
├── entities/
├── dtos/
├── guards/
└── ...
```

La comunicación entre las diferentes capas sigue una estructura similar a:

```text
HTTP Request
     │
     ▼
Controller
     │
     ▼
Guards / Authorization
     │
     ▼
DTO Validation
     │
     ▼
Service
     │
     ▼
Repository
     │
     ▼
PostgreSQL
```

---

# 🗄️ Modelo de datos

Las principales entidades del proyecto son:

```text
User
 │
 ├── Profile
 │
 ├── Address
 │
 ├── Favorites
 │
 └── Orders
       │
       └── OrderItems
              │
              └── ProductVariant
                       │
                       └── Product
                              │
                              ├── Category
                              ├── Brand
                              └── Reviews
```

### Principales relaciones

* Un usuario tiene un perfil.
* Un usuario puede tener múltiples pedidos.
* Un pedido pertenece a un usuario.
* Un pedido contiene múltiples líneas de pedido.
* Una línea de pedido pertenece a un pedido.
* Una línea de pedido referencia una variante de producto.
* Una variante pertenece a un producto.
* Un producto pertenece a una categoría.
* Un producto pertenece a una marca.
* Un producto puede tener múltiples imágenes.
* Un producto puede recibir múltiples reviews.

---

# 🔐 Autenticación

La API utiliza **JWT (JSON Web Token)** para autenticar a los usuarios.

El flujo de autenticación es:

```text
Usuario
   │
   │ email + password
   ▼
POST /auth/login
   │
   ▼
Validación de credenciales
   │
   ▼
JWT
   │
   ▼
Authorization: Bearer <token>
```

Los endpoints protegidos requieren enviar el token mediante la cabecera:

```http
Authorization: Bearer <token>
```

Ejemplo:

```http
GET /products

Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

El JWT contiene información necesaria para identificar al usuario, incluyendo su identificador y rol.

Ejemplo de payload:

```json
{
  "sub": 2,
  "role": "user",
  "iat": 1788858560,
  "exp": 1788862160
}
```

---

# 👮 Autorización y roles

La API utiliza autorización basada en roles mediante:

* `JwtAuthGuard`
* `RolesGuard`
* Decorador `@Roles()`

Actualmente existen dos roles:

```text
ADMIN
USER
```

Ejemplo:

```ts
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
```

Este endpoint solamente podrá ser utilizado por administradores.

Para permitir ambos roles:

```ts
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.USER)
```

---

# 🔒 Control de ownership

Además del control de roles, la API implementa **ownership** sobre los recursos pertenecientes a los usuarios.

Un usuario normal no puede acceder, modificar o eliminar recursos pertenecientes a otro usuario.

La identidad del usuario se obtiene directamente del JWT:

```ts
req.user.sub
```

Por ejemplo:

```ts
if (
  req.user.role !== UserRole.ADMIN &&
  req.user.sub !== order.user.id
) {
  throw new ForbiddenException(
    'No tienes permisos para acceder a este pedido',
  );
}
```

El administrador puede acceder a los recursos independientemente de su propietario.

---

## Ownership de Orders

La relación es:

```text
User
 └── Order
```

Por lo tanto, un usuario solamente puede acceder a sus propios pedidos.

```text
ADMIN → Todas las orders
USER  → Solo sus orders
```

---

## Ownership de OrderItems

Las líneas de pedido tienen una relación indirecta:

```text
User
 └── Order
      └── OrderItem
```

Para comprobar el propietario se utiliza:

```ts
orderItem.order.user.id
```

De esta manera, un usuario no puede modificar o eliminar líneas pertenecientes a pedidos de otro usuario.

---

## Ownership de Profiles

Los perfiles están asociados a un usuario.

El acceso se controla utilizando el identificador del usuario autenticado:

```ts
req.user.sub
```

---

# 👤 Usuarios

Los usuarios permiten gestionar la información de las cuentas de la aplicación.

Entre las operaciones disponibles se incluyen:

* Crear usuario.
* Obtener usuario.
* Actualizar usuario.
* Eliminar usuario.
* Gestionar direcciones.
* Gestionar favoritos.
* Consultar información relacionada.

Las operaciones administrativas están restringidas al rol `ADMIN`.

---

# 👨‍💼 Perfiles

Cada usuario dispone de información de perfil.

El perfil puede incluir:

* Nombre.
* Apellidos.
* Teléfono.
* Imagen.
* Código postal.
* Direcciones.
* Productos favoritos.

La información de perfil está protegida mediante ownership.

---

# 👕 Productos

Los productos representan los artículos disponibles en la tienda.

Cada producto puede incluir:

* Nombre.
* Descripción.
* Precio.
* Stock.
* Categoría.
* Marca.
* Variantes.
* Imágenes.
* Reviews.

Los productos son **recursos compartidos**, por lo que no tienen ownership por usuario.

### Permisos

```text
GET     → ADMIN + USER
POST    → ADMIN
PUT     → ADMIN
DELETE  → ADMIN
```

Los usuarios pueden consultar productos, mientras que las operaciones de administración están restringidas a administradores.

---

# 🎨 Variantes de producto

Los productos pueden disponer de diferentes variantes.

Una variante puede representar características como:

* Talla.
* Color.
* Stock.
* Producto asociado.

Las variantes se utilizan también en las líneas de pedido.

---

# 🖼️ Imágenes de productos

Los productos pueden tener imágenes asociadas.

La gestión de imágenes está integrada dentro de la gestión de productos y se encuentra protegida mediante roles.

---

# 🗂️ Categorías

Las categorías permiten clasificar los productos.

Ejemplos:

```text
Camisetas
Pantalones
Sudaderas
Chaquetas
Calzado
Accesorios
```

Los usuarios pueden consultar las categorías, mientras que la creación, modificación y eliminación está destinada a administradores.

---

# 🏷️ Marcas

Las marcas permiten asociar productos con diferentes fabricantes o marcas comerciales.

Ejemplos:

```text
Nike
Adidas
Puma
Levi's
Zara
```

La gestión administrativa de marcas está restringida al rol `ADMIN`.

---

# 🛒 Pedidos

Los pedidos están asociados directamente a un usuario.

```text
User
  │
  └── Orders
```

Cada pedido puede contener múltiples líneas:

```text
Order
 │
 ├── OrderItem
 ├── OrderItem
 └── OrderItem
```

Los pedidos disponen de:

* Identificador.
* Estado.
* Total.
* Usuario.
* Líneas de pedido.

Los usuarios solamente pueden consultar y gestionar sus propios pedidos.

Los administradores tienen acceso global.

---

# 📦 Estados de pedido

Los pedidos utilizan diferentes estados para controlar su ciclo de vida.

Por ejemplo:

```text
ACTIVE
```

El estado permite controlar determinadas operaciones sobre el pedido.

Por ejemplo, un pedido que ya ha sido procesado no debería poder eliminarse.

---

# 🧾 Líneas de pedido

Las líneas de pedido representan los productos incluidos dentro de una order.

Cada línea contiene:

* Cantidad.
* Precio unitario.
* Pedido asociado.
* Variante de producto.

Ejemplo:

```json
{
  "quantity": 2,
  "unitPrice": 19.99,
  "orderId": 5,
  "productvariantId": 12
}
```

El total de la order se recalcula automáticamente cuando se crean, modifican o eliminan líneas de pedido.

La fórmula utilizada es:

```text
Total = Σ (quantity × unitPrice)
```

---

# ⭐ Reviews

Los productos pueden recibir valoraciones de los usuarios.

Una review incluye:

* Usuario.
* Producto.
* Rating.
* Comentario.

Ejemplo:

```json
{
  "rating": 5,
  "comment": "Producto de muy buena calidad."
}
```

Las reviews están protegidas mediante ownership para evitar que un usuario pueda modificar o eliminar reviews pertenecientes a otros usuarios.

---

# ✅ Validación de datos

La API utiliza:

* `class-validator`
* `class-transformer`
* DTOs

Los datos recibidos por los endpoints son validados antes de llegar a la lógica de negocio.

Esto permite controlar:

* Tipos de datos.
* Campos obligatorios.
* Longitud de strings.
* Valores numéricos.
* Formatos.
* Datos inválidos.

Ejemplo:

```ts
export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsPositive()
  price: number;
}
```

---

# 📚 Swagger / OpenAPI

La API dispone de documentación interactiva mediante Swagger.

Una vez iniciada la aplicación:

```text
http://localhost:3000/api
```

Desde Swagger es posible:

* Consultar todos los endpoints.
* Ver parámetros.
* Consultar DTOs.
* Ver ejemplos de requests.
* Ver respuestas.
* Probar endpoints.
* Autenticarse mediante JWT.
* Consultar los códigos HTTP utilizados.

---

# 🗃️ Base de datos

El proyecto utiliza **PostgreSQL** como base de datos.

El acceso se realiza mediante **TypeORM**.

Las entidades se encuentran definidas mediante decoradores de TypeORM:

```ts
@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;
}
```

Las relaciones entre entidades utilizan:

* `@OneToOne`
* `@OneToMany`
* `@ManyToOne`

---

# 🐳 Docker

PostgreSQL puede ejecutarse mediante Docker Compose.

Para iniciar los servicios:

```bash
docker compose up -d
```

Comprobar los contenedores:

```bash
docker ps
```

Detener los servicios:

```bash
docker compose down
```

Esto permite disponer de un entorno de desarrollo reproducible sin necesidad de instalar PostgreSQL directamente en el sistema.

---

# 📦 Requisitos previos

Antes de instalar el proyecto necesitas:

* Node.js 18 o superior.
* npm o pnpm.
* Docker.
* Docker Compose.
* Git.

---

# 💻 Instalación

Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/clothing-store-api.git
```

Accede al proyecto:

```bash
cd clothing-store-api
```

Instala las dependencias:

```bash
npm install
```

---

# 🔑 Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=clothing_store

JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=1d
```

> ⚠️ **Importante:** no subas el archivo `.env` al repositorio ni compartas claves secretas.

Es recomendable incluir `.env` dentro de `.gitignore`.

---

# 🐘 Configuración de PostgreSQL

Inicia PostgreSQL mediante Docker:

```bash
docker compose up -d
```

Comprueba que está funcionando:

```bash
docker ps
```

Si el proyecto utiliza migraciones de TypeORM:

```bash
npm run migration:run
```

Los comandos de migración pueden variar dependiendo de la configuración del proyecto.

---

# ▶️ Ejecución

### Desarrollo

```bash
npm run start:dev
```

### Desarrollo con debug

```bash
npm run start:debug
```

### Producción

Primero compila:

```bash
npm run build
```

Después:

```bash
npm run start:prod
```

La API estará disponible en:

```text
http://localhost:3000
```

La documentación estará disponible en:

```text
http://localhost:3000/api
```

---

# 📜 Scripts disponibles

| Comando                 | Descripción                             |
| ----------------------- | --------------------------------------- |
| `npm run start`         | Inicia la aplicación                    |
| `npm run start:dev`     | Inicia la aplicación en modo desarrollo |
| `npm run start:debug`   | Inicia la aplicación con debug          |
| `npm run start:prod`    | Inicia la aplicación en producción      |
| `npm run build`         | Compila el proyecto                     |
| `npm run lint`          | Analiza el código                       |
| `npm run test`          | Ejecuta los tests                       |
| `npm run test:e2e`      | Ejecuta tests end-to-end                |
| `docker compose up -d`  | Inicia PostgreSQL                       |
| `docker compose down`   | Detiene los contenedores                |
| `npm run migration:run` | Ejecuta migraciones                     |

---

# 🔎 Ejemplos

## Registro

```http
POST /users
Content-Type: application/json
```

Ejemplo:

```json
{
  "email": "usuario@example.com",
  "password": "Password123!"
}
```

---

## Login

```http
POST /auth/login
Content-Type: application/json
```

Ejemplo:

```json
{
  "email": "usuario@example.com",
  "password": "Password123!"
}
```

Respuesta:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

## Autenticación

Una vez obtenido el token:

```http
Authorization: Bearer <token>
```

Ejemplo:

```http
GET /products
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

## Obtener productos

```http
GET /products
Authorization: Bearer <token>
```

Los usuarios autenticados pueden consultar los productos.

---

## Obtener las orders del usuario

```http
GET /orders
Authorization: Bearer <token>
```

Un usuario normal recibe únicamente sus propios pedidos.

Un administrador puede consultar todos los pedidos.

---

## Obtener líneas de pedido

```http
GET /order-item
Authorization: Bearer <token>
```

Un usuario normal solamente obtiene las líneas correspondientes a sus propios pedidos.

---

# 🛡️ Seguridad

La API implementa diferentes mecanismos de seguridad:

### Autenticación

Los endpoints protegidos requieren un JWT válido.

### Autorización

Los Guards determinan si el usuario dispone del rol necesario.

### Ownership

Los usuarios normales solamente pueden acceder a sus propios recursos.

### Contraseñas

Las contraseñas no se almacenan directamente en texto plano, sino mediante hash.

### Información sensible

Los campos sensibles de las entidades pueden excluirse de las respuestas utilizando `class-transformer`.

### Validación

Los DTOs validan los datos enviados por el cliente antes de procesarlos.

### Separación de responsabilidades

La lógica está dividida entre:

```text
Controller
Service
Repository
Entity
DTO
Guard
```

Esto facilita el mantenimiento y reduce el acoplamiento entre componentes.

---

# 🧪 Testing

El proyecto incluye configuración para ejecutar pruebas mediante Jest.

Tests unitarios:

```bash
npm run test
```

Tests end-to-end:

```bash
npm run test:e2e
```

---

# 📁 Estructura del proyecto

```text
src/
│
├── auth/
│   ├── controllers/
│   ├── decorators/
│   ├── guards/
│   ├── strategies/
│   └── ...
│
├── users/
│   ├── controllers/
│   ├── services/
│   ├── entities/
│   ├── dtos/
│   └── ...
│
├── profiles/
│   ├── controllers/
│   ├── services/
│   ├── entities/
│   └── dtos/
│
├── products/
│   ├── controllers/
│   ├── services/
│   ├── entities/
│   └── dtos/
│
├── categories/
│   ├── controllers/
│   ├── services/
│   └── entities/
│
├── brands/
│   ├── controllers/
│   ├── services/
│   └── entities/
│
├── orders/
│   ├── controllers/
│   ├── services/
│   ├── entities/
│   └── dtos/
│
├── database/
│
├── app.module.ts
└── main.ts
```

---

# 🔄 Flujo general de una petición protegida

```text
Cliente
   │
   ▼
HTTP Request
   │
   ▼
JwtAuthGuard
   │
   ├── Token inválido → 401 Unauthorized
   │
   ▼
request.user
   │
   ▼
RolesGuard
   │
   ├── Rol no permitido → 403 Forbidden
   │
   ▼
Controller
   │
   ▼
Ownership Check
   │
   ├── Recurso de otro usuario → 403 Forbidden
   │
   ▼
Service
   │
   ▼
TypeORM Repository
   │
   ▼
PostgreSQL
```

---

# 📊 Códigos HTTP utilizados

La API utiliza códigos HTTP estándar para representar el resultado de las operaciones.

| Código | Significado                                |
| ------ | ------------------------------------------ |
| `200`  | Operación realizada correctamente          |
| `201`  | Recurso creado correctamente               |
| `400`  | Datos enviados incorrectamente             |
| `401`  | Usuario no autenticado                     |
| `403`  | Usuario sin permisos                       |
| `404`  | Recurso no encontrado                      |
| `409`  | Conflicto con el estado actual del recurso |
| `500`  | Error interno del servidor                 |

---

# 🚧 Estado del proyecto

El proyecto se encuentra actualmente en desarrollo.

### Implementado

* [x] Arquitectura modular con NestJS
* [x] PostgreSQL
* [x] TypeORM
* [x] Docker
* [x] JWT
* [x] Login
* [x] Registro
* [x] Roles `ADMIN` / `USER`
* [x] `JwtAuthGuard`
* [x] `RolesGuard`
* [x] Ownership de usuarios
* [x] Ownership de perfiles
* [x] Ownership de pedidos
* [x] Ownership de líneas de pedido
* [x] Gestión de productos
* [x] Variantes
* [x] Imágenes
* [x] Categorías
* [x] Marcas
* [x] Pedidos
* [x] Líneas de pedido
* [x] Reviews
* [x] Direcciones
* [x] Favoritos
* [x] Validación mediante DTOs
* [x] Swagger
* [x] Documentación de API

### Próximamente

* [ ] Recuperación de contraseña
* [ ] Envío de emails
* [ ] Mejoras en testing
* [ ] Mejoras de despliegue
* [ ] Configuración específica para producción

---

# 🤝 Contribuciones

Las contribuciones son bienvenidas.

1. Haz un fork del repositorio.

2. Crea una rama:

```bash
git checkout -b feature/nueva-funcionalidad
```

3. Realiza tus cambios.

4. Crea un commit:

```bash
git commit -m "feat: añade nueva funcionalidad"
```

5. Sube la rama:

```bash
git push origin feature/nueva-funcionalidad
```

6. Abre un Pull Request.

---

# 📄 Licencia

Este proyecto se distribuye bajo la licencia **MIT**.

---

# 👨‍💻 Autor

Proyecto desarrollado como API backend para una plataforma de comercio electrónico especializada en productos de moda.

**Clothing Store API**
Backend desarrollado con **NestJS + TypeScript + PostgreSQL + TypeORM**.
