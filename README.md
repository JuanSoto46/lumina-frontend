# 🌟 Lumina Frontend# � Lumina - Plataforma de Videos Educativos con Subtítulos Inteligentes



Un frontend moderno construido con React, TypeScript y Vite para la aplicación Lumina. Este proyecto proporciona una interfaz de usuario intuitiva y responsiva con autenticación de usuarios y navegación fluida.Una aplicación web moderna desarrollada en React TypeScript que permite explorar videos de alta calidad con soporte para subtítulos en múltiples idiomas.



## 🚀 Tecnologías## ✨ Características Principales



- **React 19** - Biblioteca de JavaScript para construir interfaces de usuario- **🎥 Videos de Calidad:** Integración con la API de Pexels para videos gratuitos de alta calidad

- **TypeScript** - Tipado estático para JavaScript- **🌐 Subtítulos Multiidioma:** Soporte para español e inglés con cambio dinámico

- **Vite** - Herramienta de desarrollo rápida- **❤️ Sistema de Favoritos:** Gestión personal de videos favoritos

- **Sass** - Preprocesador CSS- **🔍 Búsqueda Avanzada:** Búsqueda por categorías y palabras clave

- **React Router** - Enrutamiento del lado del cliente- **📱 Diseño Responsive:** Optimizado para dispositivos móviles y escritorio

- **Fetch API** - Para comunicación con el backend- **📋 Manual Completo:** Manual de usuario con exportación a PDF

- **🎛️ Controles Intuitivos:** Reproductor de video con controles overlay

## 📋 Características

## 🚀 Tecnologías Utilizadas

- ✅ Autenticación de usuarios (Login/Signup)

- ✅ Recuperación de contraseña- **Frontend:** React 18+ con TypeScript

- ✅ Perfil de usuario- **Estilos:** SCSS con diseño moderno y responsive

- ✅ Navegación protegida- **Build Tool:** Vite para desarrollo rápido

- ✅ Diseño responsivo- **PDF Generation:** jsPDF para exportación de manuales

- ✅ Persistencia de sesión con localStorage- **API Integration:** Axios para comunicación con backend

- **Video Player:** HTML5 video con controles personalizados

## 🏗️ Estructura del Proyecto

## 📦 Instalación

```

lumina-frontend/1. **Clonar el repositorio**

├── public/                 # Archivos estáticos   ```bash

├── src/   git clone <repository-url>

│   ├── components/         # Componentes reutilizables   cd lumina-frontend-brayan-v1

│   │   └── Footer.tsx   ```

│   ├── pages/             # Páginas de la aplicación

│   │   ├── About.tsx2. **Instalar dependencias**

│   │   ├── Forgot.tsx   ```bash

│   │   ├── Home.tsx   npm install

│   │   ├── Login.tsx   ```

│   │   ├── Profile.tsx

│   │   ├── Reset.tsx3. **Configurar variables de entorno**

│   │   └── Signup.tsx   ```bash

│   ├── services/          # Servicios y API   # Crear archivo .env con las configuraciones necesarias

│   │   └── api.ts   VITE_API_BASE_URL=http://localhost:3000/api

│   ├── styles/            # Archivos de estilos   VITE_PEXELS_API_KEY=your_pexels_api_key

│   ├── App.tsx           # Componente principal   ```

│   ├── main.tsx          # Punto de entrada

│   └── styles.scss       # Estilos globales4. **Iniciar servidor de desarrollo**

├── package.json   ```bash

├── tsconfig.json   npm run dev

├── vite.config.ts   ```

└── README.md

```5. **Abrir en navegador**

   ```

## ⚙️ Configuración   http://localhost:5173

   ```

### Prerrequisitos

## 🏗️ Estructura del Proyecto

- Node.js 18+ 

- npm o yarn```

src/

### Instalación├── components/           # Componentes reutilizables

│   ├── Footer.tsx       # Pie de página

1. Clona el repositorio:│   └── ScreenshotCapture.tsx  # Capturas para manual

```bash├── pages/               # Páginas principales

git clone https://github.com/JuanSoto46/lumina-frontend.git│   ├── Home.tsx        # Página inicial

cd lumina-frontend│   ├── Login.tsx       # Inicio de sesión

```│   ├── Signup.tsx      # Registro de usuario

