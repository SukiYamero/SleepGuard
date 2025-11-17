import { useState, useEffect, useCallback } from 'react';
import { Platform, Alert, PermissionsAndroid } from 'react-native';
import { useTranslation } from 'react-i18next';
import InactivityService from '../services/InactivityService';
import AccessibilityService from '../services/AccessibilityService';

interface AlertConfig {
    visible: boolean;
    title: string;
    message: string;
    buttons: Array<{
        text: string;
        onPress: () => void;
        style?: 'default' | 'cancel' | 'primary';
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
        buttons: [],
    });

    useEffect(() => {
        // Check initial state
        setIsMonitoring(InactivityService.isServiceRunning());

        // Check accessibility service status
        checkAccessibilityStatus();

        // Cleanup on unmount
        return () => {
            if (InactivityService.isServiceRunning()) {
                InactivityService.stop().catch(console.error);
            }
        };
    }, []);

    const checkAccessibilityStatus = async () => {
        try {
            const enabled = await AccessibilityService.isEnabled();
            setAccessibilityEnabled(enabled);
            return enabled;
        } catch (error) {
            console.warn('[Hook] Could not check accessibility status:', error);
            setAccessibilityEnabled(false);
            return false;
        }
    };

    const handleInactivityDetected = useCallback(async () => {
        console.log('[Hook] Inactivity detected! Should navigate to home...');

        // Stop the monitoring service first
        await InactivityService.stop();
        setIsMonitoring(false);

        // TODO: Implement home button press logic
        // This will require additional native modules or accessibility services
        Alert.alert(
            '🏠 Inactivity Detected',
            'Simulating home button press...\n\nMonitoring has been stopped. Activate the toggle again to resume.',
            [{ text: 'OK' }]
        );
    }, []);

    const handleServiceStopped = useCallback(() => {
        console.log('[Hook] Service stopped externally (from notification)');
        setIsMonitoring(false);
    }, []);

    const requestNotificationPermission = useCallback(async (): Promise<boolean> => {
        if (Platform.OS !== 'android') {
            return true;
        }

        // Android 13 (API 33) and above requires explicit notification permission
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

        // Check accessibility service first
        const isAccessibilityEnabled = await checkAccessibilityStatus();

        if (!isAccessibilityEnabled) {
            setAlertConfig({
                visible: true,
                title: t('accessibilityRequired.title'),
                message: t('accessibilityRequired.message'),
                buttons: [
                    {
                        text: t('accessibilityRequired.remindLater'),
                        style: 'cancel',
                        onPress: () => {
                            console.log('[Hook] User chose to continue without accessibility');
                            setAlertConfig(prev => ({ ...prev, visible: false }));
                        }
                    },
                    {
                        text: t('accessibilityRequired.enableNow'),
                        style: 'primary',
                        onPress: async () => {
                            setAlertConfig(prev => ({ ...prev, visible: false }));
                            try {
                                await AccessibilityService.openSettings();
                            } catch (error) {
                                console.error('[Hook] Could not open accessibility settings:', error);
                            }
                        },
                    },
                ],
            });
            // Don't return - allow monitoring with fallback methods
        }

        try {
            // Request notification permission first (Android 13+)
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
    }, [timeoutMinutes, handleInactivityDetected, handleServiceStopped, requestNotificationPermission, t]);

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
