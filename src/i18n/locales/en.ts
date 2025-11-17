export default {
    translation: {
        // Header
        appName: 'SleepGuard',
        appNameFull: 'SleepGuard: Gaming Battery Saver',
        help: '?',

        // Main screen
        inactivityDetection: 'Inactivity\nDetection',
        monitoringActive: 'Monitoring is running in the background.',
        monitoringInactive: 'Monitoring is disabled.',

        // Settings
        settings: 'Settings',
        returnToHomeLabel: 'Return to home after inactivity',
        minutes: 'min',
        hintText: 'The app will return to home after {{minutes}} minute(s) of inactivity.\nYour device will turn off according to its normal settings.',

        // FAQ Modal
        howItWorks: '💬 How does it work?',
        close: '×',

        // FAQ Questions
        faq: {
            whatDoesItDo: {
                question: 'What does this app do?',
                answer: '• The app detects when you don\'t touch the screen\n• After the configured time, it presses the Home button\n• Your device will turn off according to its normal settings',
            },
            worksInBackground: {
                question: 'Does it work in the background?',
                answer: 'Yes, the service runs in the background while the app is active. It continuously monitors touch activity on your device.',
            },
            batteryConsumption: {
                question: 'Does it consume a lot of battery?',
                answer: 'No, the app is optimized to consume minimal resources. In fact, it helps save battery by automatically turning off your device.',
            },
            permissions: {
                question: 'What permissions does it need?',
                answer: 'The app requires accessibility permissions to detect inactivity and simulate pressing the Home button.',
            },
            accessibilityPermission: {
                question: '🔐 Why does it need Accessibility access?',
                answer: 'SleepGuard needs this permission to:\n\n' +
                    '• Detect when you touch or swipe the screen\n' +
                    '• Know if you\'re using other apps\n' +
                    '• Correctly identify your inactivity\n\n' +
                    'IMPORTANT: This permission is per-app, NOT global. Only SleepGuard can detect your activity, it doesn\'t affect other apps.\n\n' +
                    '📱 How to enable it:\n' +
                    '1. Go to Settings → Accessibility\n' +
                    '2. Look for "Installed services" or "Downloaded services"\n' +
                    '3. Select "SleepGuard"\n' +
                    '4. Toggle the switch on\n' +
                    '5. Confirm when Android asks\n\n' +
                    '🔓 How to disable it:\n' +
                    'Follow the same steps and toggle the switch off. You can enable and disable it whenever you want.',
            },
        },

        // Accessibility Service
        accessibility: {
            permissionTitle: 'Enable Activity Detection',
            permissionMessage: 'To correctly identify your inactivity, the app needs to detect when you interact with your device (touches, swipes, etc.).',
            benefit1: 'Detects activity across all apps',
            benefit2: 'Works in the background',
            step1: 'Tap "Enable Now" to open Settings',
            step2: 'Find "App Name" in the list',
            step3: 'Toggle the switch on',
            enableButton: 'Enable Now',
            remindLater: 'Remind Later',
        },

        // Practical Example
        practicalExample: '💡 Practical Example',
        exampleScenario: '🎮 Scenario: Gaming before sleep',
        exampleSteps: {
            step1: 'You\'re playing on your tablet at 11 PM',
            step2: 'You fall asleep without closing the game',
            step3: 'After {{minutes}} minutes without touching the screen, SleepGuard detects inactivity',
            step4: 'The app automatically presses the Home button',
            step5: 'Your tablet turns off according to its settings (e.g., after 2 minutes on home)',
        },
        exampleResult: 'Your battery is protected! Without this app, the game would have kept running all night.',

        // Footer
        version: 'Version {{version}}',
        appDescription: 'Auto-lock your device after inactivity. Save battery while gaming or sleeping.',
        copyright: '© 2025 Sukiyamero',
    },
};
