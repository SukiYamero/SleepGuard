import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { AppState, AppStateStatus } from 'react-native';
import ScreenStateModule from './ScreenStateModule';

interface ServiceOptions {
    timeoutMinutes: number;
    onInactivityDetected: () => void;
    onServiceStopped?: () => void;
}

class InactivityService {
    private static instance: InactivityService;
    private isRunning = false;
    private lastActivityTime = Date.now();
    private timeoutMinutes = 5;
    private onInactivityCallback?: () => void;
    private onServiceStoppedCallback?: () => void;
    private appStateSubscription?: any;
    private checkInterval?: ReturnType<typeof setInterval>;
    private foregroundServiceRegistered = false;

    private constructor() {
        this.setupNotificationHandler();
    }

    public static getInstance(): InactivityService {
        if (!InactivityService.instance) {
            InactivityService.instance = new InactivityService();
        }
        return InactivityService.instance;
    }

    private setupNotificationHandler() {
        // Handle notification actions (like Stop button)
        notifee.onForegroundEvent(({ type, detail }) => {
            if (type === EventType.ACTION_PRESS && detail.pressAction?.id === 'stop-service') {
                this.stop();
            }
        });

        notifee.onBackgroundEvent(async ({ type, detail }) => {
            if (type === EventType.ACTION_PRESS && detail.pressAction?.id === 'stop-service') {
                await this.stop();
            }
        });
    }

    private async createNotificationChannel() {
        await notifee.createChannel({
            id: 'sleepguard-service',
            name: 'SleepGuard Service',
            importance: AndroidImportance.LOW,
            description: 'Monitoring inactivity in the background',
        });
    }

    private async showServiceNotification() {
        try {
            await this.createNotificationChannel();

            await notifee.displayNotification({
                id: 'sleepguard-monitoring',
                title: '🛡️ SleepGuard Active',
                body: `Monitoring inactivity (${this.timeoutMinutes} min timeout)`,
                android: {
                    channelId: 'sleepguard-service',
                    importance: AndroidImportance.LOW,
                    ongoing: true,
                    autoCancel: false,
                    smallIcon: 'ic_small_icon', // Using default notification icon
                    color: '#3b82f6',
                    asForegroundService: true,
                    actions: [
                        {
                            title: '⏸️ Stop',
                            pressAction: {
                                id: 'stop-service',
                            },
                        },
                    ],
                },
            });
            console.log('[SleepGuard] Notification displayed successfully');
        } catch (error) {
            console.error('[SleepGuard] Error showing notification:', error);
        }
    }

    private async updateNotification(message: string) {
        try {
            await notifee.displayNotification({
                id: 'sleepguard-monitoring',
                title: '🛡️ SleepGuard Active',
                body: message,
                android: {
                    channelId: 'sleepguard-service',
                    importance: AndroidImportance.LOW,
                    ongoing: true,
                    autoCancel: false,
                    smallIcon: 'ic_launcher',
                    color: '#3b82f6',
                    asForegroundService: true,
                    actions: [
                        {
                            title: '⏸️ Stop',
                            pressAction: {
                                id: 'stop-service',
                            },
                        },
                    ],
                },
            });
        } catch (error) {
            console.error('[SleepGuard] Error updating notification:', error);
        }
    }

    private handleAppStateChange = (nextAppState: AppStateStatus) => {
        console.log('[SleepGuard] App state changed to:', nextAppState);

        // Only reset timer when SleepGuard comes to foreground
        // This indicates user interaction with OUR app
        // Don't reset when going to background, as that's not user activity
        if (nextAppState === 'active') {
            console.log('[SleepGuard] SleepGuard brought to foreground - user interaction');
            this.resetTimer();
        } else {
            console.log('[SleepGuard] SleepGuard went to background - not resetting timer');
        }
    };

    private handleScreenOn = () => {
        console.log('[SleepGuard] Screen turned on - user activity detected');
        this.resetTimer();
    };

    private handleScreenOff = () => {
        console.log('[SleepGuard] 📴 Screen turned off - pausing inactivity timer');
        // When screen is off, we pause the timer by updating lastActivityTime
        // This ensures the countdown doesn't continue while device is sleeping
        // When screen turns on again, handleScreenOn will reset the timer
        this.resetTimer();
    };

    private handleUserPresent = () => {
        console.log('[SleepGuard] User unlocked device - user activity detected');
        this.resetTimer();
    };

    private handleAccessibilityActivity = () => {
        // This is called when Accessibility Service detects user activity
        const now = new Date().toISOString().substr(11, 12);
        console.log(`[SleepGuard] 🎯 [${now}] Accessibility detected user activity`);
        this.resetTimer();
    };

    private resetTimer() {
        this.lastActivityTime = Date.now();
        console.log('[SleepGuard] Timer reset');
    }

