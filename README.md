# 💒 Sistema de Invitación Digital de Boda con RSVP

Sistema completo de invitación digital para bodas con confirmación de asistencia (RSVP) y panel de administración para gestión de invitados.

## 🌟 Características

### Sitio Público
- ✨ **Hero Slider**: Presentación elegante con slider de imágenes a pantalla completa
- 💝 **Mensaje de Bienvenida**: Texto personalizado para los invitados
- 📅 **Itinerario**: Cronograma detallado de eventos del día
- 🖼️ **Galería**: Diseño masonry para mostrar fotos de la pareja
- 👔 **Código de Vestimenta**: Información clara sobre el dress code
- 🎁 **Mesa de Regalos**: Enlaces a registros y opciones de regalo
- 📝 **Confirmación RSVP**: Sistema de confirmación de asistencia con:
  - Búsqueda de invitados por nombre y apellido
  - Selector de acompañantes limitado según asignación
  - Mensaje personalizado para los novios
  - Estados: Confirmado / Pendiente / No asistirá

### Panel de Administración
- 🔐 **Autenticación Segura**: Login protegido con NextAuth
- 📊 **Dashboard con Estadísticas**:
  - Total de invitados
  - Confirmados (con total de personas incluyendo acompañantes)
  - Pendientes
  - Declinados
  - Sin respuesta
- 📋 **Gestión de Invitados**:
  - Tabla completa con toda la información
  - Filtros por estado de asistencia
  - Búsqueda por nombre
  - Edición manual de invitados
  - Eliminación de registros
- 📥 **Importación CSV**: Carga masiva de invitados
- 📤 **Exportación CSV**: Descarga de lista completa con estados

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14 con App Router
- **Backend**: Next.js API Routes
- **Base de Datos**: SQLite con Prisma ORM
- **Autenticación**: NextAuth.js
- **Estilos**: TailwindCSS
- **Animaciones**: Framer Motion
- **Iconos**: React Icons
- **CSV**: PapaParse

## 📁 Estructura del Proyecto

```
RSVP/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts    # Autenticación
│   │   ├── guests/
│   │   │   ├── route.ts                    # CRUD invitados
│   │   │   ├── [id]/route.ts               # Operaciones por ID
│   │   │   ├── search/route.ts             # Búsqueda de invitados
│   │   │   ├── import/route.ts             # Importar CSV
│   │   │   └── export/route.ts             # Exportar CSV
│   │   ├── rsvp/route.ts                   # Confirmaciones RSVP
│   │   └── stats/route.ts                  # Estadísticas
│   ├── admin/
│   │   ├── login/page.tsx                  # Página de login
│   │   └── dashboard/page.tsx              # Panel admin
│   ├── globals.css                         # Estilos globales
│   ├── layout.tsx                          # Layout principal
│   └── page.tsx                            # Página principal
├── components/
│   ├── HeroSlider.tsx                      # Slider de hero
│   ├── WelcomeMessage.tsx                  # Mensaje de bienvenida
│   ├── Itinerary.tsx                       # Itinerario de eventos
│   ├── Gallery.tsx                         # Galería de fotos
│   ├── DressCode.tsx                       # Código de vestimenta
│   ├── GiftRegistry.tsx                    # Mesa de regalos
│   ├── RSVPButton.tsx                      # Botón de confirmación
│   ├── RSVPModal.tsx                       # Modal RSVP
│   └── Providers.tsx                       # Context providers
├── prisma/
│   ├── schema.prisma                       # Schema de BD
│   └── seed.ts                             # Datos iniciales
├── lib/
│   └── prisma.ts                           # Cliente Prisma
├── types/
│   └── next-auth.d.ts                      # Types de NextAuth
├── .env.example                            # Variables de entorno ejemplo
├── next.config.js                          # Configuración Next.js
├── tailwind.config.ts                      # Configuración Tailwind
├── tsconfig.json                           # Configuración TypeScript
└── package.json                            # Dependencias
```

## 🚀 Instalación y Configuración

### 1. Instalar Dependencias

```powershell
npm install
```

### 2. Configurar Variables de Entorno

Copia el archivo `.env.example` a `.env` y configura las variables:

```powershell
Copy-Item .env.example .env
```

Edita el archivo `.env` y cambia los valores:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="tu-clave-secreta-aleatoria"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@wedding.com"
ADMIN_PASSWORD="TuContraseñaSegura123!"
```

### 3. Configurar Base de Datos

```powershell
# Generar cliente Prisma
npx prisma generate

# Crear base de datos y tablas
npx prisma db push

# (Opcional) Cargar datos de ejemplo
npx tsx prisma/seed.ts
```

### 4. Iniciar Servidor de Desarrollo

```powershell
npm run dev
```

El sitio estará disponible en: `http://localhost:3000`

