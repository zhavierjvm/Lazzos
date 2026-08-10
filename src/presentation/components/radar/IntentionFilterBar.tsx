import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button } from '../ui/Button';
import { colors } from '../../../core/theme';
import { useRadarStore } from '../../../app/stores/useRadarStore';
import { IntentionCategory } from '../../../domain/entities/User';

const FILTERS: (IntentionCategory | 'Todos')[] = [
  'Todos',
  'Negocios/Servicios',
  'Citas',
  'Emprendimiento/Ventas',
  'Amigos'
];

export const IntentionFilterBar = () => {
  const { selectedFilter, setSelectedFilter } = useRadarStore();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {FILTERS.map(filter => (
        <Button
          key={filter}
          title={filter}
          variant={selectedFilter === filter ? 'secondary' : 'outline'}
          onPress={() => setSelectedFilter(filter)}
          style={[styles.filterBtn, selectedFilter === filter && styles.activeBtn]}
          textStyle={{ fontSize: 12 }}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 50,
  },
  content: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginVertical: 0,
    borderColor: colors.glassBorder,
    borderRadius: 20,
  },
  activeBtn: {
    borderColor: colors.secondary,
  }
});
