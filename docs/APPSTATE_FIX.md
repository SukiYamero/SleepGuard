# 🔍 Fix: AppState vs Accessibility Service

## 🎯 Problema Reportado

**Escenario:**
1. Usuario abre app de Teléfono
2. Usuario minimiza la app de Teléfono (va a home o cambia a otra app)
3. ❌ El timer de inactividad NO se resetea

## 🔍 Análisis del Problema

### ¿Qué estaba pasando?

El código original tenía este comportamiento:

```typescript
private handleAppStateChange = (nextAppState: AppStateStatus) => {
    console.log('[SleepGuard] App state changed to:', nextAppState);
    this.resetTimer();  // ❌ Resetea en CUALQUIER cambio de estado
};
```

### ¿Por qué no funcionaba?

`AppState` de React Native solo detecta cambios en el **estado de NUESTRA app (SleepGuard)**, no de otras apps:

| Acción del Usuario | AppState de SleepGuard | ¿Timer se resetea? |
|-------------------|----------------------|-------------------|
| Abre SleepGuard | `inactive` → `active` | ✅ Sí (correcto) |
| Minimiza SleepGuard | `active` → `background` | ✅ Sí (incorrecto) |
| **Abre app Teléfono** | `background` (no cambia) | ❌ **No** (problema) |
| **Minimiza app Teléfono** | `background` (no cambia) | ❌ **No** (problema) |
| Vuelve a SleepGuard | `background` → `active` | ✅ Sí (correcto) |

**El problema:** Cuando el usuario usa otras apps, SleepGuard permanece en `background` y `AppState` no notifica nada.

### Flujo Incorrecto (Antes):

```
Usuario abre app Teléfono
         ↓
SleepGuard sigue en 'background'
         ↓
AppState NO cambia
         ↓
handleAppStateChange NO se llama
         ↓
❌ Timer NO se resetea
```

## ✅ Solución Implementada

### Cambio 1: AppState solo para nuestra app

```typescript
private handleAppStateChange = (nextAppState: AppStateStatus) => {
    console.log('[SleepGuard] App state changed to:', nextAppState);
    
    // Solo resetear cuando SleepGuard viene al frente
    // Esto indica interacción con NUESTRA app
    if (nextAppState === 'active') {
        console.log('[SleepGuard] SleepGuard brought to foreground - user interaction');
        this.resetTimer();
    } else {
        console.log('[SleepGuard] SleepGuard went to background - not resetting timer');
        // No reseteamos cuando va a background, eso no es actividad del usuario
    }
};
```

### ¿Por qué este cambio?

| Estado | Significa | ¿Resetear timer? | Razón |
|--------|-----------|------------------|-------|
| `active` | Usuario abrió SleepGuard | ✅ Sí | Usuario interactuó con nuestra app |
| `background` | SleepGuard en segundo plano | ❌ No | Usuario puede estar inactivo |
| `inactive` | Transición temporal | ❌ No | Estado transitorio |

### Cambio 2: Depender del Accessibility Service

El Accessibility Service **SÍ detecta actividad en todas las apps**:

```kotlin
// InactivityAccessibilityService.kt
override fun onAccessibilityEvent(event: AccessibilityEvent?) {
    // Detecta eventos en CUALQUIER app
    Log.d(TAG, "🎯 Activity detected: $eventTypeName in ${it.packageName}")
    broadcastUserActivity()  // ✅ Esto resetea el timer
}
```

## 📊 Comparación

### Antes (Incorrecto):

| Listener | Detecta | Problema |
|----------|---------|----------|
| AppState | Solo cambios de SleepGuard | ❌ No detecta otras apps |
| ScreenStateModule | Screen on/off, unlock | ✅ Funciona |
| AccessibilityService | Actividad en todas las apps | ✅ Funciona |

**Resultado:** Cuando el usuario usa otras apps, solo el Accessibility Service detecta la actividad.

### Ahora (Correcto):

| Listener | Detecta | Cuándo resetea |
|----------|---------|----------------|
| AppState | Solo cambios de SleepGuard | Solo cuando `active` |
| ScreenStateModule | Screen on/off, unlock | Siempre |
| AccessibilityService | Actividad en todas las apps | Siempre |

## 🔄 Flujos Corregidos

### Flujo 1: Usuario abre app de Teléfono

```
Usuario abre app Teléfono (desde home o app switcher)
         ↓
Accessibility Service detecta WINDOW_STATE_CHANGED
         ↓
onAccessibilityEvent() llamado
         ↓
broadcastUserActivity()
         ↓
ScreenStateModule recibe broadcast
         ↓
handleAccessibilityActivity() llamado
         ↓
✅ Timer reseteado
```

### Flujo 2: Usuario minimiza app de Teléfono

