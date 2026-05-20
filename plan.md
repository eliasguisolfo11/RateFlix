# Plan de desarrollo para RateFlix

## Objetivo
Crear una aplicación móvil nativa tipo Netflix usando React Native / Expo, con navegación protegida, consumo de la API TMDB versión 3 y una interfaz oscura estilo Netflix.

## Alcance
- Login con validación estática (`admin/123`).
- Autenticación global mediante un `AuthContext`.
- Navegación con Root Stack y pestañas inferiores (`MainTabs`).
- Consumo de TMDB para películas y series estrenadas en 2026.
- UI oscura, grid de 2 columnas, tarjetas con poster, título y rating.
- Estados de carga con `ActivityIndicator`.

## Estructura de carpetas
- `/src/screens`
  - `LoginScreen.js`
  - `MoviesScreen.js`
  - `SeriesScreen.js`
- `/src/components`
  - `MediaCard.js`
- `/src/services`
  - `api.js`
- `/src/context`
  - `AuthContext.js`
- `/src/config`
  - `tmdbConfig.js`

## Dependencias
- `@react-navigation/native`
- `@react-navigation/stack`
- `@react-navigation/bottom-tabs`
- `react-native-safe-area-context`
- `react-native-screens`
- `@react-native-async-storage/async-storage` (opcional para persistencia futura)

## Pasos principales

1. Configurar la navegación
   - Crear un `Root Stack` con dos rutas: `Login` y `MainTabs`.
   - Crear `MainTabs` con dos pestañas: `Películas` y `Series`.
   - Proteger `MainTabs` usando el estado de autenticación de `AuthContext`.

2. Implementar el contexto de autenticación
   - Crear `AuthContext` con estado `isLoggedIn` y funciones `signIn` / `signOut`.
   - Envolver la app con `AuthProvider`.
   - Usar `useContext` en la pantalla de login y en el flujo de navegación.

3. Crear la pantalla de login
   - Formulario con `TextInput` para email y contraseña.
   - Botón de ingreso que valide `admin` y `123`.
   - Al autenticar correctamente, cambiar el estado global y navegar a `MainTabs`.
   - Mensaje de error si las credenciales no coinciden.

4. Crear servicios API TMDB
   - `tmdbConfig.js` que lea `API_KEY` desde el archivo `.env` y defina la base URL.
   - `api.js` con funciones:
     - `fetchMovies2026()` para `/discover/movie` con `sort_by=vote_average.desc`, `primary_release_year=2026`, `vote_count.gte=100`.
     - `fetchSeries2026()` para `/discover/tv` con `sort_by=vote_average.desc`, `first_air_date_year=2026`, `vote_count.gte=50`.
   - Usar `fetch` y `async/await`.

5. Crear componentes de visualización
   - `MediaCard`: imagen de poster TMDB, título truncado a una línea, rating con ⭐ y fondo oscuro.
   - Estilizar con bordes suaves y acento `#e50914`.

6. Crear pantallas de contenido
   - `MoviesScreen`: cargar filmes 2026, mostrar `FlatList` con `numColumns={2}`.
   - `SeriesScreen`: cargar series 2026 de forma similar.
   - Mostrar `ActivityIndicator` centrado mientras se carga.
   - Manejar estado de error simple en caso de fallo de la API.

7. Estilo general
   - Fondo general `#121212`.
   - Texto en blanco.
   - Acentos rojos `#e50914`.
   - Espaciado cómodo y tarjetas modernas.

## Entregables clave
- `src/context/AuthContext.js`
- `src/services/api.js`
- `src/config/tmdbConfig.js`
- `src/screens/LoginScreen.js`
- `src/screens/MoviesScreen.js`
- `src/screens/SeriesScreen.js`
- `src/components/MediaCard.js`
- `App.js` o `index.js` con navegación principal y proveedor de contexto.

## Notas adicionales
- Usar componentes funcionales y hooks (`useState`, `useEffect`, `useContext`).
- El API key puede ser un placeholder dentro de `tmdbConfig.js` para simular la configuración.
- Mantener los archivos limpios y con comentarios en español.
