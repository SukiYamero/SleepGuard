# 🔔 Solución - Notificación No Aparece

## ✅ Cambios Realizados

### 1. **Solicitud de Permisos de Notificación (Android 13+)**
Agregado en `useInactivityMonitoring.ts`:
- Solicita permiso `POST_NOTIFICATIONS` antes de iniciar el servicio
- Muestra diálogo explicativo al usuario
- Solo en Android 13+ (API 33+)

### 2. **Ícono de Notificación**
Creado `/android/app/src/main/res/drawable/ic_small_icon.xml`:
- Ícono de escudo blanco (requerido por Android)
- Visible en la barra de notificaciones

### 3. **Simplificación del Servicio**
En `InactivityService.ts`:
- Removido `registerForegroundService()` (causaba problemas)
- La notificación con `asForegroundService: true` es suficiente
- Agregado log para confirmar que la notificación se muestra

### 4. **Declaración del Servicio en AndroidManifest.xml**
```xml
<service
  android:name="io.invertase.notifee.NotifeeApiModule"
  android:exported="false"
  android:foregroundServiceType="specialUse">
  <property
    android:name="android.app.PROPERTY_SPECIAL_USE_FGS_SUBTYPE"
    android:value="Monitoring device inactivity to save battery" />
</service>
```

---

## 🧪 Cómo Probar Ahora

### Paso 1: Verificar Permisos
1. Abre la app reconstruida
2. Activa el toggle
3. **Debería aparecer un diálogo** pidiendo permiso de notificaciones
4. Presiona **"OK"** o "Permitir"

### Paso 2: Ver la Notificación
Una vez concedido el permiso:
1. Baja la **barra de notificaciones** (desliza desde arriba)
2. Deberías ver: **"🛡️ SleepGuard Active"**
3. Con el mensaje: "Monitoring inactivity (X min timeout)"

### Paso 3: Verificar que Funciona
1. Observa que la notificación permanece visible
2. Presiona el botón Home
3. La notificación debe seguir ahí
4. El tiempo debería actualizarse cada ~10 segundos

---

## 📱 Si Aún No Ves la Notificación

### Verificar Manualmente los Permisos:
1. Ve a **Settings** → **Apps** → **SleepGuard**
2. Toca en **Permissions** o **Permisos**
3. Busca **Notifications** o **Notificaciones**
4. Asegúrate que está **Permitido**

### Ver Logs para Debugging:
```bash
# Ver si la notificación se creó
npx react-native log-android | grep "SleepGuard"

# Deberías ver:
# [SleepGuard] Starting service...
# [SleepGuard] Notification displayed successfully
# [SleepGuard] Service started successfully
```

### Verificar Canales de Notificación:
```bash
# Ver canales de notificación creados
adb shell dumpsys notification | grep sleepguard
```

---

## 🔍 Qué Buscar en los Logs

**Logs esperados cuando activas el toggle:**
```
[Hook] Notification permission granted (si Android 13+)
[SleepGuard] Starting service...
[SleepGuard] Notification displayed successfully
[SleepGuard] Service started successfully
[SleepGuard] Remaining: X.X min (cada 10 segundos)
```

**Si hay error:**
```
[SleepGuard] Error showing notification: [mensaje de error]
```

---

## ⚙️ Versión de Android

- **Android 12 o menor**: No pide permisos, debería funcionar directamente
- **Android 13 o mayor**: Pide permiso de notificaciones la primera vez

Verifica tu versión de Android:
```bash
adb shell getprop ro.build.version.sdk
```

- **33+**: Android 13+ (requiere permiso)
- **31-32**: Android 12 (no requiere permiso)

---

## 💡 Solución Rápida

Si después de todo esto no funciona:

1. **Desinstala la app completamente:**
   ```bash
   adb uninstall com.sukiyamero.sleepguard
   ```

2. **Reinstala desde cero:**
   ```bash
   cd /Users/sukiyamero/Desktop/programacion/mobile/InactivityWatcher
   pnpm android
   ```

3. **Acepta el permiso** cuando te lo pida

4. **Activa el toggle** y revisa la barra de notificaciones

---

## ✅ Checklist

- [ ] La app se reconstruyó sin errores
- [ ] Al activar el toggle, apareció diálogo de permisos (Android 13+)
- [ ] Permiso concedido
- [ ] Notificación visible en la barra de notificaciones
- [ ] Notificación muestra "🛡️ SleepGuard Active"
- [ ] Botón "⏸️ Stop" visible en la notificación
- [ ] Tiempo se actualiza cada ~10 segundos

---

¿Ya probaste después de la reconstrucción? ¿Apareció el diálogo de permisos? 🚀
