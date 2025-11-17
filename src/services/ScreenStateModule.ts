import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const { ScreenStateModule } = NativeModules;

interface ScreenStateEvents {
    onScreenOn: () => void;
    onScreenOff: () => void;
    onUserPresent: () => void;
    onAccessibilityActivity?: () => void;
}

class ScreenStateService {
    private eventEmitter: NativeEventEmitter | null = null;
    private listeners: Array<any> = [];

    constructor() {
        if (Platform.OS === 'android' && ScreenStateModule) {
            this.eventEmitter = new NativeEventEmitter(ScreenStateModule);
        } else if (Platform.OS === 'android' && !ScreenStateModule) {
            console.warn('[ScreenState] ⚠️ Native module not found. Please rebuild the app.');
        }
    }

    startListening(callbacks: ScreenStateEvents) {
        if (!this.eventEmitter || Platform.OS !== 'android') {
            console.warn('[ScreenState] Not available on this platform');
            return;
        }

        if (!ScreenStateModule) {
            console.error('[ScreenState] ❌ Native module not available. Cannot start listening.');
            return;
        }

        try {
            // Start native listener
            ScreenStateModule.startListening();

            // Subscribe to events
            const screenOnListener = this.eventEmitter.addListener(
                'onScreenOn',
                callbacks.onScreenOn
            );

            const screenOffListener = this.eventEmitter.addListener(
                'onScreenOff',
                callbacks.onScreenOff
            );

            const userPresentListener = this.eventEmitter.addListener(
                'onUserPresent',
                callbacks.onUserPresent
            );

            const accessibilityListener = callbacks.onAccessibilityActivity
                ? this.eventEmitter.addListener(
                    'onAccessibilityActivity',
                    callbacks.onAccessibilityActivity
                )
                : null;

            this.listeners.push(screenOnListener, screenOffListener, userPresentListener);
            if (accessibilityListener) {
                this.listeners.push(accessibilityListener);
            }
            console.log('[ScreenState] Started listening to screen events');
        } catch (error) {
            console.error('[ScreenState] Error starting listener:', error);
        }
    }

    stopListening() {
        if (!this.eventEmitter || Platform.OS !== 'android') {
            return;
        }

        if (!ScreenStateModule) {
            console.error('[ScreenState] ❌ Native module not available.');
            return;
        }

        try {
            // Remove all listeners
            this.listeners.forEach(listener => listener.remove());
            this.listeners = [];

            // Stop native listener
            ScreenStateModule.stopListening();
            console.log('[ScreenState] Stopped listening to screen events');
        } catch (error) {
            console.error('[ScreenState] Error stopping listener:', error);
        }
    }
}

export default new ScreenStateService();