## 📝 Formato del CSV para Importación

El archivo CSV debe tener las siguientes columnas:

```csv
firstName,lastName,email,phone,maxCompanions
Juan,Pérez,juan@example.com,5551234567,2
María,García,maria@example.com,5559876543,1
Carlos,López,,5555555555,3
```

**Columnas:**
- `firstName` (requerido): Nombre del invitado
- `lastName` (requerido): Apellido del invitado
- `email` (opcional): Correo electrónico
- `phone` (opcional): Teléfono
- `maxCompanions` (opcional): Número máximo de acompañantes (default: 0)

## 🎨 Personalización

### Cambiar Información de los Novios

Edita `components/HeroSlider.tsx`:

```tsx
<h1 className="font-elegant text-6xl md:text-8xl mb-4 drop-shadow-lg">
  Tus Nombres Aquí
</h1>
<p className="text-2xl md:text-3xl font-light tracking-wider">
  Tu Fecha Aquí
</p>
```

### Agregar Imágenes

1. Crea la carpeta `public/images/`
2. Agrega tus imágenes para:
   - Hero slider: `public/images/slide1.jpg`, `slide2.jpg`, etc.
   - Galería: `public/images/gallery/1.jpg`, `2.jpg`, etc.

3. Descomenta las líneas de `Image` en los componentes correspondientes

### Personalizar Colores

Edita `tailwind.config.ts` para cambiar la paleta de colores:

```ts
colors: {
  primary: {
    50: '#fdf8f6',
    // ... tus colores
  },
}
```

### Modificar Itinerario

Edita `components/Itinerary.tsx` para cambiar los eventos:

```tsx
const events = [
  {
    icon: FaChurch,
    time: '16:00',
    title: 'Tu Evento',
    location: 'Tu Ubicación',
    description: 'Tu Descripción',
  },
  // ... más eventos
]
```

### Actualizar Mesa de Regalos

Edita `components/GiftRegistry.tsx`:

```tsx
const registries = [
  {
    icon: FaStore,
    name: 'Tienda',
    description: 'Descripción',
    link: 'https://tu-enlace.com',
    eventNumber: '12345678',
  },
  // ... más opciones
]
```

## 🔐 Panel de Administración

### Acceso

1. Navega a: `http://localhost:3000/admin/login`
2. Usa las credenciales configuradas en `.env`:
   - Email: El valor de `ADMIN_EMAIL`
   - Password: El valor de `ADMIN_PASSWORD`

### Funcionalidades

- **Dashboard**: Vista general con estadísticas en tiempo real
- **Tabla de Invitados**: Lista completa con toda la información
- **Filtros**: Por estado (confirmado, pendiente, declinado, sin respuesta)
- **Búsqueda**: Por nombre o apellido
- **Importar CSV**: Carga masiva de invitados
- **Exportar CSV**: Descarga lista completa
- **Editar**: Modificar información de invitados (funcionalidad base implementada)
- **Eliminar**: Borrar invitados de la lista

## 📱 Responsive Design

El sitio está completamente optimizado para:
- 📱 Móviles
- 📲 Tablets
- 💻 Desktop
- 🖥️ Pantallas grandes

## 🔒 Seguridad

- Autenticación con NextAuth.js
- Passwords hasheados con bcrypt
- Validación de datos en backend
- Protección de rutas del admin
- Variables de entorno para datos sensibles

## 🚀 Producción

### Build para Producción

```powershell
npm run build
npm start
```

### Variables de Entorno en Producción

Asegúrate de configurar todas las variables de entorno en tu plataforma de hosting:

- `DATABASE_URL`: Conexión a tu base de datos
- `NEXTAUTH_SECRET`: Clave secreta única (generarla con `openssl rand -base64 32`)
- `NEXTAUTH_URL`: URL de tu sitio en producción
- `ADMIN_EMAIL`: Email del administrador
- `ADMIN_PASSWORD`: Contraseña segura del administrador

### Despliegue Recomendado

- **Vercel**: Despliegue automático con integración GitHub
- **Netlify**: Alternativa con soporte para Next.js
- **Railway**: Para proyectos con base de datos PostgreSQL

Para producción, considera usar PostgreSQL en lugar de SQLite:

1. Cambia el provider en `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Actualiza `DATABASE_URL` con tu conexión PostgreSQL

## 📞 Soporte

Para dudas o problemas:
1. Revisa la documentación de cada tecnología usada
2. Verifica los logs en la consola del navegador y terminal
3. Asegúrate de tener todas las dependencias instaladas

## 📄 Licencia

Este proyecto es de código abierto para uso personal o comercial.

## 🎉 ¡Felicidades por tu Boda!

Este sistema te ayudará a gestionar tu evento de manera elegante y eficiente. ¡Disfruta tu gran día! 💍✨
