import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchMoviesByYear, fetchGenres } from '../services/api';
import MediaCard from '../components/MediaCard';
import { SkeletonGrid } from '../components/MediaCardSkeleton';
import YearFilter from '../components/YearFilter';
import GenreFilter from '../components/GenreFilter';

export default function MoviesScreen() {
  const navigation = useNavigation();
  const [year, setYear] = useState(2026);
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [genreId, setGenreId] = useState(null);
  const [genres, setGenres] = useState([]);
  const [showGenreFilter, setShowGenreFilter] = useState(false);

  useEffect(() => {
    fetchGenres('movie').then(setGenres);
  }, []);

  const load = useCallback(async (y, p, g) => {
    setLoading(true);
    setError(null);
    try {
      const { results, totalPages: tp } = await fetchMoviesByYear(y, p, g);
      setMovies(results);
      setTotalPages(tp);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    load(year, 1, genreId);
  }, [year, genreId, load]);

  const loadNext = useCallback(async () => {
    if (loadingMore || page >= totalPages) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const { results } = await fetchMoviesByYear(year, nextPage, genreId);
      setMovies((prev) => [...prev, ...results]);
      setPage(nextPage);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMore(false);
    }
  }, [page, totalPages, loadingMore, year, genreId]);

  const genreMap = genres.reduce((acc, g) => ({ ...acc, [g.id]: g.name }), {});

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <YearFilter selectedYear={year} onSelect={setYear} />
        <TouchableOpacity
          style={styles.searchBtn}
          onPress={() => navigation.navigate('Search', { type: 'movie' })}
        >
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.genreToggle}
        onPress={() => setShowGenreFilter((s) => !s)}
      >
        <Text style={styles.genreToggleText}>
          {genreId
            ? `Género: ${genreMap[genreId] || genreId}`
            : 'Todos los géneros'}
          {' ▼'}
        </Text>
      </TouchableOpacity>

      {showGenreFilter && (
        <GenreFilter
          genres={genres}
          selected={genreId}
          onSelect={(g) => {
            setGenreId(g);
            setShowGenreFilter(false);
          }}
        />
      )}

      {loading ? (
        <SkeletonGrid count={6} />
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.error}>Error al cargar películas</Text>
        </View>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          renderItem={({ item }) => (
            <MediaCard
              title={item.title}
              posterPath={item.poster_path}
              rating={item.vote_average}
              mediaId={item.id}
              mediaType="movie"
              year={(item.release_date || '').slice(0, 4)}
              genreLabel={
                item.genre_ids?.[0] ? genreMap[item.genre_ids[0]] : undefined
              }
              onPress={() =>
                navigation.navigate('Detail', {
                  mediaId: item.id,
                  mediaType: 'movie',
                })
              }
            />
          )}
          contentContainerStyle={{ padding: 6 }}
          onEndReached={loadNext}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator
                color="#e50914"
                style={{ padding: 16 }}
              />
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 12,
  },
  searchBtn: {
    padding: 8,
  },
  searchIcon: {
    fontSize: 20,
  },
  genreToggle: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  genreToggleText: {
    color: '#e50914',
    fontSize: 13,
    fontWeight: '600',
  },
  center: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: '#fff',
    fontSize: 16,
  },
});
