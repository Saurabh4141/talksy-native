import React, {
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    StatusBar,
    Animated,
    Easing,
} from 'react-native';


import { LinearGradient } from 'expo-linear-gradient';

import useAuth from '../../../hooks/useAuth';

import { radius } from '../../../theme';

import { nameCopy } from '../../../locales/onboarding/name';

import { updateName } from '../../../services/user.service';

const { width } =
    Dimensions.get('window');

export default function NameScreen({
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
     * Preferred language
     */
    const language =
        user?.preferred_language ||
        'en';

    /**
     * Localized copy
     */
    const copy =
        nameCopy[language] ||
        nameCopy.en;

    /**
     * State
     */
    const [name, setName] =
        useState(user?.name || '');

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState('');

    /**
     * Input ref
     */
    const inputRef =
        useRef(null);

    /**
     * Button glow animation
     */
    const glowAnim =
        useRef(
            new Animated.Value(0),
        ).current;

    /**
     * Focus input
     */
    // useEffect(() => {
    //     /**
    //      * Wait until splash
    //      * fully disappears
    //      */
    //     const timer =
    //         setTimeout(() => {
    //             inputRef.current?.focus();
    //         }, 2200);

    //     return () =>
    //         clearTimeout(timer);
    // }, []);

    /**
     * Validation
     */
    const trimmed =
        name.trim();

    /**
     * Minimum 3 chars
     */
    const valid =
        trimmed.length >= 3;

    /**
     * Dynamic emotional tagline
     */
    const liveTagline =
        useMemo(() => {
            /**
             * Empty
             */
            if (!trimmed) {
                return '';
            }

            /**
             * 1 char
             */
            if (
                trimmed.length === 1
            ) {
                return copy.reactions
                    .typing;
            }

            /**
             * 2 chars
             */
            if (
                trimmed.length === 2
            ) {
                return copy.reactions
                    .more;
            }

            /**
             * Emotional reactions
             */
            const reactions = [
                copy.reactions.greeting(
                    trimmed,
                ),

                copy.reactions.cute(
                    trimmed,
                ),

                copy.reactions.meet(
                    trimmed,
                ),
            ];

            return reactions[
                trimmed.length %
                reactions.length
            ];
        }, [trimmed, copy]);

    /**
     * Button glow animation
     */
    useEffect(() => {
        /**
         * Glow only when valid
         */
        if (!valid) {
            glowAnim.setValue(0);

            return;
        }

        const animation =
            Animated.loop(
                Animated.sequence([
                    Animated.timing(
                        glowAnim,
                        {
                            toValue: 1,
                            duration: 1200,
                            easing:
                                Easing.inOut(
                                    Easing.ease,
                                ),
                            useNativeDriver:
                                false,
                        },
                    ),

                    Animated.timing(
                        glowAnim,
                        {
                            toValue: 0,
                            duration: 1200,
                            easing:
                                Easing.inOut(
                                    Easing.ease,
                                ),
                            useNativeDriver:
                                false,
                        },
                    ),
                ]),
            );

        animation.start();

        return () =>
            animation.stop();
    }, [valid]);

    /**
     * Continue
     */
    async function handleContinue() {
        /**
         * Prevent invalid state
         */
        if (!valid || loading) {
            return;
        }

        try {
            setLoading(true);

            setError('');

            /**
             * API request
             */
            const response =
                await updateName(
                    trimmed,
                );

            /**
             * Response validation
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
             * Update auth user
             */
            await updateUser(
                response.data.user,
            );

            /**
             * Smooth transition
             */
            setTimeout(() => {
                navigation.navigate(
                    'Gender',
                );
            }, 300);
        } catch (err) {
            console.log(
                'update name error:',
                err,
            );

            setError(
                err?.message ||
                copy.validation,
            );
        } finally {
            setLoading(false);
        }
    }

    /**
     * Animated glow opacity
     */
    const glowOpacity =
        glowAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.15, 0.4],
        });

    return (
        <LinearGradient
            colors={[
                '#1b062d',
                '#090014',
                '#040009',
            ]}
            start={{
                x: 0,
                y: 0,
            }}
            end={{
                x: 1,
                y: 1,
            }}
            style={styles.gradient}
        >
            {/* Top radiant glow */}
            <View
                style={
                    styles.topRadiant
                }
            />

            {/* Bottom radiant glow */}
            <View
                style={
                    styles.bottomRadiant
                }
            />

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

                <KeyboardAvoidingView
                    style={styles.flex}
                    behavior={
                        Platform.OS ===
                            'ios'
                            ? 'padding'
                            : undefined
                    }
                >
                    {/* Progress */}
                    <View
                        style={
                            styles.progressWrap
                        }
                    >
                        <View
                            style={
                                styles.progressInactive
                            }
                        />

                        <View
                            style={
                                styles.progressActive
                            }
                        />

                        <View
                            style={
                                styles.progressInactive
                            }
                        />

                        <View
                            style={
                                styles.progressInactive
                            }
                        />

                        <View
                            style={
                                styles.progressInactive
                            }
                        />
                    </View>

                    {/* Content */}
                    <View
                        style={
                            styles.content
                        }
                    >
                        {/* Heading */}
                        <Text
                            style={styles.title}
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

                        {/* Input */}
                        <View
                            style={
                                styles.inputWrap
                            }
                        >
                            <TextInput
                                ref={inputRef}
                                value={name}
                                onChangeText={(
                                    text,
                                ) => {
                                    const clean =
                                        text.replace(
                                            /\s+/g,
                                            ' ',
                                        );

                                    setName(clean);

                                    if (error) {
                                        setError('');
                                    }
                                }}
                                placeholder={
                                    copy.placeholder
                                }
                                placeholderTextColor="rgba(255,255,255,0.34)"
                                autoCapitalize="words"
                                autoCorrect={false}
                                keyboardType="default"
                                returnKeyType="done"
                                maxLength={32}
                                editable={!loading}
                                onSubmitEditing={
                                    handleContinue
                                }
                                style={[
                                    styles.input,

                                    error &&
                                    styles.inputError,
                                ]}
                            />
                        </View>

                        {/* Dynamic tagline */}
                        <View
                            style={
                                styles.taglineWrap
                            }
                        >
                            {!!liveTagline && (
                                <Text
                                    style={
                                        styles.tagline
                                    }
                                >
                                    {
                                        liveTagline
                                    }
                                </Text>
                            )}
                        </View>

                        {/* Error */}
                        {!!error && (
                            <Text
                                style={
                                    styles.error
                                }
                            >
                                {error}
                            </Text>
                        )}
                    </View>

                    {/* Footer */}
                    <View
                        style={
                            styles.footer
                        }
                    >
                        {/* Button glow */}
                        {valid && (
                            <Animated.View
                                style={[
                                    styles.buttonGlow,
                                    {
                                        opacity:
                                            glowOpacity,
                                    },
                                ]}
                            />
                        )}

                        {/* Continue */}
                        <Pressable
                            disabled={
                                !valid ||
                                loading
                            }
                            onPress={
                                handleContinue
                            }
                            style={[
                                styles.button,

                                (!valid ||
                                    loading) &&
                                styles.buttonDisabled,
                            ]}
                        >
                            <Text
                                style={
                                    styles.buttonText
                                }
                            >
                                {loading
                                    ? copy.submitting
                                    : copy.button}
                            </Text>
                        </Pressable>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles =
    StyleSheet.create({
        flex: {
            flex: 1,
        },

        container: {
            flex: 1,

            /**
             * Equivalent to:
             * background: var(--gradient-bg)
             */
            backgroundColor:
                'transparent',
        },

        progressWrap: {
            marginTop: 28,

            flexDirection: 'row',

            justifyContent:
                'center',

            alignItems: 'center',

            gap: 8,
        },

        progressActive: {
            width: 38,

            height: 6,

            borderRadius: 999,

            backgroundColor:
                '#ffffff',
        },

        progressInactive: {
            width: 14,

            height: 6,

            borderRadius: 999,

            backgroundColor:
                'rgba(255,255,255,0.18)',
        },

        content: {
            flex: 1,

            justifyContent:
                'center',

            paddingHorizontal: 28,

            marginTop: -30,
        },

        title: {
            textAlign: 'center',

            color: '#f4d7ff',

            fontSize:
                width < 370
                    ? 36
                    : 48,

            fontWeight: '800',

            lineHeight:
                width < 370
                    ? 46
                    : 58,

            letterSpacing: -1.6,
        },

        subtitle: {
            marginTop: 16,

            textAlign: 'center',

            color:
                'rgba(255,255,255,0.72)',

            fontSize: 17,

            lineHeight: 26,

            paddingHorizontal: 12,
        },

        inputWrap: {
            marginTop: 50,
        },

        input: {
            minHeight: 70,

            borderRadius: 999,

            borderWidth: 1.2,

            borderColor:
                'rgba(255,255,255,0.10)',

            backgroundColor:
                'rgba(255,255,255,0.05)',

            paddingHorizontal: 28,

            color: '#ffffff',

            fontSize: 20,

            fontWeight: '700',
        },

        inputError: {
            borderColor:
                'rgba(255,90,90,0.7)',
        },

        taglineWrap: {
            minHeight: 38,

            marginTop: 18,

            justifyContent:
                'center',

            alignItems: 'center',
        },

        tagline: {
            color: '#e7b8ff',

            fontSize: 15,

            fontWeight: '600',

            textAlign: 'center',

            paddingHorizontal: 20,
        },

        error: {
            marginTop: 6,

            color: '#ff8b8b',

            fontSize: 14,

            textAlign: 'center',
        },

        footer: {
            paddingHorizontal: 28,

            paddingBottom: 42,

            position: 'relative',
        },


        button: {
            minHeight: 66,

            borderRadius:
                radius.full,

            justifyContent:
                'center',

            alignItems: 'center',

            backgroundColor:
                '#a855f7',
        },

        buttonDisabled: {
            opacity: 0.45,
        },

        buttonText: {
            color: '#16061f',

            fontSize: 18,

            fontWeight: '800',
        },
        gradient: {
            flex: 1,
        },

        topRadiant: {
            position: 'absolute',

            top: -180,

            left: -120,

            width: 420,

            height: 420,

            borderRadius: 999,

            backgroundColor:
                'rgba(168,85,247,0.10)',
        },

        bottomRadiant: {
            position: 'absolute',

            bottom: -220,

            right: -160,

            width: 460,

            height: 460,

            borderRadius: 999,

            backgroundColor:
                'rgba(120,60,255,0.08)',
        },

        buttonGlow: {
            // position: 'absolute',

            // left: 56,

            // right: 56,

            // bottom: 34,

            // height: 54,

            // borderRadius: 999,

            // backgroundColor:
            //     '#a855f7',
        },
    });