# Prompt para Crear Administrador de Isaju en Next.js

## 📋 Contexto del Proyecto

Necesito crear un panel de administración en **Next.js** para gestionar el contenido del catálogo de peluches **Isaju**. El sitio principal está construido con **Astro 5.9.3** y actualmente tiene los datos hardcodeados. El administrador debe permitir gestionar productos de forma dinámica.

### Información del Negocio

- **Nombre**: Isaju
- **Tipo**: Fábrica de peluches artesanales
- **WhatsApp de contacto**: +57 321 852 4293
- **Estilo**: Artesanal, acogedor, moderno
- **Color principal**: #f6d15c (amarillo)
- **Color secundario**: #954C7E (morado/rosa)
- **Fuente personalizada**: "DK Magical Brush" (para títulos)

---

## 🎯 Objetivo del Administrador

Crear un sistema completo de administración que permita:

1. **Gestionar productos** (crear, editar, eliminar, listar)
2. **Subir múltiples imágenes** por producto
3. **Gestionar información** de productos (nombre, precio, descripción)
4. **Autenticación** segura para acceder al panel
5. **API REST** para que el sitio Astro consuma los datos
6. **Almacenamiento** de imágenes y datos

---

## 📊 Estructura de Datos

### Modelo de Producto

```typescript
interface Product {
  id: string; // UUID o ID único
  name: string; // Ej: "Peluche Cafe"
  price: string; // Ej: "$60.000" o "$60"
  description: string; // Descripción detallada del producto
  images: string[]; // Array de URLs/rutas de imágenes
  createdAt: Date; // Fecha de creación
  updatedAt: Date; // Fecha de última actualización
  published: boolean; // Si está publicado o en borrador (opcional)
  order?: number; // Orden de visualización (opcional)
}
```

### Ejemplo de Producto Actual

```typescript
{
  id: "1",
  name: "Peluche Cafe",
  price: "$60.000",
  description: "Este adorable peluche café está hecho con amor y cuidado artesanal. Perfecto para regalar o para tener como compañero. Cada pieza es única y está diseñada para brindar calidez y ternura.",
  images: [
    "/peluche-blanco.jpg",
    "/peluche.jpg",
    "/perro.jpg"
  ]
}
```

---

## 🛠️ Stack Tecnológico Recomendado

### Framework y Core

- **Next.js 14+** (App Router recomendado)
- **TypeScript** (configuración estricta)
- **React 18+**

### Base de Datos y Almacenamiento

- **Opción 1**: **Prisma + PostgreSQL** (recomendado para producción)
- **Opción 2**: **MongoDB + Mongoose** (más simple, buena para MVP)
- **Opción 3**: **Supabase** (PostgreSQL + Storage + Auth integrado)
- **Almacenamiento de imágenes**:
  - Cloudinary, AWS S3, o Supabase Storage
  - O almacenamiento local en `/public/uploads` (solo para desarrollo)

### Autenticación

- **NextAuth.js** (NextAuth v5) o **Clerk** o **Supabase Auth**
- Sistema de login con email/password o OAuth

### UI y Estilos

- **Tailwind CSS** (recomendado para rapidez)
- O **CSS Modules** (para mantener consistencia con el sitio Astro)
- **shadcn/ui** o **Radix UI** para componentes accesibles
- **React Hook Form** para formularios
- **Zod** para validación de esquemas

### Upload de Imágenes

- **react-dropzone** o **uploadthing** para drag & drop
- **next/image** para optimización de imágenes

### API

- **Next.js API Routes** o **Route Handlers** (App Router)
- Formato JSON para respuestas

---

## 🎨 Diseño y UX

### Estilo Visual

- Mantener la identidad visual de Isaju:
  - Color de fondo del header: `#f6d15c`
  - Colores de acento: `#954C7E`
  - Fuente para títulos: "DK Magical Brush" (si está disponible) o similar artesanal
- Diseño limpio, moderno y fácil de usar
- Responsive (mobile-first)

### Páginas Requeridas

#### 1. **Login** (`/login`)

- Formulario de email y contraseña
- Validación de campos
- Mensajes de error claros
- Redirección después del login

#### 2. **Dashboard** (`/dashboard` o `/`)

- Vista general con estadísticas:
  - Total de productos
  - Productos publicados
  - Últimos productos agregados
- Accesos rápidos a acciones comunes

#### 3. **Lista de Productos** (`/products`)

- Tabla o grid con todos los productos
- Columnas: Imagen (thumbnail), Nombre, Precio, Fecha, Acciones
- Botones: Ver, Editar, Eliminar
- Búsqueda y filtros (opcional)
- Paginación si hay muchos productos

#### 4. **Crear Producto** (`/products/new`)

