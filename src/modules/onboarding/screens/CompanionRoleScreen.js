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
  roleCopy,
} from '../../../locales/onboarding/role';

import {
  updateCompanionRole,
} from '../../../services/onboarding.service';

const { width } =
  Dimensions.get('window');

/**
 * Role options
 */
const ROLES = [
  {
    id: 'special',
    icon: '❤️',
    title:
      'Someone special',

    subtitle:
      'Deep emotional bond',
  },

  {
    id: 'friend',
    icon: '🤝',
    title:
      'Chill friend',

    subtitle:
      'Fun casual connection',
  },

  {
    id: 'caring',
    icon: '🥰',
    title:
      'Caring partner',

    subtitle:
      'Warm emotional support',
  },

  {
    id: 'romantic',
    icon: '😘',
    title:
      'Romantic partner',

    subtitle:
      'Flirty emotional vibe',
  },

  {
    id: 'listener',
    icon: '🫶',
    title:
      'Good listener',

    subtitle:
      'No judgement, just comfort',
  },

  {
    id: 'fun',
    icon: '😂',
    title:
      'Fun buddy',

    subtitle:
      'Playful and energetic',
  },

  {
    id: 'naughty',
    icon: '😈',
    title:
      'Thodi naughty',

    subtitle:
      'Bold playful chemistry',
  },

  {
    id: 'unique',
    icon: '✨',
    title:
      'Something unique',

    subtitle:
      'Create your own vibe',
  },
];

export default function CompanionRoleScreen({
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
    roleCopy[locale] ||
    roleCopy.en;

  /**
   * Selected role
   */
  const [selected, setSelected] =
    useState(
      user
        ?.onboarding_profile
        ?.companion_role ||
      null,
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
    /**
     * Prevent invalid submit
     */
    if (!canContinue) {
      return;
    }

    try {
      setLoading(true);

      /**
       * Update role
       */
      const response =
        await updateCompanionRole(
          selected,
        );

      /**
       * Validate response
       */
      if (
        !response ||
        !response.data ||
        !response.data.user
      ) {
        throw new Error(
          'Invalid server response',
        );
      }

      /**
       * Update auth state
       */
      await updateUser(
        response.data.user,
      );

      /**
       * Navigate next
       */
      setTimeout(() => {
        navigation.replace(
          'Main',
        );
      }, 300);
    } catch (err) {
      console.log(
        'updateRole error:',
        err?.message ||
        err,
      );
    } finally {
      setLoading(false);
    }
  }

  /**
   * Role card
   */
  function RoleCard({
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
            {ROLES.map(
              (item) => (
                <RoleCard
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
          : 24,

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