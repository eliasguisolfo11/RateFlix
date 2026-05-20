// API key leída desde .env mediante react-native-dotenv
import { API_KEY } from '@env';
import { TMDB_BASE_URL } from '../config/tmdbConfig';

// Obtiene películas estrenadas en un año específico, ordenadas por rating descendente
// @param {number} year - Año de estreno (default: 2026)
// @returns {Array} - Lista de películas de TMDB
export async function fetchMoviesByYear(year = 2026) {
  const res = await fetch(
    `${TMDB_BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=vote_average.desc&primary_release_year=${year}&vote_count.gte=100`
  );
  const json = await res.json();
  return json.results;
}

// Obtiene series con primera fecha de emisión en un año específico, ordenadas por rating
// @param {number} year - Año de emisión (default: 2026)
// @returns {Array} - Lista de series de TMDB
export async function fetchSeriesByYear(year = 2026) {
  const res = await fetch(
    `${TMDB_BASE_URL}/discover/tv?api_key=${API_KEY}&sort_by=vote_average.desc&first_air_date_year=${year}&vote_count.gte=50`
  );
  const json = await res.json();
  return json.results;
}
