import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

import {
  colors,
  spacing,
  typography,
  radius,
} from '../../../theme';

import {
  requestOtp,
} from '../../../services/auth.service';

export default function LoginScreen({
  navigation,
}) {
  const [phone, setPhone] =
    useState('');

  const [error, setError] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  /**
   * Submit handler
   */
  const handleSubmit =
    async () => {
      /**
       * Prevent double requests
       */
      if (loading) {
        return;
      }

      setError(null);

      /**
       * Empty validation
       */
      if (!phone) {
        setError(
          'Apna number bata do, please 💜',
        );

        return;
      }

      /**
       * Indian mobile validation
       */
      if (
        !/^[6-9]\d{9}$/.test(phone)
      ) {
        setError(
          'Please enter a valid 10-digit number',
        );

        return;
      }

      try {
        setLoading(true);

        /**
         * Request OTP API
         */
        await requestOtp(phone);

        /**
         * Navigate OTP screen
         */
        navigation.navigate(
          'OTP',
          {
            phone_number: phone,
          },
        );
      } catch (err) {
        console.log(
          'requestOtp error:',
          err,
        );

        const message =
          err?.message ||
          'Something went wrong';

        setError(message);

        Alert.alert(
          'Error',
          message,
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <KeyboardAvoidingView
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Heading */}
        <Text style={styles.title}>
          Start a conversation…
        </Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Koi hai jo tumhari baat
          sunega 💜
        </Text>

        {/* Form */}
        <View style={styles.form}>
          {/* Phone Input */}
          <View>
            <TextInput
              value={phone}
              onChangeText={(
                text,
              ) => {
                /**
                 * Allow digits only
                 */
                const cleaned =
                  text
                    .replace(
                      /\D/g,
                      '',
                    )
                    .slice(0, 10);

                setPhone(cleaned);

                /**
                 * Clear old errors
                 */
                if (error) {
                  setError(null);
                }
              }}
              placeholder="Enter your mobile number"
              placeholderTextColor={
                colors.textSecondary
              }
              keyboardType="number-pad"
              maxLength={10}
              // autoFocus
              editable={!loading}
              style={[
                styles.input,

                error &&
                  styles.inputError,
              ]}
            />

            {error && (
              <Text
                style={
                  styles.errorText
                }
              >
                {error}
              </Text>
            )}
          </View>

          {/* Continue Button */}
          <Pressable
            onPress={handleSubmit}
            disabled={loading}
            style={({
              pressed,
            }) => [
              styles.button,

              pressed &&
                !loading &&
                styles.buttonPressed,

              loading &&
                styles.buttonDisabled,
            ]}
          >
            {loading ? (
              <ActivityIndicator
                color={
                  colors.textPrimary
                }
              />
            ) : (
              <Text
                style={
                  styles.buttonText
                }
              >
                Continue
              </Text>
            )}
          </Pressable>

          {/* Footer */}
          <Text
            style={styles.footerText}
          >
            We'll send a one-time
            code to verify your
            number.
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,

      justifyContent:
        'center',

      backgroundColor:
        colors.background,
    },

    content: {
      paddingHorizontal:
        spacing.lg,
    },

    title: {
      textAlign: 'center',

      color:
        colors.primaryLight,

      fontSize:
        typography.sizes.xxl,

      fontWeight:
        typography.weights
          .extrabold,

      letterSpacing: -0.5,
    },

    subtitle: {
      marginTop: spacing.sm,

      textAlign: 'center',

      color:
        colors.textSecondary,

      fontSize:
        typography.sizes.sm,

      opacity: 0.8,
    },

    form: {
      marginTop: spacing.xl,

      gap: spacing.md,
    },

    input: {
      minHeight: 56,

      paddingHorizontal:
        spacing.lg,

      borderRadius:
        radius.full,

      borderWidth: 1,

      borderColor:
        colors.border,

      backgroundColor:
        'rgba(255,255,255,0.05)',

      color:
        colors.textPrimary,

      fontSize:
        typography.sizes.md,
    },

    inputError: {
      borderColor: '#ef4444',
    },

    errorText: {
      marginTop: spacing.sm,

      paddingHorizontal:
        spacing.sm,

      color: '#f87171',

      fontSize:
        typography.sizes.sm,
    },

    button: {
      minHeight: 56,

      justifyContent:
        'center',

      alignItems: 'center',

      borderRadius:
        radius.full,

      backgroundColor:
        colors.primary,
    },

    buttonPressed: {
      opacity: 0.85,
    },

    buttonDisabled: {
      opacity: 0.7,
    },

    buttonText: {
      color:
        colors.textPrimary,

      fontSize:
        typography.sizes.md,

      fontWeight:
        typography.weights
          .semibold,
    },

    footerText: {
      textAlign: 'center',

      color:
        colors.textSecondary,

      opacity: 0.6,

      fontSize:
        typography.sizes.xs,

      lineHeight: 18,
    },
  });