import React from 'react';
import {
  TextInput,
  StyleSheet,
} from 'react-native';

import {
  colors,
  spacing,
  typography,
  radius,
} from '../../theme';

export default function Textarea({
  value,
  onChangeText,
  placeholder,
  style,
  ...props
}) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.textSecondary}
      multiline
      textAlignVertical="top"
      style={[styles.input, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    minHeight: 120,

    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,

    borderRadius: radius.md,

    borderWidth: 1,
    borderColor: colors.border,

    backgroundColor: 'transparent',

    color: colors.textPrimary,

    fontSize: typography.sizes.md,
    fontWeight: typography.weights.regular,
  },
});