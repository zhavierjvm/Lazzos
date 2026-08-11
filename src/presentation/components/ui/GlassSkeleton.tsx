import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colors } from '../../../core/theme';

interface GlassSkeletonProps {
  style?: StyleProp<ViewStyle>;
}

export const GlassSkeleton: React.FC<GlassSkeletonProps> = ({ style }) => {
  const animatedValue = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 0.7,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animatedValue]);

  return (
    <Animated.View style={[styles.skeleton, style, { opacity: animatedValue }]} />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.glassBorder,
    borderRadius: 8,
  },
});
