# Solución del Crash "SleepGuard Keeps Stopping"

## 🐛 Problema Original

Al activar el toggle para iniciar el monitoreo, la app se cerraba con el mensaje:
```
SleepGuard Keeps stopping
```

## 🔍 Causa Raíz

El crash fue causado por **conflictos entre dos librerías de background service**:

1. **react-native-background-actions**: Intentaba crear un foreground service usando su propio método
2. **@notifee/react-native**: También gestiona foreground services a través de notificaciones

### Problema específico:
En `InactivityService.ts`, el método `backgroundTask` tenía un `Promise` que nunca se resolvía:

```typescript
private backgroundTask = async (_taskData: any) => {
    await new Promise(async () => {  // ❌ Promise sin resolver
        // ... código
    });
};
```

Esto causaba que el servicio se quedara bloqueado y Android lo terminara forzosamente.

## ✅ Solución Implementada

### 1. Simplificar arquitectura
- ❌ Removido: `react-native-background-actions`
- ✅ Mantenido: Solo `@notifee/react-native`

### 2. Usar notificación como foreground service
La clave está en usar la propiedad `asForegroundService: true`:

```typescript
await notifee.displayNotification({
    id: 'sleepguard-monitoring',
    title: '🛡️ SleepGuard Active',
    body: 'Monitoring...',
    android: {
        channelId: 'sleepguard-service',
        asForegroundService: true,  // 🔑 Esto mantiene el servicio activo
        ongoing: true,              // No se puede deslizar para cerrar
        autoCancel: false,
        // ...
    },
});
```

### 3. Simplificar el servicio
Ahora `InactivityService` funciona así:

```typescript
public async start(options: ServiceOptions): Promise<void> {
    // 1. Mostrar notificación foreground
    await this.showServiceNotification();
    
    // 2. Escuchar cambios en AppState
    this.appStateSubscription = AppState.addEventListener('change', ...);
    
    // 3. Iniciar timer de verificación
    this.checkInterval = setInterval(() => {
        this.checkInactivity();
    }, 10000);
    
    this.isRunning = true;
}
```

### 4. Agregar manejo de errores
Todos los métodos críticos ahora tienen try-catch:

```typescript
private async showServiceNotification() {
    try {
        await this.createNotificationChannel();
        await notifee.displayNotification({...});
    } catch (error) {
        console.error('[SleepGuard] Error showing notification:', error);
    }
}
```

### 5. Implementar listeners de eventos
Para manejar acciones de notificación (como botón Stop):

```typescript
private setupNotificationHandler() {
    // Cuando la app está en foreground
    notifee.onForegroundEvent(({ type, detail }) => {
        if (type === EventType.ACTION_PRESS && 
            detail.pressAction?.id === 'stop-service') {
            this.stop();
        }
    });

    // Cuando la app está en background
    notifee.onBackgroundEvent(async ({ type, detail }) => {
        if (type === EventType.ACTION_PRESS && 
            detail.pressAction?.id === 'stop-service') {
            await this.stop();
        }
    });
}
```

## 🎯 Resultado

Ahora el servicio:
- ✅ Inicia correctamente sin crash
- ✅ Muestra notificación persistente
- ✅ Monitorea inactividad cada 10 segundos
- ✅ Actualiza la notificación con tiempo restante
- ✅ Funciona en background
- ✅ Responde al botón Stop de la notificación
- ✅ Detecta cambios en AppState (actividad del usuario)

## 🔧 Comandos Ejecutados

```bash
# 1. Remover librería conflictiva
pnpm remove react-native-background-actions

# 2. Limpiar build
cd android && ./gradlew clean && cd ..

# 3. Reconstruir app
pnpm android
```

## 📊 Comparación

### Antes (con crash):
```
App → Toggle ON 
  → BackgroundService.start() 
  → Promise sin resolver 
  → Android timeout 
  → CRASH ❌
```

### Ahora (estable):
```
App → Toggle ON 
  → notifee.displayNotification({ asForegroundService: true })
  → Servicio activo en foreground 
  → setInterval() monitorea cada 10s 
  → Funciona correctamente ✅
```

## 🚀 Próximos Pasos

Ahora que el servicio es estable, podemos:

1. **Solicitar permisos en runtime**
   - POST_NOTIFICATIONS (Android 13+)
   - Ignorar optimización de batería

2. **Implementar home button press**
   - Accessibility Service
   - Native module

3. **Mejorar detección de actividad**
   - Touch events globales
   - Sensores de movimiento

4. **Persistir estado**
   - AsyncStorage para configuración
   - Restaurar servicio al reiniciar app

## 📝 Lecciones Aprendidas

1. **Evitar múltiples librerías** para la misma funcionalidad
2. **notifee es suficiente** para foreground services simples
3. **Siempre revisar Promises** - deben resolverse o rechazarse
4. **Try-catch crítico** en operaciones asíncronas con servicios nativos
5. **Logs abundantes** facilitan debugging de servicios background

## 🔗 Referencias

- [Notifee - Foreground Service](https://notifee.app/react-native/docs/android/foreground-service)
- [Android Foreground Services](https://developer.android.com/develop/background-work/services/foreground-services)
- [React Native AppState](https://reactnative.dev/docs/appstate)
