import React from 'react';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import LanguageScreen from '../modules/onboarding/screens/LanguageScreen';

import NameScreen from '../modules/onboarding/screens/NameScreen';

import GenderScreen from '../modules/onboarding/screens/GenderScreen';

import CompanionGenderScreen from '../modules/onboarding/screens/CompanionGenderScreen';

import CompanionRoleScreen from '../modules/onboarding/screens/CompanionRoleScreen';

const Stack =
  createNativeStackNavigator();

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Language"
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

      {/* Companion Gender */}
      <Stack.Screen
        name="CompanionGender"
        component={
          CompanionGenderScreen
        }
      />

      {/* Companion Role */}
      <Stack.Screen
        name="Role"
        component={
          CompanionRoleScreen
        }
      />
    </Stack.Navigator>
  );
}