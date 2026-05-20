import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { fetchSeries2026 } from '../services/api';
import MediaCard from '../components/MediaCard';

export default function SeriesScreen() {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSeries2026()
      .then(setSeries)
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
        <Text style={styles.error}>Error al cargar series</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
