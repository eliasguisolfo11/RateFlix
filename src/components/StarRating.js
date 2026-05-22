import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const STARS = [1, 2, 3, 4, 5];

export default function StarRating({ score, size = 24, interactive = true, onRate }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.label, { fontSize: size - 4 }]}>Tu rating: </Text>
      {STARS.map((s) => (
        <TouchableOpacity
          key={s}
          onPress={() => interactive && onRate?.(s === score ? 0 : s)}
          disabled={!interactive}
        >
          <Text style={[styles.star, { fontSize: size }]}>
            {s <= score ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      ))}
      {score > 0 && (
        <Text style={[styles.score, { fontSize: size - 4 }]}>({score}/5)</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  label: {
    color: '#aaa',
    marginRight: 4,
  },
  star: {
    color: '#f5c518',
    marginHorizontal: 2,
  },
  score: {
    color: '#aaa',
    marginLeft: 6,
  },
});
