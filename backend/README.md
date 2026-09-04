# Clothing Store API

API RESTful desarrollada con **NestJS** para la gestión integral de una tienda de ropa. Permite administrar productos, usuarios, pedidos, categorías y marcas, incluyendo un sistema de autenticación y autorización.

## Tecnologías utilizadas

- NestJS
- TypeScript
- TypeORM
- PostgreSQL
- Docker
- Swagger
- JWT
- Class Validator
- Class Transformer

## Funcionalidades

- Registro e inicio de sesión de usuarios.
- Autenticación mediante tokens JWT.
- Control de acceso basado en roles.
- Gestión de productos.
- Gestión de categorías.
- Gestión de marcas.
- Creación y administración de pedidos.
- Validación de datos de entrada.
- Persistencia de datos mediante TypeORM.
- Base de datos PostgreSQL ejecutada mediante Docker.
- Documentación interactiva con Swagger.
- Arquitectura modular y escalable.

## Requisitos previos

- Node.js 18 o superior.
- npm o pnpm.
- Docker y Docker Compose.
- Git.

## Instalación

Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/clothing-store-api.git
cd clothing-store-api
```

Instala las dependencias:

```bash
npm install
```

## Variables de entorno

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

> No compartas el archivo `.env` ni incluyas claves secretas directamente en el repositorio.

## Base de datos con Docker

Inicia el contenedor de PostgreSQL:

```bash
docker compose up -d
```

Comprueba que el contenedor está ejecutándose:

```bash
docker ps
```

Para detener los contenedores:

```bash
docker compose down
```

Si el proyecto utiliza migraciones de TypeORM, ejecútalas con:

```bash
npm run migration:run
```

Los comandos disponibles pueden variar según la configuración del proyecto.

## Ejecución del proyecto

Modo desarrollo:

```bash
npm run start:dev
```

Modo producción:

```bash
npm run build
npm run start:prod
```

La aplicación estará disponible en:

```text
http://localhost:3000
```

## Documentación de la API

La documentación de Swagger está disponible en:

```text
http://localhost:3000/api
```

Desde Swagger UI puedes consultar y probar los diferentes endpoints de la API.

## Estructura del proyecto

```text
src/
├── auth/
├── users/
├── products/
├── categories/
├── brands/
├── orders/
├── database/
├── app.module.ts
└── main.ts
```

La estructura puede variar según la organización actual del proyecto.

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run start` | Inicia la aplicación |
| `npm run start:dev` | Inicia la aplicación en modo desarrollo |
| `npm run start:debug` | Inicia la aplicación en modo depuración |
| `npm run start:prod` | Inicia la aplicación en modo producción |
| `npm run build` | Compila el proyecto |
| `npm run lint` | Analiza el código fuente |
| `npm run test` | Ejecuta los tests |
| `npm run test:e2e` | Ejecuta los tests end-to-end |
| `docker compose up -d` | Inicia PostgreSQL mediante Docker |
| `docker compose down` | Detiene los contenedores |

## Autenticación

Los endpoints protegidos requieren un token JWT en la cabecera `Authorization`:

```http
Authorization: Bearer <token>
```

Ejemplo:

```http
GET /products
Authorization: Bearer <token>
```

## Ejemplo de respuesta

```json
{
  "id": 1,
  "name": "Camiseta básica",
  "description": "Camiseta de algodón de corte regular",
  "price": 19.99,
  "stock": 50,
  "categoryId": 1,
  "brandId": 1
}
```

## Estado del proyecto

El proyecto se encuentra actualmente en desarrollo.

## Contribuciones

Las contribuciones son bienvenidas.

1. Haz un fork del repositorio.
2. Crea una rama para tu funcionalidad:

```bash
git checkout -b feature/nueva-funcionalidad
```

3. Realiza tus cambios y crea un commit:

```bash
git commit -m "feat: añade nueva funcionalidad"
```

4. Sube la rama al repositorio:

```bash
git push origin feature/nueva-funcionalidad
```

5. Abre un Pull Request.

## Licencia

Este proyecto se distribuye bajo la licencia MIT.
