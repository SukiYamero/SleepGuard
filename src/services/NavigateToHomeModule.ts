import { NativeModules } from 'react-native';

const { NavigateToHomeModule } = NativeModules;

if (!NavigateToHomeModule) {
    console.error('[NavigateToHome] ❌ Native module not found. Please rebuild the app.');
}

class NavigateToHomeService {
    /**
     * Navigate the device to the home screen
     * @returns Promise<boolean> - true if navigation was successful
     */
    async goToHome(): Promise<boolean> {
        if (!NavigateToHomeModule) {
            console.error('[NavigateToHome] ❌ CRITICAL: Native module not available');
            console.error('[NavigateToHome] ❌ Please rebuild the app with: pnpm run android');
            return false;
        }

        try {
            console.log('[NavigateToHome] 🏠 Navigating to home screen...');
            const result = await NavigateToHomeModule.goToHome();
            console.log('[NavigateToHome] ✅ Successfully navigated to home');
            return result;
        } catch (error) {
            console.error('[NavigateToHome] ❌ CRITICAL: Error navigating to home:', error);
            console.error('[NavigateToHome] ❌ This may indicate a system-level issue');
            return false;
        }
    }
}

export default new NavigateToHomeService();
