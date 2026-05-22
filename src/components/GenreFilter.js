import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function GenreFilter({ genres, selected, onSelect }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.chip, !selected && styles.chipActive]}
        onPress={() => onSelect(null)}
      >
        <Text style={[styles.chipText, !selected && styles.chipTextActive]}>
          Todos
        </Text>
      </TouchableOpacity>
      {genres.map((g) => (
        <TouchableOpacity
          key={g.id}
          style={[styles.chip, selected === g.id && styles.chipActive]}
          onPress={() => onSelect(g.id)}
        >
          <Text
            style={[
              styles.chipText,
              selected === g.id && styles.chipTextActive,
            ]}
          >
            {g.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
  chip: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#444',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  chipActive: {
    borderColor: '#e50914',
    backgroundColor: 'rgba(229, 9, 20, 0.15)',
  },
  chipText: {
    color: '#aaa',
    fontSize: 12,
  },
  chipTextActive: {
    color: '#e50914',
    fontWeight: '600',
  },
});
