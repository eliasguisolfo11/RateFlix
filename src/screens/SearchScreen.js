import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { searchMedia } from '../services/api';
import MediaCard from '../components/MediaCard';
import { SkeletonGrid } from '../components/MediaCardSkeleton';
import SearchBar from '../components/SearchBar';

export default function SearchScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const mediaType = route.params?.type || 'movie';

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    setQuery('');
    setResults([]);
    setPage(1);
  }, [mediaType]);

  const doSearch = useCallback(async (q, p) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(p === 1);
    try {
      const data = await searchMedia(q, mediaType, p);
      if (p === 1) {
        setResults(data.results);
      } else {
        setResults((prev) => [...prev, ...data.results]);
      }
      setTotalPages(data.totalPages);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [mediaType]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      doSearch(query, 1);
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [query, doSearch]);

  const loadNext = useCallback(async () => {
    if (loadingMore || page >= totalPages) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      await doSearch(query, nextPage);
      setPage(nextPage);
    } finally {
      setLoadingMore(false);
    }
  }, [page, totalPages, loadingMore, query, doSearch]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.back}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>{'< Volver'}</Text>
      </TouchableOpacity>

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder={
          mediaType === 'movie'
            ? 'Buscar películas...'
            : 'Buscar series...'
        }
      />

      {loading ? (
        <SkeletonGrid count={6} />
      ) : query && results.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.empty}>
            No se encontraron resultados para "{query}"
          </Text>
        </View>
      ) : query === '' ? (
        <View style={styles.center}>
          <Text style={styles.empty}>
            Escribe un título para buscar
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          renderItem={({ item }) => (
            <MediaCard
              title={item.title || item.name}
              posterPath={item.poster_path}
              rating={item.vote_average || 0}
              mediaId={item.id}
              mediaType={mediaType}
              year={
                (item.release_date || item.first_air_date || '').slice(0, 4)
              }
              onPress={() =>
                navigation.navigate('Detail', {
                  mediaId: item.id,
                  mediaType,
                })
              }
            />
          )}
          contentContainerStyle={{ padding: 6 }}
          onEndReached={loadNext}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator color="#e50914" style={{ padding: 16 }} />
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
  back: {
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 4,
  },
  backText: {
    color: '#e50914',
    fontSize: 16,
    fontWeight: '600',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  empty: {
    color: '#888',
    fontSize: 15,
    textAlign: 'center',
  },
});
