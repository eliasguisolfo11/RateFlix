import { API_KEY } from '@env';
import { TMDB_BASE_URL } from '../config/tmdbConfig';

async function apiFetch(endpoint) {
  const res = await fetch(`${TMDB_BASE_URL}${endpoint}&api_key=${API_KEY}`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.status_message || 'Error en la API');
  return json;
}

function buildParams(base, params) {
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&');
  return `${base}?${query}`;
}

// Películas por año con paginación
export async function fetchMoviesByYear(year = 2026, page = 1, genreId) {
  const params = {
    sort_by: 'vote_average.desc',
    primary_release_year: year,
    vote_count_gte: 100,
    page,
    with_genres: genreId,
  };
  const json = await apiFetch(buildParams('/discover/movie', params));
  return { results: json.results, totalPages: json.total_pages };
}

// Series por año con paginación
export async function fetchSeriesByYear(year = 2026, page = 1, genreId) {
  const params = {
    sort_by: 'vote_average.desc',
    first_air_date_year: year,
    vote_count_gte: 50,
    page,
    with_genres: genreId,
  };
  const json = await apiFetch(buildParams('/discover/tv', params));
  return { results: json.results, totalPages: json.total_pages };
}

// Detalle de película
export async function fetchMovieDetails(id) {
  return apiFetch(`/movie/${id}?append_to_response=credits,videos`);
}

// Detalle de serie
export async function fetchTVDetails(id) {
  return apiFetch(`/tv/${id}?append_to_response=credits,videos`);
}

// Lista de géneros
export async function fetchGenres(type = 'movie') {
  const json = await apiFetch(`/genre/${type}/list?`);
  return json.genres;
}

// Búsqueda
export async function searchMedia(query, type = 'movie', page = 1) {
  const json = await apiFetch(
    `/search/${type}?query=${encodeURIComponent(query)}&page=${page}`
  );
  return { results: json.results, totalPages: json.total_pages };
}
