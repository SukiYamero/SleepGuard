export default {
    translation: {
        // Header
        appName: 'Inactivity Shield',
        help: '?',

        // Main screen
        inactivityDetection: 'Detección de\nInactividad',
        monitoringActive: 'El monitoreo se está ejecutando en segundo plano.',
        monitoringInactive: 'El monitoreo está desactivado.',

        // Settings
        settings: 'Ajustes',
        returnToHomeLabel: 'Volver al inicio tras inactividad',
        minutes: 'min',
        hintText: 'La app volverá al home después de {{minutes}} minuto(s) sin actividad.\nTu dispositivo se apagará según su configuración normal.',

        // FAQ Modal
        howItWorks: 'ℹ️ Cómo funciona?',
        close: '✕',

        // FAQ Questions
        faq: {
            whatDoesItDo: {
                question: '¿Qué hace esta app?',
                answer: '• La app detecta cuando no tocas la pantalla\n• Después del tiempo configurado, presiona el botón Home\n• Tu dispositivo se apagará según su configuración normal',
            },
            worksInBackground: {
                question: '¿Funciona en segundo plano?',
                answer: 'Sí, el servicio se ejecuta en segundo plano mientras la app esté activa. Monitorea continuamente la actividad táctil de tu dispositivo.',
            },
            batteryConsumption: {
                question: '¿Consume mucha batería?',
                answer: 'No, la app está optimizada para consumir mínimos recursos. De hecho, ayuda a ahorrar batería al apagar tu dispositivo automáticamente.',
            },
            permissions: {
                question: '¿Qué permisos necesita?',
                answer: 'La app requiere permisos de accesibilidad para detectar la inactividad y simular la pulsación del botón Home.',
            },
        },

        // Practical Example
        practicalExample: '💡 Ejemplo práctico',
        exampleScenario: '🎮 Escenario: Jugando antes de dormir',
        exampleSteps: {
            step1: 'Estás jugando en tu tablet a las 11 PM',
            step2: 'Te quedas dormido sin cerrar el juego',
            step3: 'Después de {{minutes}} minutos sin tocar la pantalla, Inactivity Shield detecta la inactividad',
            step4: 'La app presiona automáticamente el botón Home',
            step5: 'Tu tablet se apaga según su configuración (ej: después de 2 minutos en home)',
        },
        exampleResult: '¡Tu batería está protegida! Sin esta app, el juego habría seguido funcionando toda la noche.',

        // Footer
        version: 'Versión {{version}}',
        appDescription: 'Protege la batería de tu dispositivo',
        copyright: '© 2025',
    },
};
