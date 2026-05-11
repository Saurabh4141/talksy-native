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
} from 'react-native';

import {
    colors,
    spacing,
    typography,
    radius,
} from '../../../theme';

import useAuth from '../../../hooks/useAuth';

import { updateGender } from '../../../services/user.service';
import { genderCopy } from '../../../locales/onboarding/gender';

const { width } =
    Dimensions.get('window');

/**
 * Gender options
 */
const GENDERS = [
    {
        id: 'male',
        title: 'Male',
        subtitle:
            'He / Him',
        icon: '🧑',
    },

    {
        id: 'female',
        title: 'Female',
        subtitle:
            'She / Her',
        icon: '👩',
    },

    {
        id: 'non_binary',
        title:
            'Non-binary',
        subtitle:
            'They / Them',
        icon: '✨',
    },

    {
        id:
            'prefer_not_say',
        title:
            'Prefer not to say',
        subtitle:
            'Keep it private',
        icon: '🌙',
    },
];

export default function GenderScreen({
    navigation,
}) {
    /**
     * Auth
     */
    const {
        user,
        updateUser,
    } = useAuth();

    const locale =
        user?.preferred_language ||
        'en';

    const copy =
        genderCopy[locale] ||
        genderCopy.en;

    /**
     * Selected gender
     */
    const [selected, setSelected] =
        useState(
            user?.gender ||
            'male',
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

            /**
             * Save gender
             */
            const response =
                await updateGender(
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
             * Next screen
             */
            navigation.replace(
                'Vibe',
            );
        } catch (err) {
            console.log(
                'gender update error:',
                err,
            );
        } finally {
            setLoading(false);
        }
    }

    /**
     * Gender card
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

            {/* Content */}
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
                    {GENDERS.map(
                        (item) => (
                            <GenderCard
                                key={item.id}
                                item={item}
                            />
                        ),
                    )}
                </View>
            </View>

            {/* Footer */}
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
            flex: 1,

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
                    ? 34
                    : 40,

            lineHeight:
                width < 370
                    ? 42
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
                typography.sizes
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
                    ? 22
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
            paddingHorizontal:
                spacing.lg,

            paddingBottom: 34,

            paddingTop: 18,
        },

        buttonGlow: {
            //   position:
            //     'absolute',

            //   left: 56,

            //   right: 56,

            //   bottom: 28,

            //   height: 56,

            //   borderRadius: 999,

            //   backgroundColor:
            //     '#a855f7',

            //   opacity: 0.24,
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