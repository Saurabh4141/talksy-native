import AsyncStorage from '@react-native-async-storage/async-storage';

import { apiRequest } from './api';

export async function updateCompanionGender(
  genderPreference,
) {
  try {
    const token =
      await AsyncStorage.getItem(
        'access_token',
      );

    const data =
      await apiRequest({
        endpoint:
          '/onboarding/companion-gender',

        method: 'PATCH',

        token,

        body: {
          gender_preference:
            genderPreference,
        },
      });

    return data;
  } catch (err) {
    console.log(
      'updateCompanionGender error:',
      err,
    );

    throw new Error(
      err?.message ||
      'Failed to update companion gender',
    );
  }
}

export async function updateCompanionRole(
  companionRole,
) {
  try {
    const token =
      await AsyncStorage.getItem(
        'access_token',
      );

    const data =
      await apiRequest({
        endpoint:
          '/onboarding/companion-role',

        method: 'PATCH',

        token,

        body: {
          companion_role:
            companionRole,
        },
      });

    return data;
  } catch (err) {
    console.log(
      'updateCompanionRole error:',
      err,
    );

    throw new Error(
      err?.message ||
      'Failed to update companion role',
    );
  }
}