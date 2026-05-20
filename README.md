# RateFlix

Aplicación móvil estilo Netflix desarrollada con React Native / Expo. Consume la API de TMDB para mostrar las películas y series mejor puntuadas del año 2026.

## Stack

- **Framework:** React Native 0.81.5 + Expo SDK 54
- **Navegación:** @react-navigation (Stack + Bottom Tabs)
- **Base de datos:** SQLite (expo-sqlite)
- **API externa:** TMDB v3
- **Entorno:** react-native-dotenv

## Funcionalidades

- Autenticación con SQLite (login y registro de usuarios)
- Usuario por defecto: `admin` / `123`
- Exploración de películas y series de 2026 ordenadas por rating
- Grid de 2 columnas con poster, título y puntuación
- Guardar favoritos por usuario (persistencia local)
- Navegación protegida (requiere login)
- Interfaz oscura estilo Netflix (#121212, acento #e50914)

## Estructura del proyecto

```
src/
├── components/
│   └── MediaCard.js          # Tarjeta con poster, rating y botón de favorito
├── config/
│   └── tmdbConfig.js         # URLs base de TMDB
├── context/
│   └── AuthContext.js        # Contexto de autenticación global
├── screens/
│   ├── LoginScreen.js        # Login y registro de usuarios
│   ├── MoviesScreen.js       # Listado de películas 2026
│   ├── SeriesScreen.js       # Listado de series 2026
│   └── FavoritesScreen.js    # Favoritos del usuario
└── services/
    ├── api.js                # Llamadas a la API de TMDB
    └── database.js           # Servicio SQLite (usuarios y favoritos)
```

## Requisitos previos

- Node.js >= 18
- Expo CLI (`npm install -g expo-cli`) o `npx expo`
- Expo Go en tu dispositivo móvil (iOS/Android)
- (Opcional) Un emulador Android / iOS

## Configuración

### 1. Clonar el repositorio

```bash
git clone git@github.com:eliasguisolfo11/RateFlix.git
cd RateFlix
```

### 2. Configurar variables de entorno

Crear archivo `.env` en la raíz del proyecto:

```env
API_KEY=tu_api_key_de_tmdb
```

> Obtené una API key gratis en https://www.themoviedb.org/settings/api

### 3. Instalar dependencias

```bash
npm install --legacy-peer-deps
```

### 4. Iniciar la aplicación

```bash
npx expo start
```

Escanear el QR con Expo Go (Android) o la cámara (iOS).

## Base de datos

SQLite se inicializa automáticamente al iniciar la app con dos tablas:

- **users** — id, username, email, password
- **favorites** — id, user_email (FK → users.email), media_id, title, poster_path, rating, media_type

El usuario `admin` / `123` se crea automáticamente si no existe.

## TMDB API

Endpoints utilizados:

- `GET /discover/movie` — Películas de 2026 con `vote_count.gte=100`
- `GET /discover/tv` — Series de 2026 con `vote_count.gte=50`

Ambos ordenados por `vote_average.desc`.

## Commits de referencia

```
chore: initial project setup with Expo SDK 54
feat: add TMDB API configuration and service functions
feat: add SQLite database with users and favorites tables
feat: add auth context with SQLite-backed login and register
feat: add MediaCard component with poster, rating and favorite toggle
feat: add main screens and navigation
chore: add useMedia custom hook for data fetching
```
