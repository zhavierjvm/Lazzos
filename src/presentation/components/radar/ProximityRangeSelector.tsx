import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { GlassCard } from '../GlassCard';
import { Button } from '../ui/Button';
import { colors } from '../../../core/theme';
import { useRadarStore, ProximityRange } from '../../../app/stores/useRadarStore';

export const ProximityRangeSelector = () => {
  const { range, setRange, isFuzzyLocation, setFuzzyLocation } = useRadarStore();

  const handleRangeChange = (newRange: ProximityRange) => {
    setRange(newRange);
  };

  return (
    <GlassCard style={styles.container}>
      <Text style={styles.title}>Alcance de Radar</Text>

      <View style={styles.buttonsContainer}>
        <Button
          title="5m (Solo BLE)"
          variant={range === 5 ? 'primary' : 'outline'}
          onPress={() => handleRangeChange(5)}
          style={[styles.rangeBtn, range === 5 && styles.activeBtn]}
          textStyle={{ fontSize: 12 }}
        />
        <Button
          title="15m"
          variant={range === 15 ? 'primary' : 'outline'}
          onPress={() => handleRangeChange(15)}
          style={[styles.rangeBtn, range === 15 && styles.activeBtn]}
          textStyle={{ fontSize: 12 }}
        />
        <Button
          title="50m"
          variant={range === 50 ? 'primary' : 'outline'}
          onPress={() => handleRangeChange(50)}
          style={[styles.rangeBtn, range === 50 && styles.activeBtn]}
          textStyle={{ fontSize: 12 }}
        />
      </View>

      <View style={styles.fuzzyContainer}>
        <Text style={styles.fuzzyText}>Ubicación Difusa (Más Privacidad)</Text>
        <Switch
          trackColor={{ false: colors.glassBorder, true: colors.primary }}
          thumbColor={isFuzzyLocation ? colors.background : colors.textSecondary}
          onValueChange={setFuzzyLocation}
          value={isFuzzyLocation}
        />
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
  },
  title: {
    color: colors.textPrimary,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  rangeBtn: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 8,
    borderColor: colors.glassBorder,
  },
  activeBtn: {
    borderColor: colors.primary,
  },
  fuzzyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fuzzyText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
});
