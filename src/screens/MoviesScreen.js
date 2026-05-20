import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { fetchMovies2026 } from '../services/api';
import MediaCard from '../components/MediaCard';

export default function MoviesScreen() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovies2026()
      .then(setMovies)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#e50914"
        style={{ flex: 1, backgroundColor: '#121212' }}
      />
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Error al cargar películas</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
          />
        )}
        contentContainerStyle={{ padding: 6 }}
      />
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
