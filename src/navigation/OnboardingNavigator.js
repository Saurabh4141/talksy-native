import React, {
  useEffect,
  useRef,
} from 'react';

import {
  BackHandler,
  ToastAndroid,
} from 'react-native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import LanguageScreen from '../modules/onboarding/screens/LanguageScreen';

import NameScreen from '../modules/onboarding/screens/NameScreen';

import GenderScreen from '../modules/onboarding/screens/GenderScreen';

const Stack =
  createNativeStackNavigator();

/**
 * Build onboarding stack
 */
function getInitialRoutes(
  step,
) {
  switch (step) {
    case 'gender':
      return [
        {
          name:
            'Language',
        },

        {
          name: 'Name',
        },

        {
          name:
            'Gender',
        },
      ];

    case 'name':
      return [
        {
          name:
            'Language',
        },

        {
          name: 'Name',
        },
      ];

    default:
      return [
        {
          name:
            'Language',
        },
      ];
  }
}

export default function OnboardingNavigator({
  onboardingStep,
}) {
  /**
   * Back press timestamp
   */
  const lastBackPress =
    useRef(0);

  /**
   * Android back handling
   */
  useEffect(() => {
    const onBackPress =
      () => {
        const now =
          Date.now();

        /**
         * Double press exit
         */
        if (
          now -
            lastBackPress.current <
          2000
        ) {
          BackHandler.exitApp();

          return true;
        }

        lastBackPress.current =
          now;

        ToastAndroid.show(
          'Press back again to exit',
          ToastAndroid.SHORT,
        );

        return true;
      };

    const subscription =
      BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

    return () =>
      subscription.remove();
  }, []);

  return (
    <Stack.Navigator
      initialState={{
        index:
          getInitialRoutes(
            onboardingStep,
          ).length - 1,

        routes:
          getInitialRoutes(
            onboardingStep,
          ),
      }}
      screenOptions={{
        headerShown: false,

        animation:
          'slide_from_right',

        contentStyle: {
          backgroundColor:
            '#05010f',
        },
      }}
    >
      {/* Language */}
      <Stack.Screen
        name="Language"
        component={
          LanguageScreen
        }
      />

      {/* Name */}
      <Stack.Screen
        name="Name"
        component={
          NameScreen
        }
      />

      {/* User Gender */}
      <Stack.Screen
        name="Gender"
        component={
          GenderScreen
        }
      />
    </Stack.Navigator>
  );
}