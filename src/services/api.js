import { API_KEY } from '@env';
import { TMDB_BASE_URL } from '../config/tmdbConfig';

export async function fetchMovies2026() {
  const res = await fetch(
    `${TMDB_BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=vote_average.desc&primary_release_year=2026&vote_count.gte=100`
  );
  const json = await res.json();
  return json.results;
}

export async function fetchSeries2026() {
  const res = await fetch(
    `${TMDB_BASE_URL}/discover/tv?api_key=${API_KEY}&sort_by=vote_average.desc&first_air_date_year=2026&vote_count.gte=50`
  );
  const json = await res.json();
  return json.results;
}