- Formulario con campos:
  - **Nombre** (texto, requerido)
  - **Precio** (texto, requerido) - Ej: "$60.000"
  - **Descripción** (textarea, requerido)
  - **Imágenes** (upload múltiple, mínimo 1, máximo 10)
    - Drag & drop o botón de selección
    - Preview de imágenes antes de subir
    - Posibilidad de reordenar imágenes (arrastrar y soltar)
    - Eliminar imágenes antes de guardar
- Botones: Guardar, Cancelar
- Validación en tiempo real
- Mensajes de éxito/error

#### 5. **Editar Producto** (`/products/[id]/edit`)

- Mismo formulario que crear, pero pre-llenado
- Mostrar imágenes actuales con opción de:
  - Eliminar imágenes existentes
  - Agregar nuevas imágenes
  - Reordenar todas las imágenes (existentes + nuevas)

#### 6. **Vista Previa de Producto** (`/products/[id]`)

- Mostrar el producto como se vería en el sitio público
- Opcional pero recomendado

---

## 🔌 API Endpoints Requeridos

### Autenticación

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Productos

- `GET /api/products` - Listar todos los productos
- `GET /api/products/[id]` - Obtener un producto por ID
- `POST /api/products` - Crear nuevo producto
- `PUT /api/products/[id]` - Actualizar producto
- `DELETE /api/products/[id]` - Eliminar producto

### Imágenes

- `POST /api/upload` - Subir imagen(es)
- `DELETE /api/upload/[filename]` - Eliminar imagen

### Respuesta de API (Formato JSON)

```typescript
// GET /api/products
{
  "products": [
    {
      "id": "1",
      "name": "Peluche Cafe",
      "price": "$60.000",
      "description": "...",
      "images": ["/peluche-blanco.jpg", "/peluche.jpg"],
      "createdAt": "2025-01-15T10:00:00Z",
      "updatedAt": "2025-01-15T10:00:00Z"
    }
  ]
}

// POST /api/products
{
  "success": true,
  "product": { ... },
  "message": "Producto creado exitosamente"
}

// Error
{
  "success": false,
  "error": "Mensaje de error",
  "details": { ... }
}
```

---

## 🔐 Seguridad

1. **Autenticación obligatoria** para todas las rutas del admin (excepto `/login`)
2. **Middleware de autenticación** en Next.js
3. **Validación de datos** en el servidor (usar Zod)
4. **Sanitización** de inputs
5. **Límites de tamaño** para imágenes (ej: máximo 5MB por imagen)
6. **Validación de tipos de archivo** (solo JPG, PNG, WebP)
7. **Rate limiting** en endpoints de API (opcional pero recomendado)

---

## 📁 Estructura de Proyecto Sugerida

```
isaju-admin/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Grupo de rutas de autenticación
│   │   └── login/
│   ├── (dashboard)/              # Grupo de rutas protegidas
│   │   ├── layout.tsx            # Layout con sidebar/navbar
│   │   ├── dashboard/            # Dashboard principal
│   │   ├── products/             # Gestión de productos
│   │   │   ├── page.tsx          # Lista de productos
│   │   │   ├── new/              # Crear producto
│   │   │   └── [id]/
│   │   │       ├── page.tsx      # Ver producto
│   │   │       └── edit/         # Editar producto
│   │   └── api/                  # API Routes
│   │       ├── auth/
│   │       ├── products/
│   │       └── upload/
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Estilos globales
├── components/                   # Componentes React
│   ├── ui/                       # Componentes base (shadcn/ui)
│   ├── forms/                    # Formularios
│   │   ├── ProductForm.tsx
│   │   └── ImageUpload.tsx
│   ├── layout/                   # Layout components
│   │   ├── Sidebar.tsx
│   │   ├── Navbar.tsx
│   │   └── ProtectedRoute.tsx
│   └── products/                 # Componentes específicos
│       ├── ProductList.tsx
│       ├── ProductCard.tsx
│       └── ProductTable.tsx
├── lib/                          # Utilidades
│   ├── db/                       # Configuración de BD
│   ├── auth.ts                   # Configuración de autenticación
│   ├── upload.ts                 # Utilidades de upload
│   └── validations.ts            # Esquemas Zod
├── types/                        # TypeScript types
│   └── product.ts
├── public/                       # Assets estáticos
│   └── uploads/                  # Imágenes subidas (si es local)
├── .env.local                    # Variables de entorno
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 🚀 Funcionalidades Específicas

### 1. Upload de Imágenes

- **Drag & Drop**: Permitir arrastrar imágenes al área de upload
- **Selección múltiple**: Seleccionar varias imágenes a la vez
- **Preview**: Mostrar preview de imágenes antes de subir
- **Progreso**: Barra de progreso durante la subida
- **Validación**:
  - Solo JPG, PNG, WebP
  - Tamaño máximo: 5MB por imagen
  - Máximo 10 imágenes por producto
- **Reordenamiento**: Arrastrar y soltar para cambiar el orden
- **Eliminación**: Botón para eliminar imágenes antes de guardar

### 2. Formulario de Producto

- **Validación en tiempo real** con mensajes de error claros
- **Auto-guardado** (opcional, guardar borrador cada X segundos)
- **Confirmación antes de salir** si hay cambios sin guardar
- **Mensajes de éxito** después de guardar
- **Loading states** durante el guardado

### 3. Lista de Productos

- **Búsqueda** por nombre
- **Ordenamiento** por fecha, nombre, precio
- **Filtros** (opcional): publicados, borradores
- **Paginación** o scroll infinito
- **Confirmación** antes de eliminar
- **Toast notifications** para acciones (crear, editar, eliminar)

### 4. Integración con Sitio Astro

- El sitio Astro debe poder consumir la API
- Endpoint público: `GET /api/products` (sin autenticación, solo lectura)
- O generar un archivo JSON estático que Astro pueda leer durante el build
- Considerar webhook para regenerar el sitio Astro cuando se actualice un producto

---

## 📝 Variables de Entorno Necesarias

```env
# Base de datos
DATABASE_URL="postgresql://..."

