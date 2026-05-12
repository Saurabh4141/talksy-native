import React from 'react';

import {
  View,
  Text,
} from 'react-native';

export default function Role() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent:
          'center',
        alignItems:
          'center',
        backgroundColor:
          '#05010f',
      }}
    >
      <Text
        style={{
          color: 'white',
          fontSize: 24,
        }}
      >
        Role Screen
      </Text>
    </View>
  );
}