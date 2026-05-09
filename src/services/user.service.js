import AsyncStorage from '@react-native-async-storage/async-storage';

import { apiRequest } from './api';

export async function updateLanguage(preferred_language) {
  try {
    const token = await AsyncStorage.getItem('access_token');

    const data = await apiRequest({
      endpoint: '/users/onboarding/language',
      method: 'PATCH',
      token,
      body: {
        preferred_language,
      },
    });

    return data;
  } catch (err) {
    console.log('updateLanguage error:', err);

    throw new Error(
      err?.message ||
      'Failed to update language',
    );
  }
}