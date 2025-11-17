import { NativeModules, Platform } from 'react-native';

const { AccessibilityModule } = NativeModules;

class AccessibilityService {
    async isEnabled(): Promise<boolean> {
        if (Platform.OS !== 'android') {
            return false;
        }

        if (!AccessibilityModule) {
            console.warn('[Accessibility] ⚠️ Native module not found. Please rebuild the app.');
            return false;
        }

        try {
            return await AccessibilityModule.isAccessibilityServiceEnabled();
        } catch (error) {
            console.error('[Accessibility] Error checking service status:', error);
            return false;
        }
    }

    async openSettings(): Promise<boolean> {
        if (Platform.OS !== 'android') {
            return false;
        }

        if (!AccessibilityModule) {
            console.error('[Accessibility] ❌ Native module not available. Cannot open settings.');
            return false;
        }

        try {
            return await AccessibilityModule.openAccessibilitySettings();
        } catch (error) {
            console.error('[Accessibility] Error opening settings:', error);
            return false;
        }
    }
}

export default new AccessibilityService();