│   ├── Pexels.tsx      # Exploración de videos

2. Instala las dependencias:│   ├── Profile.tsx     # Perfil de usuario

```bash│   ├── About.tsx       # Información de la app

npm install│   ├── Forgot.tsx      # Recuperar contraseña

```│   ├── Reset.tsx       # Restablecer contraseña

│   └── UserManual.tsx  # Manual de usuario

3. Configura las variables de entorno:├── services/           # Servicios y APIs

```bash│   ├── api.ts         # Cliente API principal

cp .env.example .env│   └── PDFGenerator.ts # Generador de PDFs

```├── types/             # Definiciones TypeScript

│   └── video.types.ts # Tipos para videos y subtítulos

4. Edita el archivo `.env` y actualiza la URL del backend:├── App.tsx           # Componente principal

```bash├── main.tsx          # Punto de entrada

VITE_API_BASE_URL=http://localhost:3000└── styles.scss       # Estilos globales

``````



## 🚀 Scripts Disponibles## 🎮 Funcionalidades Clave



### Desarrollo### 📹 Exploración de Videos

```bash- Visualización de videos populares en cuadrícula

npm run dev- Búsqueda por categorías (Naturaleza, Tecnología, Ciudad)

```- Vista previa al pasar el cursor

Inicia el servidor de desarrollo en `http://localhost:5173`- Información detallada de cada video



### Construcción### 🎛️ Reproductor de Video

```bash- Controles overlay integrados en el video

npm run build- Play/pausa con barra espaciadora

```- Control de volumen deslizable

Construye la aplicación para producción en la carpeta `dist/`- Selector de idioma para subtítulos (🌐 ES/EN)

- Botón de activación/desactivación de subtítulos (CC)

### Vista previa- Barra de progreso interactiva

```bash

npm run preview### 🌍 Sistema de Subtítulos

```- Cambio dinámico entre español e inglés

Previsualiza la versión de producción localmente- Recarga automática de subtítulos sin interrumpir el video

- Sincronización en tiempo real

## 🔧 Configuración del Backend- Diseño legible con fondo semitransparente



Este frontend requiere un backend compatible. Asegúrate de que tu API backend esté ejecutándose en la URL especificada en `VITE_API_BASE_URL`.### ❤️ Gestión de Favoritos

- Agregar/quitar videos de favoritos con un clic

### Endpoints esperados:- Página dedicada para colección personal

- `POST /auth/login` - Autenticación de usuario- Persistencia entre sesiones

- `POST /auth/signup` - Registro de usuario- Contador de videos guardados

- `POST /auth/forgot` - Recuperación de contraseña

- `POST /auth/reset` - Resetear contraseña### 👤 Gestión de Usuarios

- `GET /user/profile` - Obtener perfil de usuario- Registro con validación de formulario

- Inicio de sesión seguro

## 🎨 Personalización de Estilos- Recuperación de contraseña

- Perfil personal con estadísticas

Los estilos están organizados usando Sass. Puedes personalizar:- Edición de información personal



- **Estilos globales**: `src/styles.scss`### 📖 Manual de Usuario

- **Estilos por componente**: Cada página/componente puede tener sus propios estilos- Manual completo con capturas de pantalla

- **Variables**: Define variables de Sass para colores, fuentes, etc.- Navegación por secciones

- Exportación a PDF con jsPDF

## 🔐 Autenticación- Diseño optimizado para impresión

- Mockups visuales de todas las funciones

El sistema de autenticación utiliza:

- **JWT tokens** almacenados en localStorage## 🔧 Configuración de Desarrollo

- **Rutas protegidas** que requieren autenticación

- **Persistencia de sesión** entre recargas de página### Scripts Disponibles



## 🤝 Contribución```bash

# Desarrollo

1. Haz fork del proyectonpm run dev          # Servidor de desarrollo con hot reload

2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)

3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)# Construcción

4. Push a la rama (`git push origin feature/AmazingFeature`)npm run build        # Build de producción

5. Abre un Pull Requestnpm run preview      # Preview del build de producción



## 📝 Notas de Desarrollo# Linting

npm run lint         # Verificar código con ESLint

