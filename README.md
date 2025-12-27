# Isaju Admin - Panel de Administración

Panel de administración para gestionar el catálogo de productos de Isaju, construido con Next.js 14, TypeScript, Prisma y NextAuth.

## 🚀 Características

- ✅ Autenticación segura con NextAuth
- ✅ CRUD completo de productos
- ✅ Upload múltiple de imágenes con drag & drop
- ✅ Reordenamiento de imágenes
- ✅ Dashboard con estadísticas
- ✅ API REST para integración con sitio Astro
- ✅ Diseño responsive
- ✅ Validación de formularios con Zod

## 📋 Requisitos Previos

- Node.js 18+ 
- PostgreSQL (o usar un servicio como Supabase/Neon)
- npm o yarn

## 🛠️ Instalación

1. **Clonar e instalar dependencias:**

```bash
npm install
```

2. **Configurar variables de entorno:**

Copia `.env.example` a `.env.local` y configura las variables:

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/isaju_admin?schema=public"
AUTH_SECRET="tu-secret-key-aqui" # Genera con: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"

# Para producción en Vercel (opcional - solo si usas Vercel Blob)
# BLOB_READ_WRITE_TOKEN="vercel_blob_token_aqui"
```

**Nota sobre almacenamiento de imágenes:**
- En **desarrollo**: Las imágenes se guardan localmente en `public/uploads/`
- En **producción (Vercel)**: Se usa Vercel Blob Storage automáticamente si está configurado `BLOB_READ_WRITE_TOKEN`

3. **Configurar la base de datos:**

```bash
# Generar el cliente de Prisma
npm run db:generate

# Crear las tablas en la base de datos
npm run db:push
```

4. **Crear un usuario administrador:**

Puedes crear un usuario administrador usando el script incluido:

```bash
# Opción 1: Usar el script (configura ADMIN_EMAIL y ADMIN_PASSWORD en .env.local)
npm run create-admin

# Opción 2: Usar Prisma Studio para crear el usuario manualmente
npm run db:studio
```

Si usas el script, asegúrate de configurar las variables opcionales en `.env.local`:
```env
ADMIN_EMAIL="admin@isaju.com"
ADMIN_PASSWORD="tu-contraseña-segura"
```

Si no las configuras, se usarán valores por defecto (cambia la contraseña después del primer login).

5. **Iniciar el servidor de desarrollo:**

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
isaju-admin/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Rutas de autenticación
│   ├── (dashboard)/       # Rutas protegidas del admin
│   │   ├── dashboard/     # Dashboard principal
│   │   ├── products/      # Gestión de productos
│   │   └── api/           # API Routes
│   └── layout.tsx         # Layout raíz
├── components/            # Componentes React
│   ├── ui/               # Componentes base (shadcn/ui)
│   ├── forms/            # Formularios
│   ├── layout/           # Componentes de layout
│   └── products/         # Componentes de productos
├── lib/                  # Utilidades
│   ├── auth.ts           # Configuración NextAuth
│   ├── db/               # Prisma client
│   ├── upload.ts         # Utilidades de upload
│   └── validations.ts    # Esquemas Zod
├── prisma/               # Prisma schema
└── types/                # TypeScript types
```

## 🔐 Autenticación

El panel requiere autenticación. Crea un usuario en la base de datos antes de iniciar sesión.

## 📡 API Endpoints

### Productos (público para GET)

- `GET /api/products` - Listar productos
- `GET /api/products/[id]` - Obtener un producto

### Productos (requiere autenticación)

- `POST /api/products` - Crear producto
- `PUT /api/products/[id]` - Actualizar producto
- `DELETE /api/products/[id]` - Eliminar producto

### Upload (requiere autenticación)

- `POST /api/upload` - Subir imágenes
- `DELETE /api/upload/[filename]` - Eliminar imagen

## 🎨 Personalización

Los colores de la marca están configurados en `tailwind.config.ts`:
- Primary: `#f6d15c` (amarillo)
- Secondary: `#954C7E` (morado/rosa)

## 🚢 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Vercel detectará Next.js automáticamente

### Otras plataformas

Asegúrate de:
- Configurar `DATABASE_URL` correctamente
- Configurar `AUTH_SECRET` con un valor seguro
- Configurar `NEXTAUTH_URL` con tu dominio
- Ejecutar `npm run db:push` para crear las tablas

## 📝 Notas

- Las imágenes se almacenan localmente en `/public/uploads` (desarrollo)
- Para producción, considera usar Cloudinary, AWS S3 o Supabase Storage
- El endpoint `GET /api/products` es público para que el sitio Astro pueda consumirlo

## 🤝 Soporte

Para más información, consulta la documentación de:
- [Next.js](https://nextjs.org/docs)
- [NextAuth](https://next-auth.js.org)
- [Prisma](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

