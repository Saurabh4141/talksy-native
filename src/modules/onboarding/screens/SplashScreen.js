import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  Easing,
  StyleSheet,
} from 'react-native';

import {
  colors,
  spacing,
  typography,
  radius,
} from '../../../theme';

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const translateAnim = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),

      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),

      Animated.timing(translateAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      // TEMPORARY NAVIGATION
      // later replace with onboarding/auth logic
      navigation?.replace?.('Login');
    }, 1100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Animated.View
        style={[
          styles.logoWrapper,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Inner Highlight */}
        <View style={styles.innerHighlight} />

        {/* Heart */}
        <Text style={styles.heart}>💜</Text>
      </Animated.View>

      {/* App Name */}
      <Animated.Text
        style={[
          styles.title,
          {
            opacity: fadeAnim,
            transform: [{ translateY: translateAnim }],
          },
        ]}
      >
        Saathi
      </Animated.Text>

      {/* Tagline */}
      <Animated.Text
        style={[
          styles.tagline,
          {
            opacity: fadeAnim,
            transform: [{ translateY: translateAnim }],
          },
        ]}
      >
        Koi jo hamesha tumhare saath rahe 💜
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },

  logoWrapper: {
    height: 130,
    width: 130,
    borderRadius: radius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    position: 'relative',
    overflow: 'hidden',
  },

  innerHighlight: {
    position: 'absolute',
    top: spacing.xs,
    left: spacing.xs,
    right: spacing.xs,
    bottom: spacing.xs,
    borderRadius: radius.lg,
    backgroundColor: colors.overlay,
  },

  heart: {
    fontSize: 42,
    color: colors.textPrimary,
  },

  title: {
    marginTop: spacing.xl,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.extrabold,
    letterSpacing: -0.5,
    color: colors.primaryLight,
  },

  tagline: {
    marginTop: spacing.sm + spacing.xs,
    maxWidth: 260,
    textAlign: 'center',
    fontSize: typography.sizes.md,
    lineHeight: 24,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
  },
});