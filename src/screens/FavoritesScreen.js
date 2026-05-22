import React, { useState, useCallback, useEffect } from 'react';
import { View, FlatList, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { getFavorites, getWatchlist } from '../services/database';
import MediaCard from '../components/MediaCard';

const TABS = [
  { key: 'fav', label: '❤️ Favoritos' },
  { key: 'watchlist', label: '📌 Ver después' },
  { key: 'watched', label: '✅ Vistos' },
];

export default function FavoritesScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('fav');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    let data;
    if (activeTab === 'fav') {
      data = await getFavorites(user.email);
    } else {
      data = await getWatchlist(user.email, activeTab);
    }
    setItems(data);
    setLoading(false);
  }, [user, activeTab]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      load();
    });
    return unsubscribe;
  }, [navigation, load]);

  const handleToggleFav = (newFav, mediaId) => {
    if (!newFav && activeTab === 'fav') {
      setItems((prev) => prev.filter((item) => item.media_id !== mediaId));
    }
  };

  const renderItem = ({ item }) => (
    <MediaCard
      title={item.title}
      posterPath={item.poster_path}
      rating={item.rating}
      mediaId={item.media_id || item.id}
      mediaType={item.media_type}
      onToggleFav={activeTab === 'fav' ? handleToggleFav : undefined}
      onPress={() =>
        navigation.navigate('Detail', {
          mediaId: item.media_id || item.id,
          mediaType: item.media_type,
        })
      }
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabRow}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, activeTab === t.key && styles.tabActive]}
            onPress={() => setActiveTab(t.key)}
          >
            <Text style={[styles.tabText, activeTab === t.key && styles.tabTextActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#e50914"
          style={{ flex: 1, backgroundColor: '#121212' }}
        />
      ) : items.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.empty}>
            {activeTab === 'fav'
              ? 'Sin favoritos aún'
              : activeTab === 'watchlist'
                ? 'Sin películas pendientes'
                : 'No has marcado nada como visto'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => `${item.media_id || item.id}`}
          numColumns={2}
          renderItem={renderItem}
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
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#1e1e1e',
    paddingVertical: 8,
    paddingHorizontal: 8,
    gap: 6,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: 'rgba(229,9,20,0.15)',
  },
  tabText: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#e50914',
  },
  center: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});
