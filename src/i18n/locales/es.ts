export default {
    translation: {
        // Header
        appName: 'SleepGuard',
        appNameFull: 'SleepGuard: Gaming Battery Saver',
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
        howItWorks: '💬 ¿Cómo funciona?',
        close: '×',

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
            accessibilityPermission: {
                question: '🔐 ¿Por qué necesita acceso de Accesibilidad?',
                answer: 'SleepGuard necesita este permiso para:\n\n' +
                    '• Detectar cuando tocas o deslizas la pantalla\n' +
                    '• Saber si estás usando otras apps\n' +
                    '• Identificar correctamente tu inactividad\n\n' +
                    'IMPORTANTE: Este permiso es por app, NO es global. Solo SleepGuard puede detectar tu actividad, no afecta otras apps.\n\n' +
                    '📱 Cómo activarlo:\n' +
                    '1. Ve a Ajustes → Accesibilidad\n' +
                    '2. Busca "Servicios instalados" o "Servicios descargados"\n' +
                    '3. Selecciona "SleepGuard"\n' +
                    '4. Activa el interruptor\n' +
                    '5. Confirma cuando Android te pregunte\n\n' +
                    '🔓 Cómo desactivarlo:\n' +
                    'Sigue los mismos pasos y desactiva el interruptor. Puedes activarlo y desactivarlo cuando quieras.',
            },
        },

        // Accessibility Service
        accessibility: {
            permissionTitle: 'Activar Detección de Actividad',
            permissionMessage: 'Para identificar correctamente tu inactividad, la app necesita detectar cuando interactúas con tu dispositivo (toques, deslizamientos, etc.).',
            benefit1: 'Detecta actividad en todas las apps',
            benefit2: 'Funciona en segundo plano',
            step1: 'Toca "Activar Ahora" para abrir Ajustes',
            step2: 'Busca "{{appName}}" en la lista',
            step3: 'Activa el interruptor',
            enableButton: 'Activar Ahora',
            remindLater: 'Recordar Después',
        },

        // Practical Example
        practicalExample: '💡 Ejemplo práctico',
        exampleScenario: '🎮 Escenario: Jugando antes de dormir',
        exampleSteps: {
            step1: 'Estás jugando en tu tablet a las 11 PM',
            step2: 'Te quedas dormido sin cerrar el juego',
            step3: 'Después de {{minutes}} minutos sin tocar la pantalla, SleepGuard detecta la inactividad',
            step4: 'La app presiona automáticamente el botón Home',
            step5: 'Tu tablet se apaga según su configuración (ej: después de 2 minutos en home)',
        },
        exampleResult: '¡Tu batería está protegida! Sin esta app, el juego habría seguido funcionando toda la noche.',

        // Footer
        version: 'Versión {{version}}',
        appDescription: 'Auto-bloquea tu dispositivo tras inactividad. Ahorra batería mientras juegas o duermes.',
        copyright: '© 2025 Sukiyamero',
    },
};
