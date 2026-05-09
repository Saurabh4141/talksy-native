import React from 'react';
import {
  View,
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

export default function ToggleGroup({
  items = [],
  value,
  onChange,
}) {
  return (
    <View style={styles.container}>
      {items.map((item) => {
        const isActive = item.value === value;

        return (
          <Pressable
            key={item.value}
            onPress={() => onChange(item.value)}
            style={[
              styles.item,
              isActive && styles.activeItem,
            ]}
          >
            <Text
              style={[
                styles.text,
                isActive && styles.activeText,
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  item: {
    minHeight: 40,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'transparent',
  },

  activeItem: {
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