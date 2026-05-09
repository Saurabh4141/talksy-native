import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Animated,
  StyleSheet,
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
   * Splash state
   */
  const [bootstrapped, setBootstrapped] =
    useState(false);

  /**
   * Fade animation
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
    if (!loading) {
      /**
       * Small delay
       */
      const timer =
        setTimeout(() => {
          /**
           * Fade splash
           */
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
        }, 1500);

      return () =>
        clearTimeout(timer);
    }
  }, [loading]);

  /**
   * Decide navigator
   */
  function renderNavigator() {
    /**
     * Not logged in
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
    <>
      {/* App always mounted */}
      {renderNavigator()}

      {/* Splash overlay */}
      {!bootstrapped && (
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            {
              opacity,
              zIndex: 999,
            },
          ]}
        >
          <SplashScreen />
        </Animated.View>
      )}
    </>
  );
}