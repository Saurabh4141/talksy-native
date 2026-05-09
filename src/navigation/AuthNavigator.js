import React from 'react';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';


import LoginScreen from '../modules/auth/screens/LoginScreen';

import OtpScreen from '../modules/auth/screens/OtpScreen';

const Stack =
  createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,

        animation:
          'slide_from_right',
      }}
    >

      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />

      <Stack.Screen
        name="OTP"
        component={OtpScreen}
      />
    </Stack.Navigator>
  );
}