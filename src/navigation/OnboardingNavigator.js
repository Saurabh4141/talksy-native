import React from 'react';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import LanguageScreen from '../modules/onboarding/screens/LanguageScreen';
import NameScreen from '../modules/onboarding/screens/NameScreen';

const Stack = createNativeStackNavigator();

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Language"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: {
          backgroundColor:
            '#05010f',
        },
      }}
    >
      <Stack.Screen
        name="Language"
        component={
          LanguageScreen
        }
      />

      <Stack.Screen
        name="Name"
        component={
          NameScreen
        }
      />
    </Stack.Navigator>
  );
}