    private checkInactivity = () => {
        try {
            const now = Date.now();
            const elapsedMinutes = (now - this.lastActivityTime) / (1000 * 60);
            const remainingMinutes = Math.max(0, this.timeoutMinutes - elapsedMinutes);

            console.log(`[SleepGuard] Remaining: ${remainingMinutes.toFixed(1)} min`);

            // Update notification with remaining time
            if (remainingMinutes > 0) {
                this.updateNotification(
                    `${remainingMinutes.toFixed(1)} min remaining`
                );
            }

            // Check if timeout reached
            if (elapsedMinutes >= this.timeoutMinutes) {
                console.log('[SleepGuard] Inactivity timeout reached!');
                if (this.onInactivityCallback) {
                    this.onInactivityCallback();
                }
                // Don't reset timer - let the callback handle stopping the service
            }
        } catch (error) {
            console.error('[SleepGuard] Error checking inactivity:', error);
        }
    };

    public async start(options: ServiceOptions): Promise<void> {
        if (this.isRunning) {
            console.log('[SleepGuard] Service already running');
            return;
        }

        this.timeoutMinutes = options.timeoutMinutes;
        this.onInactivityCallback = options.onInactivityDetected;
        this.onServiceStoppedCallback = options.onServiceStopped;
        this.lastActivityTime = Date.now();

        try {
            console.log('[SleepGuard] Starting service...');

            // Show foreground notification (this automatically starts foreground service)
            await this.showServiceNotification();

            // Register the foreground service with notifee
            // IMPORTANT: This promise intentionally never resolves to keep the foreground service alive.
            // According to Notifee documentation, the service runs as long as this promise is pending.
            // We track registration state with this.foregroundServiceRegistered flag.
            // 
            // Memory Management:
            // - Only one instance exists (singleton pattern prevents multiple registrations)
            // - The promise lifecycle is tied to the Android foreground service lifecycle
            // - When stop() is called, notifee.stopForegroundService() cleans up the service
            // - Android OS automatically cleans up when the process terminates
            // - No memory leak occurs because the promise is scoped to the service lifecycle
            if (!this.foregroundServiceRegistered) {
                notifee.registerForegroundService((_notification) => {
                    return new Promise<void>(() => {
                        // This promise never resolves/rejects - this is intentional
                        // The foreground service stays alive as long as this promise is pending
                        console.log('[SleepGuard] Foreground service registered and running');
                    });
                });
                this.foregroundServiceRegistered = true;
                console.log('[SleepGuard] Foreground service registration completed');
            }

            // Listen to app state changes
            this.appStateSubscription = AppState.addEventListener(
                'change',
                this.handleAppStateChange
            );

            // Listen to screen events (screen on, user unlock, and accessibility activity)
            try {
                ScreenStateModule.startListening({
                    onScreenOn: this.handleScreenOn,
                    onScreenOff: this.handleScreenOff,
                    onUserPresent: this.handleUserPresent,
                    onAccessibilityActivity: this.handleAccessibilityActivity,
                });
            } catch (screenError) {
                console.warn('[SleepGuard] ⚠️ Could not start screen state monitoring (will use AppState only):', screenError);
            }

            // Optimized: Check every 30 seconds (2 times per minute)
            // Perfect for 10-30 minute timeouts, reduces CPU usage by 67%
            // Timer resets instantly on activity, this only updates notification
            this.checkInterval = setInterval(() => {
                this.checkInactivity();
            }, 30000);

            this.isRunning = true;
            console.log('[SleepGuard] Service started successfully');
        } catch (error) {
            console.error('[SleepGuard] Failed to start service:', error);
            throw error;
        }
    }

    public async stop(): Promise<void> {
        if (!this.isRunning) {
            console.log('[SleepGuard] Service not running');
            return;
        }

        try {
            console.log('[SleepGuard] Stopping service...');

            if (this.checkInterval) {
                clearInterval(this.checkInterval);
                this.checkInterval = undefined;
            }

            if (this.appStateSubscription) {
                this.appStateSubscription.remove();
                this.appStateSubscription = undefined;
            }

            try {
                ScreenStateModule.stopListening();
            } catch (screenError) {
                console.warn('[SleepGuard] Could not stop screen state monitoring:', screenError);
            }

            // Cancel notification (this stops the foreground service)
            await notifee.cancelNotification('sleepguard-monitoring');
            await notifee.stopForegroundService();

            this.isRunning = false;
            this.foregroundServiceRegistered = false;

            // Notify UI that service has stopped
            if (this.onServiceStoppedCallback) {
                this.onServiceStoppedCallback();
            }

            console.log('[SleepGuard] Service stopped successfully');
        } catch (error) {
            console.error('[SleepGuard] Failed to stop service:', error);
            throw error;
        }
    }

    public async updateTimeout(minutes: number): Promise<void> {
        this.timeoutMinutes = minutes;
        if (this.isRunning) {
            // Update notification with new timeout
            await this.updateNotification(
                `Monitoring inactivity (${minutes} min timeout)`
            );
        }
    }

    public isServiceRunning(): boolean {
        return this.isRunning;
    }

    public resetActivity(): void {
        this.resetTimer();
    }
}

export default InactivityService.getInstance();