# Autenticación
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

# Upload de imágenes (si usas Cloudinary)
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

# O si usas Supabase
NEXT_PUBLIC_SUPABASE_URL="..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."

# O si usas AWS S3
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="..."
AWS_BUCKET_NAME="..."
```

---

## ✅ Checklist de Implementación

### Fase 1: Setup Básico

- [ ] Crear proyecto Next.js con TypeScript
- [ ] Configurar Tailwind CSS
- [ ] Configurar base de datos (Prisma/MongoDB/Supabase)
- [ ] Configurar autenticación (NextAuth/Clerk)
- [ ] Crear layout base con sidebar/navbar

### Fase 2: Autenticación

- [ ] Página de login
- [ ] Middleware de protección de rutas
- [ ] Sistema de sesiones
- [ ] Logout

### Fase 3: CRUD de Productos

- [ ] Modelo de datos de Producto
- [ ] API: GET /api/products (listar)
- [ ] API: GET /api/products/[id] (obtener uno)
- [ ] API: POST /api/products (crear)
- [ ] API: PUT /api/products/[id] (actualizar)
- [ ] API: DELETE /api/products/[id] (eliminar)

### Fase 4: UI de Productos

- [ ] Lista de productos (tabla/grid)
- [ ] Formulario de crear producto
- [ ] Formulario de editar producto
- [ ] Componente de upload de imágenes
- [ ] Validación de formularios

### Fase 5: Upload de Imágenes

- [ ] Endpoint de upload
- [ ] Integración con servicio de almacenamiento
- [ ] Componente drag & drop
- [ ] Preview de imágenes
- [ ] Reordenamiento de imágenes
- [ ] Eliminación de imágenes

### Fase 6: Mejoras y Pulido

- [ ] Dashboard con estadísticas
- [ ] Búsqueda y filtros
- [ ] Paginación
- [ ] Toast notifications
- [ ] Loading states
- [ ] Manejo de errores
- [ ] Responsive design
- [ ] Optimización de imágenes

### Fase 7: Integración con Astro

- [ ] Endpoint público de API (solo lectura)
- [ ] O generación de JSON estático
- [ ] Documentación de integración

---

## 🎯 Resultado Esperado

Un panel de administración completo, seguro y fácil de usar que permita:

1. ✅ Gestionar productos sin tocar código
2. ✅ Subir y organizar múltiples imágenes por producto
3. ✅ Ver cambios en tiempo real
4. ✅ Tener una API lista para que el sitio Astro consuma los datos
5. ✅ Interfaz intuitiva y responsive

---

## 📚 Recursos y Referencias

- **Next.js Docs**: https://nextjs.org/docs
- **NextAuth.js**: https://next-auth.js.org
- **Prisma**: https://www.prisma.io/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com
- **React Hook Form**: https://react-hook-form.com
- **Zod**: https://zod.dev

---

## 💡 Notas Adicionales

1. **Prioridad**: Enfocarse primero en el CRUD básico de productos y upload de imágenes. Las funcionalidades avanzadas (búsqueda, filtros, estadísticas) pueden agregarse después.

2. **Testing**: Considerar agregar tests básicos para las funcionalidades críticas (crear, editar, eliminar productos).

3. **Performance**: Optimizar las imágenes subidas (compresión, redimensionamiento) antes de guardarlas.

4. **Backup**: Implementar sistema de backup de la base de datos (especialmente importante para producción).

5. **Logs**: Considerar agregar logging de acciones del administrador para auditoría.

---

**Este prompt debe ser suficiente para crear un administrador completo y funcional. Ajusta según tus necesidades específicas.**
