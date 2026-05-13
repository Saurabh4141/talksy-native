import AsyncStorage from '@react-native-async-storage/async-storage';

import { apiRequest } from './api';

export async function updateLanguage(preferred_language) {
  try {
    const token = await AsyncStorage.getItem('access_token');

    const data = await apiRequest({
      endpoint: '/users/language',
      method: 'PATCH',
      token,
      body: {
        preferred_language,
      },
    });

    return data;
  } catch (err) {
    console.log(
      'updateLanguage FULL ERROR:',
      err,
    );

    console.log(
      'updateLanguage MESSAGE:',
      err?.message,
    );

    console.log(
      'updateLanguage STACK:',
      err?.stack,
    );

    throw new Error(
      err?.message ||
      'Failed to update language',
    );
  }
}

export async function updateName(name) {
  try {
    const token = await AsyncStorage.getItem('access_token');

    const data = await apiRequest({
      endpoint: '/users/name',
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

export async function updateGender(gender) {
  try {
    const token = await AsyncStorage.getItem('access_token');

    const data = await apiRequest({
      endpoint: '/users/gender',
      method: 'PATCH',
      token,
      body: {
        gender,
      },
    });

    return data;
  } catch (err) {
    console.log('updateGender error:', err);

    throw new Error(
      err?.message ||
      'Failed to update gender',
    );
  }
}

