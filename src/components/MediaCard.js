import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Pressable, StyleSheet } from 'react-native';
import { TMDB_IMAGE_URL } from '../config/tmdbConfig';
import { useAuth } from '../context/AuthContext';
import { addFavorite, removeFavorite, isFavorite, getRating } from '../services/database';

export default function MediaCard({
  title,
  posterPath,
  rating,
  mediaId,
  mediaType,
  year,
  genreLabel,
  onPress,
  onToggleFav,
}) {
  const { user } = useAuth();
  const [fav, setFav] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    if (user && mediaId) {
      isFavorite(user.email, mediaId).then(setFav);
      getRating(user.email, mediaId).then((s) => {
        if (mounted.current) setUserRating(s);
      });
    }
    return () => { mounted.current = false; };
  }, [user, mediaId]);

  const toggleFav = async (e) => {
    e.stopPropagation?.();
    if (fav) {
      await removeFavorite(user.email, mediaId);
      setFav(false);
      if (onToggleFav) onToggleFav(false, mediaId);
    } else {
      await addFavorite(user.email, {
        id: mediaId,
        title,
        poster_path: posterPath,
        vote_average: rating,
        media_type: mediaType,
      });
      setFav(true);
      if (onToggleFav) onToggleFav(true, mediaId);
    }
  };

  const stars = userRating > 0 ? '★'.repeat(userRating) + '☆'.repeat(5 - userRating) : null;

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.posterWrapper}>
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
        {year ? (
          <View style={styles.yearBadge}>
            <Text style={styles.yearText}>{year}</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
      <View style={styles.bottomRow}>
        <Text style={styles.rating}>⭐ {rating.toFixed(1)}</Text>
        {genreLabel ? (
          <Text style={styles.genreLabel} numberOfLines={1}>
            {genreLabel}
          </Text>
        ) : null}
      </View>
      {stars ? (
        <Text style={styles.userStars}>{stars}</Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  posterWrapper: {
    position: 'relative',
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
  yearBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(229, 9, 20, 0.85)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  yearText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingTop: 6,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingBottom: 8,
    paddingTop: 2,
  },
  rating: {
    color: '#f5c518',
    fontSize: 12,
  },
  genreLabel: {
    color: '#aaa',
    fontSize: 10,
    maxWidth: 80,
  },
  userStars: {
    color: '#f5c518',
    fontSize: 11,
    paddingHorizontal: 8,
    paddingBottom: 6,
    letterSpacing: 1,
  },
});
