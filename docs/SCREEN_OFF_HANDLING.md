# 📴 Manejo de Pantalla Apagada

## 🎯 Problema
Si el usuario apaga manualmente el dispositivo pero deja el servicio activo, el contador de inactividad seguiría corriendo en segundo plano, lo cual no tiene sentido porque:
- El usuario no está usando el dispositivo (pantalla apagada)
- El dispositivo ya está "dormido" o bloqueado
- No hay necesidad de contar inactividad durante este tiempo

## ✅ Solución Implementada

### 1. **Detección de Pantalla Apagada (Android Nativo)**

**Archivo**: `ScreenStateModule.kt`

```kotlin
Intent.ACTION_SCREEN_OFF -> {
    // Screen turned off - device locked or sleeping
    sendEvent("onScreenOff")
}
```

Ahora escuchamos el evento `ACTION_SCREEN_OFF` que Android envía cuando:
- Usuario presiona el botón de encendido para apagar la pantalla
- El timeout de pantalla apaga automáticamente la pantalla
- El dispositivo entra en modo sleep

### 2. **Manejo en el Servicio (JavaScript)**

**Archivo**: `InactivityService.ts`

```typescript
private handleScreenOff = () => {
    console.log('[SleepGuard] 📴 Screen turned off - pausing inactivity timer');
    // When screen is off, we pause the timer by updating lastActivityTime
    // This ensures the countdown doesn't continue while device is sleeping
    // When screen turns on again, handleScreenOn will reset the timer
    this.resetTimer();
};
```

**¿Por qué resetear el timer?**
- Al resetear `lastActivityTime = Date.now()` cuando la pantalla se apaga, efectivamente "pausamos" el contador
- Cuando la pantalla se vuelve a encender, `handleScreenOn()` también resetea el timer
- Resultado: El contador siempre empieza de cero cuando el usuario vuelve a usar el dispositivo

## 🔄 Flujo Completo

### Escenario 1: Usuario apaga la pantalla manualmente

```
Usuario presiona botón de encendido
         ↓
Android envía Intent.ACTION_SCREEN_OFF
         ↓
ScreenStateModule detecta el evento
         ↓
Envía "onScreenOff" a React Native
         ↓
InactivityService.handleScreenOff()
         ↓
resetTimer() → lastActivityTime = ahora
         ↓
Contador pausado ✅
```

### Escenario 2: Usuario vuelve a encender

```
Usuario presiona botón de encendido
         ↓
Android envía Intent.ACTION_SCREEN_ON
         ↓
ScreenStateModule detecta el evento
         ↓
Envía "onScreenOn" a React Native
         ↓
InactivityService.handleScreenOn()
         ↓
resetTimer() → lastActivityTime = ahora
         ↓
Contador reiniciado desde cero ✅
```

### Escenario 3: Usuario desbloquea el dispositivo

```
Usuario desbloquea (PIN, huella, etc.)
         ↓
Android envía Intent.ACTION_USER_PRESENT
         ↓
InactivityService.handleUserPresent()
         ↓
resetTimer() → Usuario claramente activo
         ↓
Contador reiniciado ✅
```

## 📊 Ejemplo Práctico

**Timeline:**

1. **10:00 AM** - Usuario activa SleepGuard (timeout: 5 minutos)
2. **10:02 AM** - Usuario apaga la pantalla manualmente
   - `handleScreenOff()` → `lastActivityTime = 10:02 AM`
   - ⏸️ Contador pausado efectivamente
3. **10:30 AM** - Usuario enciende la pantalla
   - `handleScreenOn()` → `lastActivityTime = 10:30 AM`
   - ⏱️ Contador reinicia desde cero
4. **10:35 AM** - 5 minutos sin actividad
   - ✅ SleepGuard presiona Home (comportamiento esperado)

**Sin esta solución:**
- El contador seguiría corriendo desde 10:02 AM hasta 10:30 AM
- Al encender, ya habrían pasado 28 minutos
- El dispositivo se iría al home inmediatamente (comportamiento NO deseado)

## 🎯 Beneficios

1. ✅ **Lógica correcta**: Solo cuenta inactividad cuando la pantalla está encendida
2. ✅ **Mejor UX**: El usuario siempre tiene el tiempo completo cuando vuelve a usar el dispositivo
3. ✅ **Ahorro de batería**: No procesamos eventos innecesarios con pantalla apagada
4. ✅ **Comportamiento intuitivo**: El servicio se comporta como el usuario espera

## 🔧 Código Modificado

### Archivos actualizados:

1. **ScreenStateModule.kt**
   - ✅ Agregado `Intent.ACTION_SCREEN_OFF` al IntentFilter
   - ✅ Agregado case para manejar el evento

2. **ScreenStateModule.ts** (TypeScript)
   - ✅ Agregado `onScreenOff` a la interfaz `ScreenStateEvents`
   - ✅ Agregado listener para el evento

3. **InactivityService.ts**
   - ✅ Agregado método `handleScreenOff()`
   - ✅ Registrado callback en `startListening()`

## 🧪 Testing

Para probar el comportamiento:

1. Activa el monitoreo con timeout de 2 minutos
2. Apaga la pantalla manualmente
3. Espera 5 minutos
4. Enciende la pantalla
5. **Resultado esperado**: El contador debería estar en 2 minutos (no ya expirado)

## 📝 Notas Técnicas

- `ACTION_SCREEN_OFF` se envía SIEMPRE que la pantalla se apaga, independientemente de la causa
- El servicio foreground continúa ejecutándose (esto es correcto para mantener la notificación)
- El intervalo de 10 segundos sigue corriendo, pero el tiempo no avanza porque `lastActivityTime` se actualiza
- Cuando el dispositivo se apaga completamente (shutdown), Android limpia todos los servicios automáticamente

## 🚀 Próximos Pasos (Opcional)

Si queremos ser aún más sofisticados, podríamos:

1. **Pausar el intervalo** completamente cuando la pantalla está apagada (ahorro extra de batería)
2. **Actualizar la notificación** para indicar que el servicio está pausado
3. **Agregar estadísticas** de cuánto tiempo estuvo la pantalla encendida vs apagada

Por ahora, la solución actual es simple, efectiva y cubre el caso de uso principal.
