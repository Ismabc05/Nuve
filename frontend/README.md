# Nuvé — Frontend

Aplicación web de la tienda Nuvé, desarrollada con React, TypeScript y Vite. Incluye la experiencia de compra y un panel de administración.

## Requisitos

- Node.js 20.19 o posterior (o 22.12 o posterior).
- npm.

## Instalación y desarrollo

Desde esta carpeta (`frontend`), instala las dependencias e inicia el servidor local:

```bash
npm ci
npm run dev
```

Vite mostrará en la terminal la dirección local para abrir la aplicación. El servidor de desarrollo utiliza recarga en caliente.

## Comandos disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo. |
| `npm run build` | Comprueba los tipos de TypeScript y genera la versión de producción en `dist/`. |
| `npm run preview` | Sirve localmente la última compilación de producción. |
| `npm run lint` | Analiza el código con ESLint. |

## Funcionalidades

- Registro, inicio de sesión y recuperación y restablecimiento de contraseña.
- Catálogo de productos, filtros y detalle de producto.
- Carrito, favoritos y perfil de usuario.
- Consulta de pedidos y confirmación de compra.
- Panel de administración para gestionar productos, pedidos, clientes, catálogo e inventario.
- Protección de rutas según la sesión y el rol del usuario.

## Rutas principales

| Ruta | Acceso | Página |
| --- | --- | --- |
| `/login`, `/register` | Público | Inicio de sesión y registro |
| `/forgot-password`, `/reset-password` | Público | Recuperación de contraseña |
| `/products`, `/products/:id` | Con sesión | Tienda y detalle de producto |
| `/carts`, `/favorites`, `/perfil` | Con sesión | Carrito, favoritos y perfil |
| `/orders/:id`, `/orders/success` | Con sesión | Pedido y confirmación |
| `/admin` | Solo administradores | Panel de gestión |

## Estructura del proyecto

```text
src/
├── componentes/       # Componentes compartidos de la tienda
├── context/           # Estado compartido del carrito y favoritos
├── estilos/           # Hojas de estilo organizadas por área
├── paginas/           # Páginas agrupadas por funcionalidad
│   ├── Admin/         # Panel y componentes de administración
│   ├── Auth/          # Autenticación
│   ├── Orders/        # Pedidos
│   ├── Product/       # Tienda y productos
│   ├── Root/          # Redirecciones y protección de rutas
│   └── User/          # Carrito, favoritos y perfil
├── services/          # Comunicación con la API y servicios externos
└── types/             # Tipos de TypeScript
```

Los recursos estáticos, como el logotipo y las imágenes, se encuentran en `public/`.

## API y servicios externos

Los servicios del frontend se conectan actualmente a la API desplegada en `https://nuve-miru.onrender.com`. La subida de imágenes de perfil utiliza Cloudinary. Las direcciones y la configuración correspondiente están definidas en los servicios de `src/services/`; actualmente no se requiere un archivo `.env` para iniciar el frontend.

Para desarrollo local con otra API, actualiza la URL base en los servicios antes de ejecutar la aplicación.
