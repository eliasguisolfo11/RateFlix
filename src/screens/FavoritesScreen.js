// Pantalla de favoritos del usuario autenticado
// Recarga automáticamente cada vez que se enfoca el tab (navigation focus)
// Muestra los contenidos guardados en SQLite con el mismo MediaCard
import React, { useState, useCallback, useEffect } from 'react';
import { View, FlatList, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { getFavorites } from '../services/database';
import MediaCard from '../components/MediaCard';

export default function FavoritesScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getFavorites(user.email);
    setFavorites(data);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      load();
    });
    return unsubscribe;
  }, [navigation, load]);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#e50914"
        style={{ flex: 1, backgroundColor: '#121212' }}
      />
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>Sin favoritos aún</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => `${item.media_id}`}
        numColumns={2}
        renderItem={({ item }) => (
          <MediaCard
            title={item.title}
            posterPath={item.poster_path}
            rating={item.rating}
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
  empty: {
    color: '#888',
    fontSize: 18,
  },
});
