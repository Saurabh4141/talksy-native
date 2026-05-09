import AsyncStorage from '@react-native-async-storage/async-storage';

import { apiRequest } from './api';

export async function updateName(name) {
  try {
    const token = await AsyncStorage.getItem('access_token');

    const data = await apiRequest({
      endpoint: '/users/onboarding/name',
      method: 'PATCH',
      token,
      body: {
        name,
      },
    });

    return data;
  } catch (err) {
    console.log('updateName error:', err);

    throw new Error(
      err?.message ||
      'Failed to update name',
    );
  }
}