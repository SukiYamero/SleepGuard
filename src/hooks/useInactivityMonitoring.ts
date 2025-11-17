import { useState, useEffect, useCallback, useRef } from 'react';
import { Platform, Alert, PermissionsAndroid, AppState, AppStateStatus } from 'react-native';
import { useTranslation } from 'react-i18next';
import InactivityService from '../services/InactivityService';
import AccessibilityService from '../services/AccessibilityService';

export interface AlertConfig {
    visible: boolean;
    title: string;
    message: string;
    icon?: string;
    benefits?: string[];
    steps?: string[];
    buttons: Array<{
        text: string;
        onPress: () => void;
        style?: 'default' | 'cancel' | 'destructive';
    }>;
}

export const useInactivityMonitoring = () => {
    const { t } = useTranslation();
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [timeoutMinutes, setTimeoutMinutes] = useState(1);
    const [accessibilityEnabled, setAccessibilityEnabled] = useState(false);
    const [alertConfig, setAlertConfig] = useState<AlertConfig>({
        visible: false,
        title: '',
        message: '',
        benefits: [],
        steps: [],
        buttons: [],
    });
    const appState = useRef<AppStateStatus>(AppState.currentState);

    const checkAccessibilityStatus = useCallback(async () => {
        try {
            const enabled = await AccessibilityService.isEnabled();
            setAccessibilityEnabled(enabled);
            return enabled;
        } catch (error) {
            console.warn('[Hook] Could not check accessibility status:', error);
            setAccessibilityEnabled(false);
            return false;
        }
    }, []);

    useEffect(() => {
        setIsMonitoring(InactivityService.isServiceRunning());

        checkAccessibilityStatus();

        return () => {
            if (InactivityService.isServiceRunning()) {
                InactivityService.stop().catch(console.error);
            }
        };
    }, [checkAccessibilityStatus]);

    // Monitor app state to detect when user returns from Settings
    useEffect(() => {
        const subscription = AppState.addEventListener('change', async (nextAppState: AppStateStatus) => {
            // Detect when app comes to foreground
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                console.log('[Hook] App came to foreground - checking accessibility status');

                // If monitoring is enabled, check if accessibility is still granted
                if (isMonitoring) {
                    const isAccessibilityStillEnabled = await checkAccessibilityStatus();

                    if (!isAccessibilityStillEnabled) {
                        console.log('[Hook] User returned without enabling accessibility - stopping monitoring');
                        // User went to Settings but didn't enable accessibility
                        await InactivityService.stop();
                        setIsMonitoring(false);
                    } else {
                        console.log('[Hook] Accessibility is enabled - monitoring continues');
                    }
                }
            }

            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, [isMonitoring, checkAccessibilityStatus]);

    const handleInactivityDetected = useCallback(async () => {
        console.log('[Hook] ⏰ Inactivity detected! Navigating to home and stopping service...');

        // Stop the monitoring service
        await InactivityService.stop();
        setIsMonitoring(false);
    }, []);

    const handleServiceStopped = useCallback(() => {
        console.log('[Hook] Service stopped externally (from notification)');
        setIsMonitoring(false);
    }, []);

    const requestNotificationPermission = useCallback(async (): Promise<boolean> => {
        if (Platform.OS !== 'android') {
            return true;
        }

        // (API 33) and above requires explicit notification permission
        if (Platform.Version >= 33) {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
                    {
                        title: 'SleepGuard Needs Notification Permission',
                        message: 'SleepGuard needs to show notifications to run in the background and monitor inactivity.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );

                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('[Hook] Notification permission granted');
                    return true;
                } else {
                    console.log('[Hook] Notification permission denied');
                    Alert.alert(
                        'Permission Required',
                        'SleepGuard needs notification permission to work in the background. Please enable it in Settings.',
                        [{ text: 'OK' }]
                    );
                    return false;
                }
            } catch (err) {
                console.warn('[Hook] Error requesting notification permission:', err);
                return false;
            }
        }

        return true; // Android < 13 doesn't need runtime permission
    }, []);

    const startMonitoring = useCallback(async () => {
        if (Platform.OS !== 'android') {
            Alert.alert(
                'Not Supported',
                'Background monitoring is only available on Android.'
            );
            return;
        }

        const isAccessibilityEnabled = await checkAccessibilityStatus();

        if (!isAccessibilityEnabled) {
            setAlertConfig({
                visible: true,
                title: t('accessibility.permissionTitle'),
                message: t('accessibility.permissionMessage'),
                icon: '👆',
                benefits: [
                    t('accessibility.benefit1'),
                    t('accessibility.benefit2'),
                ],
                steps: [
                    t('accessibility.step1'),
                    t('accessibility.step2', { appName: t('appName') }),
                    t('accessibility.step3'),
                ],
                buttons: [
                    {
                        text: t('accessibility.enableButton'),
                        onPress: async () => {
                            setAlertConfig(prev => ({ ...prev, visible: false }));
                            try {
                                await AccessibilityService.openSettings();
                            } catch (error) {
                                console.error('[Hook] Could not open accessibility settings:', error);
                            }
                        },
                        style: 'default',
                    },
                    {
                        text: t('accessibility.remindLater'),
                        onPress: () => {
                            console.log('[Hook] User chose to remind later - stopping monitoring');
                            setAlertConfig(prev => ({ ...prev, visible: false }));
                            // Ensure toggle goes back to OFF if user declined
                            setIsMonitoring(false);
                        },
                        style: 'cancel',
                    },
                ],
            });
            // Don't start the service without accessibility permission
            return;
        }

        // Only proceed if accessibility is enabled
        try {
            const hasPermission = await requestNotificationPermission();
            if (!hasPermission) {
                return;
            }

            await InactivityService.start({
                timeoutMinutes,
                onInactivityDetected: handleInactivityDetected,
                onServiceStopped: handleServiceStopped,
            });
            setIsMonitoring(true);
        } catch (error) {
            console.error('[Hook] Failed to start monitoring:', error);
            Alert.alert(
                'Error',
                'Failed to start background monitoring. Please check permissions.'
            );
        }
    }, [timeoutMinutes, handleInactivityDetected, handleServiceStopped, requestNotificationPermission, t, checkAccessibilityStatus]);

    const stopMonitoring = useCallback(async () => {
        try {
            await InactivityService.stop();
            setIsMonitoring(false);
        } catch (error) {
            console.error('[Hook] Failed to stop monitoring:', error);
            Alert.alert('Error', 'Failed to stop monitoring.');
        }
    }, []);

    const updateTimeout = useCallback(
        async (minutes: number) => {
            setTimeoutMinutes(minutes);
            if (isMonitoring) {
                await InactivityService.updateTimeout(minutes);
            }
        },
        [isMonitoring]
    );

    const resetActivity = useCallback(() => {
        InactivityService.resetActivity();
    }, []);

    return {
        isMonitoring,
        timeoutMinutes,
        accessibilityEnabled,
        alertConfig,
        startMonitoring,
        stopMonitoring,
        updateTimeout,
        resetActivity,
        checkAccessibilityStatus,
    };
};
