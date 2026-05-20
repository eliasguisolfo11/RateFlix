import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { TMDB_IMAGE_URL } from '../config/tmdbConfig';
import { useAuth } from '../context/AuthContext';
import { addFavorite, removeFavorite, isFavorite } from '../services/database';

export default function MediaCard({ title, posterPath, rating, mediaId, mediaType }) {
  const { user } = useAuth();
  const [fav, setFav] = useState(false);

  useEffect(() => {
    if (user && mediaId) {
      isFavorite(user.email, mediaId).then(setFav);
    }
  }, [user, mediaId]);

  const toggleFav = async () => {
    if (fav) {
      await removeFavorite(user.email, mediaId);
      setFav(false);
    } else {
      await addFavorite(user.email, {
        id: mediaId,
        title,
        poster_path: posterPath,
        vote_average: rating,
        media_type: mediaType,
      });
      setFav(true);
    }
  };

  return (
    <View style={styles.card}>
      {posterPath ? (
        <Image
          source={{ uri: `${TMDB_IMAGE_URL}${posterPath}` }}
          style={styles.poster}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.poster, styles.placeholder]} />
      )}
      <TouchableOpacity style={styles.favButton} onPress={toggleFav}>
        <Text style={styles.favIcon}>{fav ? '❤️' : '🤍'}</Text>
      </TouchableOpacity>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <Text style={styles.rating}>⭐ {rating.toFixed(1)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    overflow: 'hidden',
  },
  poster: {
    width: '100%',
    height: 200,
  },
  placeholder: {
    backgroundColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favIcon: {
    fontSize: 16,
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingTop: 6,
  },
  rating: {
    color: '#fff',
    fontSize: 12,
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
});
