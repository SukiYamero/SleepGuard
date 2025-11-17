# Foreground Service Configuration

## 📦 Librería Utilizada

### @notifee/react-native (v9.1.8)
Librería moderna para notificaciones locales y gestión de foreground services.

**Características:**
- ✅ Notificaciones locales avanzadas con foreground service
- ✅ Canales de notificación personalizables
- ✅ Estilos de notificación (BigText, BigPicture, etc.)
- ✅ Acciones en notificaciones (botones interactivos)
- ✅ Soporte completo para Android 13+ y 14+
- ✅ Notificaciones persistentes para mantener servicio activo

## ⚙️ Configuración Android

### Permisos agregados en AndroidManifest.xml:
```xml
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_SPECIAL_USE" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
<uses-permission android:name="android.permission.WAKE_LOCK" />
```

**Descripción de permisos:**
- `FOREGROUND_SERVICE`: Requerido para ejecutar foreground services
- `FOREGROUND_SERVICE_SPECIAL_USE`: Para Android 14+ (API 34+), permite casos de uso especiales
- `POST_NOTIFICATIONS`: Para Android 13+ (API 33+), permite mostrar notificaciones
- `WAKE_LOCK`: Mantiene el CPU activo mientras el servicio corre

## 🏗️ Arquitectura

### InactivityService (Singleton)
Ubicación: `src/services/InactivityService.ts`

**Responsabilidades:**
1. Gestionar el ciclo de vida del foreground service
2. Monitorear el tiempo de inactividad
3. Mostrar y actualizar notificaciones
4. Detectar cambios en el estado de la app
5. Ejecutar callback cuando se detecta inactividad

**Métodos principales:**
```typescript
await InactivityService.start({ timeoutMinutes, onInactivityDetected })
await InactivityService.stop()
await InactivityService.updateTimeout(minutes)
InactivityService.resetActivity()
InactivityService.isServiceRunning()
```

**Características clave:**
- Usa notifee con `asForegroundService: true` para mantener servicio activo
- Registra listeners de eventos de notificación (onForegroundEvent, onBackgroundEvent)
- Monitorea AppState para detectar actividad del usuario
- Actualiza notificación cada 10 segundos con tiempo restante
- Ejecuta callback cuando se alcanza el timeout

### useInactivityMonitoring Hook
Ubicación: `src/hooks/useInactivityMonitoring.ts`

**Propósito:** Facilitar el uso del servicio en componentes React

**Retorna:**
```typescript
{
  isMonitoring: boolean,           // Estado actual del servicio
  timeoutMinutes: number,          // Tiempo configurado
  startMonitoring: () => Promise,  // Iniciar monitoreo
  stopMonitoring: () => Promise,   // Detener monitoreo
  updateTimeout: (min) => Promise, // Cambiar timeout
  resetActivity: () => void        // Resetear temporizador
}
```

## 🔄 Flujo de Funcionamiento

1. **Usuario activa el toggle** → `startMonitoring()` se ejecuta
2. **Servicio inicia** → Se muestra notificación persistente
3. **Monitoreo activo** → Cada 10 segundos verifica inactividad
4. **Cambio de estado de app** → `AppState` listener resetea el timer
5. **Timeout alcanzado** → Se ejecuta `onInactivityDetected()`
6. **Timer se resetea** → Continúa monitoreando

## 📊 Notificación del Servicio

La notificación muestra:
- 🛡️ Título: "SleepGuard Active"
- ⏱️ Tiempo restante en tiempo real
- ⏸️ Botón "Stop" para detener el servicio
- 🔵 Color de acento: #3b82f6 (azul)
- 📱 Prioridad: LOW (no molesta al usuario)

## 🎯 Próximos Pasos

### 1. Implementar Home Button Press
Necesitamos crear un módulo nativo o usar Accessibility Services para:
- Simular presión del botón Home
- Funciona incluso cuando la app está en background

Opciones:
- ✅ Accessibility Service (recomendado)
- ⚠️ Módulo nativo con `performGlobalAction()`

### 2. Solicitar Permisos en Runtime
Para Android 13+, necesitamos solicitar:
```typescript
import { PermissionsAndroid } from 'react-native';

// Solicitar permiso de notificaciones
const granted = await PermissionsAndroid.request(
  PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
);
```

### 3. Optimizar Detección de Actividad
Actualmente usa `AppState.addEventListener`. Mejorar con:
- Touch events globales
- Sensor de movimiento (acelerómetro)
- Screen on/off events

### 4. Persistencia de Estado
Guardar configuración en AsyncStorage:
- Último timeout configurado
- Estado del servicio al cerrar app
- Preferencias del usuario

## 🧪 Testing

### Probar el servicio:
```bash
pnpm android
```

1. Activar el toggle
2. Verificar que aparece la notificación
3. Poner la app en background
4. Esperar el timeout configurado
5. Verificar que se detecta la inactividad

### Comandos útiles:
```bash
# Ver logs del servicio
npx react-native log-android | grep SleepGuard

# Limpiar y reconstruir
cd android && ./gradlew clean && cd ..
pnpm android

# Ver notificaciones activas
adb shell dumpsys notification
```

## 📝 Notas Importantes

1. **Restricciones de batería:** En algunos dispositivos, el usuario debe desactivar la optimización de batería para la app
2. **Android 14+:** Requiere declarar el tipo de foreground service (SPECIAL_USE en nuestro caso)
3. **Notificación persistente:** Es obligatoria mientras el foreground service esté activo
4. **Performance:** El check cada 10 segundos es un balance entre precisión y consumo de batería

## 🔗 Recursos

- [react-native-background-actions](https://github.com/rn-versions/react-native-background-actions)
- [Notifee Documentation](https://notifee.app/)
- [Android Foreground Services](https://developer.android.com/develop/background-work/services/foreground-services)
- [Accessibility Services](https://developer.android.com/guide/topics/ui/accessibility/service)
