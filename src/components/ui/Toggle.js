import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
} from 'react-native';

import {
  colors,
  spacing,
  typography,
  radius,
} from '../../theme';

export default function Toggle({
  active = false,
  onPress,
  label,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        active && styles.activeContainer,
      ]}
    >
      <Text
        style={[
          styles.text,
          active && styles.activeText,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 40,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radius.md,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },

  activeContainer: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  text: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
  },

  activeText: {
    color: colors.textPrimary,
  },
});