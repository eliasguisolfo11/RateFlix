import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { fetchMovieDetails, fetchTVDetails } from '../services/api';
import { TMDB_IMAGE_URL } from '../config/tmdbConfig';
import { useAuth } from '../context/AuthContext';
import {
  addFavorite,
  removeFavorite,
  isFavorite,
  addToWatchlist,
  removeFromWatchlist,
  updateWatchlistStatus,
  getWatchlistStatus,
  setRating,
  getRating,
} from '../services/database';
import StarRating from '../components/StarRating';

export default function DetailScreen({ route, navigation }) {
  const { mediaId, mediaType } = route.params;
  const { user } = useAuth();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fav, setFav] = useState(false);
  const [watchStatus, setWatchStatus] = useState(null);
  const [userScore, setUserScore] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const data =
          mediaType === 'movie'
            ? await fetchMovieDetails(mediaId)
            : await fetchTVDetails(mediaId);
        setDetail(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [mediaId, mediaType]);

  useEffect(() => {
    if (user && mediaId) {
      isFavorite(user.email, mediaId).then(setFav);
      getWatchlistStatus(user.email, mediaId).then(setWatchStatus);
      getRating(user.email, mediaId).then(setUserScore);
    }
  }, [user, mediaId]);

  const toggleFav = async () => {
    if (fav) {
      await removeFavorite(user.email, mediaId);
      setFav(false);
    } else {
      await addFavorite(user.email, {
        id: mediaId,
        title: detail?.title || detail?.name,
        poster_path: detail?.poster_path,
        vote_average: detail?.vote_average,
        media_type: mediaType,
      });
      setFav(true);
    }
  };

  const handleWatchlist = useCallback(async (status) => {
    if (watchStatus === status) {
      await removeFromWatchlist(user.email, mediaId);
      setWatchStatus(null);
    } else {
      await addToWatchlist(user.email, {
        id: mediaId,
        title: detail?.title || detail?.name,
        poster_path: detail?.poster_path,
        vote_average: detail?.vote_average,
        media_type: mediaType,
        status,
      });
      setWatchStatus(status);
    }
  }, [user, mediaId, detail, watchStatus]);

  const handleRate = useCallback(async (score) => {
    if (score === 0) {
      await removeRating(user.email, mediaId);
    } else {
      await setRating(user.email, mediaId, mediaType, score);
    }
    setUserScore(score);
  }, [user, mediaId, mediaType]);

  const trailer = detail?.videos?.results?.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  );

  const director = detail?.credits?.crew?.find((c) => c.job === 'Director');
  const cast = detail?.credits?.cast?.slice(0, 8) || [];

  const title = detail?.title || detail?.name;
  const year = (detail?.release_date || detail?.first_air_date || '').slice(0, 4);
  const genres = detail?.genres?.map((g) => g.name).join(', ') || '';
  const runtime = detail?.runtime
    ? `${Math.floor(detail.runtime / 60)}h ${detail.runtime % 60}m`
    : detail?.episode_run_time?.[0]
      ? `${detail.episode_run_time[0]}m`
      : null;

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#e50914" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>{'< Volver'}</Text>
      </TouchableOpacity>

      <Image
        source={{ uri: `${TMDB_IMAGE_URL}${detail?.poster_path}` }}
        style={styles.poster}
        resizeMode="cover"
      />

      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={toggleFav} style={styles.favBtn}>
            <Text style={styles.favIcon}>{fav ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.meta}>
          {year}
          {runtime ? ` · ${runtime}` : ''}
        </Text>
        <Text style={styles.rating}>⭐ {detail?.vote_average?.toFixed(1)}</Text>
        <Text style={styles.genres}>{genres}</Text>

        <Text style={styles.sectionTitle}>Sinopsis</Text>
        <Text style={styles.overview}>
          {detail?.overview || 'Sin descripción disponible.'}
        </Text>

        {director && (
          <>
            <Text style={styles.sectionTitle}>Director</Text>
            <Text style={styles.overview}>{director.name}</Text>
          </>
        )}

        {cast.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Reparto</Text>
            <View style={styles.castRow}>
              {cast.map((c) => (
                <View key={c.id} style={styles.castItem}>
                  <Image
                    source={{
                      uri: c.profile_path
                        ? `${TMDB_IMAGE_URL}${c.profile_path}`
                        : 'https://via.placeholder.com/80',
                    }}
                    style={styles.castImg}
                  />
                  <Text style={styles.castName} numberOfLines={1}>
                    {c.name}
                  </Text>
                  <Text style={styles.castChar} numberOfLines={1}>
                    {c.character}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        <StarRating
          score={userScore}
          size={28}
          onRate={handleRate}
        />

        <View style={styles.watchRow}>
          <TouchableOpacity
            style={[
              styles.watchBtn,
              watchStatus === 'watchlist' && styles.watchBtnActive,
            ]}
            onPress={() => handleWatchlist('watchlist')}
          >
            <Text
              style={[
                styles.watchBtnText,
                watchStatus === 'watchlist' && styles.watchBtnTextActive,
              ]}
            >
              📌 Quiero ver
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.watchBtn,
              watchStatus === 'watched' && styles.watchBtnActive,
            ]}
            onPress={() => handleWatchlist('watched')}
          >
            <Text
              style={[
                styles.watchBtnText,
                watchStatus === 'watched' && styles.watchBtnTextActive,
              ]}
            >
              ✅ Ya visto
            </Text>
          </TouchableOpacity>
        </View>

        {trailer && (
          <TouchableOpacity
            style={styles.trailerBtn}
            onPress={() =>
              Linking.openURL(
                `https://www.youtube.com/watch?v=${trailer.key}`
              )
            }
          >
            <Text style={styles.trailerText}>▶ Ver Tráiler</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loader: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  back: {
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 8,
  },
  backText: {
    color: '#e50914',
    fontSize: 16,
    fontWeight: '600',
  },
  poster: {
    width: '100%',
    height: 400,
  },
  info: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  favBtn: {
    padding: 4,
  },
  favIcon: {
    fontSize: 24,
  },
  meta: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 4,
  },
  rating: {
    color: '#f5c518',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  genres: {
    color: '#e50914',
    fontSize: 13,
    marginTop: 4,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 6,
  },
  overview: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
  },
  castRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  castItem: {
    alignItems: 'center',
    width: 80,
  },
  castImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#333',
  },
  castName: {
    color: '#fff',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  castChar: {
    color: '#888',
    fontSize: 10,
    textAlign: 'center',
  },
  watchRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  watchBtn: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
    paddingVertical: 10,
    alignItems: 'center',
  },
  watchBtnActive: {
    borderColor: '#e50914',
    backgroundColor: 'rgba(229,9,20,0.1)',
  },
  watchBtnText: {
    color: '#aaa',
    fontSize: 13,
    fontWeight: '600',
  },
  watchBtnTextActive: {
    color: '#e50914',
  },
  trailerBtn: {
    backgroundColor: '#e50914',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  trailerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
