import React from 'react';
import { TextInput, StyleSheet, TextInputProps, View } from 'react-native';
import { colors } from '../../../core/theme';

export const Input: React.FC<TextInputProps> = (props) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholderTextColor={colors.textSecondary}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  input: {
    backgroundColor: colors.glassBackground,
    borderColor: colors.glassBorder,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    color: colors.textPrimary,
    fontSize: 16,
  },
});
