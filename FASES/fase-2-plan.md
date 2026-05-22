# Fase 2 — Funcionalidades de Usuario ✅ COMPLETADA

## Objetivo
Agregar watchlist, ratings personalizados y skeletons loading.

---

## 2.1 Watchlist y Watched ✅

**Archivos modificados:**
- `src/services/database.js` — nueva tabla `watchlist` con funciones CRUD
- `src/screens/DetailScreen.js` — botones "Quiero ver" / "Ya visto"
- `src/screens/FavoritesScreen.js` — refactor con tabs: Favoritos | Ver después | Vistos

**Funcionalidad:**
- Tabla SQLite: `watchlist(user_email, media_id, title, poster_path, rating, media_type, status)`
- Status: `'watchlist'` (pendiente) o `'watched'` (visto)
- Botones toggle en DetailScreen (estilo activo con borde rojo)
- Tabs en FavoritesScreen que cargan cada lista por separado
- Focus listener para refrescar al volver de DetailScreen

**Funciones nuevas en database.js:**
- `addToWatchlist(userEmail, media)`
- `removeFromWatchlist(userEmail, mediaId)`
- `updateWatchlistStatus(userEmail, mediaId, status)`
- `getWatchlist(userEmail, status)`
- `getWatchlistStatus(userEmail, mediaId)`

---

## 2.2 Ratings Personalizados ✅

**Archivos creados:**
- `src/components/StarRating.js`

**Archivos modificados:**
- `src/services/database.js` — nueva tabla `ratings` con funciones CRUD
- `src/screens/DetailScreen.js` — componente StarRating interactivo
- `src/components/MediaCard.js` — muestra estrellas del usuario en la tarjeta

**Funcionalidad:**
- Tabla SQLite: `ratings(user_email, media_id, media_type, score)`
- StarRating: 5 estrellas tappables, color amarillo (#f5c518)
- Al tocar la misma estrella se quita el rating
- Muestra "(X/5)" junto a las estrellas
- En DetailScreen: rating interactivo
- En MediaCard: muestra fila de estrellas si el usuario puntuó

**Funciones nuevas en database.js:**
- `setRating(userEmail, mediaId, mediaType, score)`
- `removeRating(userEmail, mediaId)`
- `getRating(userEmail, mediaId)`

---

## 2.3 Tráilers ✅ (ya implementado en Fase 1)

El botón "Ver Tráiler" ya existe en DetailScreen desde la Fase 1:
- Filtra videos por tipo "Trailer" y sitio "YouTube"
- Abre con `Linking.openURL`

---

## 2.4 Estados de Carga Esqueletales ✅

**Archivos creados:**
- `src/components/MediaCardSkeleton.js`

**Archivos modificados:**
- `src/screens/MoviesScreen.js`
- `src/screens/SeriesScreen.js`
- `src/screens/SearchScreen.js`

**Funcionalidad:**
- `MediaCardSkeleton`: card placeholder con shimmer animation
- `SkeletonGrid`: renderiza filas de 2 skeletons (6 por defecto)
- Animación con `Animated.loop` alternando opacidad 0.3 → 1
- Reemplaza `ActivityIndicator` en la carga inicial de Movies, Series y Search
- `loadingMore` footer sigue usando ActivityIndicator (más apropiado)

---

## Archivos tocados (resumen)

| Archivo | Acción |
|---------|--------|
| `src/services/database.js` | Modificado (tablas + funciones) |
| `src/screens/DetailScreen.js` | Modificado (watchlist + rating) |
| `src/components/MediaCard.js` | Modificado (user stars) |
| `src/screens/FavoritesScreen.js` | Modificado (tabs) |
| `src/screens/MoviesScreen.js` | Modificado (skeleton) |
| `src/screens/SeriesScreen.js` | Modificado (skeleton) |
| `src/screens/SearchScreen.js` | Modificado (skeleton) |
| `src/components/StarRating.js` | Nuevo |
| `src/components/MediaCardSkeleton.js` | Nuevo |
