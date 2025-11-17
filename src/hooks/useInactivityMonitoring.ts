import { useState, useEffect, useCallback } from 'react';
import { Platform, Alert, PermissionsAndroid } from 'react-native';
import InactivityService from '../services/InactivityService';

export const useInactivityMonitoring = () => {
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [timeoutMinutes, setTimeoutMinutes] = useState(1);

    useEffect(() => {
        // Check initial state
        setIsMonitoring(InactivityService.isServiceRunning());

        // Cleanup on unmount
        return () => {
            if (InactivityService.isServiceRunning()) {
                InactivityService.stop().catch(console.error);
            }
        };
    }, []);

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
    }, [timeoutMinutes, handleInactivityDetected, handleServiceStopped, requestNotificationPermission]);

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
        startMonitoring,
        stopMonitoring,
        updateTimeout,
        resetActivity,
    };
};
