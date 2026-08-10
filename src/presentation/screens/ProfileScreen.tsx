import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../core/theme';
import { GlassCard } from '../components/GlassCard';

export const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <GlassCard>
        <Text style={styles.text}>Profile & Digital Card</Text>
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
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: 'bold',
  },
});
