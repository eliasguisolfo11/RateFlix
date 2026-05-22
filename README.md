# RateFlix

Aplicación móvil estilo Netflix desarrollada con React Native / Expo. Consume la API de TMDB para descubrir películas y series, con autenticación local, favoritos, watchlist y ratings personalizados.

## Stack

- **Framework:** React Native 0.81.5 + Expo SDK 54
- **Navegación:** @react-navigation (Stack + Bottom Tabs)
- **Base de datos:** SQLite (expo-sqlite)
- **API externa:** TMDB v3
- **Entorno:** react-native-dotenv

## Funcionalidades

### Núcleo
- Autenticación con SQLite (login y registro de usuarios)
- Usuario por defecto: `admin` / `123`
- Navegación protegida (requiere login)
- Interfaz oscura estilo Netflix (#121212, acento #e50914)

### Exploración
- Películas y series filtradas por año (2020-2026) y género
- Grid de 2 columnas con poster, título, rating y año
- Scroll infinito (carga más resultados al hacer scroll)
- Búsqueda por título con debounce y paginación
- Filtro por género con chips seleccionables

### Detalle
- Pantalla de detalle con póster, sinopsis, reparto, director
- Rating de TMDB + rating personal del usuario (1-5 estrellas)
- Botón "Ver Tráiler" que abre YouTube
- Marcador de favoritos ❤️
- Watchlist: "Quiero ver" 📌 y "Ya visto" ✅

### Gestión personal
- Favoritos persistentes por usuario
- Watchlist con tabs: Favoritos | Ver después | Vistos
- Ratings personalizados (estrellas) visibles en tarjetas
- Cuenta con cierre de sesión

### UX
- Estados de carga con skeletons (shimmer animation)
- Scroll infinito con spinner al final de la lista
- Badge de año en tarjetas
- Sombra y elevación en tarjetas

## Estructura del proyecto

```
src/
├── components/
│   ├── GenreFilter.js          # Chips de géneros seleccionables
│   ├── MediaCard.js            # Tarjeta con poster, rating, año y favorito
│   ├── MediaCardSkeleton.js    # Skeleton con shimmer animation
│   ├── SearchBar.js            # Input de búsqueda
│   ├── StarRating.js           # Rating de 5 estrellas interactivo
│   └── YearFilter.js           # Selector desplegable de año
├── config/
│   └── tmdbConfig.js           # URLs base de TMDB
├── context/
│   └── AuthContext.js          # Contexto de autenticación global
├── hooks/
│   └── useMedia.js             # Hook reutilizable para fetching
├── screens/
│   ├── AccountScreen.js        # Perfil y cierre de sesión
│   ├── DetailScreen.js         # Detalle completo + watchlist + rating
│   ├── FavoritesScreen.js      # Tabs: Favoritos, Ver después, Vistos
│   ├── LoginScreen.js          # Login y registro de usuarios
│   ├── MoviesScreen.js         # Películas con filtros y scroll infinito
│   ├── SearchScreen.js         # Búsqueda con debounce
│   └── SeriesScreen.js         # Series con filtros y scroll infinito
└── services/
    ├── api.js                  # Llamadas a la API de TMDB
    └── database.js             # SQLite: usuarios, favoritos, watchlist, ratings
```

## Base de datos

SQLite se inicializa automáticamente al iniciar la app con cuatro tablas:

- **users** — id, username, email, password
- **favorites** — user_email, media_id, title, poster_path, rating, media_type
- **watchlist** — user_email, media_id, title, poster_path, rating, media_type, status ('watchlist' | 'watched')
- **ratings** — user_email, media_id, media_type, score (1-5)

El usuario `admin` / `123` se crea automáticamente si no existe.

## TMDB API

Endpoints utilizados:

| Endpoint | Uso |
|----------|-----|
| `GET /discover/movie` | Películas por año y género |
| `GET /discover/tv` | Series por año y género |
| `GET /movie/{id}` | Detalle de película (con credits + videos) |
| `GET /tv/{id}` | Detalle de serie (con credits + videos) |
| `GET /genre/movie/list` | Lista de géneros de películas |
| `GET /genre/tv/list` | Lista de géneros de series |
| `GET /search/movie` | Búsqueda de películas |
| `GET /search/tv` | Búsqueda de series |

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
