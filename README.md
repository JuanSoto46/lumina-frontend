# 🌟 Lumina Frontend

Un frontend moderno construido con React, TypeScript y Vite para la aplicación Lumina. Este proyecto proporciona una interfaz de usuario intuitiva y responsiva con autenticación de usuarios y navegación fluida.

## 🚀 Tecnologías

- **React 19** - Biblioteca de JavaScript para construir interfaces de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Vite** - Herramienta de desarrollo rápida
- **Sass** - Preprocesador CSS
- **React Router** - Enrutamiento del lado del cliente
- **Fetch API** - Para comunicación con el backend

## 📋 Características

- ✅ Autenticación de usuarios (Login/Signup)
- ✅ Recuperación de contraseña
- ✅ Perfil de usuario
- ✅ Navegación protegida
- ✅ Diseño responsivo
- ✅ Persistencia de sesión con localStorage

## 🏗️ Estructura del Proyecto

```
lumina-frontend/
├── public/                 # Archivos estáticos
├── src/
│   ├── components/         # Componentes reutilizables
│   │   └── Footer.tsx
│   ├── pages/             # Páginas de la aplicación
│   │   ├── About.tsx
│   │   ├── Forgot.tsx
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Profile.tsx
│   │   ├── Reset.tsx
│   │   └── Signup.tsx
│   ├── services/          # Servicios y API
│   │   └── api.ts
│   ├── styles/            # Archivos de estilos
│   ├── App.tsx           # Componente principal
│   ├── main.tsx          # Punto de entrada
│   └── styles.scss       # Estilos globales
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## ⚙️ Configuración

### Prerrequisitos

- Node.js 18+ 
- npm o yarn

### Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/JuanSoto46/lumina-frontend.git
cd lumina-frontend
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env
```

4. Edita el archivo `.env` y actualiza la URL del backend:
```bash
VITE_API_BASE_URL=http://localhost:3000
```

## 🚀 Scripts Disponibles

### Desarrollo
```bash
npm run dev
```
Inicia el servidor de desarrollo en `http://localhost:5173`

### Construcción
```bash
npm run build
```
Construye la aplicación para producción en la carpeta `dist/`

### Vista previa
```bash
npm run preview
```
Previsualiza la versión de producción localmente

## 🔧 Configuración del Backend

Este frontend requiere un backend compatible. Asegúrate de que tu API backend esté ejecutándose en la URL especificada en `VITE_API_BASE_URL`.

### Endpoints esperados:
- `POST /auth/login` - Autenticación de usuario
- `POST /auth/signup` - Registro de usuario
- `POST /auth/forgot` - Recuperación de contraseña
- `POST /auth/reset` - Resetear contraseña
- `GET /user/profile` - Obtener perfil de usuario

## 🎨 Personalización de Estilos

Los estilos están organizados usando Sass. Puedes personalizar:

- **Estilos globales**: `src/styles.scss`
- **Estilos por componente**: Cada página/componente puede tener sus propios estilos
- **Variables**: Define variables de Sass para colores, fuentes, etc.

## 🔐 Autenticación

El sistema de autenticación utiliza:
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



