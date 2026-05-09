import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';

import {
  colors,
  spacing,
  typography,
  radius,
} from '../../theme';

export default function Tooltip({
  children,
  content,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Pressable
        onPressIn={() => setVisible(true)}
        onPressOut={() => setVisible(false)}
      >
        {children}
      </Pressable>

      {visible && (
        <View style={styles.tooltip}>
          <Text style={styles.tooltipText}>
            {content}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    alignItems: 'center',
  },

  tooltip: {
    position: 'absolute',
    bottom: '120%',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    zIndex: 999,
  },

  tooltipText: {
    color: colors.textPrimary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  },
});