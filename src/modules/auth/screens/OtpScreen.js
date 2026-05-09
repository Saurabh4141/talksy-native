import React, {
    useEffect,
    useRef,
    useState,
} from 'react';

import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
} from 'react-native';

import {
    colors,
    spacing,
    typography,
    radius,
} from '../../../theme';

import {
    verifyOtp,
    requestOtp,
} from '../../../services/auth.service';

import useAuth from '../../../hooks/useAuth';

const LENGTH = 4;

export default function OtpScreen({
    navigation,
    route,
}) {
    /**
     * Route params
     */
    const {
        phone_number,
    } = route.params;

    /**
     * Auth
     */
    const { login } = useAuth();

    /**
     * State
     */
    const [digits, setDigits] =
        useState(
            Array(LENGTH).fill(''),
        );

    const [status, setStatus] =
        useState(null);

    const [verifying, setVerifying] =
        useState(false);

    const [resending, setResending] =
        useState(false);

    const [resendIn, setResendIn] =
        useState(25);

    /**
     * Input refs
     */
    const refs = useRef([]);

    /**
     * Focus first input
     */
    useEffect(() => {
        refs.current[0]?.focus();
    }, []);

    /**
     * Resend timer
     */
    useEffect(() => {
        if (resendIn <= 0) {
            return;
        }

        const timer = setInterval(() => {
            setResendIn((prev) =>
                prev - 1,
            );
        }, 1000);

        return () =>
            clearInterval(timer);
    }, [resendIn]);

    /**
     * Auto verify
     */
    useEffect(() => {
        const code =
            digits.join('');

        if (
            code.length === LENGTH &&
            !verifying
        ) {
            handleVerify(code);
        }
    }, [digits, verifying]);

    /**
     * Update digit
     */
    function setDigitAt(
        index,
        value,
    ) {
        const cleaned = value.replace(
            /\D/g,
            '',
        );

        /**
         * Handle paste
         */
        if (cleaned.length > 1) {
            handlePaste(cleaned);

            return;
        }

        /**
         * Update digits
         */
        setDigits((prev) => {
            const next = [...prev];

            next[index] = cleaned;

            return next;
        });

        /**
         * Move next
         */
        if (
            cleaned &&
            index < LENGTH - 1
        ) {
            refs.current[
                index + 1
            ]?.focus();
        }

        /**
         * Clear old errors
         */
        if (
            status?.type === 'error'
        ) {
            setStatus(null);
        }
    }

    /**
     * Handle paste
     */
    function handlePaste(text) {
        const arr = text
            .replace(/\D/g, '')
            .slice(0, LENGTH)
            .split('');

        const next =
            Array(LENGTH).fill('');

        arr.forEach(
            (digit, index) => {
                next[index] = digit;
            },
        );

        setDigits(next);

        refs.current[
            Math.min(
                arr.length,
                LENGTH - 1,
            )
        ]?.focus();
    }

    /**
     * Verify OTP
     */
    async function handleVerify(
        code,
    ) {
        /**
         * Prevent duplicate requests
         */
        if (verifying) {
            return;
        }

        try {
            /**
             * Reset status
             */
            setStatus(null);

            setVerifying(true);

            setStatus({
                type: 'info',
                msg: 'Verifying…',
            });

            /**
             * Verify API
             */
            const response =
                await verifyOtp({
                    phone_number,

                    otp_code: code,
                });

            /**
             * Login user
             */
            await login({
                token:
                    response.data.token,

                user:
                    response.data.user,
            });

            /**
             * Success state
             */
            setStatus({
                type: 'success',
                msg: 'Connected 💜',
            });

            /**
             * RootNavigator
             * automatically reroutes
             */
        } catch (err) {
            console.log(
                'verifyOtp error:',
                err,
            );

            const message =
                err?.message ||
                'Verification failed';

            setStatus({
                type: 'error',
                msg: message,
            });

            /**
             * Reset fields
             */
            setDigits(
                Array(LENGTH).fill(''),
            );

            refs.current[0]?.focus();


        } finally {
            setVerifying(false);
        }
    }

    /**
     * Resend OTP
     */
    async function resend() {
        /**
         * Protection
         */
        if (
            resendIn > 0 ||
            resending
        ) {
            return;
        }

        try {
            setResending(true);

            /**
             * Request OTP
             */
            await requestOtp(
                phone_number,
            );

            /**
             * Reset fields
             */
            setDigits(
                Array(LENGTH).fill(''),
            );

            setStatus({
                type: 'info',
                msg: 'New code sent ✨',
            });

            setResendIn(25);

            refs.current[0]?.focus();

            setTimeout(() => {
                setStatus(null);
            }, 1800);
        } catch (err) {
            console.log(
                'resendOtp error:',
                err,
            );

            setStatus({
                type: 'error',
                msg:
                    err?.message ||
                    'Failed to resend OTP',
            });
        } finally {
            setResending(false);
        }
    }

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
                    Almost there…
                </Text>

                {/* Subtitle */}
                <Text
                    style={styles.subtitle}
                >
                    Bas ek second…
                    tumse connect ho
                    raha hoon 💜
                </Text>

                {/* Phone */}
                <View
                    style={styles.phoneRow}
                >
                    <Text
                        style={
                            styles.phoneText
                        }
                    >
                        +91 {phone_number}
                    </Text>

                    <Pressable
                        onPress={() =>
                            navigation.goBack()
                        }
                    >
                        <Text
                            style={
                                styles.changeText
                            }
                        >
                            Change
                        </Text>
                    </Pressable>
                </View>

                {/* OTP */}
                <View
                    style={
                        styles.otpContainer
                    }
                >
                    {digits.map(
                        (
                            digit,
                            index,
                        ) => (
                            <TextInput
                                key={index}
                                ref={(ref) => {
                                    refs.current[
                                        index
                                    ] = ref;
                                }}
                                value={digit}
                                onChangeText={(
                                    text,
                                ) =>
                                    setDigitAt(
                                        index,
                                        text,
                                    )
                                }
                                onKeyPress={(
                                    e,
                                ) => {
                                    if (
                                        e.nativeEvent
                                            .key ===
                                        'Backspace' &&
                                        !digit &&
                                        index > 0
                                    ) {
                                        refs.current[
                                            index - 1
                                        ]?.focus();
                                    }
                                }}
                                editable={
                                    !verifying
                                }
                                keyboardType="number-pad"
                                maxLength={1}
                                style={[
                                    styles.otpInput,

                                    status?.type ===
                                    'error' &&
                                    styles.errorInput,
                                ]}
                            />
                        ),
                    )}
                </View>

                {/* Status */}
                {status && (
                    <Text
                        style={[
                            styles.statusText,

                            status.type ===
                                'error'
                                ? styles.errorText
                                : styles.infoText,
                        ]}
                    >
                        {status.msg}
                    </Text>
                )}

                {/* Loader */}
                {verifying && (
                    <ActivityIndicator
                        size="small"
                        color={
                            colors.primary
                        }
                        style={
                            styles.loader
                        }
                    />
                )}

                {/* Resend */}
                <View
                    style={
                        styles.resendRow
                    }
                >
                    <Text
                        style={
                            styles.resendLabel
                        }
                    >
                        Didn't get it?
                    </Text>

                    <Pressable
                        onPress={resend}
                        disabled={
                            resendIn > 0 ||
                            resending
                        }
                    >
                        <Text
                            style={[
                                styles.resendButton,

                                (resendIn > 0 ||
                                    resending) &&
                                styles.resendDisabled,
                            ]}
                        >
                            {resending
                                ? 'Sending...'
                                : resendIn > 0
                                    ? `Resend in ${resendIn}s`
                                    : 'Resend'}
                        </Text>
                    </Pressable>
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

        phoneRow: {
            flexDirection: 'row',

            justifyContent:
                'center',

            alignItems: 'center',

            gap: spacing.md,

            marginTop: spacing.xl,
        },

        phoneText: {
            color:
                colors.textPrimary,

            fontSize:
                typography.sizes.sm,
        },

        changeText: {
            color:
                colors.primaryLight,

            fontSize:
                typography.sizes.xs,

            fontWeight:
                typography.weights
                    .bold,

            textTransform:
                'uppercase',
        },

        otpContainer: {
            flexDirection: 'row',

            justifyContent:
                'space-between',

            marginTop: spacing.xl,
        },

        otpInput: {
            width: '22%',

            aspectRatio: 1,

            borderRadius:
                radius.lg,

            borderWidth: 1,

            borderColor:
                colors.border,

            backgroundColor:
                'rgba(255,255,255,0.05)',

            textAlign: 'center',

            color:
                colors.textPrimary,

            fontSize:
                typography.sizes.xl,

            fontWeight:
                typography.weights
                    .bold,
        },

        errorInput: {
            borderColor: '#ef4444',
        },

        statusText: {
            marginTop: spacing.lg,

            textAlign: 'center',

            fontSize:
                typography.sizes.sm,
        },

        infoText: {
            color:
                colors.textSecondary,
        },

        errorText: {
            color: '#f87171',
        },

        loader: {
            marginTop: spacing.md,
        },

        resendRow: {
            flexDirection: 'row',

            justifyContent:
                'center',

            alignItems: 'center',

            gap: spacing.sm,

            marginTop: spacing.xxl,
        },

        resendLabel: {
            color:
                colors.textSecondary,

            fontSize:
                typography.sizes.sm,

            opacity: 0.7,
        },

        resendButton: {
            color:
                colors.primaryLight,

            fontSize:
                typography.sizes.sm,

            fontWeight:
                typography.weights
                    .bold,
        },

        resendDisabled: {
            opacity: 0.5,
        },
    });