```
Usuario presiona Home o cambia de app
         ↓
Accessibility Service detecta CLICKED o WINDOW_STATE
         ↓
broadcastUserActivity()
         ↓
✅ Timer reseteado
```

### Flujo 3: Usuario navega dentro de Teléfono

```
Usuario toca Keypad tab
         ↓
Accessibility Service detecta VIEW_SELECTED
         ↓
broadcastUserActivity()
         ↓
✅ Timer reseteado
```

### Flujo 4: Usuario abre SleepGuard

```
Usuario toca icono de SleepGuard
         ↓
AppState: background → active
         ↓
handleAppStateChange('active')
         ↓
✅ Timer reseteado
```

## 🧪 Testing

### Test Case 1: Minimizar app de Teléfono

```bash
# 1. Ver logs
adb logcat -s 'InactivityA11yService:*' 'SleepGuard:*'

# 2. Acciones:
- Abre app de Teléfono
- Presiona Home

# 3. Logs esperados:
🎯 Activity detected: WINDOW_STATE in com.android.launcher
📡 Broadcast sent
[SleepGuard] 🎯 Accessibility detected user activity
[SleepGuard] Timer reset
```

### Test Case 2: Cambiar entre apps

```bash
# Acciones:
- Abre Chrome
- Cambia a Teléfono (via recents)
- Vuelve a Chrome

# Logs esperados:
🎯 Activity detected: WINDOW_STATE in com.android.chrome
[SleepGuard] Timer reset
🎯 Activity detected: WINDOW_STATE in com.android.dialer
[SleepGuard] Timer reset
🎯 Activity detected: WINDOW_STATE in com.android.chrome
[SleepGuard] Timer reset
```

### Test Case 3: SleepGuard en foreground

```bash
# Acciones:
- Abre SleepGuard

# Logs esperados:
[SleepGuard] App state changed to: active
[SleepGuard] SleepGuard brought to foreground - user interaction
[SleepGuard] Timer reset
```

## 📋 Checklist de Detección

Después de esta fix, el timer se resetea cuando:

- ✅ Usuario toca la pantalla (en cualquier app)
- ✅ Usuario hace scroll (en cualquier app)
- ✅ Usuario cambia de pestaña (en cualquier app)
- ✅ Usuario cambia de app
- ✅ Usuario minimiza una app
- ✅ Usuario abre una app
- ✅ Usuario escribe texto
- ✅ Usuario enciende la pantalla
- ✅ Usuario desbloquea el dispositivo
- ✅ Usuario abre SleepGuard

El timer NO se resetea cuando:
- ❌ SleepGuard va a background (eso no es actividad del usuario)
- ❌ La pantalla se apaga (esto lo manejamos con handleScreenOff)

## 🎯 Resultado

Ahora la detección de actividad es **más precisa** porque:

1. ✅ No confundimos "nuestra app va a background" con "usuario activo"
2. ✅ Confiamos en el Accessibility Service para detectar actividad real
3. ✅ AppState solo se usa para detectar cuando el usuario interactúa directamente con SleepGuard

## 🚀 Próximos Pasos

Si aún hay problemas:

1. **Verificar que Accessibility Service esté habilitado**:
   ```bash
   adb shell settings get secure enabled_accessibility_services
   ```
   Debería contener: `com.sukiyamero.sleepguard/com.sukiyamero.sleepguard.InactivityAccessibilityService`

2. **Ver logs en tiempo real** mientras usas otras apps:
   ```bash
   adb logcat -s 'InactivityA11yService:*' 'SleepGuard:*'
   ```

3. **Verificar que los eventos se capturan**:
   - Deberías ver `🎯 Activity detected:` por cada interacción
   - Deberías ver `📡 Broadcast sent` cada 500ms máximo
   - Deberías ver `[SleepGuard] Timer reset` en respuesta

## 📝 Notas Técnicas

### Por qué AppState no es suficiente:

React Native `AppState` es un API de **app-level**, no de **system-level**:
- Solo sabe del estado de la app actual (SleepGuard)
- No recibe notificaciones de otras apps
- Es útil para saber cuando nuestra app está visible

### Por qué Accessibility Service es necesario:

Android Accessibility Service es un API de **system-level**:
- Recibe eventos de TODAS las apps
- Puede detectar interacciones del usuario globalmente
- Es el único método para saber qué hace el usuario en otras apps

### Arquitectura correcta:

```
Usuario interactúa con cualquier app
         ↓
Accessibility Service (system-level) ← Detecta TODO
         ↓
Broadcast a SleepGuard
         ↓
Timer reseteado ✅

Usuario abre SleepGuard específicamente
         ↓
AppState (app-level) ← Solo SleepGuard
         ↓
Timer reseteado ✅
```
