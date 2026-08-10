import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../core/theme';
import { GlassCard } from '../components/GlassCard';

export const ShowcaseScreen = () => {
  return (
    <View style={styles.container}>
      <GlassCard>
        <Text style={styles.text}>Showcase Feed</Text>
      </GlassCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: colors.secondary,
    fontSize: 24,
    fontWeight: 'bold',
  },
});
