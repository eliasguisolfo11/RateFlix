// Pantalla de listado de series
// Filtro por año (2020-2026) con selector desplegable, grid de 2 columnas
// Análoga a MoviesScreen pero usando item.name para el título
import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { fetchSeriesByYear } from '../services/api';
import MediaCard from '../components/MediaCard';
import YearFilter from '../components/YearFilter';

export default function SeriesScreen() {
  const [year, setYear] = useState(2026);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async (y) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSeriesByYear(y);
      setSeries(data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(year);
  }, [year, load]);

  return (
    <View style={styles.container}>
      <YearFilter selectedYear={year} onSelect={setYear} />
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#e50914"
          style={{ flex: 1, backgroundColor: '#121212' }}
        />
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.error}>Error al cargar series</Text>
        </View>
      ) : (
        <FlatList
          data={series}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          renderItem={({ item }) => (
            <MediaCard
              title={item.name}
              posterPath={item.poster_path}
              rating={item.vote_average}
              mediaId={item.id}
              mediaType="tv"
            />
          )}
          contentContainerStyle={{ padding: 6 }}
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
