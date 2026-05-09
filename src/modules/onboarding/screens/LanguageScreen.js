import React, { useState } from 'react';

import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';

import {
  colors,
  spacing,
  typography,
  radius,
} from '../../../theme';

import { LANGUAGES } from '../../../constants/languages';

import useAuth from '../../../hooks/useAuth';

import { updateLanguage } from '../../../services/user.service';

const { width } = Dimensions.get('window');

const CARD_HEIGHT = width < 370 ? 88 : 96;

export default function LanguageScreen({ navigation }) {
  /**
   * State
   */
  const [selected, setSelected] = useState('hinglish');

  const [loading, setLoading] = useState(false);

  /**
   * Auth
   */
  const { updateUser } = useAuth();

  /**
   * Continue
   */
  async function handleContinue() {
    if (!selected || loading) return;

    try {
      setLoading(true);

      const response = await updateLanguage(selected);

      await updateUser(response.data.user);

      navigation.navigate('Name');
    } catch (err) {
      console.log('language update error:', err);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Language Card
   */
  function LanguageCard({ item }) {
    const active = selected === item.code;

    return (
      <Pressable
        onPress={() => setSelected(item.code)}
        style={[
          styles.card,
          active && styles.activeCard,
        ]}
      >
        {/* Icon */}
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>
            {item.icon}
          </Text>
        </View>

        {/* Content */}
        <View style={styles.cardContent}>
          <Text
            style={[
              styles.languageTitle,
              active && styles.activeTitle,
            ]}
          >
            {item.title}
          </Text>

          <Text style={styles.languageSubtitle}>
            {item.subtitle}
          </Text>

          {item.recommended && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                Recommended ⭐
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Heading */}
        <Text style={styles.title}>
          Which language would
          you like to chat in?
        </Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          You can change this anytime later
        </Text>

        {/* Languages */}
        <View style={styles.list}>
          {LANGUAGES.map((item) => (
            <LanguageCard
              key={item.code}
              item={item}
            />
          ))}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable
          onPress={handleContinue}
          disabled={!selected || loading}
          style={[
            styles.button,
            (!selected || loading) &&
              styles.buttonDisabled,
          ]}
        >
          <Text style={styles.buttonText}>
            {loading
              ? 'Please wait...'
              : 'Continue'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
    paddingBottom: 140,
  },

  title: {
    textAlign: 'center',
    color: colors.textPrimary,
    fontSize: width < 370 ? 34 : 40,
    fontWeight: typography.weights.extrabold,
    lineHeight: width < 370 ? 42 : 48,
    letterSpacing: -1,
  },

  subtitle: {
    marginTop: spacing.md,
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: typography.sizes.md,
  },

  list: {
    marginTop: spacing.xxl,
    gap: spacing.md,
  },

  card: {
    minHeight: CARD_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },

  activeCard: {
    borderColor: 'rgba(168,85,247,0.6)',
    backgroundColor: 'rgba(168,85,247,0.16)',
  },

  iconWrap: {
    width: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },

  icon: {
    fontSize: 28,
  },

  cardContent: {
    flex: 1,
  },

  languageTitle: {
    color: colors.textPrimary,
    fontSize: width < 370 ? 24 : 28,
    fontWeight: typography.weights.bold,
  },

  activeTitle: {
    color: '#f3d4ff',
  },

  languageSubtitle: {
    marginTop: 4,
    color: colors.textSecondary,
    fontSize: typography.sizes.md,
  },

  badge: {
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(168,85,247,0.14)',
  },

  badgeText: {
    color: '#f5c8ff',
    fontSize: 12,
    fontWeight: typography.weights.semibold,
  },

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.lg,
    paddingBottom: 36,
    paddingTop: 16,
    backgroundColor: 'rgba(8,0,20,0.92)',
  },

  button: {
    minHeight: 58,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  buttonText: {
    color: colors.textPrimary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
});