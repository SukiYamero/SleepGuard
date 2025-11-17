# 🔧 Solución Final - Warning "no registered foreground service"

## 🐛 Warning Detectado

```
[notifee] no registered foreground service has been set for displaying a foreground notification.
```

## 📋 Causa del Warning

Notifee requiere que **registres explícitamente** el foreground service antes de mostrar la notificación. No basta con declararlo en el AndroidManifest, también necesitas registrarlo en el código JavaScript.

## ✅ Solución Completa

### 1. **AndroidManifest.xml** - Declaración del Servicio

```xml
<service
  android:name="app.notifee.core.ForegroundService"
  android:exported="false"
  android:stopWithTask="false"
  android:foregroundServiceType="specialUse">
  <property
    android:name="android.app.PROPERTY_SPECIAL_USE_FGS_SUBTYPE"
    android:value="Inactivity monitoring for battery optimization" />
</service>

<service
  android:name="app.notifee.core.BackgroundService"
  android:exported="false" />
```

**Propiedades clave:**
- `android:stopWithTask="false"` - El servicio continúa cuando la tarea se cierra
- `foregroundServiceType="specialUse"` - Evita el error "Short FGS timed out"
- `PROPERTY_SPECIAL_USE_FGS_SUBTYPE` - Descripción del propósito del servicio

### 2. **InactivityService.ts** - Registro del Servicio

```typescript
public async start(options: ServiceOptions): Promise<void> {
    // ...

    // 1️⃣ Primero: Registrar el foreground service
    await notifee.registerForegroundService((_notification) => {
        return new Promise(() => {
            // Promise sin resolver = servicio sigue ejecutándose
        });
    });

    // 2️⃣ Segundo: Mostrar la notificación
    await this.showServiceNotification();

    // 3️⃣ Tercero: Configurar listeners y timers
    this.appStateSubscription = AppState.addEventListener(...);
    this.checkInterval = setInterval(...);
}
```

**Orden importante:**
1. Registrar el servicio con `registerForegroundService()`
2. Mostrar la notificación con `displayNotification()`
3. Configurar la lógica del monitoreo

### 3. **InactivityService.ts** - Detención del Servicio

```typescript
public async stop(): Promise<void> {
    // ...

    // Limpiar recursos
    clearInterval(this.checkInterval);
    this.appStateSubscription.remove();
    
    // Cancelar notificación
    await notifee.cancelNotification('sleepguard-monitoring');
    
    // 🔑 Detener el foreground service
    await notifee.stopForegroundService();
}
```

## 🎯 Resultado Esperado

### Después de Reconstruir:

**Logs esperados al activar el toggle:**
```
✅ [SleepGuard] Starting service...
✅ [SleepGuard] Foreground service registered
✅ [SleepGuard] Notification displayed successfully
✅ [SleepGuard] Service started successfully
✅ [SleepGuard] Remaining: X.X min
```

**NO deberías ver:**
```
❌ [notifee] no registered foreground service has been set
❌ Short FGS timed out
❌ Short FGS ANR'ed
```

## 🔄 Próximos Pasos

1. **Reconstruir la app:**
   ```bash
   cd /Users/sukiyamero/Desktop/programacion/mobile/InactivityWatcher
   pnpm android
   ```

2. **Probar el servicio:**
   - Activa el toggle
   - Verifica que NO aparezca el warning
   - Deja correr por 5-10 minutos
   - Verifica que NO aparezca "Short FGS timed out"

3. **Ver logs en tiempo real:**
   ```bash
   adb logcat | grep -E "(SleepGuard|notifee|Short FGS)"
   ```

## 📊 Comparación

| Aspecto | Antes | Ahora |
|---------|-------|-------|
| Warning notifee | ❌ Aparecía | ✅ No aparece |
| Short FGS timeout | ❌ Después de 3 min | ✅ No ocurre |
| Notificación | ⚠️ Aparecía pero con warning | ✅ Aparece sin warnings |
| Servicio | ⚠️ Se detenía inesperadamente | ✅ Corre indefinidamente |

## 🧪 Checklist de Prueba

- [ ] App reconstruida sin errores
- [ ] Toggle activado sin warnings
- [ ] Notificación visible en barra
- [ ] Logs muestran "Foreground service registered"
- [ ] NO aparece warning de notifee
- [ ] Servicio corre por más de 5 minutos sin errores
- [ ] NO aparece "Short FGS timed out"

## 💡 Conceptos Clave

### ¿Por qué `registerForegroundService()`?
Notifee necesita saber que vas a ejecutar código en el servicio. Aunque no ejecutemos código dentro de ese callback, el registro es obligatorio para que notifee configure correctamente el servicio de Android.

### ¿Por qué `Promise` sin resolver?
```typescript
return new Promise(() => {
    // No llamamos resolve() ni reject()
});
```
Esto mantiene el servicio "vivo". Si la promesa se resolviera, el servicio se detendría.

### ¿Por qué `foregroundServiceType="specialUse"`?
Android 14+ clasifica los foreground services por tipo:
- `shortService`: < 3 minutos (causa el timeout)
- `specialUse`: Propósito especial sin límite de tiempo ✅

## 🔗 Referencias

- [Notifee - Foreground Service](https://notifee.app/react-native/docs/android/foreground-service)
- [Android - Foreground Service Types](https://developer.android.com/about/versions/14/changes/fgs-types-required)
- [Android - Special Use FGS](https://developer.android.com/develop/background-work/services/fg-service-types#special-use)

---

**Estado actual:** ✅ Servicio correctamente configurado y listo para probar
