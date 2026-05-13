// E:\Saurabh_Live\talksy-native\src\modules\onboarding\screens\CompanionGenderScreen.js

import React, {
  useMemo,
  useState,
} from 'react';

import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ScrollView,
} from 'react-native';

import {
  colors,
  spacing,
  typography,
  radius,
} from '../../../theme';

import useAuth from '../../../hooks/useAuth';

import {
  updateCompanionGender,
} from '../../../services/onboarding.service';

import {
  companionGenderCopy,
} from '../../../locales/onboarding/companionGender';

const { width } =
  Dimensions.get('window');

/**
 * Companion gender options
 */
const COMPANION_GENDERS = [
  {
    id: 'female',
    title: 'Female',
    subtitle:
      'Soft, caring energy',
    icon: '💜',
  },

  {
    id: 'male',
    title: 'Male',
    subtitle:
      'Calm, protective vibe',
    icon: '🖤',
  },

  {
    id: 'non_binary',
    title:
      'Non-binary',
    subtitle:
      'Balanced emotional connection',
    icon: '✨',
  },
];

export default function CompanionGenderScreen({
  navigation,
}) {
  /**
   * Auth
   */
  const {
    user,
    updateUser,
  } = useAuth();

  /**
   * Locale
   */
  const locale =
    user?.preferred_language ||
    'en';

  const copy =
    companionGenderCopy[
    locale
    ] ||
    companionGenderCopy.en;

  /**
   * Selected companion gender
   */
  const [selected, setSelected] =
    useState(
      user
        ?.onboarding_profile
        ?.gender_preference ||
      'female',
    );

  /**
   * Loading
   */
  const [loading, setLoading] =
    useState(false);

  /**
   * Continue enabled
   */
  const canContinue =
    useMemo(() => {
      return (
        !!selected &&
        !loading
      );
    }, [
      selected,
      loading,
    ]);

  /**
   * Continue
   */
  async function handleContinue() {
    if (!canContinue) {
      return;
    }

    try {
      setLoading(true);

      const response =
        await updateCompanionGender(
          selected,
        );

      if (
        !response ||
        !response.data ||
        !response.data.user
      ) {
        throw new Error(
          'Invalid server response',
        );
      }

      await updateUser(
        response.data.user,
      );

      setTimeout(() => {
        navigation.navigate(
          'Role',
        );
      }, 300);
    } catch (err) {
      console.log(
        'updateCompanionGender error:',
        err?.message ||
        err,
      );
    } finally {
      setLoading(false);
    }
  }

  /**
   * Companion gender card
   */
  function GenderCard({
    item,
  }) {
    const active =
      selected === item.id;

    return (
      <Pressable
        onPress={() =>
          setSelected(
            item.id,
          )
        }
        disabled={loading}
        style={[
          styles.card,

          active &&
          styles.activeCard,
        ]}
      >
        {/* Icon */}
        <View
          style={
            styles.iconWrap
          }
        >
          <Text
            style={
              styles.icon
            }
          >
            {item.icon}
          </Text>
        </View>

        {/* Content */}
        <View
          style={
            styles.cardContent
          }
        >
          <Text
            style={[
              styles.cardTitle,

              active &&
              styles.activeTitle,
            ]}
          >
            {item.title}
          </Text>

          <Text
            style={
              styles.cardSubtitle
            }
          >
            {item.subtitle}
          </Text>
        </View>
      </Pressable>
    );
  }

  return (
    <SafeAreaView
      style={
        styles.container
      }
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {/* Top glow */}
      <View
        style={
          styles.topGlow
        }
      />

      {/* Bottom glow */}
      <View
        style={
          styles.bottomGlow
        }
      />

      {/* Scrollable content */}
      <ScrollView
        contentContainerStyle={
          styles.scrollContent
        }
        showsVerticalScrollIndicator={
          false
        }
        bounces={false}
      >
        <View
          style={
            styles.content
          }
        >
          {/* Heading */}
          <Text
            style={
              styles.title
            }
          >
            {copy.title}
          </Text>

          {/* Subtitle */}
          <Text
            style={
              styles.subtitle
            }
          >
            {copy.subtitle}
          </Text>

          {/* Options */}
          <View
            style={
              styles.list
            }
          >
            {COMPANION_GENDERS.map(
              (item) => (
                <GenderCard
                  key={item.id}
                  item={item}
                />
              ),
            )}
          </View>
        </View>
      </ScrollView>

      {/* Fixed Footer */}
      <View
        style={
          styles.footer
        }
      >

        <Pressable
          onPress={
            handleContinue
          }
          disabled={
            !canContinue
          }
          style={[
            styles.button,

            !canContinue &&
            styles.buttonDisabled,
          ]}
        >
          <Text
            style={
              styles.buttonText
            }
          >
            {loading
              ? 'Please wait...'
              : 'Continue'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,

      backgroundColor:
        '#05010f',
    },

    scrollContent: {
      flexGrow: 1,

      paddingBottom: 150,
    },

    topGlow: {
      position:
        'absolute',

      top: -160,

      left: -120,

      width: 380,

      height: 380,

      borderRadius: 999,

      backgroundColor:
        'rgba(168,85,247,0.12)',
    },

    bottomGlow: {
      position:
        'absolute',

      bottom: -220,

      right: -140,

      width: 420,

      height: 420,

      borderRadius: 999,

      backgroundColor:
        'rgba(120,60,255,0.08)',
    },

    content: {
      paddingHorizontal:
        spacing.lg,

      paddingTop: 90,
    },

    title: {
      textAlign:
        'center',

      color:
        colors.textPrimary,

      fontSize:
        width < 370
          ? 30
          : 40,

      lineHeight:
        width < 370
          ? 38
          : 48,

      fontWeight:
        typography.weights
          .extrabold,

      letterSpacing: -1,
    },

    subtitle: {
      marginTop:
        spacing.md,

      textAlign:
        'center',

      color:
        colors.textSecondary,

      fontSize:
        width < 370
          ? 14
          : typography.sizes
            .md,

      lineHeight: 24,

      paddingHorizontal: 8,
    },

    list: {
      marginTop:
        spacing.xxl,

      gap: spacing.md,
    },

    card: {
      minHeight: 92,

      flexDirection:
        'row',

      alignItems:
        'center',

      paddingHorizontal: 18,

      paddingVertical: 14,

      borderRadius: 28,

      borderWidth: 1,

      borderColor:
        'rgba(255,255,255,0.08)',

      backgroundColor:
        'rgba(255,255,255,0.04)',
    },

    activeCard: {
      borderColor:
        'rgba(168,85,247,0.65)',

      backgroundColor:
        'rgba(168,85,247,0.18)',
    },

    iconWrap: {
      width: 56,

      justifyContent:
        'center',

      alignItems:
        'center',
    },

    icon: {
      fontSize: 28,
    },

    cardContent: {
      flex: 1,
    },

    cardTitle: {
      color:
        colors.textPrimary,

      fontSize:
        width < 370
          ? 20
          : 26,

      fontWeight:
        typography.weights
          .bold,
    },

    activeTitle: {
      color: '#f3d4ff',
    },

    cardSubtitle: {
      marginTop: 4,

      color:
        colors.textSecondary,

      fontSize:
        typography.sizes
          .md,
    },

    footer: {
      position:
        'absolute',

      left: 0,

      right: 0,

      bottom: 0,

      paddingHorizontal:
        spacing.lg,

      paddingTop: 24,

      paddingBottom: 34,

      backgroundColor:
        'rgba(5,1,15,0.92)',
    },

    buttonGlow: {
      // position:
      //   'absolute',

      // left: 56,

      // right: 56,

      // bottom: 28,

      // height: 56,

      // borderRadius: 999,

      // backgroundColor:
      //   '#a855f7',

      // opacity: 0.24,
    },

    button: {
      minHeight: 58,

      justifyContent:
        'center',

      alignItems:
        'center',

      borderRadius:
        radius.full,

      backgroundColor:
        colors.primary,
    },

    buttonDisabled: {
      opacity: 0.5,
    },

    buttonText: {
      color:
        colors.textPrimary,

      fontSize:
        typography.sizes
          .md,

      fontWeight:
        typography.weights
          .bold,
    },
  });