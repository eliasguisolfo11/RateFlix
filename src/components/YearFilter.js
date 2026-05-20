// Selector desplegable de año para filtrar películas y series
// Muestra un Modal con años disponibles (2020 a 2026) y marca el año activo
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';

const YEARS = [2026, 2025, 2024, 2023, 2022, 2021, 2020];

export default function YearFilter({ selectedYear, onSelect }) {
  const [visible, setVisible] = useState(false);

  const handleSelect = (year) => {
    onSelect(year);
    setVisible(false);
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.trigger} onPress={() => setVisible(true)}>
        <Text style={styles.triggerText}>{selectedYear}</Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setVisible(false)}>
          <View style={styles.dropdown}>
            <Text style={styles.label}>Seleccionar año</Text>
            <FlatList
              data={YEARS}
              keyExtractor={(item) => String(item)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.option, item === selectedYear && styles.optionActive]}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={[styles.optionText, item === selectedYear && styles.optionTextActive]}>
                    {item}
                  </Text>
                  {item === selectedYear && <Text style={styles.check}>✓</Text>}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#121212',
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  triggerText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginRight: 6,
  },
  arrow: {
    color: '#e50914',
    fontSize: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    width: 260,
    maxHeight: 340,
    paddingVertical: 12,
  },
  label: {
    color: '#888',
    fontSize: 13,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionActive: {
    backgroundColor: '#e509141a',
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  optionTextActive: {
    color: '#e50914',
    fontWeight: '700',
  },
  check: {
    color: '#e50914',
    fontSize: 16,
    fontWeight: '700',
  },
});