- El proyecto utiliza TypeScript estricto```

- Se recomienda usar ESLint y Prettier para mantener la consistencia del código

- Las rutas están configuradas con React Router v7### Configuración del Editor

- La aplicación es completamente responsiva

Recomendamos VS Code con las siguientes extensiones:

## 📄 Licencia- ES7+ React/Redux/React-Native snippets

- TypeScript Importer

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.- SCSS IntelliSense

- Prettier - Code formatter

## 👥 Equipo- Auto Rename Tag



- **JuanSoto46** - Propietario del repositorio## 🎨 Sistema de Diseño

### Paleta de Colores
- **Primario:** `#667eea` (Azul violeta)
- **Secundario:** `#764ba2` (Púrpura)
- **Gradientes:** Diversos gradientes para elementos visuales
- **Neutros:** Escalas de grises para texto y fondos

### Tipografía
- **Principal:** -apple-system, BlinkMacSystemFont, 'Segoe UI'
- **Títulos:** Helvetica bold para headings
- **Cuerpo:** Font-weight normal para contenido

### Componentes Reutilizables
- Botones con estados hover y active
- Cards con sombras y animaciones
- Formularios con validación visual
- Modales responsivos
- Navegación sticky

## 📱 Responsive Design

- **Mobile First:** Diseño optimizado para móviles
- **Breakpoints:** 480px, 768px, 1024px, 1200px
- **Touch Friendly:** Botones y controles táctiles
- **Adaptive Video:** Calidad de video según dispositivo

## 🔌 Integración de APIs

### API Principal (Backend)
```typescript
// Endpoints principales
GET /api/videos/popular?language=es
GET /api/videos/search?query=nature&language=en
GET /api/videos/:id?language=es
GET /api/users/profile
POST /api/auth/login
```

### API de Pexels
- Videos gratuitos de alta calidad
- Múltiples resoluciones disponibles
- Metadata completa de videos
- Búsqueda por categorías

## 🔒 Seguridad

- Validación de formularios en frontend y backend
- Sanitización de inputs de usuario
- Tokens JWT para autenticación
- Encriptación de contraseñas
- HTTPS en producción

## 📊 Rendimiento

- Lazy loading de imágenes y videos
- Code splitting por rutas
- Optimización de bundle con Vite
- Cache inteligente de datos
- Minimización de CSS y JavaScript

## 🚀 Despliegue

### Build de Producción
```bash
npm run build
```

### Variables de Entorno para Producción
```env
VITE_API_BASE_URL=https://api.lumina.com
VITE_PEXELS_API_KEY=production_api_key
VITE_ENVIRONMENT=production
```

### Servidores Recomendados
- **Netlify:** Para despliegue automático
- **Vercel:** Integración con Git
- **GitHub Pages:** Para demos
- **AWS S3:** Para alta disponibilidad

## 📖 Documentación Adicional

- [Manual de Usuario](src/pages/UserManual.tsx) - Guía completa para usuarios finales
- [Tipos TypeScript](src/types/) - Definiciones de tipos
- [API Documentation](src/services/) - Documentación de servicios

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está desarrollado con fines educativos. Consulta el archivo LICENSE para más detalles.

## 👨‍💻 Desarrollador

**Brayan** - Desarrollo Full Stack
- Frontend: React TypeScript con SCSS
- Backend: Node.js con Express
- Base de datos: MongoDB
- Integración de APIs externas

## 🆘 Soporte

Para reportar bugs o solicitar funcionalidades:
- Crear issue en GitHub
- Email: soporte@lumina-edu.com
- Chat en vivo: Disponible 9:00 AM - 6:00 PM

---

**🎬✨ ¡Disfruta explorando videos con Lumina! ✨🎬**
- **JWT tokens** almacenados en localStorage
- **Rutas protegidas** que requieren autenticación
- **Persistencia de sesión** entre recargas de página

## 🤝 Contribución

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Notas de Desarrollo

- El proyecto utiliza TypeScript estricto
- Se recomienda usar ESLint y Prettier para mantener la consistencia del código
- Las rutas están configuradas con React Router v7
- La aplicación es completamente responsiva

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Equipo

- **JuanSoto46** - Propietario del repositorio



