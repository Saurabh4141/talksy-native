import React from 'react';

import {
  View,
  Text,
} from 'react-native';

import {
  colors,
} from '../theme';

export default function MainNavigator() {
  return (
    <View
      style={{
        flex: 1,

        justifyContent:
          'center',

        alignItems:
          'center',

        backgroundColor:
          colors.background,
      }}
    >
      <Text
        style={{
          color: 'white',
        }}
      >
        Main App 💜
      </Text>
    </View>
  );
}