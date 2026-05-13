import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Animated,
  StyleSheet,
  View,
} from 'react-native';

import SplashScreen from '../modules/onboarding/screens/SplashScreen';

import useAuth from '../hooks/useAuth';

import AuthNavigator from './AuthNavigator';

import OnboardingNavigator from './OnboardingNavigator';

import MainNavigator from './MainNavigator';

export default function RootNavigator() {
  /**
   * Auth state
   */
  const {
    user,
    authenticated,
    loading,
  } = useAuth();

  /**
   * Splash bootstrap
   */
  const [bootstrapped, setBootstrapped] =
    useState(false);

  /**
   * Splash opacity
   */
  const opacity =
    useMemo(
      () =>
        new Animated.Value(1),
      [],
    );

  /**
   * Bootstrap app
   */
  useEffect(() => {
    /**
     * Wait until auth restore finishes
     */
    if (loading) {
      return;
    }

    /**
     * Small branded delay
     */
    const timer =
      setTimeout(() => {
        Animated.timing(
          opacity,
          {
            toValue: 0,

            duration: 500,

            useNativeDriver: true,
          },
        ).start(() => {
          setBootstrapped(
            true,
          );
        });
      }, 1400);

    return () =>
      clearTimeout(timer);
  }, [loading]);

  /**
   * Wait for auth restore
   */
  if (loading) {
    return null;
  }

  /**
   * Debug logs
   */
  console.log(
    'ROOT NAVIGATOR STATE:',
    {
      loading,

      authenticated,

      onboardingCompleted:
        user?.onboarding_completed,

      user,
    },
  );

  /**
   * Decide navigator
   */
  function renderNavigator() {
    /**
     * Not authenticated
     */
    if (!authenticated) {
      return (
        <AuthNavigator />
      );
    }

    /**
     * Onboarding incomplete
     */
    if (
      !user?.onboarding_completed
    ) {
      return (
        <OnboardingNavigator />
      );
    }

    /**
     * Main app
     */
    return <MainNavigator />;
  }

  return (
    <View style={styles.container}>
      {/* App */}
      {renderNavigator()}

      {/* Splash overlay */}
      {!bootstrapped && (
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,

            styles.splashOverlay,

            {
              opacity,
            },
          ]}
        >
          <SplashScreen />
        </Animated.View>
      )}
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,

      backgroundColor:
        '#05010f',
    },

    splashOverlay: {
      zIndex: 999,

      elevation: 999,
    },
  });