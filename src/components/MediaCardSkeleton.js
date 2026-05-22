import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

export default function MediaCardSkeleton() {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return (
    <View style={styles.card}>
      <Animated.View style={[styles.poster, { opacity }]} />
      <View style={styles.textBlock}>
        <Animated.View style={[styles.titleLine, { opacity }]} />
        <Animated.View style={[styles.ratingLine, { opacity }]} />
      </View>
    </View>
  );
}

export function SkeletonGrid({ count = 6 }) {
  const pairs = [];
  for (let i = 0; i < count; i += 2) {
    pairs.push(
      <View key={i} style={styles.row}>
        <MediaCardSkeleton />
        {i + 1 < count && <MediaCardSkeleton />}
      </View>
    );
  }
  return <View style={styles.grid}>{pairs}</View>;
}

const styles = StyleSheet.create({
  grid: {
    padding: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 0,
  },
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
    backgroundColor: '#2a2a2a',
  },
  textBlock: {
    padding: 8,
    gap: 6,
  },
  titleLine: {
    height: 14,
    backgroundColor: '#2a2a2a',
    borderRadius: 4,
    width: '80%',
  },
  ratingLine: {
    height: 10,
    backgroundColor: '#2a2a2a',
    borderRadius: 4,
    width: '40%',
  },
});
